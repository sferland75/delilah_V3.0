/**
 * Fix for Next.js development server syntax errors
 * 
 * This script fixes the syntax errors in setup-dev-bundler.js
 * that were created during the previous fix attempts
 */

const fs = require('fs');
const path = require('path');

// Path to the problematic file
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

console.log(`Attempting to fix syntax errors in: ${fileToFix}`);

// Read the file content
const originalContent = fs.readFileSync(fileToFix, 'utf8');

// Create a backup of the original file
fs.writeFileSync(`${fileToFix}.syntax-backup`, originalContent);
console.log(`Original file backed up to: ${fileToFix}.syntax-backup`);

// Find and fix both specific syntax errors
let fixedContent = originalContent.replace(
  /const appPath = _path\.default\.relative\(dir, typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : ""\)\);/g,
  'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");'
);

fixedContent = fixedContent.replace(
  /const pagesPath = _path\.default\.relative\(dir, typeof pagesPageFilePaths\.get\(p === "string" \? pagesPageFilePaths\.get\(p : ""\)\);/g,
  'const pagesPath = _path.default.relative(dir, typeof pagesPageFilePaths.get(p) === "string" ? pagesPageFilePaths.get(p) : "");'
);

// Write the fixed file
fs.writeFileSync(fileToFix, fixedContent);
console.log(`Syntax errors fixed successfully!`);

console.log('\nNow try running the development server again with:');
console.log('npm run dev');
