@echo off
echo Disabling ALL catch-all routes in the App Router...
echo This will help resolve routing conflicts between App Router and Pages Router.
echo.

set APP_DIR=d:\delilah_V3.0\src\app

REM Find and disable all catch-all route files
for /d /r "%APP_DIR%" %%d in (*[[*]*) do (
    echo Found catch-all route directory: %%d
    if exist "%%d\page.tsx" (
        echo - Disabling %%d\page.tsx
        if not exist "%%d\page.tsx.bak" (
            ren "%%d\page.tsx" "page.tsx.bak"
            echo   Renamed to page.tsx.bak
        ) else (
            echo   Already disabled (page.tsx.bak exists)
        )
    )
)

echo.
echo Done disabling catch-all routes.
echo You can now run:
echo npm run dev
echo.
