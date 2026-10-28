@echo off
@REM Run as administrator: self-elevate via UAC if needed.
net session >nul 2>&1
if %errorLevel% neq 0 (
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

@REM Admin shells start in System32; run from the script's folder.
cd /d "%~dp0"

set IME_NAME=mcbopomofo

echo * Build %IME_NAME% for PIME
call npm run build:pime
echo * Stop PIME Launcher
taskkill /F /T /IM PIMELauncher.exe >nul 2>&1
echo * Delete old files
rmdir /S /Q "C:\Program Files (x86)\PIME\node\input_methods\%IME_NAME%"
echo * Copy new files
xcopy /E /I ".\output\pime" "C:\Program Files (x86)\PIME\node\input_methods\%IME_NAME%"

@REM echo * Register %IME_NAME%
@REM "C:\Program Files (x86)\PIME\node\input_methods\%IME_NAME%\run_register_ime.bat"


echo * Start PIME Launcher
start "" "C:\Program Files (x86)\PIME\PIMELauncher.exe"

