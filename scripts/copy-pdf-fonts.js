// Copy PDF.js standard fonts to public folder
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  // Ensure destination directory exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Get all files in source directory
  const files = fs.readdirSync(src);

  // Copy each file to destination
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    // If directory, recursively copy
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Source: node_modules/pdfjs-dist/standard_fonts/
const sourcePath = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'standard_fonts');

// Destination: public/standard_fonts/
const destPath = path.join(__dirname, '..', 'public', 'standard_fonts');

// Check if source exists
if (fs.existsSync(sourcePath)) {
  console.log('Copying PDF.js standard fonts to public folder...');
  copyDir(sourcePath, destPath);
  console.log('Done!');
} else {
  console.error('Error: PDF.js standard fonts not found at', sourcePath);
}
