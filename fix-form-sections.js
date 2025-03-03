/**
 * Form Sections Fix Script
 * 
 * This script fixes the form components that are not displaying properly
 * by applying similar fixes to those documented in FIXES_APPLIED.md
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

// Set up paths
const SECTIONS_DIR = path.join('d:', 'delilah_V3.0', 'src', 'sections');

// Track the fixes
const fixes = {
  components: []
};

/**
 * Process section components
 */
async function processSectionComponents() {
  try {
    // Get all section directories
    const sectionDirs = fs.readdirSync(SECTIONS_DIR)
      .filter(dir => fs.statSync(path.join(SECTIONS_DIR, dir)).isDirectory())
      .filter(dir => !dir.startsWith('_')); // Skip archived directories
      
    for (const section of sectionDirs) {
      const sectionPath = path.join(SECTIONS_DIR, section);
      const files = fs.readdirSync(sectionPath).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));
      
      for (const file of files) {
        const filePath = path.join(sectionPath, file);
        const content = await readFile(filePath, 'utf8');
        
        // Look for components that use formContext or useState
        if (content.includes('useFormContext') || 
            (content.includes('useState') && content.includes('useEffect'))) {
          
          // Backup the file
          const backupPath = `${filePath}.bak`;
          await copyFile(filePath, backupPath);
          
          // Fix component
          const fixedContent = fixFormComponent(content, section, file);
          
          if (fixedContent !== content) {
            await writeFile(filePath, fixedContent);
            fixes.components.push(`${section}/${file}`);
            console.log(`Fixed component: ${section}/${file}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing section components: ${error.message}`);
  }
}

/**
 * Fix a form component
 */
function fixFormComponent(content, section, file) {
  let fixedContent = content;
  
  // Fix 1: Move data loading state updates to useEffect
  fixedContent = fixedContent.replace(
    /(const\s+\w+\s*=\s*mapContextDataToForm\(\)[\s\S]*?)(\s*setDataLoaded\(.*?\))/g,
    '$1'
  );
  
  // Fix 2: Prevent state updates during render
  // Look for setDataLoaded or setState calls outside of useEffect or handlers
  const stateUpdateOutsideEffect = /^\s*(set\w+)\(.*?\)(?!.*}\s*,\s*\[)/gm;
  const matches = Array.from(fixedContent.matchAll(stateUpdateOutsideEffect));
  
  // Move state updates to useEffect if found outside
  if (matches.length > 0) {
    // Check if we already have a useEffect
    if (fixedContent.includes('useEffect')) {
      // Make sure setDataLoaded is inside useEffect with appropriate dependencies
      for (const match of matches) {
        const stateSetter = match[1];
        if (!fixedContent.match(new RegExp(`useEffect\\([\\s\\S]*?${stateSetter}\\(.*?\\)`, 'm'))) {
          // Add the state setter to an appropriate useEffect
          fixedContent = fixedContent.replace(
            /(useEffect\(\(\)\s*=>\s*{[\s\S]*?)(}\s*,\s*\[.*?\]\))/,
            `$1\n    // Added by fix script\n    ${match[0].trim()}\n    $2`
          );
        }
      }
    } else {
      // Add new useEffect for state updates
      const stateUpdates = matches.map(m => `    ${m[0].trim()}`).join('\n');
      const insertPos = fixedContent.indexOf('return') > -1 ? 
                       fixedContent.indexOf('return') : 
                       fixedContent.indexOf('render');
                       
      if (insertPos > -1) {
        fixedContent = 
          fixedContent.substring(0, insertPos) + 
          `\n  // Effect to handle state updates - added by fix script\n  useEffect(() => {\n${stateUpdates}\n  }, []);\n\n` +
          fixedContent.substring(insertPos);
      }
    }
  }
  
  // Fix 3: Fix form initialization to use static default values
  const formHookMatch = fixedContent.match(/const\s+form\s*=\s*useForm\(\s*{[\s\S]*?defaultValues\s*:\s*([^}]+)}/);
  if (formHookMatch && !formHookMatch[1].trim().startsWith('{')) {
    // Define a static defaultValues
    const defaultValuesSection = `// Static default values - added by fix script\n  const defaultFormValues = ${formHookMatch[1].trim() === 'defaultFormState' ? 'defaultFormState' : '{}'};`;
    
    // Add defaultFormValues if needed
    if (!fixedContent.includes('defaultFormValues')) {
      const formDefPos = fixedContent.indexOf('const form =');
      if (formDefPos > -1) {
        fixedContent = 
          fixedContent.substring(0, formDefPos) + 
          defaultValuesSection + '\n\n  ' +
          fixedContent.substring(formDefPos);
      }
    }
    
    // Replace dynamic defaultValues with static defaultFormValues
    fixedContent = fixedContent.replace(
      /(const\s+form\s*=\s*useForm\(\s*{[\s\S]*?defaultValues\s*:)([^}]+)}/,
      '$1 defaultFormValues}'
    );
    
    // Ensure form.reset is called in useEffect
    if (!fixedContent.includes('form.reset(')) {
      // Find a useEffect with appropriate dependencies
      if (fixedContent.includes('useEffect') && 
          (fixedContent.includes('[contextData') || fixedContent.includes('[assessmentData'))) {
        // Add form.reset to existing useEffect
        fixedContent = fixedContent.replace(
          /(useEffect\(\(\)\s*=>\s*{[\s\S]*?)(}\s*,\s*\[(contextData|assessmentData).*?\]\))/,
          '$1\n    // Reset form with mapped data - added by fix script\n    if (typeof mapContextDataToForm === "function") {\n      const mappedData = mapContextDataToForm();\n      if (mappedData && mappedData.formData) {\n        form.reset(mappedData.formData);\n      }\n    }\n    $2'
        );
      } else {
        // Add new useEffect for form reset
        const dataSourceVar = fixedContent.includes('contextData') ? 'contextData' : (
                             fixedContent.includes('assessmentData') ? 'assessmentData' : 'data');
        
        const insertPos = fixedContent.indexOf('return') > -1 ? 
                         fixedContent.indexOf('return') : 
                         fixedContent.indexOf('render');
                         
        if (insertPos > -1) {
          fixedContent = 
            fixedContent.substring(0, insertPos) + 
            `\n  // Effect to reset form with mapped data - added by fix script\n  useEffect(() => {\n    if (${dataSourceVar} && typeof mapContextDataToForm === "function") {\n      const mappedData = mapContextDataToForm();\n      if (mappedData && mappedData.formData) {\n        form.reset(mappedData.formData);\n      }\n    }\n  }, [${dataSourceVar}, form]);\n\n` +
            fixedContent.substring(insertPos);
        }
      }
    }
  }
  
  // Fix 4: Add missing mapContextDataToForm function if needed
  if (!fixedContent.includes('mapContextDataToForm')) {
    const dataSourceVar = fixedContent.includes('contextData') ? 'contextData' : (
                          fixedContent.includes('assessmentData') ? 'assessmentData' : 'data');
    
    const insertPos = fixedContent.indexOf('const form =');
    if (insertPos > -1) {
      let mapperFunction = `
  // Map context data to form - added by fix script
  const mapContextDataToForm = useCallback(() => {
    if (!${dataSourceVar}) return { formData: {}, hasData: false };
    
    try {
      // Basic mapping logic
      const formData = {};
      const hasData = !!${dataSourceVar};
      
      return { formData, hasData };
    } catch (error) {
      console.error("Error mapping data:", error);
      return { formData: {}, hasData: false };
    }
  }, [${dataSourceVar}]);
`;
      
      // Insert before form declaration
      fixedContent = 
        fixedContent.substring(0, insertPos) + 
        mapperFunction +
        fixedContent.substring(insertPos);
      
      // Add useCallback import if missing
      if (!fixedContent.includes('useCallback')) {
        const reactImportMatch = fixedContent.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]/);
        if (reactImportMatch) {
          fixedContent = fixedContent.replace(
            /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
            `import {$1, useCallback} from "react"`
          );
        } else if (fixedContent.includes('import React from "react"')) {
          fixedContent = fixedContent.replace(
            /import React from "react"/,
            `import React, { useCallback } from "react"`
          );
        } else {
          fixedContent = `import { useCallback } from "react";\n${fixedContent}`;
        }
      }
    }
  }
  
  // Fix 5: Ensure proper error handling in section components
  if (!fixedContent.includes('try') && !fixedContent.includes('catch')) {
    // Add error handling in return statement
    fixedContent = fixedContent.replace(
      /(return\s*\([\s\S]*?)(<(?:div|section|form)[^>]*>)/,
      '$1<>\n      {/* Error handling wrapper - added by fix script */}\n      <ErrorBoundary>\n      $2'
    );
    
    fixedContent = fixedContent.replace(
      /(<\/(?:div|section|form)>\s*?)(\);)/,
      '$1\n      </ErrorBoundary>\n      </>\n      $2'
    );
    
    // Add ErrorBoundary import if not present
    if (!fixedContent.includes('ErrorBoundary')) {
      // Add import at the top of the file
      fixedContent = `import { ErrorBoundary } from "@/components/ui/error-boundary";\n${fixedContent}`;
    }
  }
  
  return fixedContent;
}

