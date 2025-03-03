@echo off
echo ========================================================
echo Delilah V3.0 - Comprehensive Fix and Run Script
echo ========================================================
echo.

echo Step 1: Disabling ALL catch-all routes in the App Router...
call disable-all-catch-all-routes.bat

echo Step 2: Creating simple redirects for App Router paths...
echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\assessment\page.tsx"
echo export default function RedirectToPages() { redirect('/assessment'); } >> "d:\delilah_V3.0\src\app\assessment\page.tsx"

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\import\page.tsx"
echo export default function RedirectToPages() { redirect('/import-pdf'); } >> "d:\delilah_V3.0\src\app\import\page.tsx"

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\report-drafting\page.tsx"
echo export default function RedirectToPages() { redirect('/report-drafting'); } >> "d:\delilah_V3.0\src\app\report-drafting\page.tsx"

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\assessment-sections\page.tsx"
echo export default function RedirectToPages() { redirect('/assessment-sections'); } >> "d:\delilah_V3.0\src\app\assessment-sections\page.tsx"

echo Step 3: Updating Next.js configuration to remove outdated options...
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
echo ========================================================
echo.

npm run dev
