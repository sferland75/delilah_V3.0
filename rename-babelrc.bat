@echo off
echo Backing up current .babelrc...
ren D:\delilah_V3.0\.babelrc .babelrc.original
echo Creating simplified .babelrc...
echo { > D:\delilah_V3.0\.babelrc
echo   "presets": ["next/babel"] >> D:\delilah_V3.0\.babelrc
echo } >> D:\delilah_V3.0\.babelrc
echo Done! Now run: npm run dev