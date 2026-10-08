param([string]$RepoRoot = "")
$ErrorActionPreference = "Stop"
try {
  if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
    $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
  }
  $RepoRoot = [IO.Path]::GetFullPath($RepoRoot)
  $python = Get-Command python -ErrorAction SilentlyContinue
  if (-not $python) { throw "Python 3.10+ no encontrado. Usa el workflow de GitHub Actions o instala Python." }
  $root = Join-Path ([Environment]::GetFolderPath("LocalApplicationData")) "ARKI\ResearchTrends"
  $prior = Join-Path $root "previous\snapshot.json"
  $output = Join-Path $root "latest"
  [IO.Directory]::CreateDirectory($output) | Out-Null
  $script = Join-Path $RepoRoot "tools\research-trends\watch.py"
  $sources = Join-Path $RepoRoot "tools\research-trends\sources.json"
  $canonical = Join-Path $RepoRoot "docs\arki-master-map\ARKI_MASTER_MAP_STATE.json"
  & $python.Source $script --sources $sources --canonical $canonical --previous $prior --out-dir $output
  $code = $LASTEXITCODE
  $report = Join-Path $output "report.json"
  $snapshot = Join-Path $output "snapshot.json"
  if (Test-Path -LiteralPath $snapshot -PathType Leaf) {
    $priorDir = Split-Path $prior
    [IO.Directory]::CreateDirectory($priorDir) | Out-Null
    Copy-Item -LiteralPath $snapshot -Destination $prior -Force
    Write-Host "OBSERVATION_SNAPSHOT=UPDATED (fuentes fallidas conservan última versión conocida)"
  }
  if ($code -eq 0) {
    Write-Host "RESEARCH_WATCH=COMPLETE"
  } else {
    Write-Warning "RESEARCH_WATCH=INCOMPLETE (exit $code); revisar SOURCE_ERROR en report.json."
  }
  Write-Host "REPORT=$report"
  Write-Host "IMPORT_IN_MAQUETA=Research & Trends > Importar informe > report.json"
  if ($code -ne 0) { exit $code }
} catch {
  Write-Error "ARKI_RESEARCH_WATCH_FAILED: $($_.Exception.Message)"
  exit 1
}
