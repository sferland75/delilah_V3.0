@echo off
echo Restoring Next.js App Router...
echo.

if exist "src\app_disabled" (
  echo Stopping Next.js server (if running)...
  taskkill /FI "WINDOWTITLE eq npm*" /F
  
  echo Restoring App Router directory...
  if exist "src\app" (
    echo ERROR: Cannot restore, src\app already exists.
    echo Please check and manually remove or rename the existing directory.
    exit /b 1
  )
  
  echo Renaming directory back to app...
  ren "src\app_disabled" "app"
  
  echo Clearing Next.js cache...
  if exist ".next" rd /s /q ".next"
  
  echo To enable App Router, edit next.config.js to set appDir: true in experimental section.
  echo.
  echo App Router has been restored.
) else (
  echo App Router backup directory (src\app_disabled) not found.
  echo.
  echo Checking for other backup directories...
  
  if exist "src\app_disabled_complete" (
    echo Found src\app_disabled_complete - you can manually rename this to src\app
  ) else if exist "src\app_backup" (
    echo Found src\app_backup - you can manually restore this to src\app
  ) else (
    echo No backup directories found.
  )
)
