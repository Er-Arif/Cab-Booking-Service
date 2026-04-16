param(
  [switch]$SkipVerification,
  [switch]$SkipDemoFlow
)

$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$verifyScript = Join-Path $PSScriptRoot "verify-version1.ps1"
$demoScript = Join-Path $PSScriptRoot "demo-flow.ps1"

function Step($message) {
  Write-Host ""
  Write-Host "=== $message ===" -ForegroundColor Cyan
}

Push-Location $workspaceRoot
try {
  Step "Version 1 launch rehearsal"
  Write-Host "Workspace: $workspaceRoot"

  if (-not $SkipVerification) {
    Step "Running full automated verification"
    powershell -ExecutionPolicy Bypass -File $verifyScript
  } else {
    Write-Host "Skipping automated verification because -SkipVerification was provided." -ForegroundColor Yellow
  }

  if (-not $SkipDemoFlow) {
    Step "Running backend demo flow"
    Write-Host "This expects the backend to already be running at http://localhost:4000" -ForegroundColor Yellow
    powershell -ExecutionPolicy Bypass -File $demoScript
  } else {
    Write-Host "Skipping backend demo flow because -SkipDemoFlow was provided." -ForegroundColor Yellow
  }

  Step "Manual rehearsal checkpoints"
  Write-Host "1. Admin panel" -ForegroundColor Green
  Write-Host "   URL: http://localhost:3000"
  Write-Host "   Phone: 9000000001"
  Write-Host "   OTP: 123456"
  Write-Host "   Confirm: dashboard loads, drivers list renders, complaints resolve, fare settings save."
  Write-Host ""
  Write-Host "2. Customer app" -ForegroundColor Green
  Write-Host "   Start with: powershell -ExecutionPolicy Bypass -File .\scripts\run-customer-web.ps1"
  Write-Host "   Serve build if needed from apps\customer_app\build\web"
  Write-Host "   Phone: 9000000002"
  Write-Host "   OTP: 123456"
  Write-Host "   Confirm: fare estimate, booking, history, complaint flow."
  Write-Host ""
  Write-Host "3. Driver app" -ForegroundColor Green
  Write-Host "   Start with: powershell -ExecutionPolicy Bypass -File .\scripts\run-driver-web.ps1"
  Write-Host "   Serve build if needed from apps\driver_app\build\web"
  Write-Host "   Phone: 9000000003"
  Write-Host "   OTP: 123456"
  Write-Host "   Confirm: availability toggle, assigned ride, lifecycle updates, payment confirm, earnings."
  Write-Host ""
  Write-Host "4. Sign-off reference" -ForegroundColor Green
  Write-Host "   Checklist: docs\guides\version1-acceptance-checklist.md"
  Write-Host "   Runbook: docs\guides\version1-launch-rehearsal.md"

  Step "Rehearsal package complete"
  Write-Host "Version 1 automated checks, demo flow, and manual checkpoints are ready." -ForegroundColor Green
} finally {
  Pop-Location
}
