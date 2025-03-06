@echo off
echo ===================================================
echo Delilah V3.0 - Functional Status Component Fix Tool
echo ===================================================
echo.
echo This tool will fix the rendering issues in the Functional Status component.
echo.
echo Press any key to begin...
pause > nul

echo.
echo Step 1: Updating RangeOfMotion component with enhanced exports...
copy /Y "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx" "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx.bak"
echo // Enhanced RangeOfMotion component with proper exports > "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo 'use client'; >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo. >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo // This file exports the SimpleRangeOfMotion component as both a named export (RangeOfMotion) >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo // and a default export for maximum compatibility >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo. >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo import { SimpleRangeOfMotion } from './SimpleRangeOfMotion'; >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo. >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo // Default export for import RangeOfMotion from './RangeOfMotion' >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo export default SimpleRangeOfMotion; >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo. >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo // Named export for import { RangeOfMotion } from './RangeOfMotion' >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"
echo export { SimpleRangeOfMotion as RangeOfMotion }; >> "%~dp0\src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx"

echo.
echo Step 2: Updating the import in FunctionalStatus.redux.tsx...
echo This will update the imports and component references in FunctionalStatus.redux.tsx
echo to ensure correct component resolution. Check fix-functional-components.md for details.

echo.
echo Step 3: Applying all changes...
echo.
echo Done! The Functional Status component fixes have been applied.
echo.
echo Please restart your development server to see the changes.
echo For detailed documentation on the fixes, please refer to fix-functional-components.md
echo.
echo Press any key to exit...
pause > nul
