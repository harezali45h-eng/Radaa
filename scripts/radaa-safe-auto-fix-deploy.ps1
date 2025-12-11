param(
    [string]$Branch = "deploy"
)

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  RADAA SAFE AUTO-FIX & DEPLOY " -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$root = "C:\Users\wesley\Desktop\Radaa"
$frontend = Join-Path $root "radaa-frontend"
$backend = Join-Path $root "backend"

function Get-EnvFile {
    param(
        [string]$BasePath
    )

    $envFile = Join-Path $BasePath ".env"
    $envProdFile = Join-Path $BasePath ".env.production"

    if ($env:NODE_ENV -eq "production" -and (Test-Path $envProdFile)) {
        return $envProdFile
    }

    if (Test-Path $envFile) {
        return $envFile
    }

    if (Test-Path $envProdFile) {
        return $envProdFile
    }

    return $envFile
}

function Parse-EnvFile {
    param(
        [string]$Path
    )

    $dict = @{}

    if (-not (Test-Path $Path)) {
        return $dict
    }

    Get-Content $Path | Where-Object {
        $_ -match "=" -and -not $_.TrimStart().StartsWith("#")
    } | ForEach-Object {
        $parts = $_ -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1]
            if ($key) { $dict[$key] = $value }
        }
    }

    return $dict
}

function Ensure-EnvKeys {
    param(
        [string]$Path,
        [hashtable]$Dict,
        [string[]]$KeysToEnsure,
        [ref]$AddedKeys
    )

    $lines = @()
    if (Test-Path $Path) {
        $lines = Get-Content $Path
    }

    foreach ($key in $KeysToEnsure) {
        if (-not $Dict.ContainsKey($key)) {
            $placeholder = "# TODO: set real value"
            $line = "$key=$placeholder"
            Add-Content -Path $Path -Value $line
            $AddedKeys.Value.Add($key) | Out-Null
        }
    }
}

# ===============================
# 1️⃣ Backend
# ===============================
Write-Host "`n[Backend] Checking env files..." -ForegroundColor Yellow

$backendEnvPath = Get-EnvFile -BasePath $backend

if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Creating backend env file: $backendEnvPath" -ForegroundColor Yellow
    New-Item -ItemType File -Path $backendEnvPath -Force | Out-Null
}

$backendEnv = Parse-EnvFile -Path $backendEnvPath

$backendRequiredEitherMongo = @("MONGO_URI", "MONGODB_URI")
$backendRequired = @("JWT_SECRET","MPESA_CONSUMER_KEY","MPESA_CONSUMER_SECRET","MPESA_SHORTCODE","MPESA_PASSKEY")
$backendOptional = @("MPESA_CALLBACK_URL","MPESA_ENV","IMAGE_CDN_BASE","IMAGE_CDN_KEY","IMAGE_CDN_SECRET")

$backendAddedKeys = New-Object System.Collections.Generic.List[string]

# Ensure Mongo key placeholder if neither exists
if (-not ($backendEnv.Keys | Where-Object { $backendRequiredEitherMongo -contains $_ })) {
    $mongoKey = "MONGO_URI"
    Add-Content -Path $backendEnvPath -Value "$mongoKey=# TODO: set Mongo connection string"
    $backendAddedKeys.Add($mongoKey) | Out-Null
}

# Ensure other required + optional keys exist (with placeholders)
$backendAllToEnsure = $backendRequired + $backendOptional
Ensure-EnvKeys -Path $backendEnvPath -Dict $backendEnv -KeysToEnsure $backendAllToEnsure -AddedKeys ([ref]$backendAddedKeys)

# Re-parse after insertion
$backendEnv = Parse-EnvFile -Path $backendEnvPath

# Validate Mongo
if (-not ($backendEnv.Keys | Where-Object { $backendRequiredEitherMongo -contains $_ })) {
    Write-Host "ERROR: Backend Mongo key still missing after placeholder insertion." -ForegroundColor Red
    exit 1
}

