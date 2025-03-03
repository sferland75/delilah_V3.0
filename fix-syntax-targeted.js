/**
 * Fix specifically for the syntax errors in lines 1423 and 1424
 * in the Next.js development server
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
let fileContent = fs.readFileSync(fileToFix, 'utf8');

// Fix line 1423 (appPath)
fileContent = fileContent.replace(
  /const appPath = _path\.default\.relative\(dir, typeof appPageFilePaths\.get\(p === "string" \? appPageFilePaths\.get\(p : ""\)\);/g,
  'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");'
);

// Fix line 1424 (pagesPath)
fileContent = fileContent.replace(
  /const pagesPath = _path\.default\.relative\(dir, typeof pagesPageFilePaths\.get\(p === "string" \? pagesPageFilePaths\.get\(p : ""\)\);/g,
  'const pagesPath = _path.default.relative(dir, typeof pagesPageFilePaths.get(p) === "string" ? pagesPageFilePaths.get(p) : "");'
);

// Write the fixed file
fs.writeFileSync(fileToFix, fileContent);
console.log(`Syntax errors fixed successfully!`);

console.log('\nNow try running the development server with:');
console.log('npm run dev');
