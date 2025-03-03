/**
 * Comprehensive Fix for Form Rendering Issues in Delilah V3.0
 * 
 * This script addresses the common rendering issues found in the application:
 * 1. Missing exports or export mismatches
 * 2. State updates during rendering causing infinite re-renders
 * 3. Improper form initialization
 * 4. Icon references that don't exist in lucide-react
 * 5. Missing error boundaries
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

// Set up paths
const SECTIONS_DIR = path.join('d:', 'delilah_V3.0', 'src', 'sections');
const COMPONENTS_DIR = path.join('d:', 'delilah_V3.0', 'src', 'components');

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
      // Check components and nested component directories
      await processComponents(section, sectionPath);
    }
  } catch (error) {
    console.error(`Error processing section components: ${error.message}`);
  }
}

/**
 * Process components in a directory and its subdirectories
 */
async function processComponents(section, dirPath) {
  const entries = fs.readdirSync(dirPath);
  
  // Process all .tsx and .jsx files in the current directory
  const files = entries.filter(f => (f.endsWith('.tsx') || f.endsWith('.jsx')) && f.includes('.integrated'));
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    await processFile(section, filePath);
  }
  
  // Process subdirectories (e.g., "components" folder)
  const subdirs = entries.filter(entry => {
    const fullPath = path.join(dirPath, entry);
    return fs.statSync(fullPath).isDirectory() && !entry.startsWith('_') && !entry.includes('test');
  });
  
  for (const subdir of subdirs) {
    await processComponents(section, path.join(dirPath, subdir));
  }
}

/**
 * Process an individual file
 */
