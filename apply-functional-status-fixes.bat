@echo off
echo Applying Functional Status Component Fixes...
echo.

REM Create backup of original files
echo Creating backups of original files...
if not exist "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups" mkdir "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups"

copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\ManualMuscle.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups\ManualMuscle.tsx.bak"
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\BergBalance.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups\BergBalance.tsx.bak"
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\PosturalTolerances.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups\PosturalTolerances.tsx.bak"
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\TransfersAssessment.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups\TransfersAssessment.tsx.bak"
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\FunctionalStatus.integrated.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\backups\FunctionalStatus.integrated.tsx.bak"

echo Backups created successfully.
echo.

REM Copy fixed files
echo Applying fixes to components...

REM Copy the fixed ManualMuscle component
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\ManualMuscle.fixed.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\ManualMuscle.tsx"

REM Copy the fixed BergBalance component
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\BergBalance.fixed.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\BergBalance.tsx"

REM Copy the fixed PosturalTolerances component
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\PosturalTolerances.fixed.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\PosturalTolerances.tsx"

REM Copy the fixed TransfersAssessment component
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\TransfersAssessment.fixed.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\TransfersAssessment.tsx"

REM Copy the fixed FunctionalStatus main component
copy /Y "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\FunctionalStatus.integrated.fixed.tsx" "d:\delilah_V3.0\src\sections\5-FunctionalStatus\components\FunctionalStatus.integrated.tsx"

echo Fixed components applied successfully.
echo.

echo Functional Status components have been successfully fixed.
echo The original files are backed up in the 'backups' directory.
echo.
echo See the COMPONENT_FIXES_APPLIED.md file for details on what changes were made.
echo.
echo Press any key to exit...
pause > nul
