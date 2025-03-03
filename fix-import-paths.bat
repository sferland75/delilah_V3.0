@echo off
echo Fixing import paths for moved pages...

REM Update the CSS import path in _app.js
echo Updating CSS import in _app.js...
powershell -Command "(Get-Content pages\_app.js) -replace '../styles/globals.css', '../src/styles/globals.css' | Set-Content pages\_app.js"

REM Rename duplicate files
echo Removing duplicate files...
if exist "pages\enhanced-import.js" (
  if exist "pages\enhanced-import.tsx" (
    ren "pages\enhanced-import.js" "enhanced-import.js.bak"
  )
)

REM Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q ".next" 2>nul

echo.
echo Import paths have been fixed.
echo Now try running "npm run dev" again.
echo.