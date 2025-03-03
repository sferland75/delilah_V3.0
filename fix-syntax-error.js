/**
 * Fix for Next.js development server syntax error
 * 
 * This script fixes the syntax error in setup-dev-bundler.js
 * that was created during the previous fix attempt
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

console.log(`Attempting to fix syntax error in: ${fileToFix}`);

// Read the file content
const originalContent = fs.readFileSync(fileToFix, 'utf8');

// Create a backup of the original file
fs.writeFileSync(`${fileToFix}.syntax-backup`, originalContent);
console.log(`Original file backed up to: ${fileToFix}.syntax-backup`);

// Find and fix the specific syntax error
const fixedContent = originalContent.replace(
  /const appPath = _path\.default\.relative\(dir, typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : ""\)\);/g,
  'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");'
);

// Write the fixed file
fs.writeFileSync(fileToFix, fixedContent);
console.log(`Syntax error fixed successfully!`);

console.log('\nNow try running the development server again with:');
console.log('npm run dev');
