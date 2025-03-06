const fs = require('fs');
const path = require('path');

// Define the path to the component file
const componentPath = path.join(__dirname, '..', 'src', 'sections', '5-FunctionalStatus', 'components', 'FunctionalStatus.redux.tsx');

try {
  // Read the file content
  let content = fs.readFileSync(componentPath, 'utf8');
  
  // First option: Change the import to use RangeOfMotion from RangeOfMotion.tsx
  content = content.replace(
    "import { SimpleRangeOfMotion } from './SimpleRangeOfMotion';",
    "import { RangeOfMotion } from './RangeOfMotion';"
  );
  
  // Also update the TabsContent to ensure it's using RangeOfMotion
  content = content.replace(
    "<SimpleRangeOfMotion />",
    "<RangeOfMotion />"
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(componentPath, content, 'utf8');
  
  console.log('Successfully updated the FunctionalStatus.redux.tsx component!');
} catch (error) {
  console.error('Error updating the component:', error);
}
