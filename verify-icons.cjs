const fs = require('fs');
const path = require('path');

const lucideIcons = new Set();
const files = fs.readdirSync('src', { recursive: true });
for (const f of files) {
  const full = path.join('src', f);
  if (fs.statSync(full).isFile() && (f.endsWith('.ts') || f.endsWith('.tsx'))) {
    const text = fs.readFileSync(full, 'utf8');
    const matches = text.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g);
    for (const m of matches) {
      const icons = m[1].split(',').map(s => s.trim().split(' as ')[0].trim()).filter(Boolean);
      icons.forEach(i => lucideIcons.add(i));
    }
  }
}

console.log('Total unique Lucide icons:', lucideIcons.size);
console.log('List:', [...lucideIcons]);

// Test if all icons exist in lucide-react package
const lucide = require('lucide-react');
const missing = [];
for (const icon of lucideIcons) {
  if (!lucide[icon]) {
    missing.push(icon);
  }
}

if (missing.length > 0) {
  console.error('MISSING ICONS IN LUCIDE-REACT:', missing);
} else {
  console.log('✓ ALL LUCIDE ICONS EXIST AND ARE VALID!');
}
