@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\maqueta-viva\Start-ARKI-MaquetaViva.ps1"
if errorlevel 1 (
  echo.
  echo No se pudo abrir ARKI Maqueta Viva. Revisa el mensaje anterior.
  pause
  exit /b 1
)
exit /b 0
