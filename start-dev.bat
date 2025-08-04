@echo off
echo Starting backend...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Starting frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

