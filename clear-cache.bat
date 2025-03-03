@echo off
echo Clearing Next.js cache and temporary files...
rd /s /q .next
rd /s /q node_modules\.cache
echo Cache cleared. Now you can run:
echo npm run dev
pause