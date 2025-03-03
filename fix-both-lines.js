/**
 * Fix for the two syntax errors on lines 1423 and 1424
 * in the Next.js setup-dev-bundler.js file
 */

const fs = require('fs');
const path = require('path');

// File path
const fileToFix = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'server',
  'lib',
  'router-utils',
  'setup-dev-bundler.js'
);

console.log(`Reading file: ${fileToFix}`);
let content = fs.readFileSync(fileToFix, 'utf8');

// Create backup
fs.writeFileSync(`${fileToFix}.bak`, content, 'utf8');
console.log(`Backup created at: ${fileToFix}.bak`);

// First, find the exact problematic lines by searching for the patterns
const line1 = content.match(/const appPath = _path\.default\.relative\(dir, typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : ""\)\);/);
const line2 = content.match(/const pagesPath = _path\.default\.relative\(dir, typeof pagesPageFilePaths\.get\(p === "string" \? pagesPageFilePaths\.get\(p : ""\)\);/);

if (line1) {
  // Fix line 1423
  content = content.replace(
    /const appPath = _path\.default\.relative\(dir, typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : ""\)\);/g,
    'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");'
  );
  console.log('Fixed appPath line');
} else {
  console.log('WARNING: Could not find appPath line to fix');
}

if (line2) {
  // Fix line 1424
  content = content.replace(
    /const pagesPath = _path\.default\.relative\(dir, typeof pagesPageFilePaths\.get\(p === "string" \? pagesPageFilePaths\.get\(p : ""\)\);/g,
    'const pagesPath = _path.default.relative(dir, typeof pagesPageFilePaths.get(p) === "string" ? pagesPageFilePaths.get(p) : "");'
  );
  console.log('Fixed pagesPath line');
} else {
  console.log('WARNING: Could not find pagesPath line to fix');
}

// Write the fixed content back to the file
fs.writeFileSync(fileToFix, content, 'utf8');
console.log('File has been fixed successfully.');
