@echo off
echo --------------------------------------------------
echo Fixing dependencies and starting the application with mock services
echo --------------------------------------------------
echo.

echo Step 1: Installing Radix UI dependencies for UI components...
call npm install @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-separator --save

echo.
echo Step 2: Using mock export service to avoid docx compatibility issues...
echo Mock export service is in place.

echo.
echo Step 3: Starting the development server...
call npm run dev