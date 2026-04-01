param(
    [Parameter(Mandatory = $true)]
    [string]$BackendBaseUrl,

    [Parameter(Mandatory = $false)]
    [string]$FrontendUrl
)

Write-Host "Checking backend health..." -ForegroundColor Cyan
$health = Invoke-RestMethod -Uri "$BackendBaseUrl/api/v1/health" -Method Get
Write-Host "Health: $health" -ForegroundColor Green

Write-Host "Checking stacks endpoint..." -ForegroundColor Cyan
$stacks = Invoke-RestMethod -Uri "$BackendBaseUrl/api/v1/stacks" -Method Get
Write-Host "Stacks count: $($stacks.Count)" -ForegroundColor Green

if ($stacks.Count -gt 0) {
    $stackId = $stacks[0].id
    Write-Host "Checking steps endpoint with stackId=$stackId..." -ForegroundColor Cyan
    $steps = Invoke-RestMethod -Uri "$BackendBaseUrl/api/v1/steps?stackId=$stackId" -Method Get
    Write-Host "Steps count: $($steps.Count)" -ForegroundColor Green
}

if ($FrontendUrl) {
    Write-Host "Checking frontend URL..." -ForegroundColor Cyan
    try {
        $frontendResponse = Invoke-WebRequest -Uri $FrontendUrl -Method Get
        Write-Host "Frontend status: $($frontendResponse.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "Frontend check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "Deployment verification completed." -ForegroundColor Green
