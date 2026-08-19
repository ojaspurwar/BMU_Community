const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function resolvePkg(name) {
  try { return require(name); } catch(e) {}
  const nm = path.join(ROOT, 'node_modules');
  if (fs.existsSync(nm)) {
    const found = fs.readdirSync(nm).find(d => d === name || d.startsWith('.' + name + '-'));
    if (found) {
      try { return require(path.join(nm, found)); } catch(e) {}
    }
  }
  return null;
}

const sucrase = resolvePkg('sucrase') || require('sucrase');
let PORT = parseInt(process.env.PORT || '4040', 10);
const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// Compile Tailwind on startup if tools are available
async function compileCSS() {
  const cssPath = path.join(ROOT, 'public/globals.css');
  if (fs.existsSync(cssPath) && fs.statSync(cssPath).size > 1000) {
    console.log('✓ Found precompiled Tailwind CSS (', fs.statSync(cssPath).size, 'bytes )');
    return;
  }
  try {
    const postcss = resolvePkg('postcss');
    const tailwindcss = resolvePkg('tailwindcss');
    const autoprefixer = resolvePkg('autoprefixer');
    if (!postcss || !tailwindcss) return;

    const cssInput = fs.readFileSync(path.join(ROOT, 'src/app/globals.css'), 'utf8');
    const tailwindConfig = path.resolve(ROOT, 'tailwind.config.cjs');
    const result = await postcss([
      tailwindcss({ config: tailwindConfig }),
      autoprefixer ? autoprefixer : () => {},
    ]).process(cssInput, { from: 'src/app/globals.css' });
    fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
    fs.writeFileSync(cssPath, result.css);
    console.log('✓ Compiled Tailwind CSS (', result.css.length, 'bytes )');
  } catch (e) {
    console.warn('Tailwind build warning:', e.message);
  }
}

// Module map for ESM imports in browser
const ESM_MAP = {
  'react': 'https://esm.sh/react@19',
  'react-dom': 'https://esm.sh/react-dom@19',
  'react-dom/client': 'https://esm.sh/react-dom@19/client',
  'lucide-react': 'https://esm.sh/lucide-react@0.475.0',
  'canvas-confetti': 'https://esm.sh/canvas-confetti@1.9.4',
  'clsx': 'https://esm.sh/clsx@2.1.1',
  'tailwind-merge': 'https://esm.sh/tailwind-merge@3.0.2',
  'framer-motion': 'https://esm.sh/framer-motion@12.4.7',
};

function transformTSX(filePath, code) {
  // Strip Next.js directives & raw css imports
  let preprocessed = code.replace(/['"]use client['"];?/g, '');
  preprocessed = preprocessed.replace(/import\s+['"][^'"]+\.css['"];?/g, '');

  const compiled = sucrase.transform(preprocessed, {
    transforms: ['typescript', 'jsx'],
    jsxRuntime: 'classic',
    production: true,
    filePath,
  }).code;

  let transformed = compiled;

  // If file doesn't have React imported, import it at top for React.createElement
  if (!transformed.includes('import React') && !transformed.includes('from \'react\'') && !transformed.includes('from "react"')) {
    transformed = "import React from 'https://esm.sh/react@19';\n" + transformed;
  }

  // Rewrite @/ to /src/
  transformed = transformed.replace(/from\s+['"]@\/([^'"]+)['"]/g, (match, p1) => {
    let resolved = `/src/${p1}`;
    if (!resolved.endsWith('.ts') && !resolved.endsWith('.tsx') && !resolved.endsWith('.js')) {
      if (fs.existsSync(path.join(ROOT, 'src', `${p1}.tsx`))) resolved += '.tsx';
      else if (fs.existsSync(path.join(ROOT, 'src', `${p1}.ts`))) resolved += '.ts';
      else if (fs.existsSync(path.join(ROOT, 'src', p1, 'index.tsx'))) resolved += '/index.tsx';
      else if (fs.existsSync(path.join(ROOT, 'src', p1, 'index.ts'))) resolved += '/index.ts';
    }
    return `from '${resolved}'`;
  });

  // Rewrite relative imports without extension (e.g. from './app/page')
  const currentDir = path.dirname(filePath);
  transformed = transformed.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
    if (p1.endsWith('.css')) return `// CSS: ${p1}`;
    let resolved = p1;
    if (!resolved.endsWith('.ts') && !resolved.endsWith('.tsx') && !resolved.endsWith('.js')) {
      const fullPath = path.resolve(currentDir, p1);
      if (fs.existsSync(`${fullPath}.tsx`)) resolved += '.tsx';
      else if (fs.existsSync(`${fullPath}.ts`)) resolved += '.ts';
      else if (fs.existsSync(path.join(fullPath, 'index.tsx'))) resolved += '/index.tsx';
      else if (fs.existsSync(path.join(fullPath, 'index.ts'))) resolved += '/index.ts';
    }
    return `from '${resolved}'`;
  });

  // Rewrite bare ESM imports (react, lucide-react, etc.)
  for (const [pkg, url] of Object.entries(ESM_MAP)) {
    const regex = new RegExp(`from\\s+['"]${pkg}['"]`, 'g');
    transformed = transformed.replace(regex, `from '${url}'`);
    const importRegex = new RegExp(`import\\s+['"]${pkg}['"]`, 'g');
    transformed = transformed.replace(importRegex, `import '${url}'`);
  }

  return transformed;
}

