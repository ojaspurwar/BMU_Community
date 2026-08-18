const esbuild = require('esbuild-wasm');
const fs = require('fs');
const path = require('path');

async function build() {
  console.log('Bundling with esbuild-wasm...');
  await esbuild.initialize({});
  await esbuild.build({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    format: 'esm',
    target: 'es2020',
    sourcemap: false,
    define: {
      'process.env.NODE_ENV': '"development"',
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
    },
  });
  console.log('✓ Successfully created public/bundle.js (', fs.statSync('public/bundle.js').size, 'bytes )');
}

build().catch(console.error);
