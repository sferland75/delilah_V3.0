/**
 * Direct fix for Next.js path.relative error
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

console.log(`Fixing file: ${fileToFix}`);

// First, let's restore from backup if it exists
const backupFile = `${fileToFix}.backup`;
if (fs.existsSync(backupFile)) {
  console.log(`Restoring from backup: ${backupFile}`);
  fs.copyFileSync(backupFile, fileToFix);
}

// Read the file content
let fileContent = fs.readFileSync(fileToFix, 'utf8');

// Check for the specific problematic line around line 1423
// which is causing the "The "to" argument must be of type string. Received undefined" error
const lines = fileContent.split('\n');
const lineCount = lines.length;

let fixed = false;
let patchedLines = 0;

for (let i = 0; i < lineCount; i++) {
  // Look for lines that contain path.relative
  if (lines[i].includes('_path.default.relative(') && !lines[i].includes('typeof')) {
    // Modify this line to add a type check
    const originalLine = lines[i];
    lines[i] = lines[i].replace(
      /_path\.default\.relative\(([^,]+),\s*([^)]+)\)/g,
      '_path.default.relative($1, typeof $2 === "string" ? $2 : "")'
    );
    
    if (originalLine !== lines[i]) {
      patchedLines++;
      console.log(`Patched line ${i+1}: ${originalLine.trim()} -> ${lines[i].trim()}`);
      fixed = true;
    }
  }
  
  // Also look for the safePath function that's causing problems
  if (lines[i].includes('const safePath = (p) => {')) {
    // Change the function name to avoid collision
    lines[i] = lines[i].replace('const safePath = (p) => {', 'const safePath2 = (p) => {');
    console.log(`Renamed safePath function on line ${i+1}`);
    fixed = true;
  }
  
  // Look for uses of the safePath function and update them
  if (lines[i].includes('safePath(') && !lines[i].includes('safePath2(')) {
    lines[i] = lines[i].replace('safePath(', 'safePath2(');
    console.log(`Updated safePath function call on line ${i+1}`);
    fixed = true;
  }
}

if (fixed) {
  // Create a backup if one doesn't exist
  if (!fs.existsSync(backupFile)) {
    console.log(`Creating backup: ${backupFile}`);
    fs.writeFileSync(backupFile, fileContent);
  }
  
  // Write the fixed content
  const fixedContent = lines.join('\n');
  fs.writeFileSync(fileToFix, fixedContent);
  console.log(`Fixed ${patchedLines} instances of path.relative calls`);
  console.log('File successfully patched!');
} else {
  console.log('No changes were needed or could be made.');
}
