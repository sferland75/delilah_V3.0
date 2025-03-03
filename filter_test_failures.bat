@echo off
findstr /C:"FAIL" /C:"Error:" /C:"TypeError:" /C:"● " test_output.txt > test_failures.txt