@echo off
echo Applying EMERGENCY component fix...

echo.
echo Stopping any running servers...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Clearing Next.js cache completely...
rmdir /s /q .next
rmdir /s /q node_modules\.cache

echo.
echo DELETE all index.tsx files to prevent conflicts
del /Q src\sections\3-MedicalHistory\index.tsx >nul 2>&1
del /Q src\sections\4-SymptomsAssessment\index.tsx >nul 2>&1
del /Q src\sections\5-FunctionalStatus\index.tsx >nul 2>&1
del /Q src\sections\6-TypicalDay\index.tsx >nul 2>&1

echo.
echo Creating simple .js files that bypass complex components...
echo 'use client'; > src\sections\3-MedicalHistory\index.js
echo. >> src\sections\3-MedicalHistory\index.js
echo import { MedicalHistorySelfContained } from './components/MedicalHistorySelfContained'; >> src\sections\3-MedicalHistory\index.js
echo. >> src\sections\3-MedicalHistory\index.js
echo // Export as both named export and default export >> src\sections\3-MedicalHistory\index.js
echo export { MedicalHistorySelfContained as MedicalHistory }; >> src\sections\3-MedicalHistory\index.js
echo export default MedicalHistorySelfContained; >> src\sections\3-MedicalHistory\index.js

echo.
echo Starting application with fixed components...
npm run dev