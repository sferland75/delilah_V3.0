@echo off
echo Applying hot fix to components...

echo.
echo Stopping any running servers...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Clearing Next.js cache...
rmdir /s /q .next

echo.
echo Directly modifying MedicalHistory index...
echo. > src\sections\3-MedicalHistory\index.js
echo 'use client'; > src\sections\3-MedicalHistory\index.js
echo. >> src\sections\3-MedicalHistory\index.js
echo import { MedicalHistorySelfContained } from './components/MedicalHistorySelfContained'; >> src\sections\3-MedicalHistory\index.js
echo. >> src\sections\3-MedicalHistory\index.js
echo // Export our component as both named export and default >> src\sections\3-MedicalHistory\index.js
echo export { MedicalHistorySelfContained as MedicalHistory }; >> src\sections\3-MedicalHistory\index.js
echo export default MedicalHistorySelfContained; >> src\sections\3-MedicalHistory\index.js

echo.
echo Directly modifying SymptomsAssessment index...
echo. > src\sections\4-SymptomsAssessment\index.js
echo 'use client'; > src\sections\4-SymptomsAssessment\index.js
echo. >> src\sections\4-SymptomsAssessment\index.js
echo import { MedicalHistorySelfContained } from '../3-MedicalHistory/components/MedicalHistorySelfContained'; >> src\sections\4-SymptomsAssessment\index.js
echo. >> src\sections\4-SymptomsAssessment\index.js
echo // Export as temporary stand-in >> src\sections\4-SymptomsAssessment\index.js
echo export { MedicalHistorySelfContained as SymptomsAssessment }; >> src\sections\4-SymptomsAssessment\index.js
echo export default MedicalHistorySelfContained; >> src\sections\4-SymptomsAssessment\index.js

echo.
echo Starting the application with fixed components...
npm run dev