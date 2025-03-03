/**
 * Fix for Next.js development server await error
 * 
 * This script fixes the "await is only valid in async functions" error
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

// Split by lines to find problematic code
const lines = fileContent.split('\n');

// Find the line with the await causing the error (around line 849)
let foundProblemLine = false;
const problemLineRegex = /^\s*await currentEntriesHandling;/;

for (let i = 0; i < lines.length; i++) {
  if (problemLineRegex.test(lines[i])) {
    console.log(`Found problem at line ${i+1}: ${lines[i]}`);
    
    // Check if we're inside an async function
    let isInsideAsyncFunction = false;
    
    // Look backwards to find the function declaration
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].includes('async function') && !lines[j].includes('});')) {
        isInsideAsyncFunction = true;
        break;
      }
      // If we encounter a function end, we're not in a function
      if (lines[j].includes('});')) {
        break;
      }
    }
    
    if (!isInsideAsyncFunction) {
      console.log('This await is not inside an async function. Wrapping it in an async IIFE...');
      // Replace with an async IIFE
      lines[i] = lines[i].replace(
        'await currentEntriesHandling;',
        '(async () => { await currentEntriesHandling; })().catch(console.error);'
      );
      foundProblemLine = true;
    }
  }
}

if (foundProblemLine) {
  console.log('Writing fixed file...');
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log('Await error fix applied successfully!');
} else {
  console.log('Could not find the problematic await line. No changes made.');
}
