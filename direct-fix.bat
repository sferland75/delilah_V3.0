@echo off
echo Fixing Next.js dev server watchpack error...

REM Back up the original file if it doesn't already have a backup
if not exist "d:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js.backup" (
  echo Creating backup...
  copy "d:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js" "d:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js.backup"
)

echo Patching file...
powershell -Command "(Get-Content 'd:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js') -replace 'const safePath = \(p\) => \{', '// safePath removed to avoid duplicate' | Set-Content 'd:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js'"

powershell -Command "(Get-Content 'd:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js') -replace '_path\.default\.relative\(([^,]+),\s*([^)]+)\)', '_path.default.relative($1, typeof $2 === \"string\" ? $2 : \"\")' | Set-Content 'd:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js'"

echo Done! Now try running:
echo npm run dev
pause
