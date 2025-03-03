#!/usr/bin/env node

// Script to generate a placeholder for a missing section file
// Usage: node generate-section-file.js section-name

const fs = require('fs');
const path = require('path');

const sectionMap = {
  'demographics': 'demographics.json',
  'medical-history': 'medical_history.json',
  'symptoms-assessment': 'symptoms_assessment.json',
  'functional-status': 'functional_status.json',
  'typical-day': 'typical_day.json',
  'environmental-assessment': 'environmental_assessment.json',
  'adl-assessment': 'adl_assessment.json',
  'attendant-care': 'attendant_care.json'
};

// Kebab to camel case conversion for section names
function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Generate placeholder section file
function generateSectionFile(sectionName) {
  const camelCaseName = kebabToCamel(sectionName);
  const fileName = sectionMap[sectionName] || `${sectionName.replace(/-/g, '_')}.json`;
  const filePath = path.resolve(__dirname, fileName);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Section file already exists: ${fileName}`);
    return;
  }
  
  // Create placeholder content
  const placeholderContent = {
    [camelCaseName]: {
      placeholderNote: `This is a placeholder for the ${sectionName} section. Replace with actual data.`,
      generatedAt: new Date().toISOString()
    }
  };
  
  // Write the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(placeholderContent, null, 2), 'utf8');
    console.log(`Created placeholder section file: ${fileName}`);
  } catch (error) {
    console.error(`Error creating section file: ${error.message}`);
  }
}

// Main execution
function main() {
  const sectionName = process.argv[2];
  
  if (!sectionName) {
    console.log('Usage: node generate-section-file.js section-name');
    console.log('Available sections:');
    Object.keys(sectionMap).forEach(section => console.log(`  - ${section}`));
    return;
  }
  
  generateSectionFile(sectionName);
}

main();
