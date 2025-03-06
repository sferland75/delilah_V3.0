/**
 * Verification script for Delilah V3.0 Implementation
 * 
 * This script checks for the presence of key files and components
 * created during the core UI restoration, form completion, and report
 * drafting module implementation.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Define paths to check
const requiredPaths = [
  // Core UI Components
  'pages/index.tsx',
  'pages/assessment/index.tsx',
  'pages/full-assessment.tsx',
  'src/components/navigation/main/MainNavigation.tsx',
  
  // Form Components
  'src/components/form/FormSectionBase.tsx',
  'src/components/form/index.ts',
  'src/sections/sample/DemoSection.tsx',
  'src/services/assessment-storage-service.ts',
  
  // Report Drafting
  'pages/report-drafting/index.tsx',
  'src/components/ReportDrafting/ReportPreview.tsx',
  'src/lib/report-drafting/api-service.ts',
  'src/lib/report-drafting/api-client.ts',
  'src/lib/report-drafting/generators.ts',
  'src/lib/report-drafting/templates.ts',
  'src/lib/report-drafting/types.ts',
  
  // UI Components
  'src/components/ui/dialog.tsx',
  'src/components/ui/date-picker.tsx',
  'src/components/ui/popover.tsx',
  'src/components/ui/calendar.tsx',
  
  // Documentation
  'IMPLEMENTATION_SUMMARY.md',
  'DEVELOPER_QUICKSTART.md'
];

// Define imports to check in key files
const requiredImports = {
  'pages/index.tsx': [
    'MainNavigation', 
    'Card', 
    'Button'
  ],
  'src/components/form/FormSectionBase.tsx': [
    'useAssessment',
    'useForm',
    'zodResolver'
  ],
  'pages/report-drafting/index.tsx': [
    'ReportDraftingProvider',
    'TemplateSelection',
    'ConfigureReport',
    'ReportPreview'
  ]
};

// Function to check if a file exists
function checkFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

// Function to check if a file contains specific imports
function checkImports(filePath, imports) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  return imports.every(imp => content.includes(imp));
}

// Execute verification
console.log(chalk.blue.bold('Delilah V3.0 Implementation Verification\n'));

// Check all required files
console.log(chalk.yellow('Checking for required files:'));
let missingFiles = 0;

requiredPaths.forEach(filePath => {
  const exists = checkFile(filePath);
  
  if (exists) {
    console.log(`${chalk.green('✓')} ${filePath}`);
  } else {
    console.log(`${chalk.red('✗')} ${filePath} - Not found!`);
    missingFiles++;
  }
});

console.log(chalk.yellow('\nChecking for required imports in key files:'));
let missingImports = 0;

for (const [file, imports] of Object.entries(requiredImports)) {
  const hasImports = checkImports(file, imports);
  
  if (hasImports) {
    console.log(`${chalk.green('✓')} ${file} - All imports present`);
  } else {
    console.log(`${chalk.red('✗')} ${file} - Missing required imports!`);
    missingImports++;
  }
}

// Summary
console.log(chalk.blue.bold('\nVerification Summary:'));
console.log(`Files checked: ${requiredPaths.length}`);
console.log(`Files missing: ${missingFiles}`);
console.log(`Files with missing imports: ${missingImports}`);

if (missingFiles === 0 && missingImports === 0) {
  console.log(chalk.green.bold('\nAll verification checks passed! The implementation appears complete.'));
} else {
  console.log(chalk.yellow.bold('\nSome verification checks failed. Review the missing components above.'));
}

// Final notes
console.log(chalk.blue.bold('\nNext Steps:'));
console.log('1. Run the application with `npm run dev`');
console.log('2. Test the core workflow: Assessment creation → Form completion → Report generation');
console.log('3. Check that all UI components render correctly');
console.log('4. Verify that form data is saved and loaded properly');