async function processFile(section, filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Skip files that don't have form components or state management
    if (!content.includes('useForm') && 
        !content.includes('useState') && 
        !content.includes('useFormContext') &&
        !content.includes('export')) {
      return;
    }
    
    // Skip backup files
    if (filePath.endsWith('.bak')) {
      return;
    }
    
    const fileName = path.basename(filePath);
    
    // Create a backup before modifying
    const backupPath = `${filePath}.bak`;
    // Only create a backup if one doesn't exist
    if (!fs.existsSync(backupPath)) {
      await copyFile(filePath, backupPath);
    }
    
    // Fix the component
    const fixedContent = fixFormComponent(content, section, fileName);
    
    if (fixedContent !== content) {
      await writeFile(filePath, fixedContent);
      fixes.components.push(`${section}/${fileName}`);
      console.log(`Fixed component: ${section}/${fileName}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
  }
}

/**
 * Fix a form component by addressing all identified issues
 */
function fixFormComponent(content, section, file) {
  let fixedContent = content;
  
  // Fix 1: Add necessary imports
  fixedContent = addMissingImports(fixedContent);
  
  // Fix 2: Wrap all context data operations in null checks
  fixedContent = addNullChecks(fixedContent);
  
  // Fix 3: Wrap mapContextToForm in useCallback to prevent re-renders
  fixedContent = fixMapContextToFormFunction(fixedContent);
  
  // Fix 4: Fix form initialization with static default values
  fixedContent = fixFormInitialization(fixedContent);
  
  // Fix 5: Move state updates from render to useEffect
  fixedContent = moveStateUpdatesToEffect(fixedContent);
  
  // Fix 6: Add proper error boundaries
  fixedContent = addErrorBoundaries(fixedContent);
  
  // Fix 7: Fix icon imports
  fixedContent = fixIconImports(fixedContent);
  
  // Fix 8: Add default exports
  fixedContent = ensureDefaultExport(fixedContent, file);
  
  return fixedContent;
}

/**
 * Add missing imports like useCallback, ErrorBoundary, etc.
 */
function addMissingImports(content) {
  let fixedContent = content;
  
  // Add useCallback import if not present but needed
  if ((content.includes('mapContextToForm') || content.includes('mapContextDataToForm')) && !content.includes('useCallback')) {
    if (content.includes('import React')) {
      if (content.match(/import React,\s*{([^}]+)}\s+from\s+['"]react['"]/)) {
        fixedContent = fixedContent.replace(
          /import React,\s*{([^}]+)}\s+from\s+['"]react['"]/,
          (match, imports) => {
            if (!imports.includes('useCallback')) {
              return match.replace('{', '{ useCallback, ');
            }
            return match;
          }
        );
      } else if (content.match(/import React\s+from\s+['"]react['"]/)) {
        fixedContent = fixedContent.replace(
          /import React\s+from\s+['"]react['"]/,
          'import React, { useCallback } from "react"'
        );
      }
    } else if (content.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]/)) {
      fixedContent = fixedContent.replace(
        /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
        (match, imports) => {
          if (!imports.includes('useCallback')) {
            return match.replace('{', '{ useCallback, ');
          }
          return match;
        }
      );
    }
  }
  
  // Add ErrorBoundary import if not present
  if (!content.includes('ErrorBoundary') && (content.includes('return') || content.includes('render'))) {
    fixedContent = `import { ErrorBoundary } from "@/components/ui/error-boundary";\n${fixedContent}`;
  }
  
  return fixedContent;
}

/**
 * Add null checks to context data access
 */
function addNullChecks(content) {
  let fixedContent = content;
  
  // Replace data.X with data?.X for safe access
  fixedContent = fixedContent.replace(
    /data\.([a-zA-Z0-9_]+)/g,
    'data?.$1'
  );
  
  return fixedContent;
}

/**
 * Wrap mapContextToForm in useCallback to prevent unnecessary re-renders
 */
function fixMapContextToFormFunction(content) {
  let fixedContent = content;
  
  // Skip if already using useCallback or if there's no mapping function
  if (content.includes('useCallback') || (!content.includes('mapContextToForm') && !content.includes('mapContextDataToForm'))) {
    return fixedContent;
  }
  
  // Find the mapping function declaration pattern
  const mapperFunctionMatch = content.match(/const\s+(mapContextToForm|mapContextDataToForm)\s*=\s*(\([^)]*\)\s*=>|\(\)\s*=>\s*{)/);
  if (mapperFunctionMatch) {
    const functionName = mapperFunctionMatch[1];
    const functionStart = content.indexOf(mapperFunctionMatch[0]);
    const functionBody = findFunctionBody(content, functionStart);
    
    if (functionBody) {
      // Extract the function body text
      const extractedFunction = content.substring(functionStart, functionStart + functionBody.length);
      
      // Determine dependencies
      let dependencies = ['contextData'];
      if (content.includes('setDataLoaded')) {
        dependencies.push('setDataLoaded');
      }
      
      // Replace with useCallback version
      fixedContent = fixedContent.replace(
        extractedFunction,
        `const ${functionName} = useCallback(${extractedFunction.substring(extractedFunction.indexOf('=') + 1)}, [${dependencies.join(', ')}])`
      );
    }
  }
  
  return fixedContent;
}

/**
 * Find the complete function body text
 */
function findFunctionBody(content, startPos) {
  let braceCount = 0;
  let foundStartBrace = false;
  let endPos = startPos;
  
  for (let i = startPos; i < content.length; i++) {
    const char = content[i];
    
    if (char === '{') {
      foundStartBrace = true;
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    
    if (foundStartBrace && braceCount === 0) {
      endPos = i + 1;
      break;
    }
  }
  
  if (endPos > startPos) {
    return content.substring(startPos, endPos);
  }
  
  // Handle arrow functions without braces
  if (!foundStartBrace) {
    const arrowPos = content.indexOf('=>', startPos);
    if (arrowPos > -1) {
      const semicolonPos = content.indexOf(';', arrowPos);
      if (semicolonPos > -1) {
        return content.substring(startPos, semicolonPos + 1);
      }
    }
  }
  
  return null;
}

/**
 * Fix form initialization with static default values
 */
function fixFormInitialization(content) {
  let fixedContent = content;
  
  // Find form initialization with dynamic values
  const formHookMatch = fixedContent.match(/const\s+(\w+)\s*=\s*useForm(\s*)<([^>]+)>(\s*)\(/);
  if (formHookMatch) {
    const formVarName = formHookMatch[1];
    const defaultValuesMatch = fixedContent.match(/defaultValues\s*:\s*([^,}\s]+)/);
    
    // If defaultValues is a function call or expression, replace with static values
    if (defaultValuesMatch && 
        !defaultValuesMatch[1].startsWith('{') && 
        !defaultValuesMatch[1].startsWith('defaultFormValues') && 
        !defaultValuesMatch[1].startsWith('defaultFormState')) {
      
      // Define a static defaultValues variable
      const defaultVarName = 'defaultFormValues';
      
      // Check if defaultValues are already defined
      if (!fixedContent.includes(`const ${defaultVarName} =`)) {
        // Extract the schema type for TypeScript typing
        const schemaTypeMatch = formHookMatch[3];
        let schemaType = schemaTypeMatch || 'any';
        
        // Add static defaultValues before the form hook
        const defaultValuesDeclaration = `\n// Static default values to prevent re-creation on render\nconst ${defaultVarName}: ${schemaType} = ${defaultValuesMatch[1] === 'mapContextDataToForm()' ? '{}' : defaultValuesMatch[1]};\n`;
        
        const formHookPos = fixedContent.indexOf(`const ${formVarName}`);
        if (formHookPos > -1) {
          fixedContent = 
            fixedContent.substring(0, formHookPos) + 
            defaultValuesDeclaration +
            fixedContent.substring(formHookPos);
        }
      }
      
      // Replace the dynamic defaultValues with the static variable
      fixedContent = fixedContent.replace(
        /(defaultValues\s*:\s*)([^,}\s]+)/,
        `$1${defaultVarName}`
      );
      
      // Ensure form.reset is called in useEffect if needed
      if (!fixedContent.includes(`${formVarName}.reset(`)) {
        const importMatch = fixedContent.match(/import.*useEffect.*from\s+['"]react['"]/);
        
        // Add useEffect import if missing
        if (!importMatch && !fixedContent.includes('useEffect')) {
          if (fixedContent.includes('import React')) {
            fixedContent = fixedContent.replace(
              /import React(,\s*{[^}]*})?\s+from\s+['"]react['"]/,
              (match) => {
                if (match.includes('{')) {
                  return match.replace('{', '{ useEffect, ');
                } else {
                  return 'import React, { useEffect } from "react"';
                }
              }
            );
          } else if (fixedContent.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]/)) {
            fixedContent = fixedContent.replace(
              /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
              (match, imports) => {
                if (!imports.includes('useEffect')) {
                  return match.replace('{', '{ useEffect, ');
                }
                return match;
              }
            );
          } else {
            fixedContent = `import { useEffect } from 'react';\n${fixedContent}`;
          }
        }
        
        // Find data source variable (contextData or assessmentData)
        const dataSourceVar = fixedContent.includes('contextData') ? 'contextData' : 
                             (fixedContent.includes('assessmentData') ? 'assessmentData' : 'data');
        
        // Find the right position to add the useEffect
        const returnPos = fixedContent.indexOf('return');
        if (returnPos > -1) {
          const useEffectCode = `\n  // Reset form when data changes - added by fix script\n  useEffect(() => {\n    if (${dataSourceVar} && Object.keys(${dataSourceVar}).length > 0) {\n      const mappedData = typeof mapContextToForm === 'function' ? mapContextToForm() : \n                       (typeof mapContextDataToForm === 'function' ? mapContextDataToForm() : {});\n      ${formVarName}.reset(mappedData);\n    }\n  }, [${dataSourceVar}, ${formVarName}` + 
                           (fixedContent.includes('mapContextToForm') ? ', mapContextToForm' : 
                            fixedContent.includes('mapContextDataToForm') ? ', mapContextDataToForm' : '') + 
                           `]);\n`;
          
          fixedContent = 
            fixedContent.substring(0, returnPos) + 
            useEffectCode +
            fixedContent.substring(returnPos);
        }
      }
    }
  }
  
  return fixedContent;
}

