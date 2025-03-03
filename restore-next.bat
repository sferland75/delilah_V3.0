@echo off
echo Restoring original Next.js files...

echo Removing node_modules\.cache...
rd /s /q node_modules\.cache

echo Removing .next directory...
rd /s /q .next

echo Removing modified Next.js files...
del /q node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js

echo Reinstalling Next.js...
npm uninstall next
npm install next@14.0.4

echo Next.js has been restored to its original state.
echo You can now run: npm run dev
pause