param(
  [string]$OutputRoot = (Join-Path (Get-Location) "qa-runs"),
  [string]$Serial = "",
  [int]$LogcatLines = 5000
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[MiLukita QA] $Message"
}

$adbCommand = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adbCommand) {
  throw "ADB is not available in PATH."
}
$adbPath = $adbCommand.Source

$raw = & adb devices
$devices = @()
foreach ($line in $raw) {
  if ($line -match '^\s*([^\s]+)\s+(device|unauthorized|offline)\s*$') {
    $devices += [pscustomobject]@{
      Serial = $Matches[1]
      State  = $Matches[2]
    }
  }
}

if ($Serial) {
  $selected = $devices | Where-Object { $_.Serial -eq $Serial } | Select-Object -First 1
  if (-not $selected) {
    throw "Device '$Serial' was not found in adb devices."
  }
  if ($selected.State -ne "device") {
    throw "Device '$Serial' state is '$($selected.State)'."
  }
  $selectedSerial = $Serial
}
else {
  $ready = @($devices | Where-Object { $_.State -eq "device" })
  if ($ready.Count -eq 0) {
    $states = ($devices | ForEach-Object { "$($_.Serial)=$($_.State)" }) -join ", "
    throw "No authorized ADB device is available. Detected: $states"
  }
  if ($ready.Count -gt 1) {
    $list = ($ready | ForEach-Object { $_.Serial }) -join ", "
    throw "More than one authorized device is connected ($list). Run again with -Serial <serial>."
  }
  $selectedSerial = $ready[0].Serial
}

function Invoke-AdbText {
  param([Parameter(Mandatory=$true)][string[]]$Arguments)
  return & adb -s $selectedSerial @Arguments
}

