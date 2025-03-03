@echo off
echo ===================================
echo Fixing All Require/Import Paths
echo ===================================
echo.

REM Create backup of pages directory if not already done
if not exist "pages-backup-require-paths" (
  echo Creating backup of pages directory...
  xcopy "pages\*" "pages-backup-require-paths\" /E /I /Y
)

echo Updating import paths in all pages...
echo This will replace '../sections/' with '@/sections/' and similar paths...

REM Update paths using PowerShell for more reliable text replacement
powershell -Command "Get-ChildItem -Path 'pages' -Recurse -Include '*.tsx','*.jsx','*.js','*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw; $updated = $false; $newContent = $content; if ($content -match '\.\.\/sections\/') { $newContent = $newContent -replace '\.\.\/sections\/', '@/sections/'; $updated = $true; }; if ($content -match '\.\.\/components\/') { $newContent = $newContent -replace '\.\.\/components\/', '@/components/'; $updated = $true; }; if ($content -match '\.\.\/hooks\/') { $newContent = $newContent -replace '\.\.\/hooks\/', '@/hooks/'; $updated = $true; }; if ($content -match '\.\.\/contexts\/') { $newContent = $newContent -replace '\.\.\/contexts\/', '@/contexts/'; $updated = $true; }; if ($content -match '\.\.\/utils\/') { $newContent = $newContent -replace '\.\.\/utils\/', '@/utils/'; $updated = $true; }; if ($content -match '\.\.\/data\/') { $newContent = $newContent -replace '\.\.\/data\/', '@/data/'; $updated = $true; }; if ($content -match 'require\(''\.\.\/') { $newContent = $newContent -replace 'require\(''\.\.\/sections\/', 'require(''@/sections/'; $newContent = $newContent -replace 'require\(''\.\.\/components\/', 'require(''@/components/'; $newContent = $newContent -replace 'require\(''\.\.\/hooks\/', 'require(''@/hooks/'; $newContent = $newContent -replace 'require\(''\.\.\/contexts\/', 'require(''@/contexts/'; $newContent = $newContent -replace 'require\(''\.\.\/utils\/', 'require(''@/utils/'; $newContent = $newContent -replace 'require\(''\.\.\/data\/', 'require(''@/data/'; $updated = $true; }; if ($updated) { Set-Content -Path $_.FullName -Value $newContent -NoNewline; Write-Host ('Updated ' + $_.FullName) }; }"

REM Fix paths in subdirectories that need deeper references
echo Fixing paths in nested subdirectories...
powershell -Command "Get-ChildItem -Path 'pages' -Recurse -Directory | ForEach-Object { $dirDepth = ($_.FullName -split '\\').Count - ($_.FullName -split 'pages').Count; if ($dirDepth -gt 1) { Get-ChildItem -Path $_.FullName -Include '*.tsx','*.jsx','*.js','*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw; $updated = $false; $newContent = $content; if ($content -match '\.\.\/' + ('\.\./' * ($dirDepth-1)) + 'components\/') { $newContent = $newContent -replace '\.\.\/' + ('\.\./' * ($dirDepth-1)) + 'components\/', '@/components/'; $updated = $true; }; if ($updated) { Set-Content -Path $_.FullName -Value $newContent -NoNewline; Write-Host ('Updated nested path in ' + $_.FullName) }; } } }"

REM Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q ".next" 2>nul

echo.
echo ===================================
echo Path fixes completed!
echo ===================================
echo.
echo All relative import paths should now be using path aliases like @/components/
echo Restart the Next.js server with "npm run dev" to see if this resolved the issues.
echo.