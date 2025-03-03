@echo off
echo Comprehensive Delilah V3.0 Restoration Script
echo =============================================
echo.

echo Step 1: Restoring configuration files...
copy /y .babelrc.backup .babelrc
echo Restored .babelrc from backup.

echo Step 2: Cleaning cache and build artifacts...
rd /s /q node_modules\.cache
rd /s /q .next
echo Cleaned cache and build directories.

echo Step 3: Fixing Next.js installation...
npm uninstall next
npm install next@14.0.4 --save
echo Next.js reinstalled.

echo Step 4: Installing all dependencies...
call npm install
echo Dependencies installed.

echo Step 5: Running development server...
call npm run dev
