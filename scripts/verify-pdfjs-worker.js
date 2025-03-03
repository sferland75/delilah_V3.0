const fs = require('fs');
const path = require('path');

console.log('Verifying PDF.js worker file...');

// Check if the worker file exists in the public directory
const workerPath = path.join(__dirname, '..', 'public', 'pdf.worker.js');
const nodeModulesWorkerPath = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js');

if (!fs.existsSync(workerPath)) {
  console.log('PDF.js worker file not found in public directory!');
  
  if (fs.existsSync(nodeModulesWorkerPath)) {
    console.log('Found worker file in node_modules, copying to public directory...');
    
    try {
      fs.copyFileSync(nodeModulesWorkerPath, workerPath);
      console.log('Successfully copied PDF.js worker file to public directory!');
    } catch (error) {
      console.error('Error copying worker file:', error);
    }
  } else {
    console.error('PDF.js worker file not found in node_modules!');
    console.log('Please reinstall pdfjs-dist: npm install pdfjs-dist@2.16.105 --save');
  }
} else {
  console.log('PDF.js worker file exists in public directory.');
  
  // Check file size to make sure it's not corrupted or empty
  const stats = fs.statSync(workerPath);
  console.log(`Worker file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  if (stats.size < 100000) { // Less than 100KB is probably too small
    console.log('Worker file seems too small, might be corrupted or incomplete!');
    
    if (fs.existsSync(nodeModulesWorkerPath)) {
      console.log('Replacing with worker file from node_modules...');
      
      try {
        fs.copyFileSync(nodeModulesWorkerPath, workerPath);
        console.log('Successfully replaced PDF.js worker file!');
      } catch (error) {
        console.error('Error replacing worker file:', error);
      }
    }
  } else {
    console.log('Worker file size seems reasonable.');
  }
}

console.log('\nVerification complete!');
