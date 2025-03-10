@echo off
echo Applying inline component rendering fix...

echo.
echo Cleaning Next.js cache...
rmdir /s /q .next

echo.
echo Starting the application with fixed components...
npm run dev