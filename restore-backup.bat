@echo off
echo Restoring original file from backup...
if exist "d:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js.backup" (
  copy /Y "d:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js.backup" "d:\delilah_V3.0\node_modules\next\dist\server\lib\router-utils\setup-dev-bundler.js"
  echo Original file restored.
) else (
  echo No backup file found.
)
