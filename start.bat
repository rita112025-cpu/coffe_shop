@echo off
chcp 65001 >nul
cd /d "%~dp0"

rem 優先使用 portable Node，沒有就用系統 PATH 上的 Node
set "NODE_DIR=D:\tools\node-v22.23.3-win-x64"
if exist "%NODE_DIR%\node.exe" set "PATH=%NODE_DIR%;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
  echo [錯誤] 找不到 Node.js，請確認 %NODE_DIR% 存在或系統已安裝 Node。
  pause
  exit /b 1
)

if not exist node_modules (
  echo 第一次執行，安裝套件中...
  call npm install
  if errorlevel 1 (
    echo [錯誤] npm install 失敗
    pause
    exit /b 1
  )
)

echo 啟動中，瀏覽器會自動開啟 http://localhost:3000/ ，關閉此視窗即可停止。
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000/"
call npm run dev
pause