const server = http.createServer(async (req, res) => {
  let reqUrl = req.url.split('?')[0];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Title, HTTP-Referer');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- OPENROUTER AI ASSISTANT PROXY ROUTE ---
  if (reqUrl === '/api/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const apiKey = payload.apiKey || DEFAULT_OPENROUTER_KEY;
        const model = payload.model || 'deepseek/deepseek-chat';
        const messages = payload.messages || [];

        if (!apiKey) {
          res.writeHead(401, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({
            error: {
              message: 'No OpenRouter API Key configured. Please enter your OpenRouter API key in the AI Assistant settings (sk-or-v1-...) or configure OPENROUTER_API_KEY environment variable.'
            }
          }));
          return;
        }

        const requestData = JSON.stringify({
          model,
          messages,
        });

        const openRouterReq = https.request({
          hostname: 'openrouter.ai',
          port: 443,
          path: '/api/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:4040',
            'X-Title': 'CampusPulse BMU AI Assistant',
            'Content-Length': Buffer.byteLength(requestData),
          },
          timeout: 30000,
        }, (openRouterRes) => {
          let resData = '';
          openRouterRes.on('data', chunk => { resData += chunk; });
          openRouterRes.on('end', () => {
            res.writeHead(openRouterRes.statusCode || 200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            });
            res.end(resData);
          });
        });

        openRouterReq.on('error', (err) => {
          console.error('OpenRouter Proxy Error:', err.message);
          res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: { message: `AI Gateway Connection Error: ${err.message}` } }));
        });

        openRouterReq.write(requestData);
        openRouterReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: { message: `Invalid Request Body: ${e.message}` } }));
      }
    });
    return;
  }

  if (reqUrl === '/' || reqUrl === '/index.html') {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  if (reqUrl === '/src/app/globals.css' || reqUrl === '/public/globals.css') {
    const cssPath = path.join(ROOT, 'public/globals.css');
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      return res.end(css);
    }
  }

  // Handle TS/TSX dynamic compilation
  if (reqUrl.startsWith('/src/')) {
    const filePath = path.join(ROOT, reqUrl.slice(1));
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const js = transformTSX(filePath, content);
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        return res.end(js);
      } catch (err) {
        console.error('Transform error for', reqUrl, err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end(err.message);
      }
    }
  }

  // Handle other public static files
  const staticPath = path.join(ROOT, reqUrl.slice(1));
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    const ext = path.extname(staticPath);
    const mimeTypes = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    return fs.createReadStream(staticPath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`
┌─────────────────────────────────────────────────────────────┐
│                   CampusPulse • BMU OS                      │
│                                                             │
│  🚀 Local Dev Server running at: http://localhost:${port}      │
│  🤖 OpenRouter AnyModel AI Proxy: Active (/api/ai/chat)     │
│  🎨 Theme: BMU Cyber-Tricolor (Green • Red • Blue)          │
└─────────────────────────────────────────────────────────────┘
    `);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

async function boot() {
  await compileCSS();
  startServer(PORT);
}

boot();
