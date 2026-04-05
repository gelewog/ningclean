# Ningclean Clean Restart Script
# Usage: .\restart-clean.ps1

Write-Host "=== Ningclean Clean Restart ===" -ForegroundColor Cyan

# 1. Kill all Node processes for ningclean
Write-Host "`n[1/4] Killing Node processes..." -ForegroundColor Yellow
$ningcleanPorts = @(3000, 3001, 4000, 5432)
foreach ($port in $ningcleanPorts) {
    $process = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "  Killed process on port $port" -ForegroundColor Gray
    }
}

# Also kill any node processes in the ningclean directory
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    try { $_.Path -like "*ningclean*" } catch { $false }
}
foreach ($proc in $nodeProcesses) {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Killed Node process: $($proc.Id)" -ForegroundColor Gray
}

Write-Host "  All Node processes killed" -ForegroundColor Green

# 2. Ensure Docker is running
Write-Host "`n[2/4] Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps -a 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "  Docker is running" -ForegroundColor Green

# 3. Start PostgreSQL container
Write-Host "`n[3/4] Starting PostgreSQL container..." -ForegroundColor Yellow
Set-Location "C:\Users\user\.openclaw\workspace\ningclean"
docker-compose up -d
Start-Sleep -Seconds 3

# Wait for PostgreSQL to be ready
Write-Host "  Waiting for PostgreSQL to be ready..." -ForegroundColor Gray
$attempts = 0
while ($attempts -lt 10) {
    $ready = docker exec ningclean-postgres pg_isready -U postgres 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  PostgreSQL is ready!" -ForegroundColor Green
        break
    }
    $attempts++
    Start-Sleep -Seconds 1
}

# 4. Run npm dev
Write-Host "`n[4/4] Starting dev servers..." -ForegroundColor Yellow
Write-Host "  Starting Web (3001), API (4000), Admin (3000)..." -ForegroundColor Gray

# Start in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\user\.openclaw\workspace\ningclean'; npm run dev"

Write-Host "`n=== Done! ===" -ForegroundColor Cyan
Write-Host "Web:      http://localhost:3001" -ForegroundColor Green
Write-Host "Admin:    http://localhost:3000" -ForegroundColor Green
Write-Host "API:      http://localhost:4000" -ForegroundColor Green
Write-Host "Swagger:  http://localhost:4000/api/docs" -ForegroundColor Green
