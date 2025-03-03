/**
 * Fix for Next.js development server await errors
 * 
 * This script fixes all await errors in the setup-dev-bundler.js file
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
let fileContent = fs.readFileSync(filePath, 'utf8');

// First fix the duplicate safePath functions
fileContent = fileContent.replace(
  /const safePath = \(p\) => \{\s+if \(typeof p !== 'string'\) \{\s+return '';\s+\}\s+return p;\s+\};/g,
  '// safePath function removed to prevent duplication'
);

// Fix type checking in path.relative calls
fileContent = fileContent.replace(
  /_path\.default\.relative\(([^,]+),\s*([^)]+)\)/g,
  '_path.default.relative($1, typeof $2 === "string" ? $2 : "")'
);

// Fix await issues - we'll wrap all the sequential awaits in an async IIFE
// Find the problematic code block with multiple awaits
const awaitBlockStart = "        // Write empty manifests";
const awaitBlockEnd = "        let hmrEventHappend = false;";

// Extract the full block of code with awaits
const regex = new RegExp(`${awaitBlockStart}[\\s\\S]*?${awaitBlockEnd}`);
const match = fileContent.match(regex);

if (match) {
  const originalBlock = match[0];
  console.log('Found await block to fix');
  
  // Wrap the entire block in an async IIFE
  const fixedBlock = `${awaitBlockStart}
        (async () => {
            await (0, _promises.mkdir)(_path.default.join(distDir, "server"), {
                recursive: true
            });
            await (0, _promises.mkdir)(_path.default.join(distDir, "static/development"), {
                recursive: true
            });
            await (0, _promises.writeFile)(_path.default.join(distDir, "package.json"), JSON.stringify({
                type: "commonjs"
            }, null, 2));
            await currentEntriesHandling;
            await writeBuildManifest(opts.fsChecker.rewrites);
            await writeAppBuildManifest();
            await writeFallbackBuildManifest();
            await writePagesManifest();
            await writeAppPathsManifest();
            await writeMiddlewareManifest();
            await writeActionManifest();
            await writeFontManifest();
            await writeLoadableManifest();
        })().catch(err => {
            console.error('Error in manifest generation:', err);
        });
        ${awaitBlockEnd}`;
  
  // Replace the block in the file
  fileContent = fileContent.replace(originalBlock, fixedBlock);
  
  console.log('Writing fixed file...');
  fs.writeFileSync(filePath, fileContent);
  console.log('All await errors fixed successfully!');
} else {
  console.log('Could not find the problematic await block. No changes made.');
}
