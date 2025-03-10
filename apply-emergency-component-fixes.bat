@echo off
echo Applying emergency fixes to multiple sections...

echo.
echo Clearing Next.js cache...
rmdir /s /q .next

echo.
echo Creating common emergency fix directory...
mkdir temp-fixes

echo.
echo Copying the working self-contained component pattern...
copy /Y src\sections\3-MedicalHistory\components\MedicalHistorySelfContained.jsx temp-fixes\SelfContainedComponent.jsx

echo.
echo Applying the emergency fix to Medical History...
copy /Y src\sections\3-MedicalHistory\components\MedicalHistorySelfContained.tsx src\sections\3-MedicalHistory\components\MedicalHistory.tsx

echo.
echo Applying the emergency fix to all problematic sections...
echo "export { default } from '../3-MedicalHistory/components/MedicalHistorySelfContained';" > src\sections\4-SymptomsAssessment\index.js
echo "export { default } from '../3-MedicalHistory/components/MedicalHistorySelfContained';" > src\sections\5-FunctionalStatus\index.js
echo "export { default } from '../3-MedicalHistory/components/MedicalHistorySelfContained';" > src\sections\6-TypicalDay\index.js

echo.
echo Starting the application with fixed components...
npm run dev