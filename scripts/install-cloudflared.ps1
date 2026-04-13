# Install cloudflared untuk Windows (manual)

# Download latest release
$version = "2025.2.1"  # Check latest at https://github.com/cloudflare/cloudflared/releases
$url = "https://github.com/cloudflare/cloudflared/releases/download/$version/cloudflared-windows-amd64.exe"
$output = "$env:USERPROFILE\cloudflared.exe"

Write-Host "Downloading cloudflared..." -ForegroundColor Green
Invoke-WebRequest -Uri $url -OutFile $output

# Add to PATH (optional - user level)
$envPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $envPath.Contains($env:USERPROFILE)) {
    [Environment]::SetEnvironmentVariable("Path", $envPath + ";" + $env:USERPROFILE, "User")
    Write-Host "Added to PATH. Restart terminal to use 'cloudflared' command." -ForegroundColor Yellow
}

# Verify installation
& $output version
Write-Host "`nCloudflared installed successfully!" -ForegroundColor Green
Write-Host "Run: $output tunnel --url http://localhost:3000" -ForegroundColor Cyan
