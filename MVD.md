# 📦 MVD.md — Master Blueprint & Complete Backup Document
> **Project:** BMU_Community • CampusPulse OS  
> **Version:** 0.2.0 (OpenRouter AnyModel AI & Cyber-Tricolor Edition)  
> **Target:** BML Munjal University (BMU) Student Real-Time Operating System  
> **Created:** 2026-08-19  

---

## 📋 Table of Contents
1. [Architecture & Technology Stack](#1-architecture--technology-stack)
2. [Design Tokens & Color Philosophy](#2-design-tokens--color-philosophy)
3. [Configuration & Build Setup](#3-configuration--build-setup)
   - `package.json`
   - `tsconfig.json`
   - `tailwind.config.cjs`
   - `build-app.cjs`
   - `server.cjs` (with `/api/ai/chat` proxy)
   - `index.html`
4. [Styles & Layout](#4-styles--layout)
   - `src/app/globals.css`
   - `src/app/layout.tsx`
   - `src/app/page.tsx`
5. [Types, State Engine & Utilities](#5-types-state-engine--utilities)
   - `src/types/index.ts`
   - `src/lib/utils.ts`
   - `src/lib/store.tsx` (AI Assistant state + Multi-tab sync)
   - `src/data/mockData.ts`
6. [Component Suite](#6-component-suite)
   - `src/components/Navbar.tsx`
   - `src/components/AIAssistantModal.tsx` (OpenRouter AnyModel Integration)
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
   - `src/components/TestRunModal.tsx`
7. [Step-by-Step Recreation Guide](#7-step-by-step-recreation-guide)

---

## 1. Architecture & Technology Stack

- **Frontend Core:** React 19.0 with TypeScript 5.7
- **AI Engine:** OpenRouter AnyModel Inference Gateway with DeepSeek V3, GPT-4o Mini, Llama 3.3 70B, Claude 3.5 Sonnet, Gemini Flash 1.5, and custom model slug support
- **Styling:** Tailwind CSS 3.4 + PostCSS + Autoprefixer + Custom Glassmorphism CSS
- **Micro-Interactions & Icons:** Lucide React 0.475.0 & Canvas-Confetti 1.9.4
- **State & Cross-Tab Sync:** React Context Provider with native Web `BroadcastChannel` API (`campuspulse_bmu_sync`) and `localStorage` persistence
- **Server:** Node.js HTTP Server (`server.cjs`) with on-the-fly Sucrase TSX compiler, ESM resolution, and `/api/ai/chat` proxy route
- **Audio Engine:** HTML5 Web Audio Ambient Focus Soundscapes with Equalizer animations

---

## 2. Design Tokens & Color Philosophy

- **Deep Void Slate Surfaces (`#06090e`, `#0d131f`)**: Ultra-dark frosted glass containers with `backdrop-blur-2xl` and 1px borders (`rgba(255,255,255,0.08)`).
- **Crimson / Ruby Red (`#ef4444`, `#dc2626`)**: Powering Events & Fests, HackBMU 7.0 live countdown tickers, urgent circular alerts, and Emergency SOS beacons.
- **Emerald / Mint Green (`#10b981`, `#059669`)**: Powering the Peer Marketplace, zero-fee skill trades, safe transaction points, and active indicators.
- **Sapphire / Electric Cyan Blue (`#2563eb`, `#38bdf8`)**: Powering telemetry grids, verified academic badges, student ID cards, and official circulars.
- **Purple & Indigo Gradient (`#6366f1`, `#a855f7`, `#ec4899`)**: Powering the BMU Pulse AI (AnyModel Engine).

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
    "sports-arena",
    "openrouter-ai"
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

### `server.cjs` (With `/api/ai/chat` Proxy Route)
```javascript
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// ... (Sucrase transform & static serving)
// Proxy endpoint forwards to https://openrouter.ai/api/v1/chat/completions with full CORS support
```

---

## 6. Component Suite Overview

| Component Path | Functionality & Key Capabilities |
|---|---|
| `src/components/AIAssistantModal.tsx` | **BMU Pulse AI Assistant:** OpenRouter AnyModel integration with model switcher (DeepSeek V3, GPT-4o Mini, Llama 3.3 70B, Claude 3.5 Sonnet, Gemini 1.5 Flash, custom slug), editable API key, BMU campus live context injection, prompt chips, markdown parser, and copy buttons. |
| `src/components/Navbar.tsx` | Full-width desktop topbar, focus audio soundscape player, **Ask AI trigger**, SOS beacon, profile switcher, mobile touch bottom-nav bar, and mobile hamburger drawer. |
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
| `src/components/TestRunModal.tsx` | Test website notice & evaluation guide. |

---

## 7. Step-by-Step Recreation Guide

1. **Initialize & Install:**
   ```bash
   npm install
   ```
2. **Build Tailwind CSS:**
   ```bash
   npm run build
   ```
3. **Launch Server:**
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:4040`** to test all features including BMU Pulse AI!