/**
 * Move state updates from render function to useEffect
 */
function moveStateUpdatesToEffect(content) {
  let fixedContent = content;
  
  // Find setDataLoaded or setState calls outside of useEffect or handlers
  const stateUpdateRegex = /^\s*(setDataLoaded|set\w+)\(.*?\);?\s*$/gm;
  const matches = Array.from(fixedContent.matchAll(stateUpdateRegex));
  
  // Move state updates to useEffect if found outside
  if (matches.length > 0) {
    // Add state updates to appropriate useEffect
    for (const match of matches) {
      const stateSetter = match[0].trim();
      
      // Skip if already inside useEffect
      const effectRegex = new RegExp(`useEffect\\([\\s\\S]*?${stateSetter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
      if (!fixedContent.match(effectRegex)) {
        // Find data-related useEffect to add to
        const dataEffectMatch = fixedContent.match(/useEffect\(\(\)\s*=>\s*{\s*(?:\/\/[^\n]*\s*)*if\s*\(\s*(?:contextData|data|assessmentData).*?\)\s*{[^}]*}/s);
        
        if (dataEffectMatch) {
          const effectEndPos = fixedContent.indexOf('}', fixedContent.indexOf(dataEffectMatch[0]) + dataEffectMatch[0].length);
          if (effectEndPos > -1) {
            // Add the state update to the existing useEffect
            fixedContent = 
              fixedContent.substring(0, effectEndPos) + 
              `\n    // Moved from render to useEffect - added by fix script\n    ${stateSetter}\n  ` +
              fixedContent.substring(effectEndPos);
            
            // Remove the state update from its original location
            fixedContent = fixedContent.replace(new RegExp(stateSetter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\n?', 'g'), '');
          }
        } else {
          // Create a new useEffect if no suitable one exists
          const dataSource = content.includes('contextData') ? 'contextData' : 
                            (content.includes('assessmentData') ? 'assessmentData' : 'data');
          
          const newEffect = `\n  // State updates moved from render - added by fix script\n  useEffect(() => {\n    if (${dataSource} && Object.keys(${dataSource}).length > 0) {\n      ${stateSetter}\n    }\n  }, [${dataSource}]);\n\n`;
          
          const returnPos = fixedContent.indexOf('return');
          if (returnPos > -1) {
            fixedContent = 
              fixedContent.substring(0, returnPos) + 
              newEffect +
              fixedContent.substring(returnPos);
            
            // Remove the state update from its original location
            fixedContent = fixedContent.replace(new RegExp(stateSetter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\n?', 'g'), '');
          }
        }
      }
    }
  }
  
  return fixedContent;
}

/**
 * Add proper error boundaries around component rendering
 */
function addErrorBoundaries(content) {
  let fixedContent = content;
  
  // Skip if already has proper error boundaries
  if (fixedContent.includes('<ErrorBoundary>') && fixedContent.includes('</ErrorBoundary>')) {
    return fixedContent;
  }
  
  // Look for return statement with component JSX
  const returnMatch = fixedContent.match(/return\s*\(\s*(<[\w\s]+[^>]*>)/);
  if (returnMatch) {
    const openingTag = returnMatch[1];
    
    // Add ErrorBoundary around the top-level element
    fixedContent = fixedContent.replace(
      new RegExp(`return\\s*\\(\\s*${openingTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
      `return (\n    <ErrorBoundary>\n      ${openingTag}`
    );
    
    // Find the closing brace of the return statement and add the closing ErrorBoundary
    const lastClosingElement = fixedContent.lastIndexOf('</');
    if (lastClosingElement > -1) {
      const lastClosingBrace = fixedContent.indexOf(')', lastClosingElement);
      if (lastClosingBrace > -1) {
        fixedContent = 
          fixedContent.substring(0, lastClosingBrace) + 
          '\n    </ErrorBoundary>' +
          fixedContent.substring(lastClosingBrace);
      }
    }
  }
  
  // Add error boundaries around TabsContent as well
  const tabsContentRegex = /<TabsContent[^>]*>\s*<([a-zA-Z][a-zA-Z0-9]*)(?:\s+[^>]*)?>/g;
  let tabMatch;
  while ((tabMatch = tabsContentRegex.exec(fixedContent)) !== null) {
    // Skip if already wrapped
    const beforeMatch = fixedContent.substring(tabMatch.index - 20, tabMatch.index);
    if (beforeMatch.includes('<ErrorBoundary>')) continue;
    
    const componentTag = tabMatch[1];
    
    // Add ErrorBoundary around the component
    fixedContent = fixedContent.replace(
      `<TabsContent${tabMatch[0].substring(12)}`,
      `<TabsContent${tabMatch[0].substring(12, tabMatch[0].indexOf('>') + 1)}\n        <ErrorBoundary>`
    );
    
    // Find and wrap the closing tag
    const closeTagPos = fixedContent.indexOf(`</${componentTag}>`, tabMatch.index + tabMatch[0].length);
    if (closeTagPos > -1) {
      fixedContent = 
        fixedContent.substring(0, closeTagPos + componentTag.length + 3) + 
        '\n        </ErrorBoundary>' +
        fixedContent.substring(closeTagPos + componentTag.length + 3);
    }
  }
  
  return fixedContent;
}

/**
 * Fix icon imports from lucide-react
 */
function fixIconImports(content) {
  let fixedContent = content;
  
  // Replace History2 with History
  if (fixedContent.includes('History2')) {
    fixedContent = fixedContent.replace(/History2/g, 'History');
  }
  
  // Replace ClipboardClock (doesn't exist) with ClipboardCheck
  if (fixedContent.includes('ClipboardClock')) {
    // First check if ClipboardCheck is already imported
    if (!fixedContent.includes('ClipboardCheck')) {
      fixedContent = fixedContent.replace(/ClipboardClock/g, 'ClipboardCheck');
    } else {
      // If already imported, replace with a different name
      fixedContent = fixedContent.replace(/ClipboardClock/g, 'Clipboard');
      
      // Make sure Clipboard is imported
      const iconImportMatch = fixedContent.match(/import\s*{([^}]*)}\s*from\s*['"]lucide-react['"]/);
      if (iconImportMatch && !iconImportMatch[1].includes('Clipboard')) {
        fixedContent = fixedContent.replace(
          /import\s*{([^}]*)}\s*from\s*['"]lucide-react['"]/,
          (match, icons) => {
            return match.replace(icons, `${icons}, Clipboard`);
          }
        );
      }
    }
  }
  
  return fixedContent;
}

/**
 * Ensure the component has a default export
 */
function ensureDefaultExport(content, fileName) {
  let fixedContent = content;
  
  // Check if there's a named export but no default export
  const componentNameMatch = fileName.match(/([A-Za-z0-9]+)\.integrated/);
  if (componentNameMatch) {
    const componentBaseName = componentNameMatch[1];
    
    // If there's a named export but no default export, add it
    if (fixedContent.includes(`export function ${componentBaseName}`) || 
        fixedContent.includes(`export const ${componentBaseName}`)) {
      
      if (!fixedContent.includes(`export default ${componentBaseName}`)) {
        // Add default export at the end
        fixedContent += `\n\n// Add default export\nexport default ${componentBaseName}Integrated;`;
      }
    }
  }
  
  return fixedContent;
}

/**
 * Create a summary report
 */
async function createSummaryReport() {
  try {
    const summary = `# Form Rendering Issues Fixed Summary

## Components Fixed
${fixes.components.map(comp => `- ${comp}`).join('\n')}

## Fixes Applied
1. Wrapped mapContextToForm in useCallback to prevent unnecessary re-renders
2. Fixed form initialization to use static default values
3. Moved state updates from render function to useEffect
4. Added proper error boundaries around components
5. Fixed icon imports that didn't exist in lucide-react
6. Added null checks to contextData access
7. Fixed missing exports and added default exports
8. Fixed component tree rendering with proper ErrorBoundary components

## Next Steps
1. Verify all form components display correctly
2. Test data loading from pattern recognition
3. Verify form submissions update the context
4. Check for any remaining console errors

## Testing
After applying these fixes, please:
1. Start the development server: \`npm run dev\`
2. Navigate to each form section in the browser
3. Verify the forms display correctly
4. Check browser console for any errors
5. Test form data population and submission
`;

    const summaryPath = path.join('d:', 'delilah_V3.0', 'FORM_RENDERING_FIXES_SUMMARY.md');
    await writeFile(summaryPath, summary);
    console.log(`Summary saved to ${summaryPath}`);
  } catch (error) {
    console.error(`Error creating summary: ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Fixing form rendering issues across components...');
  await processSectionComponents();
  await createSummaryReport();
  console.log('Form rendering fixes complete!');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
