@echo off
echo Combining all section files into complete_assessment.json...
type demographics.json medical_history.json symptoms_assessment.json typical_day.json environmental_assessment.json adl_assessment.json > temp.json
echo { > complete_assessment.json
for /f "tokens=1,* delims={" %%a in (temp.json) do (
  for /f "tokens=1,* delims=}" %%c in ("%%b") do (
    echo   %%c, >> complete_assessment.json
  )
)
echo   "combinedAt": "%date% %time%" >> complete_assessment.json
echo } >> complete_assessment.json
del temp.json
echo Complete assessment file created successfully.
echo File location: %~dp0complete_assessment.json
pause
