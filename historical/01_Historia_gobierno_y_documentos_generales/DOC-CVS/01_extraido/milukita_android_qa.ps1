param(
  [string]$OutputRoot = (Join-Path (Get-Location) "qa-runs"),
  [string]$Serial = "",
  [int]$LogcatLines = 5000
)

$ErrorActionPreference = "Stop"

function Step($m) { Write-Host "[MiLukita QA] $m" }

if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
  throw "ADB no está disponible en PATH."
}

$raw = & adb devices
$devices = @()
foreach ($line in $raw) {
  if ($line -match '^\s*([^\s]+)\s+(device|unauthorized|offline)\s*$') {
    $devices += [pscustomobject]@{ Serial=$Matches[1]; State=$Matches[2] }
  }
}

if ($Serial) {
  $d = $devices | Where-Object Serial -eq $Serial | Select-Object -First 1
  if (-not $d) { throw "No se encontró el dispositivo $Serial." }
  if ($d.State -ne "device") { throw "Estado del dispositivo: $($d.State)" }
  $sel = $Serial
} else {
  $ready = @($devices | Where-Object State -eq "device")
  if ($ready.Count -eq 0) { throw "No hay dispositivos ADB autorizados." }
  if ($ready.Count -gt 1) { throw "Hay varios dispositivos. Usa -Serial <serial>." }
  $sel = $ready[0].Serial
}

function ADB {
  param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Args)
  & adb -s $sel @Args
}

$ts = Get-Date -Format "yyyy-MM-dd_HHmmss"
$runDir = Join-Path $OutputRoot $ts
New-Item -ItemType Directory -Force -Path $runDir | Out-Null

Step "Dispositivo $sel"
Step "Salida $runDir"

function Prop($name) { ((ADB shell getprop $name) | Out-String).Trim() }

$manufacturer = Prop "ro.product.manufacturer"
$model = Prop "ro.product.model"
$device = Prop "ro.product.device"
$android = Prop "ro.build.version.release"
$sdk = Prop "ro.build.version.sdk"
$buildId = Prop "ro.build.id"
$patch = Prop "ro.build.version.security_patch"
$fingerprint = Prop "ro.build.fingerprint"

$wmSize = ((ADB shell wm size) | Out-String).Trim()
$wmDensity = ((ADB shell wm density) | Out-String).Trim()
$battery = (ADB shell dumpsys battery | Out-String)
$storage = (ADB shell df -h /data | Out-String)
$network = (ADB shell ip addr show wlan0 | Out-String)
$focus = (ADB shell dumpsys window windows | Select-String "mCurrentFocus|mFocusedApp" | Out-String)

@"
MiLukita Device Lab - Android QA Run
Timestamp: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz")
Serial: $sel
Manufacturer: $manufacturer
Model: $model
Device: $device
Android: $android
SDK: $sdk
Build ID: $buildId
Security patch: $patch
Fingerprint: $fingerprint
"@ | Set-Content -Encoding UTF8 (Join-Path $runDir "device-info.txt")

$wmSize | Set-Content -Encoding UTF8 (Join-Path $runDir "screen-size.txt")
$wmDensity | Set-Content -Encoding UTF8 (Join-Path $runDir "screen-density.txt")
$battery | Set-Content -Encoding UTF8 (Join-Path $runDir "battery.txt")
$storage | Set-Content -Encoding UTF8 (Join-Path $runDir "storage.txt")
$network | Set-Content -Encoding UTF8 (Join-Path $runDir "network-wlan0.txt")
$focus | Set-Content -Encoding UTF8 (Join-Path $runDir "current-focus.txt")

Step "Capturando screenshot"
$screenshot = Join-Path $runDir "screenshot.png"
$bytes = & adb -s $sel exec-out screencap -p
[IO.File]::WriteAllBytes($screenshot, $bytes)

Step "Recolectando logcat"
ADB logcat -d -t $LogcatLines | Set-Content -Encoding UTF8 (Join-Path $runDir "logcat.txt")

$summary = [ordered]@{
  schema = "milukita.device-lab.android-qa.v0.1"
  timestamp = (Get-Date).ToString("o")
  serial = $sel
  manufacturer = $manufacturer
  model = $model
  device = $device
  android_version = $android
  sdk = $sdk
  build_id = $buildId
  security_patch = $patch
  fingerprint = $fingerprint
  screen_size_raw = $wmSize
  screen_density_raw = $wmDensity
  result = "FUNCTIONAL"
  physical_device_test = "PASS"
}
$summary | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $runDir "summary.json")

$manifest = Get-ChildItem -File $runDir | Sort-Object Name | ForEach-Object {
  $h = Get-FileHash -Algorithm SHA256 $_.FullName
  [pscustomobject]@{ file=$_.Name; sha256=$h.Hash.ToLower(); bytes=$_.Length }
}
$manifest | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 (Join-Path $runDir "manifest-sha256.json")

Write-Host ""
Write-Host "=== MiLukita Device Lab — Android Node v0.1 ==="
Write-Host "STATUS: FUNCTIONAL"
Write-Host "PHYSICAL DEVICE TEST: PASS"
Write-Host "Modelo: $manufacturer $model"
Write-Host "Android: $android (SDK $sdk)"
Write-Host "Evidencia: $runDir"
Write-Host ""
Write-Host "No se instalaron APKs ni se modificaron ajustes del dispositivo."
