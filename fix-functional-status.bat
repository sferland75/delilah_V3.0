@echo off
echo Fixing Functional Status Component Issues...

rem Run the fix script for FunctionalStatus.redux.tsx
node temp-fixes\fix-functional-component.js

rem Copy the enhanced RangeOfMotion component
copy /Y temp-fixes\enhanced-rangeofmotion.tsx src\sections\5-FunctionalStatus\components\RangeOfMotion.tsx

echo Fix applied successfully!
echo Please restart your development server to see the changes.
pause
