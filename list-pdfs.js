const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

// Set directory to check
const IHA_DIR = path.join('d:', 'delilah', 'IHAs');

// Function to list PDF files recursively
async function listPdfsRecursively(dir, allPdfs = []) {
  try {
    const files = await readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        // If directory, search inside it too
        await listPdfsRecursively(filePath, allPdfs);
      } else if (file.toLowerCase().endsWith('.pdf')) {
        // If PDF file, add to list
        allPdfs.push(filePath);
      }
    }
    
    return allPdfs;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
    return allPdfs;
  }
}

// Main function
async function main() {
  console.log(`Searching for PDF files in ${IHA_DIR}...`);
  
  try {
    // List PDFs in the main directory (non-recursive)
    const files = await readdir(IHA_DIR);
    const mainDirPdfs = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    console.log(`Found ${mainDirPdfs.length} PDFs in main directory:`);
    mainDirPdfs.forEach(file => console.log(`- ${file}`));
    
    // Now search recursively including subdirectories
    const allPdfs = await listPdfsRecursively(IHA_DIR);
    
    console.log(`\nFound ${allPdfs.length} PDFs in total (including subdirectories):`);
    allPdfs.forEach(file => console.log(`- ${file}`));
    
    // Check if there are PDFs in subdirectories
    const subDirPdfs = allPdfs.filter(file => !mainDirPdfs.includes(path.basename(file)));
    
    if (subDirPdfs.length > 0) {
      console.log(`\n${subDirPdfs.length} PDFs are in subdirectories and won't be processed by the current script:`);
      subDirPdfs.forEach(file => console.log(`- ${file}`));
    }
  } catch (error) {
    console.error('Error listing PDFs:', error);
  }
}

// Run the main function
main().catch(console.error);
