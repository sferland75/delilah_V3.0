/**
 * Manual fix for Next.js development server
 */

const fs = require('fs');
const path = require('path');

// Backup the original file
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

// Create backup if it doesn't exist
if (!fs.existsSync(`${filePath}.backup`)) {
  fs.copyFileSync(filePath, `${filePath}.backup`);
  console.log(`Created backup at ${filePath}.backup`);
}

// Read the content from the backup to ensure we have a clean slate
const content = fs.readFileSync(`${filePath}.backup`, 'utf8');

// Apply fixes by directly modifying the content
// 1. Fix path.relative calls to handle undefined by adding explicit string type check
const withPathFix = content.replace(
  /_path\.default\.relative\(([^,]+),\s*([^)]+)\)/g,
  '_path.default.relative($1, typeof $2 === "string" ? $2 : "")'
);

// 2. Fix duplicate safePath function (lines 187-193)
const safePath1Start = /^\s*\/\/ Additional watchpack path safety\s*$/m;
const safePath1End = /^\s*\};\s*$/m;
const safePath1Regex = new RegExp(
  `${safePath1Start.source}[\\s\\S]*?${safePath1End.source}`,
  'm'
);

// Replace the first occurrence of safePath
let withSafePathFix = withPathFix.replace(
  safePath1Regex,
  '  // Watchpack path safety function removed to avoid duplication'
);

// Replace the second occurrence of safePath
withSafePathFix = withSafePathFix.replace(
  safePath1Regex,
  '  // Watchpack path safety function removed to avoid duplication'
);

// Write the fixed file
fs.writeFileSync(filePath, withSafePathFix, 'utf8');
console.log(`Fixed file written to ${filePath}`);

// Now create a wrapper for the async code section
// Read the fixed file
const fixedContent = fs.readFileSync(filePath, 'utf8');

// Find and fix the awaits in the try-catch block
const tryBlockStart = 'try {';
const tryBlockEnd = '} catch (e) {';

// Find where we need to insert the async IIFE
const targetText = 'await writeBuildManifest(opts.fsChecker.rewrites);';
const wrapperStart = '(async function() {';
const wrapperEnd = '})().catch(console.error);';

// Find the line with the problematic await
const targetLine = fixedContent.indexOf(targetText);
if (targetLine !== -1) {
  // Find the beginning of the statement block
  const blockStart = fixedContent.lastIndexOf('// Write empty manifests', targetLine);
  if (blockStart !== -1) {
    // Find the end of the await block
    const blockEnd = fixedContent.indexOf('let hmrEventHappend = false;', targetLine);
    if (blockEnd !== -1) {
      // Extract the block to wrap
      const awaitBlock = fixedContent.substring(blockStart, blockEnd);
      
      // Create the wrapped block
      const wrappedBlock = `${fixedContent.substring(blockStart, blockStart + '// Write empty manifests'.length + 1)}
        ${wrapperStart}
${awaitBlock.substring('// Write empty manifests'.length + 1)}
        ${wrapperEnd}
        let hmrEventHappend = false;`;
      
      // Replace the block in the content
      const finalContent = fixedContent.substring(0, blockStart) + 
                          wrappedBlock + 
                          fixedContent.substring(blockEnd + 'let hmrEventHappend = false;'.length);
      
      // Write the final fixed file
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log('Successfully fixed await errors in the file.');
    } else {
      console.log('Could not find the end of the await block.');
    }
  } else {
    console.log('Could not find the block start marker.');
  }
} else {
  console.log('Could not find the target await line.');
}
