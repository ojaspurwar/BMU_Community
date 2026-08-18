const path = require('path');

async function testAll() {
  const loaded = new Set();
  const queue = ['/src/main.tsx'];

  while (queue.length > 0) {
    const current = queue.shift();
    if (loaded.has(current)) continue;
    loaded.add(current);

    const res = await fetch('http://localhost:4040' + current);
    if (!res.ok) {
      console.error('FAILED TO FETCH:', current, res.status);
      continue;
    }
    const js = await res.text();
    console.log('✓ Loaded:', current, '(', js.length, 'bytes )');

    const currentDir = path.posix.dirname(current);

    // Matches: from '/src/...' or from './...' or from '../...'
    const matches = js.matchAll(/from\s+['"](\/[^'"]+|\.[^'"]+)['"]/g);
    for (const m of matches) {
      let target = m[1];
      if (target.startsWith('.')) {
        target = path.posix.normalize(path.posix.join(currentDir, target));
      }
      if (!loaded.has(target) && (target.startsWith('/src/') || target.startsWith('/public/'))) {
        queue.push(target);
      }
    }
  }
  console.log('Total local JS modules loaded successfully:', loaded.size);
}
testAll();
