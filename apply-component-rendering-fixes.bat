@echo off
echo Applying component rendering fixes...

echo.
echo Updating MedicalHistory section...
copy /Y src\sections\3-MedicalHistory\components\MedicalHistory.integrated.final.tsx src\sections\3-MedicalHistory\components\MedicalHistory.tsx
copy /Y src\sections\3-MedicalHistory\components\PreExistingConditionsSection.fixed.tsx src\sections\3-MedicalHistory\components\PreExistingConditionsSection.tsx
copy /Y src\sections\3-MedicalHistory\components\InjuryDetailsSection.fixed.tsx src\sections\3-MedicalHistory\components\InjuryDetailsSection.tsx
copy /Y src\sections\3-MedicalHistory\components\TreatmentSection.fixed.tsx src\sections\3-MedicalHistory\components\TreatmentSection.tsx
copy /Y src\sections\3-MedicalHistory\components\MedicationsSection.fixed.tsx src\sections\3-MedicalHistory\components\MedicationsSection.tsx

echo.
echo Adding ErrorBoundary to component imports...
echo import { ErrorBoundary } from "@/components/ui/error-boundary"; >> src\sections\3-MedicalHistory\components\MedicalHistory.tsx

echo.
echo Clearing Next.js cache...
rmdir /s /q .next

echo.
echo Building project...
npm run build

echo.
echo All fixes applied successfully!
echo You can now run the application with: npm run dev