/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bmu: {
          // Blue spectrum (Sapphire & Cyan)
          blue: '#2563eb',
          blueLight: '#38bdf8',
          blueDark: '#1d4ed8',
          blueBg: '#0b1329',
          
          // Green spectrum (Emerald & Mint)
          green: '#10b981',
          greenLight: '#34d399',
          greenDark: '#047857',
          greenBg: '#06281e',
          
          // Red spectrum (Crimson & Coral)
          red: '#ef4444',
          redLight: '#f87171',
          redDark: '#b91c1c',
          redBg: '#2a0e14',
          
          // Deep Slate surfaces
          darkBg: '#06090e',
          cardBg: '#0c121d',
          cardHover: '#111a2e',
          cardBorder: '#1b263b',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'glow-green': 'glowGreen 3s infinite alternate',
        'glow-blue': 'glowBlue 3s infinite alternate',
        'glow-red': 'glowRed 3s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

