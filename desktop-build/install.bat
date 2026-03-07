@echo off
echo Installing Application...
:: NOTE: This is a template. 
:: 1. Build your app locally using Electron/Tauri.
:: 2. Replace "myapp.exe" with the actual name of your built executable.
:: 3. Ensure the executable is in the same folder as this script.

set INSTALL_DIR=%ProgramFiles%\MyApp
echo Creating directory: %INSTALL_DIR%
mkdir "%INSTALL_DIR%" 2>nul

echo Copying files...
copy "myapp.exe" "%INSTALL_DIR%\"

echo Creating shortcut on Desktop...
:: This is a simplified shortcut creation
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\MyApp.lnk" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%INSTALL_DIR%\myapp.exe" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs
cscript CreateShortcut.vbs
del CreateShortcut.vbs

echo Installation complete.
pause
