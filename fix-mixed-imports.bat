@echo off
echo ===================================
echo Fixing Mixed Import Paths
echo ===================================
echo.

REM Check for mixed import paths like '../@/components' which is incorrect
echo Checking for mixed imports (../@/)...

powershell -Command "Get-ChildItem -Path 'pages' -Recurse -Include '*.tsx','*.jsx','*.js','*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match '\.\.\/\@\/') { Write-Host ('Found mixed import in: ' + $_.FullName); $fixedContent = $content -replace '\.\.\/\@\/', '@/'; Set-Content -Path $_.FullName -Value $fixedContent -NoNewline; Write-Host ('Fixed: ' + $_.FullName) } }"

echo.
echo Mixed imports have been fixed.
echo.
echo Now clearing Next.js cache...
rmdir /s /q ".next" 2>nul

echo.
echo All fixes complete! Restart the Next.js server with:
echo npm run dev