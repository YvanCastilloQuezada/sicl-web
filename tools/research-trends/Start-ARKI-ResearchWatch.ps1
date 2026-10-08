param([string]$RepoRoot = "")
$ErrorActionPreference = "Stop"
try {
  # The launcher uses the script directory to avoid Windows argv quoting of a
  # root path ending in a backslash (e.g. -RepoRoot "C:\\repo\\").
  if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
    $RepoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).ProviderPath
  } else {
    $RepoRoot = $RepoRoot.Trim().Trim('"')
  }
  $RepoRoot = [IO.Path]::GetFullPath($RepoRoot)
  if (-not (Test-Path -LiteralPath $RepoRoot -PathType Container)) {
    throw "Directorio del repositorio no existe: $RepoRoot"
  }
  Write-Host "REPO_ROOT=$RepoRoot"
  $python = Get-Command python -ErrorAction SilentlyContinue
  if (-not $python) { throw "Python 3.10+ no encontrado. Usa el workflow de GitHub Actions o instala Python." }
  $root = Join-Path ([Environment]::GetFolderPath("LocalApplicationData")) "ARKI\ResearchTrends"
  $prior = Join-Path $root "previous\snapshot.json"
  $output = Join-Path $root "latest"
  [IO.Directory]::CreateDirectory($output) | Out-Null
  $script = Join-Path $RepoRoot "tools\research-trends\watch.py"
  $sources = Join-Path $RepoRoot "tools\research-trends\sources.json"
  $canonical = Join-Path $RepoRoot "docs\arki-master-map\ARKI_MASTER_MAP_STATE.json"
  foreach ($required in @($script, $sources, $canonical)) {
    if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
      throw "Archivo requerido no encontrado: $required"
    }
  }
  Write-Host "PYTHON=$($python.Source)"
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
