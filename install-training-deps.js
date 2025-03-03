/**
 * Install Dependencies for Pattern Recognition Training
 * 
 * This script installs the required dependencies for the pattern recognition
 * training process, including pdfjs-dist and mammoth for document processing.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure public directory exists for PDF.js fonts
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created public directory for PDF.js fonts');
}

// Check for mammoth and install if needed
console.log('Checking for mammoth package...');
try {
  require.resolve('mammoth');
  console.log('Mammoth package already installed.');
} catch (error) {
  console.log('Installing mammoth package...');
  execSync('npm install mammoth --save', { stdio: 'inherit' });
}

// Check for pdfjs-dist and install if needed
console.log('Checking for pdfjs-dist package...');
try {
  require.resolve('pdfjs-dist');
  console.log('pdfjs-dist package already installed.');
} catch (error) {
  console.log('Installing pdfjs-dist package...');
  execSync('npm install pdfjs-dist@2.16.105 --save', { stdio: 'inherit' });
}

// Setup PDF.js fonts
console.log('Setting up PDF.js fonts...');
try {
  require('./scripts/copy-pdf-fonts.js');
} catch (error) {
  console.error('Error setting up PDF.js fonts:', error.message);
  // Create placeholder directory
  const fontsDir = path.join(publicDir, 'standard_fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
    fs.writeFileSync(
      path.join(fontsDir, 'README.txt'), 
      'PDF.js standard fonts placeholder directory'
    );
  }
}

console.log('Dependencies installation complete!');
