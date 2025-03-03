/**
 * Fix for syntax errors in Next.js setup-dev-bundler.js
 * This approach uses line numbers instead of pattern matching
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

// Create backup (if not already created)
const backupPath = `${fileToFix}.bak2`;
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`Backup created at: ${backupPath}`);
}

// Split the content into lines
const lines = content.split('\n');

// Search for the problematic lines by looking for specific patterns
let appPathLineIndex = -1;
let pagesPathLineIndex = -1;

// Find the lines by searching for partial patterns
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const appPath = _path.default.relative') && line.includes('appPageFilePaths.get(p')) {
    appPathLineIndex = i;
    console.log(`Found appPath at line ${i+1}: ${line}`);
  }
  if (line.includes('const pagesPath = _path.default.relative') && line.includes('pagesPageFilePaths.get(p')) {
    pagesPathLineIndex = i;
    console.log(`Found pagesPath at line ${i+1}: ${line}`);
  }
}

// Fix the lines if found
if (appPathLineIndex !== -1) {
  const oldAppLine = lines[appPathLineIndex];
  lines[appPathLineIndex] = 'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");';
  console.log(`Fixed appPath line ${appPathLineIndex+1}`);
  console.log(`Old: ${oldAppLine}`);
  console.log(`New: ${lines[appPathLineIndex]}`);
} else {
  console.log('WARNING: Could not find appPath line to fix');
}

if (pagesPathLineIndex !== -1) {
  const oldPagesLine = lines[pagesPathLineIndex];
  lines[pagesPathLineIndex] = 'const pagesPath = _path.default.relative(dir, typeof pagesPageFilePaths.get(p) === "string" ? pagesPageFilePaths.get(p) : "");';
  console.log(`Fixed pagesPath line ${pagesPathLineIndex+1}`);
  console.log(`Old: ${oldPagesLine}`);
  console.log(`New: ${lines[pagesPathLineIndex]}`);
} else {
  console.log('WARNING: Could not find pagesPath line to fix');
}

// Write the fixed content back to the file
fs.writeFileSync(fileToFix, lines.join('\n'), 'utf8');
console.log('File has been fixed successfully.');
