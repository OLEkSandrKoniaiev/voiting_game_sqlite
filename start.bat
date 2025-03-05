@echo off
setlocal

echo Check for the presence of Node.js...
where node >nul 2>nul || (
    echo Node.js was not found. Install it and try again :-(
    exit /b
)

echo Setting backend dependencies...
cd backend
call npm install

echo Launching the backend...
start "Backend Server" cmd /c "npm start"

cd ../frontend
echo Setting up frontend dependencies...
call npm install

echo Building the frontend...
call npm run build

echo Launching the frontend...
start "Frontend Server" cmd /c "npm run preview"

timeout /t 3 >nul

echo Open the browser...
start http://localhost:4173

echo The project has been launched! Backend: http://localhost:5000, Frontend: http://localhost:4173"

echo [93mWe are waiting for the servers to be closed...[0m
pause
