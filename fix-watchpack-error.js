/**
 * Fix for Next.js development server Watchpack error
 * 
 * This script patches the Next.js development server to fix an issue with 
 * the Watchpack event handler causing "TypeError [ERR_INVALID_ARG_TYPE]: 
 * The "to" argument must be of type string. Received undefined"
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

console.log(`Attempting to patch: ${fileToFix}`);

// Read the file content
const originalContent = fs.readFileSync(fileToFix, 'utf8');

// Let's directly target the error by looking for path.relative calls
// and adding safety checks
const fixPathRelativeCalls = (content) => {
  // Look for "_path.default.relative(" and add a type check for the "to" parameter
  return content.replace(
    /_path\.default\.relative\(([^,]+),\s*([^)]+)\)/g,
    '_path.default.relative($1, typeof $2 === "string" ? $2 : "")'
  );
};

// Apply the fix
const fixedContent = fixPathRelativeCalls(originalContent);

// Create a backup of the original file
fs.writeFileSync(`${fileToFix}.backup`, originalContent);
console.log(`Original file backed up to: ${fileToFix}.backup`);

// Write the fixed file
fs.writeFileSync(fileToFix, fixedContent);
console.log(`File patched successfully!`);

console.log('\nPatch complete. Now try running the development server again with:');
console.log('npm run dev');
