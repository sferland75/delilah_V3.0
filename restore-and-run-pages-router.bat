@echo off
echo ===================================
echo Delilah V3.0 Pages Router Restoration
echo ===================================
echo.

REM Run the Pages Router restoration script
echo Running Pages Router restoration script...
call complete-pages-router-restoration.bat

REM Clear Next.js cache more thoroughly
echo Performing thorough cache cleaning...
rmdir /s /q ".next" 2>nul
rmdir /s /q "node_modules\.cache" 2>nul

REM Install dependencies if needed
echo Checking dependencies...
if not exist "node_modules" (
  echo Node modules not found. Installing dependencies...
  call npm install
) else (
  echo Node modules found. Skipping installation.
)

REM Start the development server
echo.
echo ===================================
echo Starting development server...
echo ===================================
echo.
echo The application should now be using only the Pages Router.
echo Test the following routes to ensure they are working:
echo - Homepage: http://localhost:3000
echo - Assessment: http://localhost:3000/assessment
echo - Import PDF: http://localhost:3000/import-pdf
echo - Reports: http://localhost:3000/report-drafting
echo.
echo Press Ctrl+C to stop the server when done testing.
echo.
call npm run dev