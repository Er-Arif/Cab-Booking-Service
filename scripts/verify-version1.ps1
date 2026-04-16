$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$puro = "C:\Users\arif1\AppData\Local\Microsoft\WinGet\Packages\pingbird.Puro_Microsoft.Winget.Source_8wekyb3d8bbwe\puro.exe"

Write-Host "Running Version 1 verification from $workspaceRoot"

Push-Location $workspaceRoot
try {
  Write-Host "1/5 Backend typecheck"
  cmd /c npm --workspace apps/backend run typecheck

  Write-Host "2/5 Backend tests"
  cmd /c npm --workspace apps/backend test

  Write-Host "3/5 Admin production build"
  cmd /c npm --workspace apps/admin_web run build

  if (Test-Path $puro) {
    Write-Host "4/5 Customer Flutter widget tests"
    Push-Location (Join-Path $workspaceRoot "apps\customer_app")
    try {
      & $puro flutter test
    } finally {
      Pop-Location
    }

    Write-Host "5/5 Driver Flutter widget tests"
    Push-Location (Join-Path $workspaceRoot "apps\driver_app")
    try {
      & $puro flutter test
    } finally {
      Pop-Location
    }
  } else {
    Write-Warning "Puro was not found at the expected path. Skipping Flutter widget tests."
  }

  Write-Host "Version 1 verification completed successfully."
} finally {
  Pop-Location
}
