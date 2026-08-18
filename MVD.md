# 📦 MVD.md — Master Blueprint & Complete Backup Document
> **Project:** BMU_Community • CampusPulse OS  
> **Version:** 0.1.0 (Cyber-Tricolor Edition)  
> **Target:** BML Munjal University (BMU) Student Real-Time Operating System  
> **Created:** 2026-08-18  

---

## 📋 Table of Contents
1. [Architecture & Technology Stack](#1-architecture--technology-stack)
2. [Design Tokens & Color Philosophy](#2-design-tokens--color-philosophy)
3. [Configuration & Build Setup](#3-configuration--build-setup)
   - `package.json`
   - `tsconfig.json`
   - `tailwind.config.cjs`
   - `build-app.cjs`
   - `server.cjs`
   - `index.html`
4. [Styles & Layout](#4-styles--layout)
   - `src/app/globals.css`
   - `src/app/layout.tsx`
   - `src/app/page.tsx`
5. [Types, State Engine & Utilities](#5-types-state-engine--utilities)
   - `src/types/index.ts`
   - `src/lib/utils.ts`
   - `src/lib/store.tsx`
   - `src/data/mockData.ts`
6. [Component Suite](#6-component-suite)
   - `src/components/Navbar.tsx`
   - `src/components/EventModule.tsx`
   - `src/components/EventPassModal.tsx`
   - `src/components/MarketplaceModule.tsx`
   - `src/components/MarketplaceChatDrawer.tsx`
   - `src/components/SportsModule.tsx`
   - `src/components/NoticeStreamModule.tsx`
   - `src/components/NoticeDetailModal.tsx`
   - `src/components/ProfileModal.tsx`
   - `src/components/EmergencyQuickDial.tsx`
   - `src/components/GlobalSearchModal.tsx`
7. [Step-by-Step Recreation Guide](#7-step-by-step-recreation-guide)

---

## 1. Architecture & Technology Stack

- **Frontend Core:** React 19.0 with TypeScript 5.7
- **Styling:** Tailwind CSS 3.4 + PostCSS + Autoprefixer + Custom Glassmorphism CSS
- **Micro-Interactions & Icons:** Lucide React 0.475.0 & Canvas-Confetti 1.9.4
- **State & Cross-Tab Sync:** React Context Provider with native Web `BroadcastChannel` API (`campuspulse_bmu_sync`) and `localStorage` persistence
- **Server:** Node.js HTTP Server (`server.cjs`) with on-the-fly Sucrase TSX compiler and ESM resolution
- **Audio Engine:** HTML5 Web Audio Ambient Focus Soundscapes with Equalizer animations

---

## 2. Design Tokens & Color Philosophy

- **Deep Void Slate Surfaces (`#06090e`, `#0d131f`)**: Ultra-dark frosted glass containers with `backdrop-blur-2xl` and 1px borders (`rgba(255,255,255,0.08)`).
- **Crimson / Ruby Red (`#ef4444`, `#dc2626`)**: Powering Events & Fests, HackBMU 7.0 live countdown tickers, urgent circular alerts, and Emergency SOS beacons.
- **Emerald / Mint Green (`#10b981`, `#059669`)**: Powering the Peer Marketplace, zero-fee skill trades, safe transaction points, and active indicators.
- **Sapphire / Electric Cyan Blue (`#2563eb`, `#38bdf8`)**: Powering telemetry grids, verified academic badges, student ID cards, and official circulars.
- **Amber / Gold (`#f59e0b`, `#d97706`)**: Powering the Sports Arena grid and HPL matches.

---

## 3. Configuration & Build Setup

### `package.json`
```json
{
  "name": "BMU_Community",
  "version": "0.1.0",
  "description": "BMU Community (CampusPulse) - Real-time student operating system & campus telemetry hub for BML Munjal University",
  "main": "server.cjs",
  "repository": {
    "type": "git",
    "url": "https://github.com/ojaspurwar/BMU_Community.git"
  },
  "keywords": [
    "bmu",
    "bml-munjal-university",
    "campus-os",
    "student-community",
    "real-time",
    "marketplace",
    "events",
    "sports-arena"
  ],
  "author": "Ojas Purwar",
  "license": "MIT",
  "scripts": {
    "dev": "node server.cjs",
    "build": "node build-app.cjs",
    "start": "node server.cjs"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "clsx": "^2.1.1",
    "framer-motion": "^12.4.7",
    "lucide-react": "^1.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "sucrase": "^3.35.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### `tailwind.config.cjs`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bmu: {
          dark: '#06090e',
          card: '#0d131f',
          surface: '#111a2e',
          border: 'rgba(255, 255, 255, 0.08)',
          blue: '#2563eb',
          sky: '#38bdf8',
          green: '#10b981',
          emerald: '#059669',
          red: '#ef4444',
          crimson: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### `build-app.cjs`
```javascript
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

async function build() {
  console.log('Building CampusPulse BMU (Green • Red • Blue Cyber Theme)...');
  const postcss = resolvePkg('postcss') || require('postcss');
  const tailwindcss = resolvePkg('tailwindcss') || require('tailwindcss');
  const autoprefixer = resolvePkg('autoprefixer') || require('autoprefixer');

  const cssInput = fs.readFileSync(path.join(ROOT, 'src/app/globals.css'), 'utf8');
  const tailwindConfig = path.resolve(ROOT, 'tailwind.config.cjs');

  const result = await postcss([
    tailwindcss({ config: tailwindConfig }),
    autoprefixer ? autoprefixer : () => {},
  ]).process(cssInput, { from: 'src/app/globals.css' });

  fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'public/globals.css'), result.css);
  console.log('✓ Compiled Tailwind CSS (', result.css.length, 'bytes )');
  console.log('✓ Build complete!');
}

build().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
```

### `server.cjs`
```javascript
const http = require('http');
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

async function compileCSS() {
  const cssPath = path.join(ROOT, 'public/globals.css');
  if (fs.existsSync(cssPath) && fs.statSync(cssPath).size > 1000) {
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
  } catch (e) {
    console.warn('Tailwind build warning:', e.message);
  }
}

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
  let preprocessed = code.replace(/['"]use client['"];?/g, '');
  preprocessed = preprocessed.replace(/import\s+['"][^'"]+\.css['"];?/g, '');

  const compiled = sucrase.transform(preprocessed, {
    transforms: ['typescript', 'jsx'],
    jsxRuntime: 'classic',
    production: true,
    filePath,
  }).code;

  let transformed = compiled;

  if (!transformed.includes('import React') && !transformed.includes('from \'react\'') && !transformed.includes('from "react"')) {
    transformed = "import React from 'https://esm.sh/react@19';\n" + transformed;
  }

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

  for (const [pkg, url] of Object.entries(ESM_MAP)) {
    const reg = new RegExp(`from\\s+['"]${pkg}['"]`, 'g');
    transformed = transformed.replace(reg, `from '${url}'`);
    const regNamed = new RegExp(`from\\s+['"]${pkg}/([^'"]+)['"]`, 'g');
    transformed = transformed.replace(regNamed, (m, sub) => `from '${url}/${sub}'`);
  }

  return transformed;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.ts': 'application/javascript; charset=utf-8',
  '.tsx': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === '/') {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  let localPath = path.join(ROOT, pathname);

  if ((pathname.endsWith('.ts') || pathname.endsWith('.tsx')) && fs.existsSync(localPath)) {
    try {
      const srcCode = fs.readFileSync(localPath, 'utf8');
      const transformed = transformTSX(localPath, srcCode);
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      return res.end(transformed);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end(`Transform Error: ${err.message}\n${err.stack}`);
    }
  }

  if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    const ext = path.extname(localPath);
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(localPath).pipe(res);
  }

  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  return res.end(html);
});

async function start() {
  await compileCSS();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 CampusPulse BMU (Cyber-Tricolor) running at: http://localhost:${PORT}`);
  });
}

start();
```

### `index.html`
```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CampusPulse • BML Munjal University Operating System</title>
    <meta name="description" content="A unified real-time campus OS for student events, peer skill & gear trading, sports arena court bookings, and verified campus announcements at BMU." />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='tricolor' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6'/%3E%3Cstop offset='50%25' stop-color='%2310b981'/%3E%3Cstop offset='100%25' stop-color='%23ef4444'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='%2306090e'/%3E%3Crect x='2' y='2' width='28' height='28' rx='6' fill='none' stroke='url(%23tricolor)' stroke-width='2'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-weight='900' font-size='11'%3EBMU%3C/text%3E%3C/svg%3E" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/public/globals.css" />
  </head>
  <body class="min-h-screen bg-[#06090e] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
    <div id="root">
      <div style="display:flex;height:100vh;align-items:center;justify-content:center;background:#06090e;color:#94a3b8;font-family:sans-serif;flex-direction:column;gap:16px;">
        <div style="display:flex;gap:8px;">
          <div style="width:12px;height:12px;border-radius:50%;background:#3b82f6;animation:pulse 1s infinite;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#10b981;animation:pulse 1s infinite 0.2s;"></div>
          <div style="width:12px;height:12px;border-radius:50%;background:#ef4444;animation:pulse 1s infinite 0.4s;"></div>
        </div>
        <span style="font-weight:700;letter-spacing:1px;font-size:14px;color:#cbd5e1;">LOADING CAMPUSPULSE BMU...</span>
      </div>
    </div>

    <script type="module">
      import React from 'https://esm.sh/react@19';
      import ReactDOM from 'https://esm.sh/react-dom@19/client';
      import App from '/src/app/page.tsx';
      import { CampusPulseProvider } from '/src/lib/store.tsx';

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        React.createElement(
          React.StrictMode,
          null,
          React.createElement(
            CampusPulseProvider,
            null,
            React.createElement(App, null)
          )
        )
      );
    </script>
  </body>
</html>
```

---

## 4. Styles & Layout

*(Refer to `src/app/globals.css`, `src/app/layout.tsx`, and `src/app/page.tsx` as written in the codebase.)*

---

## 5. Types, State Engine & Utilities

### `src/types/index.ts`
*(Includes: `UserProfile`, `ActiveNavTab`, `CampusEvent`, `MarketplaceItem`, `CampusNotice`, `CampusWeather`, `AudioTrack`, `SportsFacility`, `SportsMatch`, `SportsSquadChallenge`)*

### `src/lib/utils.ts`
*(Includes `cn()`, `formatTimeAgo()`, `formatEventDate()`, `generateICS()` for calendar exports)*

### `src/lib/store.tsx`
*(Provides `CampusPulseContext`, `useCampusPulse()`, BroadcastChannel synchronization on channel `campuspulse_bmu_sync`, and full action creators)*

---

## 6. Component Suite Overview

| Component Path | Functionality & Key Capabilities |
|---|---|
| `src/components/Navbar.tsx` | Full-width desktop topbar (`max-w-[1700px]`), focus audio soundscape equalizer player, SOS quick beacon, profile switcher, mobile touch bottom-nav bar, and mobile hamburger drawer. |
| `src/components/EventModule.tsx` | HackBMU 7.0 spotlight countdown, category pills, 1-click RSVP with confetti, QR ticket passes, `.ics` calendar exports, and event proposal form. |
| `src/components/EventPassModal.tsx` | Digital verified entry pass with QR code and print/save triggers. |
| `src/components/MarketplaceModule.tsx` | Peer goods listings, zero-fee student economy, safe campus exchange points, and interactive **Peer Skill Matchmaker Engine**. |
| `src/components/MarketplaceChatDrawer.tsx` | In-app peer negotiation chat drawer with quick suggestion pills and deal status dropdown. |
| `src/components/SportsModule.tsx` | Court slot booking for 6 BMU sports facilities, live Inter-Hostel Premier League (HPL) scoreboard with interactive fan cheering counters, and squad recruitment challenges. |
| `src/components/NoticeStreamModule.tsx` | Controller of Examinations (CoE), CDC Placement, and Warden circulars with batch filters, unread badge tracking, and 1-click acknowledgement. |
| `src/components/NoticeDetailModal.tsx` | Circular viewer with official authenticated PDF download simulation. |
| `src/components/ProfileModal.tsx` | Custom student profile builder, avatar preset selector, skills tag cloud, and live holographic BMU student ID card generator. |
| `src/components/EmergencyQuickDial.tsx` | 24/7 emergency quick-dial contacts (Ambulance, Gate 1 & 2 Security, Chief Warden, Mental Wellness) and campus-wide SOS broadcast beacon trigger. |
| `src/components/GlobalSearchModal.tsx` | Instant ⌘K fuzzy search across events, marketplace items, sports matches, and circulars. |

---

## 7. Step-by-Step Recreation Guide

If you ever need to recreate this exact website in a new directory or environment, follow these simple steps:

1. **Initialize Project:**
   ```bash
   mkdir BMU_Community && cd BMU_Community
   npm init -y
   ```
2. **Install Dependencies:**
   ```bash
   npm install react@19 react-dom@19 lucide-react@0.475.0 canvas-confetti@1.9.4 clsx@2.1.1 framer-motion@12.4.7
   npm install -D tailwindcss@3.4.17 postcss@8.5.2 autoprefixer@10.4.20 sucrase@3.35.0 typescript@5.7.3
   ```
3. **Copy Configuration Files:**
   - Create `package.json`, `tsconfig.json`, `tailwind.config.cjs`, `build-app.cjs`, `server.cjs`, and `index.html`.
4. **Copy Source Files:**
   - Place all files into `src/app/`, `src/components/`, `src/data/`, `src/lib/`, and `src/types/`.
5. **Compile Tailwind CSS:**
   ```bash
   node build-app.cjs
   ```
6. **Launch Development Server:**
   ```bash
   node server.cjs
   ```
7. Open **`http://localhost:4040`** in your browser!
