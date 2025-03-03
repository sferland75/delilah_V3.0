@echo off
echo Installing missing UI components and dependencies...

echo.
echo Step 1: Installing shadcn/ui components...
echo.
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator

echo.
echo Step 2: Installing file generation dependencies...
echo.
npm install file-saver jspdf jspdf-autotable docx --save

echo.
echo All missing dependencies have been installed.
echo You can now run the application with 'npm run dev'
echo.

pause