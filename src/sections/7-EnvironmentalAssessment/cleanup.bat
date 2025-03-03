@echo off
echo Cleaning up Environmental Assessment section...

REM Remove root level files
if exist index.tsx del /q index.tsx
if exist EnvironmentalAssessment.tsx del /q EnvironmentalAssessment.tsx
if exist EnvironmentalAssessment.jsx del /q EnvironmentalAssessment.jsx
if exist IMPLEMENTATION.md del /q IMPLEMENTATION.md
if exist PROMPTS.md del /q PROMPTS.md
if exist types.ts del /q types.ts
if exist babel.config.js del /q babel.config.js
if exist jest.config.js del /q jest.config.js

REM Clean up components directory
cd components
if exist EnvironmentalAssessment.jsx del /q EnvironmentalAssessment.jsx
if exist EnvironmentalAssessment.tsx del /q EnvironmentalAssessment.tsx
if exist PropertyOverview.tsx del /q PropertyOverview.tsx
if exist RoomAssessment.tsx del /q RoomAssessment.tsx
if exist RoomHazards.tsx del /q RoomHazards.tsx
if exist SafetyAssessment.tsx del /q SafetyAssessment.tsx
if exist EnvironmentalAssessment rmdir /s /q EnvironmentalAssessment
if exist RoomAssessment rmdir /s /q RoomAssessment
cd ..

REM Clean up tests directory
cd __tests__
if exist EnvironmentalAssessment.test.tsx del /q EnvironmentalAssessment.test.tsx
if exist environmentalService.test.ts del /q environmentalService.test.ts
if exist PropertyOverview.test.tsx del /q PropertyOverview.test.tsx
if exist RoomAssessment.test.tsx del /q RoomAssessment.test.tsx
if exist SafetyAssessment.test.tsx del /q SafetyAssessment.test.tsx
if exist setup.ts del /q setup.ts
if exist setupTests.ts del /q setupTests.ts
if exist test-utils.tsx del /q test-utils.tsx
if exist helpers rmdir /s /q helpers
if exist integration rmdir /s /q integration
if exist __mocks__ rmdir /s /q __mocks__
cd ..

REM Clean up other directories
if exist services rmdir /s /q services
if exist hooks rmdir /s /q hooks
if exist __mocks__ rmdir /s /q __mocks__

echo Cleanup complete.
echo.
dir /s /b