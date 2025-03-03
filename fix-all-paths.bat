@echo off
echo ===================================
echo Delilah V3.0 Comprehensive Fix
echo ===================================
echo.

REM Update Next.js config with proper path alias
echo Updating Next.js configuration...
echo const path = require('path'); > temp.js
echo. >> temp.js
echo /** @type {import('next').NextConfig} */ >> temp.js
echo const nextConfig = { >> temp.js
echo   reactStrictMode: false, >> temp.js
echo. >> temp.js
echo   // Configure webpack for PDF.js and path aliases >> temp.js
echo   webpack: (config) =^> { >> temp.js
echo     // This addresses the "Can't resolve 'canvas'" error when using pdf.js in Next.js >> temp.js
echo     config.resolve.fallback = { >> temp.js
echo       ...config.resolve.fallback, >> temp.js
echo       canvas: false, >> temp.js
echo       fs: false, >> temp.js
echo       path: false, >> temp.js
echo     }; >> temp.js
echo. >> temp.js
echo     // Add path aliases >> temp.js
echo     config.resolve.alias = { >> temp.js
echo       ...config.resolve.alias, >> temp.js
echo       '@': path.resolve(__dirname, './src'), >> temp.js
echo     }; >> temp.js
echo. >> temp.js
echo     return config; >> temp.js
echo   } >> temp.js
echo }; >> temp.js
echo. >> temp.js
echo module.exports = nextConfig; >> temp.js

copy /y temp.js next.config.js
del temp.js

REM Create jsconfig.json with proper path aliases
echo Creating jsconfig.json...
echo { > jsconfig.json
echo   "compilerOptions": { >> jsconfig.json
echo     "baseUrl": ".", >> jsconfig.json
echo     "paths": { >> jsconfig.json
echo       "@/*": ["src/*"] >> jsconfig.json
echo     } >> jsconfig.json
echo   } >> jsconfig.json
echo } >> jsconfig.json

REM Create emergency fallback navigation
echo Creating reliable emergency navigation...
mkdir "public\fallback" 2>nul

echo ^<!DOCTYPE html^> > public\fallback\index.html
echo ^<html lang="en"^> >> public\fallback\index.html
echo ^<head^> >> public\fallback\index.html
echo     ^<meta charset="UTF-8"^> >> public\fallback\index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> public\fallback\index.html
echo     ^<title^>Delilah V3.0 - Safe Navigation^</title^> >> public\fallback\index.html
echo     ^<style^> >> public\fallback\index.html
echo         body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; } >> public\fallback\index.html
echo         h1 { color: #2563eb; } >> public\fallback\index.html
echo         .links { display: flex; flex-wrap: wrap; gap: 1rem; margin: 2rem 0; } >> public\fallback\index.html
echo         .link { padding: 1rem; background: #f1f5f9; border-radius: 0.5rem; text-decoration: none; color: #0f172a; width: 200px; } >> public\fallback\index.html
echo         .link:hover { background: #e2e8f0; } >> public\fallback\index.html
echo         .section { margin-bottom: 2rem; } >> public\fallback\index.html
echo     ^</style^> >> public\fallback\index.html
echo ^</head^> >> public\fallback\index.html
echo ^<body^> >> public\fallback\index.html
echo     ^<h1^>Delilah V3.0 Navigation^</h1^> >> public\fallback\index.html
echo     ^<p^>This is an ultra-reliable navigation page that doesn't depend on Next.js routing.^</p^> >> public\fallback\index.html
echo. >> public\fallback\index.html
echo     ^<div class="section"^> >> public\fallback\index.html
echo         ^<h2^>Main Navigation^</h2^> >> public\fallback\index.html
echo         ^<div class="links"^> >> public\fallback\index.html
echo             ^<a href="/simple-nav" class="link"^>Simple Nav Page^</a^> >> public\fallback\index.html
echo             ^<a href="/assessment" class="link"^>Assessment^</a^> >> public\fallback\index.html
echo             ^<a href="/import-pdf" class="link"^>Import PDF^</a^> >> public\fallback\index.html
echo             ^<a href="/report-drafting" class="link"^>Reports^</a^> >> public\fallback\index.html
echo             ^<a href="/full-assessment" class="link"^>Full Assessment^</a^> >> public\fallback\index.html
echo         ^</div^> >> public\fallback\index.html
echo     ^</div^> >> public\fallback\index.html
echo. >> public\fallback\index.html
echo     ^<div class="section"^> >> public\fallback\index.html
echo         ^<h2^>Assessment Sections^</h2^> >> public\fallback\index.html
echo         ^<div class="links"^> >> public\fallback\index.html
echo             ^<a href="/assessment-sections" class="link"^>All Sections^</a^> >> public\fallback\index.html
echo             ^<a href="/medical-full" class="link"^>Medical History^</a^> >> public\fallback\index.html
echo             ^<a href="/emergency-symptoms" class="link"^>Symptoms^</a^> >> public\fallback\index.html
echo             ^<a href="/typical-day" class="link"^>Typical Day^</a^> >> public\fallback\index.html
echo         ^</div^> >> public\fallback\index.html
echo     ^</div^> >> public\fallback\index.html
echo. >> public\fallback\index.html
echo     ^<p^>^<strong^>Tip:^</strong^> You can access this page directly at http://localhost:3000/fallback/ even if routing is broken.^</p^> >> public\fallback\index.html
echo ^</body^> >> public\fallback\index.html
echo ^</html^> >> public\fallback\index.html

echo Copying emergency navigation to root.html as well...
copy /y "public\fallback\index.html" "public\root.html" >nul

REM Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q ".next" 2>nul

echo.
echo ===================================
echo All fixes applied!
echo ===================================
echo.
echo Next steps:
echo 1. Run "npm run dev" to start the application
echo 2. Try accessing http://localhost:3000/simple-nav for basic navigation
echo 3. If routing issues persist, use http://localhost:3000/fallback/ as a reliable backup
echo.
echo Press any key to start the development server...
pause >nul
echo.
echo Starting Next.js development server...
npm run dev