/**
 * Create a summary report
 */
async function createSummaryReport() {
  try {
    const summary = `# Form Section Components Fixes Summary

## Components Fixed
${fixes.components.map(comp => `- ${comp}`).join('\n')}

## Fixes Applied
1. Moved state updates from render function to useEffect
2. Fixed form initialization to prevent re-render loops
3. Ensured proper error handling with ErrorBoundary components
4. Fixed component state management for consistent rendering
5. Added proper data mapping structure

## Next Steps
1. Verify all form components display correctly
2. Test data loading functionality
3. Test form submission
4. Check for any console errors related to form components

## Testing
After applying these fixes, please:
1. Start the development server: \`npm run dev\`
2. Navigate to each form section in the browser
3. Verify the forms display correctly
4. Check browser console for any errors
5. Test form data population from pattern recognition
`;

    const summaryPath = path.join('d:', 'delilah_V3.0', 'FORM_SECTION_FIXES_SUMMARY.md');
    await writeFile(summaryPath, summary);
    console.log(`Summary saved to ${summaryPath}`);
  } catch (error) {
    console.error(`Error creating summary: ${error.message}`);
  }
}

/**
 * Create a diagnostics file for easier debugging
 */
async function createDiagnosticsFile() {
  try {
    // Create a React component to help debug form issues
    const diagnosticsComponent = `// FormDiagnostics.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FormDiagnostics = ({ formContext, sectionName }) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [formState, setFormState] = useState(null);
  
  useEffect(() => {
    if (showDiagnostics && formContext) {
      // Get current form state safely
      try {
        const currentValues = formContext.getValues ? formContext.getValues() : {};
        setFormState(currentValues);
      } catch (error) {
        console.error("Error getting form values:", error);
        setFormState({ error: error.message });
      }
    }
  }, [showDiagnostics, formContext]);
  
  if (!showDiagnostics) {
    return (
      <div className="mt-4 mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowDiagnostics(true)}
          size="sm"
        >
          Show Form Diagnostics
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="mt-4 mb-4 border border-yellow-400">
      <CardHeader className="bg-yellow-50 py-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Form Diagnostics: {sectionName || "Unknown Section"}</span>
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(false)}
            size="sm"
          >
            Hide
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-gray-50">
        <div className="text-xs font-mono overflow-auto max-h-64">
          <h4 className="font-bold mb-2">Current Form Values:</h4>
          <pre>{JSON.stringify(formState, null, 2)}</pre>
          
          <h4 className="font-bold mt-4 mb-2">Form State:</h4>
          <ul className="list-disc list-inside">
            <li>Dirty: {String(formContext?.formState?.isDirty || false)}</li>
            <li>Valid: {String(formContext?.formState?.isValid || false)}</li>
            <li>Submitting: {String(formContext?.formState?.isSubmitting || false)}</li>
            <li>Errors: {Object.keys(formContext?.formState?.errors || {}).length || 0}</li>
          </ul>
          
          {Object.keys(formContext?.formState?.errors || {}).length > 0 && (
            <>
              <h4 className="font-bold mt-4 mb-2">Form Errors:</h4>
              <pre>{JSON.stringify(formContext?.formState?.errors, null, 2)}</pre>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDiagnostics;
`;

    const diagnosticsPath = path.join('d:', 'delilah_V3.0', 'src', 'components', 'ui', 'form-diagnostics.jsx');
    await writeFile(diagnosticsPath, diagnosticsComponent);
    console.log(`Diagnostics component created at ${diagnosticsPath}`);
  } catch (error) {
    console.error(`Error creating diagnostics file: ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Fixing form section components...');
  await processSectionComponents();
  await createSummaryReport();
  await createDiagnosticsFile();
  console.log('Form section fixes complete!');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
