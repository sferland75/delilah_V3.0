// Simple script to combine all section files into one complete assessment
const fs = require('fs');

// List of all section files to combine
const sectionFiles = [
  'demographics.json',
  'medical_history.json', 
  'symptoms_assessment.json',
  'functional_status.json',
  'typical_day.json',
  'environmental_assessment.json',
  'adl_assessment.json',
  'attendant_care.json'
];

// Combined object
const completeAssessment = {};

// Load and merge each file
sectionFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      // Extract the section name and data from each file
      const sectionName = Object.keys(data)[0];
      completeAssessment[sectionName] = data[sectionName];
      console.log(`Added section from ${file}`);
    } else {
      console.log(`File not found: ${file} (skipping)`);
    }
  } catch (error) {
    console.error(`Error processing ${file}: ${error.message}`);
  }
});

// Add timestamp
completeAssessment.metadata = {
  generated: new Date().toISOString(),
  sections: Object.keys(completeAssessment).length - 1, // Subtract 1 for metadata
  description: "Complete assessment data for John Smith - MVA case"
};

// Write the combined file
fs.writeFileSync('complete_assessment.json', JSON.stringify(completeAssessment, null, 2), 'utf8');
console.log(`Complete assessment file created with ${completeAssessment.metadata.sections} sections`);
