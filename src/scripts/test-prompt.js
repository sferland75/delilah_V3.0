/**
 * Script to test a prompt template from the command line.
 * 
 * Usage:
 *   node test-prompt.js [section] [detail] [style]
 * 
 * Example:
 *   node test-prompt.js functional-status standard clinical
 */

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage:');
  console.log('  node test-prompt.js [section] [detail] [style]');
  console.log('\nExample:');
  console.log('  node test-prompt.js functional-status standard clinical');
  process.exit(1);
}

// Parse arguments
const section = args[0] || 'functional-status';
const detailLevel = args[1] || 'standard';
const style = args[2] || 'clinical';

// Run a simple test by directly reading files
async function runSimpleTest() {
  console.log(`Testing prompt template: ${section} - ${detailLevel} - ${style}`);
  
  try {
    // Read the sample data file
    const fs = require('fs');
    const path = require('path');
    
    const sampleDataPath = path.join(__dirname, '..', 'lib', 'report-drafting', 'prompt-testing', 'sample-data.ts');
    console.log(`Looking for sample data at: ${sampleDataPath}`);
    
    if (!fs.existsSync(sampleDataPath)) {
      console.error(`Sample data file not found at: ${sampleDataPath}`);
      console.log('\nDirect approach: Reading sample data from built-in example');
      
      // Use built-in sample data
      const sampleData = getSampleData(section);
      console.log(`\nSample data for ${section} loaded successfully`);
      
      // Generate the prompt
      const prompt = generatePrompt(section, detailLevel, style, sampleData);
      
      // Display the prompt
      console.log('\n==== GENERATED PROMPT ====\n');
      console.log(prompt);
      console.log('\n==========================\n');
    } else {
      console.log('Sample data file found, but TypeScript files cannot be directly required in Node.js');
      console.log('Please use the web interface to test prompts instead:');
      console.log('- Start the development server: npm run dev');
      console.log('- Navigate to: http://localhost:3000/prompt-testing');
    }
    
  } catch (error) {
    console.error('Error generating prompt:', error);
    process.exit(1);
  }
}

// Simple function to generate a prompt
function generatePrompt(section, detailLevel, style, data) {
  // Very simplified version of the actual prompt template
  return `You are an experienced occupational therapist writing a report.

SECTION: ${section}
DETAIL LEVEL: ${detailLevel}
STYLE: ${style}

CLIENT DATA:
${JSON.stringify(data, null, 2)}

Please write a professional report section based on this information.`;
}

// Built-in sample data for functional-status
function getSampleData(section) {
  if (section === 'functional-status') {
    return {
      mobilityStatus: 'Independent household ambulation; uses cane for community distances > 400m',
      transferStatus: 'Independent in all transfers',
      standingTolerance: 'Limited to 15-20 minutes before fatigue',
      walkingDistance: '400m without assistive device; 800m with cane',
      balance: 'Berg Balance Scale score: 48/56 (mild impairment)',
      upperExtremityFunction: 'Full active range of motion; mild weakness in fine motor skills when fatigued',
      strength: 'Upper extremities 5/5 throughout; lower extremities 4+/5 left, 4/5 right',
      endurance: 'Moderate limitation; requires rest after 30 minutes of activity'
    };
  } else {
    return {
      note: 'Basic sample data for testing',
      clientName: 'John Smith',
      basicInfo: 'Example data for ' + section
    };
  }
}

// Run the test
runSimpleTest();
