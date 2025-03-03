@echo off
echo Disabling Next.js App Router...
echo.

if exist "src\app" (
  echo Stopping Next.js server (if running)...
  taskkill /FI "WINDOWTITLE eq npm*" /F
  
  echo Backing up App Router directory...
  if not exist "src\app_backup" mkdir "src\app_backup"
  robocopy "src\app" "src\app_backup" /E /NFL /NDL /NJH /NJS
  
  echo Renaming App Router directory...
  ren "src\app" "app_disabled"
  
  echo Clearing Next.js cache...
  if exist ".next" rd /s /q ".next"
  
  echo App Router has been disabled.
  echo.
  echo To start the application with only Pages Router:
  echo npm run dev
) else (
  echo App Router directory (src\app) not found.
  echo It may already be disabled or renamed.
)