# Validate required keys
$backendMissing = $backendRequired | Where-Object { -not $backendEnv.ContainsKey($_) }
if ($backendMissing.Count -gt 0) {
    Write-Host "ERROR: Backend required keys missing even after insertion: $($backendMissing -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "Backend env validation OK." -ForegroundColor Green

# Backend npm install
Write-Host "`n[Backend] Installing npm dependencies..." -ForegroundColor Yellow
Push-Location $backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend npm install failed." -ForegroundColor Red
    Pop-Location
    exit 1
}

# Backend tests
Write-Host "`n[Backend] Running tests (test:mongo, test:integration)..." -ForegroundColor Yellow

npm run test:mongo
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm run test:mongo failed." -ForegroundColor Red
    Pop-Location
    exit 1
}

# Start backend server for integration tests
$backendPort = if ($backendEnv.ContainsKey("PORT")) { $backendEnv["PORT"] } else { "5001" }
Write-Host "Starting backend server on port $backendPort for integration tests..." -ForegroundColor Yellow

$serverProcess = Start-Process "node" "app.js" -PassThru

# Wait for health endpoint to be ready
$maxAttempts = 30
$healthOk = $false
for ($i = 0; $i -lt $maxAttempts; $i++) {
    try {
        $healthUrl = "http://localhost:$backendPort/api/health"
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $healthOk = $true
            break
        }
    } catch {
        # ignore and retry
    }
    Start-Sleep -Seconds 1
}

if (-not $healthOk) {
    Write-Host "ERROR: Backend health check failed; server did not become ready on port $backendPort." -ForegroundColor Red
    if ($serverProcess -and -not $serverProcess.HasExited) {
        $serverProcess | Stop-Process -Force
    }
    Pop-Location
    exit 1
}

Write-Host "Backend health check passed; running integration tests..." -ForegroundColor Green

npm run test:integration
$integrationExit = $LASTEXITCODE

if ($serverProcess -and -not $serverProcess.HasExited) {
    $serverProcess | Stop-Process -Force
}

if ($integrationExit -ne 0) {
    Write-Host "ERROR: npm run test:integration failed." -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host "Backend tests passed." -ForegroundColor Green

# ===============================
# 2️⃣ Frontend
# ===============================
Write-Host "`n[Frontend] Checking env files..." -ForegroundColor Yellow

$frontendEnvPath = Join-Path $frontend ".env"
if (-not (Test-Path $frontendEnvPath)) {
    Write-Host "Creating frontend env file: $frontendEnvPath" -ForegroundColor Yellow
    New-Item -ItemType File -Path $frontendEnvPath -Force | Out-Null
}

$frontendEnv = Parse-EnvFile -Path $frontendEnvPath

$frontendRequiredSocket = "NEXT_PUBLIC_SOCKET_URL"
$frontendApiEither = @("NEXT_PUBLIC_API_BASE_URL", "NEXT_PUBLIC_API_URL")
$frontendOptional = @("NEXT_PUBLIC_APP_ENV","NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")

$frontendAddedKeys = New-Object System.Collections.Generic.List[string]

# Ensure socket URL placeholder
if (-not $frontendEnv.ContainsKey($frontendRequiredSocket)) {
    Add-Content -Path $frontendEnvPath -Value "$frontendRequiredSocket=# TODO: set socket URL"
    $frontendAddedKeys.Add($frontendRequiredSocket) | Out-Null
}

# Ensure at least one API key; prefer NEXT_PUBLIC_API_BASE_URL
if (-not ($frontendEnv.Keys | Where-Object { $frontendApiEither -contains $_ })) {
    $apiKey = "NEXT_PUBLIC_API_BASE_URL"
    Add-Content -Path $frontendEnvPath -Value "$apiKey=# TODO: set API base URL"
    $frontendAddedKeys.Add($apiKey) | Out-Null
}

# Ensure optional keys exist with placeholders
Ensure-EnvKeys -Path $frontendEnvPath -Dict $frontendEnv -KeysToEnsure $frontendOptional -AddedKeys ([ref]$frontendAddedKeys)

# Re-parse
$frontendEnv = Parse-EnvFile -Path $frontendEnvPath

# Validate socket URL
if (-not $frontendEnv.ContainsKey($frontendRequiredSocket)) {
    Write-Host "ERROR: NEXT_PUBLIC_SOCKET_URL missing even after insertion." -ForegroundColor Red
    exit 1
}

# Validate API key presence
if (-not ($frontendEnv.Keys | Where-Object { $frontendApiEither -contains $_ })) {
    Write-Host "ERROR: No API base URL key (NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL) present even after insertion." -ForegroundColor Red
    exit 1
}

# Warnings for optional keys that were auto-added as placeholders
$frontendWarnAdded = $frontendAddedKeys | Where-Object { $frontendOptional -contains $_ }
if ($frontendWarnAdded.Count -gt 0) {
    Write-Host "WARNING: Optional frontend keys were missing and placeholders were added: $($frontendWarnAdded -join ', ')" -ForegroundColor Yellow
}

Write-Host "Frontend env validation OK." -ForegroundColor Green

# Frontend npm install
Write-Host "`n[Frontend] Installing npm dependencies..." -ForegroundColor Yellow
Push-Location $frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend npm install failed." -ForegroundColor Red
    Pop-Location
    exit 1
}

