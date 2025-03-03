@echo off
echo Full Restoration Script for Delilah V3.0
echo =======================================

echo Step 1: Restoring original index file...
del /q D:\delilah_V3.0\src\pages\index.js
del /q D:\delilah_V3.0\src\pages\index.simple.js
ren D:\delilah_V3.0\src\pages\index.tsx.original index.tsx
echo Original index.tsx restored.

echo Step 2: Restoring original _app.js file...
del /q D:\delilah_V3.0\src\pages\_app.js
copy /y D:\delilah_V3.0\src\pages\_app.js.backup D:\delilah_V3.0\src\pages\_app.js 2>NUL
IF ERRORLEVEL 1 (
  echo Creating _app.js from scratch...
  echo import { useEffect } from 'react';> D:\delilah_V3.0\src\pages\_app.js
  echo import configureStandardFonts from '../utils/pdf-import/configurePdfJs';>> D:\delilah_V3.0\src\pages\_app.js
  echo import { AssessmentProvider } from '../contexts/AssessmentContext';>> D:\delilah_V3.0\src\pages\_app.js
  echo import Navbar from '../components/navbar';>> D:\delilah_V3.0\src\pages\_app.js
  echo import '../styles/globals.css'; // Import global styles>> D:\delilah_V3.0\src\pages\_app.js
  echo.>> D:\delilah_V3.0\src\pages\_app.js
  echo function MyApp({ Component, pageProps }) {>> D:\delilah_V3.0\src\pages\_app.js
  echo   useEffect(() =^> {>> D:\delilah_V3.0\src\pages\_app.js
  echo     // Configure PDF.js standard fonts>> D:\delilah_V3.0\src\pages\_app.js
  echo     configureStandardFonts();>> D:\delilah_V3.0\src\pages\_app.js
  echo   }, []);>> D:\delilah_V3.0\src\pages\_app.js
  echo.>> D:\delilah_V3.0\src\pages\_app.js
  echo   return (>> D:\delilah_V3.0\src\pages\_app.js
  echo     ^<AssessmentProvider^>>> D:\delilah_V3.0\src\pages\_app.js
  echo       ^<Navbar /^>>> D:\delilah_V3.0\src\pages\_app.js
  echo       ^<main className="container mx-auto px-4 py-6"^>>> D:\delilah_V3.0\src\pages\_app.js
  echo         ^<Component {...pageProps} /^>>> D:\delilah_V3.0\src\pages\_app.js
  echo       ^</main^>>> D:\delilah_V3.0\src\pages\_app.js
  echo     ^</AssessmentProvider^>>> D:\delilah_V3.0\src\pages\_app.js
  echo   );>> D:\delilah_V3.0\src\pages\_app.js
  echo }>> D:\delilah_V3.0\src\pages\_app.js
  echo.>> D:\delilah_V3.0\src\pages\_app.js
  echo export default MyApp;>> D:\delilah_V3.0\src\pages\_app.js
)
echo _app.js restored.

echo Step 3: Restoring app directory...
ren D:\delilah_V3.0\src\app_disabled app 2>NUL
IF ERRORLEVEL 1 (
  echo Renaming app_backup if available...
  ren D:\delilah_V3.0\src\app_backup app 2>NUL
  IF ERRORLEVEL 1 (
    echo No app directory backup found - creating minimal app structure...
    mkdir D:\delilah_V3.0\src\app
    echo // This file is intentionally empty > D:\delilah_V3.0\src\app\page.js
  )
)
echo App directory restored.

echo Step 4: Removing debug and temporary files...
del /q D:\delilah_V3.0\src\pages\debug.js
del /q D:\delilah_V3.0\src\pages\minimal.js
del /q D:\delilah_V3.0\src\pages\basic.js
del /q D:\delilah_V3.0\src\pages\test-page.js
del /q D:\delilah_V3.0\src\pages\_middleware.js
echo Temporary files removed.

echo Step 5: Restoring original .babelrc file...
copy /y D:\delilah_V3.0\.babelrc.backup D:\delilah_V3.0\.babelrc 2>NUL
IF ERRORLEVEL 1 (
  echo No .babelrc backup found - using original configuration...
  echo {> D:\delilah_V3.0\.babelrc
  echo   "presets": [>> D:\delilah_V3.0\.babelrc
  echo     "@babel/preset-env",>> D:\delilah_V3.0\.babelrc
  echo     ["@babel/preset-react", {"runtime": "automatic"}],>> D:\delilah_V3.0\.babelrc
  echo     "@babel/preset-typescript">> D:\delilah_V3.0\.babelrc
  echo   ]>> D:\delilah_V3.0\.babelrc
  echo }>> D:\delilah_V3.0\.babelrc
)
echo .babelrc restored.

echo Step 6: Restoring next.config.js...
echo /** @type {import('next').NextConfig} */> D:\delilah_V3.0\next.config.js
echo const nextConfig = {>> D:\delilah_V3.0\next.config.js
echo   reactStrictMode: true,>> D:\delilah_V3.0\next.config.js
echo   >> D:\delilah_V3.0\next.config.js
echo   // Configure webpack for PDF.js>> D:\delilah_V3.0\next.config.js
echo   webpack: (config) =^> {>> D:\delilah_V3.0\next.config.js
echo     // This addresses the "Can't resolve 'canvas'" error when using pdf.js in Next.js>> D:\delilah_V3.0\next.config.js
echo     config.resolve.fallback = {>> D:\delilah_V3.0\next.config.js
echo       ...config.resolve.fallback,>> D:\delilah_V3.0\next.config.js
echo       canvas: false,>> D:\delilah_V3.0\next.config.js
echo       fs: false,>> D:\delilah_V3.0\next.config.js
echo       path: false,>> D:\delilah_V3.0\next.config.js
echo     };>> D:\delilah_V3.0\next.config.js
echo     return config;>> D:\delilah_V3.0\next.config.js
echo   },>> D:\delilah_V3.0\next.config.js
echo };>> D:\delilah_V3.0\next.config.js
echo >> D:\delilah_V3.0\next.config.js
echo module.exports = nextConfig;>> D:\delilah_V3.0\next.config.js
echo next.config.js restored.

echo Step 7: Restoring PDF.js configuration...
echo // PDF.js Standard Font Data Configuration> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo // Auto-generated on 2025-03-01 21:38:17.98>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo >> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo /**>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo  * Configure PDF.js to handle standard fonts correctly>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo  * To be used in the _app.js or similar startup file>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo  */>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo export default function configureStandardFonts() {>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo   if (typeof window !== 'undefined') {>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo     // Standard fonts path for our application>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo     window.STANDARD_FONTS_PATH = '/standard_fonts/';>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo >> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo     // Copy standard fonts to public folder at build time>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo     // This is done by the build script>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo     // node_modules/pdfjs-dist/standard_fonts/ -^> public/standard_fonts/>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo   }>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo }>> D:\delilah_V3.0\src\utils\pdf-import\configurePdfJs.js
echo PDF.js configuration restored.

echo Step 8: Cleaning build artifacts...
rd /s /q D:\delilah_V3.0\.next 2>NUL
echo Build artifacts cleaned.

echo Step 9: Installing Node.js dependencies...
cd D:\delilah_V3.0
call npm install
echo Dependencies installed.

echo Restoration complete! You can now run 'npm run dev' to start the application.
pause