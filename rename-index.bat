@echo off
echo Temporarily renaming index page to bypass potential redirects...

echo Backing up original index.tsx...
ren D:\delilah_V3.0\src\pages\index.tsx index.tsx.original

echo Renaming simple index to be the main index...
ren D:\delilah_V3.0\src\pages\index.simple.js index.js

echo Done! You can now run 'npm run dev' to test the simple index page.
pause