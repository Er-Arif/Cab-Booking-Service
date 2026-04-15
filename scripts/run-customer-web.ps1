$ErrorActionPreference = "Stop"

$puro = "C:\Users\arif1\AppData\Local\Microsoft\WinGet\Packages\pingbird.Puro_Microsoft.Winget.Source_8wekyb3d8bbwe\puro.exe"

if (-not (Test-Path $puro)) {
  throw "Puro not found at $puro"
}

Set-Location "E:\MyProjects\Cab Booking Service\apps\customer_app"
& $puro flutter pub get
& $puro flutter build web
Write-Host "Customer app built successfully." -ForegroundColor Green
Write-Host "Open a second terminal and run the local server command below to view it:" -ForegroundColor Yellow
Write-Host "python -m http.server 4100 --bind 127.0.0.1 --directory `"E:\MyProjects\Cab Booking Service\apps\customer_app\build\web`"" -ForegroundColor Cyan
