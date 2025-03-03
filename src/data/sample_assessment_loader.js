// Sample Assessment Loader
// This script loads the modular assessment sections and combines them
// into a complete assessment record for testing

const fs = require('fs');
const path = require('path');

// Configuration - paths to individual section files
const sectionFiles = [
  { 
    name: 'demographics', 
    path: './demographics.json' 
  },
  { 
    name: 'medicalHistory', 
    path: './medical_history.json' 
  },
  { 
    name: 'symptomsAssessment', 
    path: './symptoms_assessment.json' 
  },
  { 
    name: 'functionalStatus', 
    path: './functional_status.json' 
  },
  { 
    name: 'typicalDay', 
    path: './typical_day.json' 
  },
  { 
    name: 'environmentalAssessment', 
    path: './environmental_assessment.json' 
  },
  { 
    name: 'activitiesOfDailyLiving', 
    path: './adl_assessment.json' 
  },
  { 
    name: 'attendantCare', 
    path: './attendant_care.json' 
  }
];

// Function to load and combine all assessment sections
function loadFullAssessment() {
  const completeAssessment = {};
  
  // Load each section file
  sectionFiles.forEach(section => {
    try {
      const filePath = path.resolve(__dirname, section.path);
      if (fs.existsSync(filePath)) {
        const sectionData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // Extract the actual section data (which may be nested inside its own object)
        const sectionContent = sectionData[section.name] || sectionData;
        // Add to complete assessment
        completeAssessment[section.name] = sectionContent;
      } else {
        console.warn(`Warning: Section file ${section.path} not found`);
      }
    } catch (error) {
      console.error(`Error loading section ${section.name}:`, error.message);
    }
  });
  
  return completeAssessment;
}

// Create the complete assessment file
function createCompleteAssessmentFile() {
  const assessment = loadFullAssessment();
  const outputPath = path.resolve(__dirname, './complete_assessment.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(assessment, null, 2), 'utf8');
    console.log(`Complete assessment file created at: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error creating complete assessment file:', error.message);
    return false;
  }
}

// Execute the file creation if run directly
if (require.main === module) {
  createCompleteAssessmentFile();
}

module.exports = { loadFullAssessment, createCompleteAssessmentFile };
