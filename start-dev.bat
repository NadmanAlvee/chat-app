@echo off
echo Starting backend...
start "Backend Server" cmd /k "cd backend && yarn run dev"

echo Starting frontend...
start "Frontend Server" cmd /k "cd frontend && yarn run dev"

