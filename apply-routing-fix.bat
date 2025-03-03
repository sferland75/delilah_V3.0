@echo off
echo Applying comprehensive routing fixes for Delilah V3.0...
echo.

echo 1. Disabling ALL conflicting catch-all routes in the App Router...
if exist "d:\delilah_V3.0\src\app\assessment\[[...path]]\page.tsx" (
    echo - Disabling /assessment catch-all route...
    ren "d:\delilah_V3.0\src\app\assessment\[[...path]]\page.tsx" "page.tsx.bak"
)

if exist "d:\delilah_V3.0\src\app\import\[[...path]]\page.tsx" (
    echo - Disabling /import catch-all route...
    ren "d:\delilah_V3.0\src\app\import\[[...path]]\page.tsx" "page.tsx.bak"
)

if exist "d:\delilah_V3.0\src\app\report-drafting\[[...path]]\page.tsx" (
    echo - Disabling /report-drafting catch-all route...
    ren "d:\delilah_V3.0\src\app\report-drafting\[[...path]]\page.tsx" "page.tsx.bak"
)

if exist "d:\delilah_V3.0\src\app\assessment-sections\[[...path]]\page.tsx" (
    echo - Disabling /assessment-sections catch-all route...
    ren "d:\delilah_V3.0\src\app\assessment-sections\[[...path]]\page.tsx" "page.tsx.bak"
)

echo 2. Creating simple redirects for App Router paths...
echo Creating simple redirects...

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\assessment\page.tsx"
echo export default function RedirectToPages() { >> "d:\delilah_V3.0\src\app\assessment\page.tsx"
echo   redirect('/assessment'); >> "d:\delilah_V3.0\src\app\assessment\page.tsx"
echo } >> "d:\delilah_V3.0\src\app\assessment\page.tsx"

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\import\page.tsx"
echo export default function RedirectToPages() { >> "d:\delilah_V3.0\src\app\import\page.tsx"
echo   redirect('/import-pdf'); >> "d:\delilah_V3.0\src\app\import\page.tsx"
echo } >> "d:\delilah_V3.0\src\app\import\page.tsx"

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\report-drafting\page.tsx"
echo export default function RedirectToPages() { >> "d:\delilah_V3.0\src\app\report-drafting\page.tsx"
echo   redirect('/report-drafting'); >> "d:\delilah_V3.0\src\app\report-drafting\page.tsx"
echo } >> "d:\delilah_V3.0\src\app\report-drafting\page.tsx"

echo import { redirect } from 'next/navigation'; > "d:\delilah_V3.0\src\app\assessment-sections\page.tsx"
echo export default function RedirectToPages() { >> "d:\delilah_V3.0\src\app\assessment-sections\page.tsx"
echo   redirect('/assessment-sections'); >> "d:\delilah_V3.0\src\app\assessment-sections\page.tsx"
echo } >> "d:\delilah_V3.0\src\app\assessment-sections\page.tsx"

echo.
echo 3. Creating a script to help identify any further routing conflicts...
echo @echo off > "d:\delilah_V3.0\find-routing-conflicts.bat"
echo echo Searching for potential routing conflicts... >> "d:\delilah_V3.0\find-routing-conflicts.bat"
echo echo. >> "d:\delilah_V3.0\find-routing-conflicts.bat"
echo echo Checking for catch-all routes in App Router: >> "d:\delilah_V3.0\find-routing-conflicts.bat"
echo dir /s /b "d:\delilah_V3.0\src\app\[[*" >> "d:\delilah_V3.0\find-routing-conflicts.bat"
echo echo. >> "d:\delilah_V3.0\find-routing-conflicts.bat"
echo echo Done! >> "d:\delilah_V3.0\find-routing-conflicts.bat"

echo.
echo Routing fixes applied successfully!
echo.
echo You can now run the application with:
echo npm run dev
echo.
echo If you encounter more routing conflicts, run find-routing-conflicts.bat to identify them.
echo.
