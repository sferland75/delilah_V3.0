@echo off
echo --------------------------------------------------
echo Applying Form Section Component Fixes
echo --------------------------------------------------
echo.

echo This script fixes form section components that are not displaying properly.
echo.

node fix-form-sections.js

echo.
echo Files have been updated. 
echo.
echo Next steps:
echo 1. Check the FORM_SECTION_FIXES_SUMMARY.md file for details on changes made
echo 2. Run 'npm run dev' to start the application
echo 3. Test each form section to verify it displays correctly
echo.

choice /C YN /M "Do you want to start the development server now?"
if errorlevel 2 goto end
if errorlevel 1 goto start

:start
call npm run dev
goto end

:end
