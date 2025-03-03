/**
 * Fix for Next.js development server error
 * 
 * This script fixes two issues:
 * 1. Duplicate safePath function declarations
 * 2. Missing type checking in path.relative calls
 */

const fs = require('fs');
const path = require('path');

// Target file
const filePath = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'server',
  'lib',
  'router-utils',
  'setup-dev-bundler.js'
);

console.log(`Reading file: ${filePath}`);
const fileContent = fs.readFileSync(filePath, 'utf8');

console.log('Fixing file...');

// Fix 1: Remove duplicate safePath function declarations
const fixedContent1 = fileContent.replace(
  /const safePath = \(p\) => \{\s+if \(typeof p !== 'string'\) \{\s+return '';\s+\}\s+return p;\s+\};/g,
  '// safePath function removed to prevent duplication'
);

// Fix 2: Add type checking to path.relative calls
const fixedContent2 = fixedContent1.replace(
  /_path\.default\.relative\(([^,]+),\s*([^)]+)\)/g,
  '_path.default.relative($1, typeof $2 === "string" ? $2 : "")'
);

console.log('Writing fixed file...');
fs.writeFileSync(filePath, fixedContent2);

console.log('Fix applied successfully!');
