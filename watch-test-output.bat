@echo off
:loop
type test_output.txt
timeout /t 1 /nobreak > nul
goto loop