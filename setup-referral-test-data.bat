@echo off
echo Setting up referral test data folder...

REM Ensure the directory exists
mkdir public\data\sample-referrals 2>NUL

REM Copy sample referral text files
echo Copying sample referral documents...
copy /Y public\data\sample-referrals\*.txt src\__tests__\data\referrals\ 2>NUL
copy /Y public\data\sample-referrals\*.json src\__tests__\data\referrals\ 2>NUL

REM Create test directory if it doesn't exist
mkdir src\__tests__\data\referrals 2>NUL

echo Test data setup complete.
echo.
echo You can now run the referral integration tests with:
echo npm test -- -t "referralIntegration"
echo.
echo Or run the referral extractor tests with:
echo npm test -- -t "enhancedReferralExtractor"

