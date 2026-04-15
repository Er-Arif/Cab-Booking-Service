$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:4000"

function Step($message) {
  Write-Host ""
  Write-Host "=== $message ===" -ForegroundColor Cyan
}

function PostJson($path, $body, $token = $null) {
  $headers = @{}
  if ($token) {
    $headers["Authorization"] = "Bearer $token"
  }

  return Invoke-RestMethod `
    -Method Post `
    -Uri "$baseUrl$path" `
    -Headers $headers `
    -ContentType "application/json" `
    -Body ($body | ConvertTo-Json -Depth 10)
}

function PatchJson($path, $body, $token) {
  $headers = @{
    Authorization = "Bearer $token"
  }

  return Invoke-RestMethod `
    -Method Patch `
    -Uri "$baseUrl$path" `
    -Headers $headers `
    -ContentType "application/json" `
    -Body ($body | ConvertTo-Json -Depth 10)
}

function GetJson($path, $token) {
  $headers = @{
    Authorization = "Bearer $token"
  }

  return Invoke-RestMethod `
    -Method Get `
    -Uri "$baseUrl$path" `
    -Headers $headers
}

function GetToken($phone, $role) {
  PostJson "/api/auth/send-otp" @{ phone = $phone } | Out-Null
  $auth = PostJson "/api/auth/verify-otp" @{
    phone = $phone
    otp = "123456"
    role = $role
  }
  return $auth.token
}

Step "Health check"
$health = Invoke-RestMethod -Method Get -Uri "$baseUrl/health"
$health | ConvertTo-Json -Depth 5

Step "Authenticate customer, driver, and admin"
$customerToken = GetToken "9000000002" "customer"
$driverToken = GetToken "9000000003" "driver"
$adminToken = GetToken "9000000001" "admin"
Write-Host "Customer, driver, and admin tokens acquired." -ForegroundColor Green

Step "Estimate fare"
$fareEstimate = PostJson "/api/pricing/estimate" @{
  pickup = @{
    latitude = 24.2733
    longitude = 86.6467
  }
  drop = @{
    latitude = 24.2714
    longitude = 86.6395
  }
  categoryKey = "bike"
}
$fareEstimate | ConvertTo-Json -Depth 6

Step "Create booking"
$rideResponse = PostJson "/api/rides" @{
  categoryKey = "bike"
  pickupAddress = "Madhupur Railway Station"
  dropAddress = "Main Market"
  pickup = @{
    latitude = 24.2733
    longitude = 86.6467
  }
  drop = @{
    latitude = 24.2714
    longitude = 86.6395
  }
  paymentMethod = "cash"
} $customerToken
$rideId = $rideResponse.ride.id
Write-Host "Created ride: $rideId" -ForegroundColor Green
$rideResponse | ConvertTo-Json -Depth 8

Step "Check driver requests"
$driverRequests = GetJson "/api/driver/requests" $driverToken
$driverRequests | ConvertTo-Json -Depth 8

Step "Advance ride lifecycle"
$statuses = @(
  "driver_arriving",
  "driver_arrived",
  "trip_started",
  "trip_completed"
)

foreach ($status in $statuses) {
  $statusResult = PatchJson "/api/rides/$rideId/status" @{ status = $status } $driverToken
  Write-Host "Updated status to $status" -ForegroundColor Yellow
  $statusResult | ConvertTo-Json -Depth 8
}

Step "Record payment"
$paymentResult = PatchJson "/api/rides/$rideId/payment" @{} $driverToken
$paymentResult | ConvertTo-Json -Depth 8

Step "Check customer history"
$customerHistory = GetJson "/api/customer/rides/history" $customerToken
$customerHistory | ConvertTo-Json -Depth 8

Step "Check driver earnings and history"
$driverEarnings = GetJson "/api/driver/earnings" $driverToken
$driverHistory = GetJson "/api/driver/history" $driverToken
$driverEarnings | ConvertTo-Json -Depth 8
$driverHistory | ConvertTo-Json -Depth 8

Step "Check admin dashboard and reports"
$adminDashboard = GetJson "/api/admin/dashboard" $adminToken
$adminRides = GetJson "/api/admin/rides" $adminToken
$adminReports = GetJson "/api/admin/reports/summary" $adminToken
$adminDashboard | ConvertTo-Json -Depth 8
$adminRides | ConvertTo-Json -Depth 8
$adminReports | ConvertTo-Json -Depth 8

Step "Raise and resolve complaint"
$complaint = PostJson "/api/customer/complaints" @{
  rideId = $rideId
  complaintType = "overcharge"
  description = "Need fare clarification for this ride."
} $customerToken
$complaintId = $complaint.id
Write-Host "Created complaint: $complaintId" -ForegroundColor Yellow

$complaintsBefore = GetJson "/api/admin/complaints" $adminToken
$complaintsBefore | ConvertTo-Json -Depth 8

$resolvedComplaint = PatchJson "/api/admin/complaints/$complaintId" @{
  resolutionStatus = "resolved"
  resolutionNote = "Fare verified and clarified to customer."
} $adminToken
$resolvedComplaint | ConvertTo-Json -Depth 8

Step "Demo flow completed"
Write-Host "Ride flow, payment, admin reporting, and complaint handling all executed." -ForegroundColor Green
