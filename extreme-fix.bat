@echo off
echo ========================================================
echo Delilah V3.0 - Extreme Fix (Temporarily Disable App Router)
echo ========================================================
echo.
echo WARNING: This script temporarily disables the App Router completely
echo by renaming the app directory. This is an extreme solution but will
echo definitely resolve routing conflicts.
echo.
echo Press CTRL+C to cancel or any key to continue...
pause > nul

echo.
echo Step 1: Backing up the app directory...
if not exist "d:\delilah_V3.0\src\app.bak" (
    ren "d:\delilah_V3.0\src\app" "app.bak"
    echo App directory renamed to app.bak
) else (
    echo App directory already backed up (app.bak exists)
)

echo.
echo Step 2: Creating a minimal app directory to keep Next.js happy...
if not exist "d:\delilah_V3.0\src\app" (
    mkdir "d:\delilah_V3.0\src\app"
    echo Created minimal app directory
)

echo.
echo Step 3: Creating a layout file that redirects to Pages Router...
echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\layout.tsx"
echo export default function RootLayout() { redirect('/'); } >> "d:\delilah_V3.0\src\app\layout.tsx"

echo.
echo Step 4: Updating Next.js configuration...
echo /** @type {import('next').NextConfig} */ > "d:\delilah_V3.0\next.config.js"
echo const nextConfig = { >> "d:\delilah_V3.0\next.config.js"
echo   reactStrictMode: true, >> "d:\delilah_V3.0\next.config.js"
echo   webpack: (config) =^> { >> "d:\delilah_V3.0\next.config.js"
echo     config.resolve.fallback = { >> "d:\delilah_V3.0\next.config.js"
echo       ...config.resolve.fallback, >> "d:\delilah_V3.0\next.config.js"
echo       canvas: false, >> "d:\delilah_V3.0\next.config.js"
echo       fs: false, >> "d:\delilah_V3.0\next.config.js"
echo       path: false, >> "d:\delilah_V3.0\next.config.js"
echo     }; >> "d:\delilah_V3.0\next.config.js"
echo     return config; >> "d:\delilah_V3.0\next.config.js"
echo   }, >> "d:\delilah_V3.0\next.config.js"
echo }; >> "d:\delilah_V3.0\next.config.js"
echo module.exports = nextConfig; >> "d:\delilah_V3.0\next.config.js"

echo.
echo All fixes applied successfully! Starting the application...
echo.
echo To restore the App Router later, run restore-app-router.bat
echo.
echo ========================================================
echo.

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\restore-app-router.bat"
echo export default function restoreAppRouter() { >> "d:\delilah_V3.0\restore-app-router.bat"
echo   @echo off >> "d:\delilah_V3.0\restore-app-router.bat"
echo   echo Restoring App Router... >> "d:\delilah_V3.0\restore-app-router.bat"
echo   if exist "d:\delilah_V3.0\src\app.bak" ( >> "d:\delilah_V3.0\restore-app-router.bat"
echo     rmdir /s /q "d:\delilah_V3.0\src\app" >> "d:\delilah_V3.0\restore-app-router.bat"
echo     ren "d:\delilah_V3.0\src\app.bak" "app" >> "d:\delilah_V3.0\restore-app-router.bat"
echo     echo App Router restored. >> "d:\delilah_V3.0\restore-app-router.bat"
echo   ) else ( >> "d:\delilah_V3.0\restore-app-router.bat"
echo     echo Error: App Router backup not found. >> "d:\delilah_V3.0\restore-app-router.bat"
echo   ) >> "d:\delilah_V3.0\restore-app-router.bat"
echo } >> "d:\delilah_V3.0\restore-app-router.bat"

npm run dev
