@echo off
echo ===================================================
echo Applying ULTRA DEBUG version of AssessmentContext
echo ===================================================

echo.
echo Backing up original AssessmentContext...
if not exist "src\contexts\AssessmentContext.tsx.orig" (
  copy "src\contexts\AssessmentContext.tsx" "src\contexts\AssessmentContext.tsx.orig"
) else (
  echo Original backup already exists at src\contexts\AssessmentContext.tsx.orig
)

echo.
echo Installing ULTRA DEBUG version...
copy "src\contexts\AssessmentContext.ultra-debug.tsx" "src\contexts\AssessmentContext.tsx"

echo.
echo Done! ULTRA DEBUG version of AssessmentContext installed.
echo This adds extremely detailed logging and auto-fixes nested data structures.
echo.
echo To use it, visit these special pages after loading a sample case:
echo - /assessment/context-debug (whole context)
echo - /assessment/typical-day-fixed (direct access to Typical Day)
echo - /assessment/medical-fixed (direct access to Medical History)
echo - /assessment/symptoms-fixed (direct access to Symptoms Assessment)
echo.
echo After testing, run restore-context-orig.bat to revert to the original version.

echo.
echo Creating restore script...
echo @echo off > restore-context-orig.bat
echo echo Restoring original AssessmentContext... >> restore-context-orig.bat
echo copy "src\contexts\AssessmentContext.tsx.orig" "src\contexts\AssessmentContext.tsx" >> restore-context-orig.bat
echo echo Done! >> restore-context-orig.bat

echo.
echo ===================================================
echo NEXT STEPS:
echo 1. Restart your development server
echo 2. Load a sample case
echo 3. Visit the debug pages listed above
echo 4. Check console for detailed logs
echo 5. Run restore-context-orig.bat when finished
echo ===================================================
