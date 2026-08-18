const http = require('http');
const fs = require('fs');
const path = require('path');
const sucrase = require('sucrase');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const PORT = 3000;
const ROOT = process.cwd();

// Compile Tailwind on startup
async function compileCSS() {
  try {
    const cssInput = fs.readFileSync(path.join(ROOT, 'src/app/globals.css'), 'utf8');
    const tailwindConfig = path.resolve(ROOT, 'tailwind.config.cjs');
    const result = await postcss([
      tailwindcss({ config: tailwindConfig }),
      autoprefixer,
    ]).process(cssInput, { from: 'src/app/globals.css' });
    fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'public/globals.css'), result.css);
    console.log('✓ Compiled Tailwind CSS (', result.css.length, 'bytes )');
  } catch (e) {
    console.error('Tailwind build error:', e);
  }
}

// Module map for ESM imports in browser
const ESM_MAP = {
  'react': 'https://esm.sh/react@19',
  'react-dom': 'https://esm.sh/react-dom@19',
  'react-dom/client': 'https://esm.sh/react-dom@19/client',
  'react/jsx-runtime': 'https://esm.sh/react@19/jsx-runtime',
  'react/jsx-dev-runtime': 'https://esm.sh/react@19/jsx-dev-runtime',
  'lucide-react': 'https://esm.sh/lucide-react@0.475.0',
  'canvas-confetti': 'https://esm.sh/canvas-confetti@1.9.4',
  'clsx': 'https://esm.sh/clsx@2.1.1',
  'tailwind-merge': 'https://esm.sh/tailwind-merge@3.0.2',
  'framer-motion': 'https://esm.sh/framer-motion@12.4.7',
};

function transformTSX(filePath, code) {
  // Step 1: Transform TSX -> JS with sucrase
  const compiled = sucrase.transform(code, {
    transforms: ['typescript', 'jsx'],
    jsxRuntime: 'automatic',
    production: false,
    filePath,
  }).code;

  // Step 2: Rewrite imports to work in modern browser ESM
  let transformed = compiled;

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

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

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
    return res.end(fs.readFileSync(staticPath));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

compileCSS().then(() => {
  server.listen(PORT, () => {
    console.log(`
┌─────────────────────────────────────────────────────────────┐
│                   CampusPulse • BMU OS                      │
│                                                             │
│  🚀 Local Dev Server running at: http://localhost:${PORT}      │
│  🏛️ Tailored for BML Munjal University (BMU)                │
│  📡 Real-Time Multi-Tab Synchronized                        │
└─────────────────────────────────────────────────────────────┘
    `);
  });
});
