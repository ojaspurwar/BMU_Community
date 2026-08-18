const fs = require('fs');
const path = require('path');

function getImports(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  const bare = new Set();
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isFile() && (f.endsWith('.ts') || f.endsWith('.tsx'))) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
      for (const m of matches) {
        const imp = m[1];
        if (!imp.startsWith('.') && !imp.startsWith('@/')) {
          bare.add(imp);
        }
      }
    }
  }
  return [...bare];
}

console.log('All bare imports in src/:', getImports('src'));
