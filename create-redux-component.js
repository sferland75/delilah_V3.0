/**
 * Helper script to create a Redux version of an existing component
 * 
 * Usage: node create-redux-component.js [ComponentPath]
 * Example: node create-redux-component.js src/sections/MedicalHistory/components/MedicalHistory.tsx
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node create-redux-component.js [ComponentPath]');
  process.exit(1);
}

const componentPath = args[0];

// Validate file exists
if (!fs.existsSync(componentPath)) {
  console.error(`File not found: ${componentPath}`);
  process.exit(1);
}

// Read the component file
const componentContent = fs.readFileSync(componentPath, 'utf8');

// Generate the Redux version path
const pathInfo = path.parse(componentPath);
const reduxPath = path.join(pathInfo.dir, `${pathInfo.name}.redux${pathInfo.ext}`);

// Transform the component to use Redux
const reduxContent = transformToRedux(componentContent);

// Write the Redux version
fs.writeFileSync(reduxPath, reduxContent, 'utf8');
console.log(`Redux component created: ${reduxPath}`);

/**
 * Transform a Context-based component to use Redux
 */
function transformToRedux(content) {
  let reduxContent = content;
  
  // Replace imports
  reduxContent = reduxContent.replace(
    "import { useAssessment } from '@/contexts/AssessmentContext';",
    "import { useAppSelector, useAppDispatch } from '@/store/hooks';\n" +
    "import { updateSectionThunk, saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';\n" +
    "import { addToast } from '@/store/slices/uiSlice';"
  );
  
  // Replace Context hook with Redux hooks
  reduxContent = reduxContent.replace(
    /const \{([^}]+)\} = useAssessment\(\);/g,
    (match, contextArgs) => {
      // Clean up args
      const args = contextArgs.split(',').map(arg => arg.trim());
      
      let reduxHooks = "const dispatch = useAppDispatch();\n";
      
      // Map common context variables to Redux selectors
      if (args.includes('data')) {
        reduxHooks += "  const currentData = useAppSelector(state => state.assessments.currentData);\n";
      }
      
      if (args.includes('currentAssessmentId')) {
        reduxHooks += "  const currentId = useAppSelector(state => state.assessments.currentId);\n";
      }
      
      if (args.includes('saveCurrentAssessment')) {
        reduxHooks += "  const saveStatus = useAppSelector(state => state.assessments.loading.save);\n";
      }
      
      return reduxHooks;
    }
  );
  
  // Replace updateSection calls
  reduxContent = reduxContent.replace(
    /updateSection\('([^']+)', ([^)]+)\);/g,
    "dispatch(updateSectionThunk({ sectionName: '$1', sectionData: $2 }));"
  );
  
  // Replace saveCurrentAssessment calls
  reduxContent = reduxContent.replace(
    /saveCurrentAssessment\(\)/g,
    "dispatch(saveCurrentAssessmentThunk())"
  );
  
  // Add Redux indicator to component name
  reduxContent = reduxContent.replace(
    /export const ([A-Za-z0-9_]+) = \(\) =>/g,
    "export const $1Redux = () =>"
  );
  
  // Add Redux indicator to export default
  reduxContent = reduxContent.replace(
    /export default ([A-Za-z0-9_]+);/g,
    "export default $1Redux;"
  );
  
  return reduxContent;
}
