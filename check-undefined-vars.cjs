const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const declared = new Set([
    'console', 'window', 'document', 'localStorage', 'sessionStorage', 'fetch', 'setTimeout', 'clearTimeout',
    'setInterval', 'clearInterval', 'Math', 'Date', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean',
    'Promise', 'Set', 'Map', 'RegExp', 'Error', 'TypeError', 'Blob', 'URL', 'Event', 'KeyboardEvent', 'React',
    'HTMLInputElement', 'HTMLAudioElement', 'Audio', 'navigator', 'location', 'history', 'alert', 'confirm',
    'prompt', 'requestAnimationFrame', 'cancelAnimationFrame', 'encodeURIComponent', 'decodeURIComponent',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'undefined', 'NaN', 'Infinity', 'process', 'global',
    'Buffer', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array',
    'Uint32Array', 'Float32Array', 'Float64Array', 'BroadcastChannel'
  ]);

  const used = new Set();

  function visit(node) {
    // Collect declarations
    if (ts.isImportDeclaration(node)) {
      if (node.importClause) {
        if (node.importClause.name) declared.add(node.importClause.name.text);
        if (node.importClause.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            node.importClause.namedBindings.elements.forEach(el => {
              declared.add(el.name.text);
            });
          } else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            declared.add(node.importClause.namedBindings.name.text);
          }
        }
      }
      return;
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      declared.add(node.name.text);
    }
    if (ts.isClassDeclaration(node) && node.name) {
      declared.add(node.name.text);
    }
    if (ts.isInterfaceDeclaration(node) && node.name) {
      declared.add(node.name.text);
    }
    if (ts.isTypeAliasDeclaration(node) && node.name) {
      declared.add(node.name.text);
    }
    if (ts.isEnumDeclaration(node) && node.name) {
      declared.add(node.name.text);
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      declared.add(node.name.text);
    }
    if (ts.isParameter(node) && ts.isIdentifier(node.name)) {
      declared.add(node.name.text);
    }

    // Collect identifier usages in JSX or expressions
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (ts.isIdentifier(node.tagName)) {
        used.add(node.tagName.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const missing = [];
  for (const u of used) {
    if (!declared.has(u) && /^[A-Z]/.test(u) && u !== 'React') {
      missing.push(u);
    }
  }

  if (missing.length > 0) {
    console.error(`File ${filePath} missing JSX components/icons:`, missing);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isFile() && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
      checkFile(full);
    }
  }
}

console.log('Scanning all files in src/ for missing identifiers...');
scanDir('src');
console.log('Scan completed.');
