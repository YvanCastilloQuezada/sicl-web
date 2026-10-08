@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\research-trends\Start-ARKI-ResearchWatch.ps1" -RepoRoot "%~dp0"
set "exitCode=%errorlevel%"
if not "%exitCode%"=="0" echo RESEARCH_WATCH_FAILED=%exitCode%
pause
exit /b %exitCode%
