@echo off
echo Running application with fixed components...

echo.
echo Applying component rendering fixes...
call apply-component-rendering-fixes.bat

echo.
echo Clearing Next.js cache...
rmdir /s /q .next

echo.
echo Starting development server...
npm run dev