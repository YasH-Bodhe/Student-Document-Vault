@echo off
REM Start All Servers - Student Document Vault
REM This script starts the Blockchain, Backend Server, and Frontend Client

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Student Document Vault - Starting All Services           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Get the directory where the batch file is located
set PROJECT_ROOT=%~dp0

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js is installed
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm is not installed or not in PATH
    echo Please install npm from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ npm is installed
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "%PROJECT_ROOT%blockchain\node_modules" (
    echo 📦 Installing blockchain dependencies...
    cd /d "%PROJECT_ROOT%blockchain"
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install blockchain dependencies
        pause
        exit /b 1
    )
    cd /d "%PROJECT_ROOT%"
)

if not exist "%PROJECT_ROOT%server\node_modules" (
    echo 📦 Installing server dependencies...
    cd /d "%PROJECT_ROOT%server"
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install server dependencies
        pause
        exit /b 1
    )
    cd /d "%PROJECT_ROOT%"
)

if not exist "%PROJECT_ROOT%client\node_modules" (
    echo 📦 Installing client dependencies...
    cd /d "%PROJECT_ROOT%client"
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install client dependencies
        pause
        exit /b 1
    )
    cd /d "%PROJECT_ROOT%"
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Starting Services...                                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Start Blockchain Node in a new window
echo 🚀 Starting Blockchain Node (Hardhat)...
start "Blockchain Node" cmd /k "title Blockchain Node - Hardhat & cd /d "%PROJECT_ROOT%blockchain" & npx hardhat node"

REM Wait for blockchain to start and stabilize (increased from 5 to 15 seconds)
echo ⏳ Waiting 15 seconds for blockchain to initialize...
timeout /t 15 /nobreak

REM Deploy contract to blockchain
echo.
echo ⚙️  Deploying Smart Contract to blockchain...
cd /d "%PROJECT_ROOT%blockchain"
call npm run deploy:localhost
if %errorlevel% neq 0 (
    echo ❌ Contract deployment failed!
    echo Please check the blockchain node window for errors
    cd /d "%PROJECT_ROOT%"
    pause
    exit /b 1
)
cd /d "%PROJECT_ROOT%"

echo ✅ Smart Contract deployed successfully!
timeout /t 3 /nobreak

REM Start Backend Server in a new window
echo 🚀 Starting Backend Server (Express)...
start "Backend Server" cmd /k "title Backend Server - Express & cd /d "%PROJECT_ROOT%server" & npm run dev"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start Frontend Client in a new window
echo 🚀 Starting Frontend Client (React + Vite)...
start "Frontend Client" cmd /k "title Frontend Client - React & cd /d "%PROJECT_ROOT%client" & npm run dev"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  All Services Started!                                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Service Information:
echo ───────────────────────────────────────────────────────────
echo ✓ Blockchain Node:   http://localhost:8545 (RPC endpoint)
echo ✓ Backend Server:    http://localhost:5000 (API endpoint)
echo ✓ Frontend Client:   http://localhost:5173 (Web interface)
echo.
echo 💡 Tips:
echo   - Each service runs in a separate window
echo   - Close any window to stop that service
echo   - Or close all windows to stop everything
echo   - Logs for each service are shown in their respective windows
echo.
echo Press Ctrl+C in any window to stop that service
echo ───────────────────────────────────────────────────────────
echo.
