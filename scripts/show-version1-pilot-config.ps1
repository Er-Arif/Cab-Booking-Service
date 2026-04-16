$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $workspaceRoot "config\version1-pilot-config.json"

if (-not (Test-Path $configPath)) {
  throw "Pilot config file not found at $configPath"
}

$config = Get-Content $configPath -Raw | ConvertFrom-Json

Write-Host "=== Version 1 Pilot Configuration ===" -ForegroundColor Cyan
Write-Host "City: $($config.city), $($config.state)"
Write-Host "Provider mode: $($config.launchPolicy.providerMode)"
Write-Host "OTP mode: $($config.launchPolicy.otp)"
Write-Host "Maps mode: $($config.launchPolicy.maps)"
Write-Host "Payments mode: $($config.launchPolicy.payments)"

Write-Host ""
Write-Host "Launch zones" -ForegroundColor Green
foreach ($zone in $config.serviceZones) {
  Write-Host "- $($zone.name) [$($zone.status)] - $($zone.notes)"
}

Write-Host ""
Write-Host "Launch landmarks" -ForegroundColor Green
foreach ($landmark in $config.landmarks) {
  Write-Host "- $($landmark.name) (zone: $($landmark.zoneId))"
}

Write-Host ""
Write-Host "Ride categories" -ForegroundColor Green
foreach ($category in $config.rideCategories) {
  Write-Host "- $($category.label): minimum Rs $($category.minimumFare), per km Rs $($category.perKmRate), cancellation Rs $($category.cancellationFee)"
}

Write-Host ""
Write-Host "Seeded access" -ForegroundColor Green
Write-Host "- Admin: $($config.seededAccess.admin.phone), OTP $($config.seededAccess.admin.otp)"
Write-Host "- Customer: $($config.seededAccess.customer.phone), OTP $($config.seededAccess.customer.otp)"
foreach ($driver in $config.seededAccess.drivers) {
  Write-Host "- Driver: $($driver.name), $($driver.phone), $($driver.vehicleType)"
}

Write-Host ""
Write-Host "Operational defaults" -ForegroundColor Green
Write-Host "- Commission rate: $($config.opsDefaults.commissionRate)"
Write-Host "- Settlement cycle: $($config.opsDefaults.settlementCycle)"
Write-Host "- Complaint first response target: $($config.opsDefaults.complaintFirstResponseHours) hours"
Write-Host "- Complaint resolution target: $($config.opsDefaults.complaintResolutionHours) hours"
