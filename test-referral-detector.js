const fs = require('fs');
const path = require('path');

// Import our referral detector code
const { detectReferralDocument, detectReferralSections } = require('./src/utils/pdf-import/ReferralDetector');

// Sample content from our test file
const sampleContent = fs.readFileSync(
  path.join(__dirname, 'public/data/sample-referrals/sample-referral-text-1.txt'),
  'utf8'
);

// Test referral detection
const detectionResult = detectReferralDocument(sampleContent);
console.log('Detection Result:');
console.log(JSON.stringify(detectionResult, null, 2));
console.log('\n');

// Test section detection
const sectionsResult = detectReferralSections(sampleContent);
console.log('Sections Result:');
console.log(JSON.stringify(sectionsResult, null, 2));
