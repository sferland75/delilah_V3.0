@echo off
echo Cleaning up temporary scripts...

:: Delete all the temporary .bat files we created
del check_branch.bat
del check_files.bat
del cleanup_branches.bat
del compare_branches.bat
del fix_branches.bat
del force_add.bat
del force_add_v2.bat
del test_change.bat
del verify_sync.bat
del cleanup_scripts.bat

echo Done! All temporary scripts removed.
pause