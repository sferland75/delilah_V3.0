@echo off
echo Running Medical History Section Tests...
cd C:\Users\ferla\Desktop\delilah_V3.0
npm test src/sections/medical-history/generate.test.ts -- --coverage
pause