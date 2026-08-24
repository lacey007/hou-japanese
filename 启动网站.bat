@echo off
setlocal
cd /d "%~dp0"

set "HIBIKI_NODE=C:\Users\bhou\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if not exist "%HIBIKI_NODE%" goto NO_NODE
if not exist "node_modules\next\dist\bin\next" goto NO_DEPS

echo.
echo Starting stable Hibiki Japanese at http://localhost:3000
echo Updating the website data and cache. Please wait...
echo Keep this window open while using the website.
echo Press Ctrl+C to stop the website.
echo.

"%HIBIKI_NODE%" "node_modules\next\dist\bin\next" build
if errorlevel 1 goto BUILD_FAILED

start "Hibiki Browser" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:3000'"
"%HIBIKI_NODE%" "node_modules\next\dist\bin\next" start
goto STOPPED

:NO_NODE
echo.
echo Node.js was not found.
echo Install Node.js 20 or newer from https://nodejs.org/
echo.
pause
exit /b 1

:NO_DEPS
echo.
echo Project dependencies were not found.
echo Open PowerShell in this project folder and run: npm install
echo.
pause
exit /b 1

:BUILD_FAILED
echo.
echo The website update failed. Please keep this window open and take a screenshot of this message.
pause
exit /b 1

:STOPPED
echo.
echo The website has stopped.
pause
