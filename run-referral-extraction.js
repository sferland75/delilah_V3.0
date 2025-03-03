/**
 * Run Referral Extraction Test Script
 * 
 * This script tests the referral document extraction functionality
 * on the sample referral documents.
 */

const fs = require('fs');
const path = require('path');
const { processReferralDocument, mapReferralToApplicationModel } = require('./src/utils/pdf-import/ReferralDetector');

// Check if directories exist
if (!fs.existsSync('./public/data/sample-referrals')) {
  console.error('Error: Sample referrals directory not found.');
  console.error('Please make sure the directory exists: ./public/data/sample-referrals');
  process.exit(1);
}

const sampleFiles = fs.readdirSync('./public/data/sample-referrals')
  .filter(file => file.endsWith('.txt'));

if (sampleFiles.length === 0) {
  console.error('Error: No sample referral text files found.');
  console.error('Please add sample TXT files to: ./public/data/sample-referrals');
  process.exit(1);
}

console.log(`Found ${sampleFiles.length} sample referral documents.`);
console.log('Processing referral documents...\n');

// Process each sample file
sampleFiles.forEach(file => {
  console.log(`\n----- Processing file: ${file} -----`);
  
  // Read file content
  const filePath = path.join('./public/data/sample-referrals', file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Process the document
  console.log('Detecting and extracting document data...');
  const processedData = processReferralDocument(fileContent);
  
  // Map to application model
  console.log('Mapping to application model...');
  const appModel = mapReferralToApplicationModel(processedData);
  
  // Display results
  console.log('\nExtraction Results:');
  console.log('Document Type:', processedData.documentType);
  console.log('Confidence:', processedData.confidence.toFixed(2));
  
  // Client info
  const client = appModel.referral.client;
  console.log('\nClient Information:');
  console.log('- Name:', client.name);
  console.log('- Date of Birth:', client.dateOfBirth);
  console.log('- Date of Loss:', client.dateOfLoss);
  console.log('- File Number:', client.fileNumber);
  
  // Assessment requirements
  console.log('\nAssessment Requirements:');
  console.log('- Types:', appModel.referral.assessmentTypes.join(', '));
  console.log('- Report Types:', appModel.referral.reportTypes.map(rt => 
    `${rt.number}: ${rt.description}`).join(', '));
  
  if (appModel.referral.specificRequirements.length > 0) {
    console.log('\nSpecific Requirements:');
    appModel.referral.specificRequirements.forEach(req => console.log(`- ${req}`));
  }
  
  // Save the result as JSON
  const outputPath = path.join('./public/data/sample-referrals', `${file.replace('.txt', '')}-result.json`);
  fs.writeFileSync(outputPath, JSON.stringify(appModel, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);
});

console.log('\nAll sample documents processed successfully.');
