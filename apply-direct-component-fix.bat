@echo off
echo Applying direct component fixes...

echo.
echo Clearing Next.js cache...
rmdir /s /q .next

echo.
echo Applying Medical History fix...
copy /Y src\sections\3-MedicalHistory\components\FixedMedicalHistorySelfContained.jsx src\sections\3-MedicalHistory\components\MedicalHistory.jsx

echo.
echo Applying Physical Symptoms fix...
copy /Y src\sections\4-SymptomsAssessment\components\PhysicalSymptomsSelfContained.jsx src\sections\4-SymptomsAssessment\components\SymptomsAssessment.jsx

echo.
echo Starting the application with fixed components...
npm run dev