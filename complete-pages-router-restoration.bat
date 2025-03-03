@echo off
echo Starting Pages Router Restoration...

REM Ensure App Router directory remains disabled
echo Ensuring App Router is disabled...
IF EXIST "src\app" (
  echo Moving src\app to src\app_disabled_final_backup
  ren "src\app" "app_disabled_final_backup"
)

REM Remove any potential middleware that might interfere with Pages Router
echo Checking for middleware...
IF EXIST "src\middleware.ts" (
  echo Backing up and removing middleware
  copy "src\middleware.ts" "src\middleware.ts.bak"
  del "src\middleware.ts"
)
IF EXIST "src\middleware.js" (
  echo Backing up and removing middleware
  copy "src\middleware.js" "src\middleware.js.bak"
  del "src\middleware.js"
)

REM Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q ".next" 2>nul

REM Tell the user what happened
echo.
echo Pages Router Restoration Complete!
echo.
echo The following actions were taken:
echo 1. Ensured App Router directory is disabled
echo 2. Removed any middleware that might interfere with Pages Router
echo 3. Cleared Next.js cache
echo.
echo Next steps:
echo 1. Run "npm run dev" to start the application
echo 2. Test key routes to ensure navigation is working properly
echo.
pause