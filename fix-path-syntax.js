/**
 * Fix for corrupted path syntax in setup-dev-bundler.js
 */

const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(
  __dirname,
  'node_modules',
  'next',
  'dist',
  'server',
  'lib',
  'router-utils',
  'setup-dev-bundler.js'
);

console.log(`Reading file: ${filePath}`);
const content = fs.readFileSync(filePath, 'utf8');

// Fix the corrupted appPath and pagesPath syntax
// We need to fix the specific malformed path.relative calls around line 1429
const corruptedAppPathPattern = /const appPath = _path\.default\.relative\(dir, typeof typeof typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : "" === "string" \? typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : "" : "" === "string" \? typeof typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : "" === "string" \? typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : "" : "" : ""\)\);/g;

const corruptedPagesPathPattern = /const pagesPath = _path\.default\.relative\(dir, typeof typeof pagesPageFilePaths\.get\(p === "string" \? pagesPageFilePaths\.get\(p : "" === "string" \? typeof pagesPageFilePaths\.get\(p === "string" \? pagesPageFilePaths\.get\(p : "" : ""\)\);/g;

// Replace with corrected versions
const fixedContent = content
  .replace(corruptedAppPathPattern, 'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");')
  .replace(corruptedPagesPathPattern, 'const pagesPath = _path.default.relative(dir, typeof pagesPageFilePaths.get(p) === "string" ? pagesPageFilePaths.get(p) : "");');

// Write the fixed file
fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log(`Fixed path syntax in: ${filePath}`);
