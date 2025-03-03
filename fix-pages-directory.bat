@echo off
echo ===================================
echo Fixing Pages Directory Structure
echo ===================================
echo.

REM Create backup of existing pages directory
echo Creating backup of root pages directory...
if exist "pages_backup" (
  echo pages_backup already exists, skipping backup
) else (
  if exist "pages" (
    echo Moving pages to pages_backup
    ren "pages" "pages_backup"
  )
)

REM Create pages directory if it doesn't exist
if not exist "pages" (
  echo Creating pages directory
  mkdir "pages"
)

REM Copy all files from src/pages to pages
echo Copying files from src/pages to pages...
xcopy "src\pages\*" "pages\" /E /I /Y
if %errorlevel% neq 0 (
  echo Error copying files. Check that src\pages exists.
  exit /b %errorlevel%
)

REM Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q ".next" 2>nul

echo.
echo Pages directory structure has been fixed.
echo The application should now use the pages in the root pages directory.
echo.
echo Run "npm run dev" to start the application and test the routes.
echo.