@echo off
echo Fixing redirect issues in Delilah V3.0...

echo Removing App Router structure that's causing redirects...
rd /s /q D:\delilah_V3.0\src\app

echo Cleaning build cache...
rd /s /q D:\delilah_V3.0\.next

echo Done! You can now run 'npm run dev' to start the application.
