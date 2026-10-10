# ARKI Árbol Vivo — watcher explícito, de solo lectura.
# Ejecutar en la copia experimental: pwsh -File .\tools\maqueta-viva\Watch-ARKI-ArbolVivo.ps1
param([ValidateRange(60,86400)][int]$IntervalSeconds = 300)
$ErrorActionPreference = "Stop"
$Repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$Branch = "docs/av-ui-001-preparation-20261010"
$Experiment = "refs/remotes/origin/$Branch"
$Canonical = "refs/remotes/origin/main"
Set-Location $Repo
$remote = (& git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $remote -notmatch 'YvanCastilloQuezada/sicl-web') { throw "Remote no autorizado: $remote" }
Write-Host "ARKI LIVE WATCH: solo lectura; intervalo $IntervalSeconds segundos. Ctrl+C para detener."
$last = ""
while ($true) {
  try {
    & git fetch origin "+refs/heads/${Branch}:${Experiment}" "+refs/heads/main:${Canonical}"
    if ($LASTEXITCODE -ne 0) { throw "Git fetch falló" }
    $experimentalSha = (& git rev-parse $Experiment).Trim()
    $stateSha = (& git rev-parse "${Canonical}:docs/arki-master-map/ARKI_MASTER_MAP_STATE.json").Trim()
    $registrySha = (& git rev-parse "${Experiment}:tools/maqueta-viva/assembly-registry.json").Trim()
    if ($LASTEXITCODE -ne 0) { throw "No se pudieron resolver fuentes" }
    $fingerprint = "$experimentalSha/$stateSha/$registrySha"
    if ($fingerprint -ne $last) {
      $head = (& git rev-parse HEAD).Trim()
      if ($head -ne $experimentalSha) {
        Write-Warning "El checkout local no está actualizado. Para actualizarlo sin sobrescribir cambios, detén el watcher, verifica git status y cambia al SHA $experimentalSha."
      } else {
        & pwsh -NoProfile -File (Join-Path $PSScriptRoot "Install-ARKI-ArbolVivo.ps1")
        if ($LASTEXITCODE -ne 0) { throw "Instalación o pruebas fallaron; no se acredita sincronización" }
        $last = $fingerprint
        Write-Host "SYNC_OK experimental=$($experimentalSha.Substring(0,8)) state=$($stateSha.Substring(0,8))"
      }
    } else { Write-Host "SIN_CAMBIOS $(Get-Date -Format s)" }
  } catch { Write-Warning "SYNC_FAILED: $_" }
  Start-Sleep -Seconds $IntervalSeconds
}