function Get-Prop {
  param([string]$Name)
  return ((Invoke-AdbText -Arguments @("shell","getprop",$Name)) | Out-String).Trim()
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$runDir = Join-Path $OutputRoot $timestamp
New-Item -ItemType Directory -Force -Path $runDir | Out-Null

Write-Step "Device: $selectedSerial"
Write-Step "Output: $runDir"

$manufacturer = Get-Prop "ro.product.manufacturer"
$model        = Get-Prop "ro.product.model"
$deviceName   = Get-Prop "ro.product.device"
$android      = Get-Prop "ro.build.version.release"
$sdk          = Get-Prop "ro.build.version.sdk"
$buildId      = Get-Prop "ro.build.id"
$securityPatch= Get-Prop "ro.build.version.security_patch"
$fingerprint  = Get-Prop "ro.build.fingerprint"

$wmSize    = ((Invoke-AdbText -Arguments @("shell","wm","size")) | Out-String).Trim()
$wmDensity = ((Invoke-AdbText -Arguments @("shell","wm","density")) | Out-String).Trim()
$battery   = ((Invoke-AdbText -Arguments @("shell","dumpsys","battery")) | Out-String)
$storage   = ((Invoke-AdbText -Arguments @("shell","df","-h","/data")) | Out-String)
$network   = ((Invoke-AdbText -Arguments @("shell","ip","addr","show","wlan0")) | Out-String)

try {
  $focus = ((Invoke-AdbText -Arguments @("shell","dumpsys","window","windows")) |
    Select-String -Pattern "mCurrentFocus|mFocusedApp" | Out-String)
}
catch {
  $focus = "Unable to read current focus: $($_.Exception.Message)"
}

@"
MiLukita Device Lab - Android QA Run
Timestamp: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz")
Serial: $selectedSerial
Manufacturer: $manufacturer
Model: $model
Device: $deviceName
Android: $android
SDK: $sdk
Build ID: $buildId
Security patch: $securityPatch
Fingerprint: $fingerprint
ADB path: $adbPath
"@ | Set-Content -Encoding UTF8 (Join-Path $runDir "device-info.txt")

$wmSize    | Set-Content -Encoding UTF8 (Join-Path $runDir "screen-size.txt")
$wmDensity | Set-Content -Encoding UTF8 (Join-Path $runDir "screen-density.txt")
$battery   | Set-Content -Encoding UTF8 (Join-Path $runDir "battery.txt")
$storage   | Set-Content -Encoding UTF8 (Join-Path $runDir "storage.txt")
$network   | Set-Content -Encoding UTF8 (Join-Path $runDir "network-wlan0.txt")
$focus     | Set-Content -Encoding UTF8 (Join-Path $runDir "current-focus.txt")

Write-Step "Capturing screenshot..."
$screenshotPath = Join-Path $runDir "screenshot.png"

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $adbPath
$psi.Arguments = "-s `"$selectedSerial`" exec-out screencap -p"
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true

$p = New-Object System.Diagnostics.Process
$p.StartInfo = $psi
[void]$p.Start()

$fs = [System.IO.File]::Open(
  $screenshotPath,
  [System.IO.FileMode]::Create,
  [System.IO.FileAccess]::Write
)
try {
  $p.StandardOutput.BaseStream.CopyTo($fs)
}
finally {
  $fs.Dispose()
}

$stderr = $p.StandardError.ReadToEnd()
$p.WaitForExit()

if ($p.ExitCode -ne 0) {
  throw "Screenshot failed. adb exit code $($p.ExitCode). $stderr"
}

if (-not (Test-Path $screenshotPath) -or (Get-Item $screenshotPath).Length -eq 0) {
  throw "Screenshot file was not created or is empty."
}

Write-Step "Collecting logcat..."
$logcatPath = Join-Path $runDir "logcat.txt"
try {
  Invoke-AdbText -Arguments @("logcat","-d","-t",$LogcatLines.ToString()) |
    Set-Content -Encoding UTF8 $logcatPath
}
catch {
  "Unable to collect logcat: $($_.Exception.Message)" |
    Set-Content -Encoding UTF8 $logcatPath
}

$summary = [ordered]@{
  schema               = "milukita.device-lab.android-qa.v0.1"
  timestamp            = (Get-Date).ToString("o")
  serial               = $selectedSerial
  manufacturer         = $manufacturer
  model                = $model
  device               = $deviceName
  android_version      = $android
  sdk                  = $sdk
  build_id             = $buildId
  security_patch       = $securityPatch
  fingerprint          = $fingerprint
  screen_size_raw      = $wmSize
  screen_density_raw   = $wmDensity
  adb_path             = $adbPath
  result               = "FUNCTIONAL"
  physical_device_test = "PASS"
  evidence             = [ordered]@{
    device_info    = "device-info.txt"
    screen_size    = "screen-size.txt"
    screen_density = "screen-density.txt"
    battery        = "battery.txt"
    storage        = "storage.txt"
    network_wlan0  = "network-wlan0.txt"
    current_focus  = "current-focus.txt"
    screenshot     = "screenshot.png"
    logcat         = "logcat.txt"
  }
}

$summary | ConvertTo-Json -Depth 6 |
  Set-Content -Encoding UTF8 (Join-Path $runDir "summary.json")

$manifest = Get-ChildItem -File $runDir |
  Where-Object { $_.Name -ne "manifest-sha256.json" } |
  Sort-Object Name |
  ForEach-Object {
    $hash = Get-FileHash -Algorithm SHA256 $_.FullName
    [pscustomobject]@{
      file   = $_.Name
      sha256 = $hash.Hash.ToLower()
      bytes  = $_.Length
    }
  }

$manifest | ConvertTo-Json -Depth 4 |
  Set-Content -Encoding UTF8 (Join-Path $runDir "manifest-sha256.json")

Write-Host ""
Write-Host "=== MiLukita Device Lab - Android Node v0.1 ==="
Write-Host "STATUS: FUNCTIONAL"
Write-Host "PHYSICAL DEVICE TEST: PASS"
Write-Host "Serial: $selectedSerial"
Write-Host "Model: $manufacturer $model"
Write-Host "Android: $android (SDK $sdk)"
Write-Host "Evidence: $runDir"
Write-Host ""
Write-Host "No APKs were installed and no device settings were changed."
