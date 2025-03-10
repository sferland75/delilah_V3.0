@echo off
echo Applying self-contained component fix...

echo.
echo Clearing Next.js cache...
rmdir /s /q .next

echo.
echo Starting the application with self-contained components...
npm run dev