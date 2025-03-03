@echo off
echo ========================================================
echo Delilah V3.0 - Diagnostics Tool
echo ========================================================
echo.

echo 1. Checking Next.js and package versions...
echo.
call npm list next react react-dom

echo.
echo 2. Checking for remaining catch-all routes...
echo.
dir /s /b "d:\delilah_V3.0\src\app\*[[*]*\page.tsx"

echo.
echo 3. Checking for file conflicts between app and pages directories...
echo.
echo Checking app routes:
dir /b /AD "d:\delilah_V3.0\src\app"

echo.
echo Checking pages routes:
dir /b "d:\delilah_V3.0\src\pages\*.tsx"
dir /b /AD "d:\delilah_V3.0\src\pages"

echo.
echo 4. Checking Next.js configuration...
echo.
type "d:\delilah_V3.0\next.config.js"

echo.
echo 5. Checking Babel configuration...
echo.
type "d:\delilah_V3.0\babel.config.js"
type "d:\delilah_V3.0\.babelrc"

echo.
echo ========================================================
echo Diagnostics completed!
echo ========================================================
echo.
echo If the application still won't start, consider:
echo 1. Temporarily renaming the app directory to disable App Router
echo 2. Running with '--no-lint' flag: npm run dev -- --no-lint
echo 3. Checking for syntax errors in page components
echo.
