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

const postcss = resolvePkg('postcss') || require('postcss');
const tailwindcss = resolvePkg('tailwindcss') || require('tailwindcss');
const autoprefixer = resolvePkg('autoprefixer') || require('autoprefixer');

async function build() {
  console.log('Building CampusPulse BMU (Green • Red • Blue Cyber Theme)...');

  fs.mkdirSync('public', { recursive: true });

  // 1. Compile Tailwind CSS
  try {
    const cssInput = fs.readFileSync('src/app/globals.css', 'utf8');
    const tailwindConfig = path.resolve(__dirname, 'tailwind.config.cjs');
    const cssResult = await postcss([
      tailwindcss({ config: tailwindConfig }),
      autoprefixer ? autoprefixer : () => {},
    ]).process(cssInput, { from: 'src/app/globals.css' });
    fs.writeFileSync('public/globals.css', cssResult.css);
    console.log('✓ Compiled Tailwind CSS (', cssResult.css.length, 'bytes )');
  } catch (err) {
    console.error('Tailwind build error:', err);
  }

  console.log('✓ Build complete!');
}

build();