# tsconfig check
$tsconfigPath = Join-Path $frontend "tsconfig.json"
if (-not (Test-Path $tsconfigPath)) {
    Write-Host "ERROR: tsconfig.json missing in frontend." -ForegroundColor Red
    Pop-Location
    exit 1
}

$tsconfig = Get-Content $tsconfigPath | ConvertFrom-Json
if (-not $tsconfig.compilerOptions.paths."@/*") {
    Write-Host "ERROR: tsconfig.json missing '@/*' path alias." -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "tsconfig path alias '@/*' OK." -ForegroundColor Green

# Frontend build
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed." -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host "Frontend build passed." -ForegroundColor Green

# ===============================
# 3️⃣ Git commit & push
# ===============================
Write-Host "`n[Git] Committing and pushing changes..." -ForegroundColor Yellow
Push-Location $root

$changes = git status --porcelain
if ($changes) {
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $message = "Full env auto-populate & safe deploy - $timestamp"
    git commit -m $message
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Git commit failed." -ForegroundColor Red
        Pop-Location
        exit 1
    }

    git push origin $Branch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Git push failed." -ForegroundColor Red
        Pop-Location
        exit 1
    }

    Write-Host "Git commit and push to branch '$Branch' completed." -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor Green
}

Pop-Location

# ===============================
# 4️⃣ Summary Output
# ===============================
Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host "  RADAA SAFE AUTO-FIX & DEPLOY COMPLETE  " -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Write-Host "`n[Summary]" -ForegroundColor Cyan
Write-Host "- Backend env file: $backendEnvPath" -ForegroundColor Gray
if ($backendAddedKeys.Count -gt 0) {
    Write-Host "- Backend keys added: $($backendAddedKeys -join ', ')" -ForegroundColor Gray
} else {
    Write-Host "- Backend keys added: none" -ForegroundColor Gray
}

Write-Host "- Frontend env file: $frontendEnvPath" -ForegroundColor Gray
if ($frontendAddedKeys.Count -gt 0) {
    Write-Host "- Frontend keys added: $($frontendAddedKeys -join ', ')" -ForegroundColor Gray
} else {
    Write-Host "- Frontend keys added: none" -ForegroundColor Gray
}

Write-Host "- Backend tests: PASSED" -ForegroundColor Gray
Write-Host "- Frontend build: PASSED" -ForegroundColor Gray
Write-Host "- Git branch: $Branch" -ForegroundColor Gray
