param(
  [Parameter(Mandatory = $false)]
  [string]$RepoRoot = ""
)
$ErrorActionPreference = "Stop"
try {
  if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
    $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
  }
  $RepoRoot = [IO.Path]::GetFullPath($RepoRoot)
  $statePath = Join-Path $RepoRoot "docs\arki-master-map\ARKI_MASTER_MAP_STATE.json"
  $templatePath = Join-Path $PSScriptRoot "maqueta-viva.template.html"
  $launcherPath = Join-Path $RepoRoot "ARKI-MAQUETA-VIVA.cmd"
  $registryPath = Join-Path $PSScriptRoot "assembly-registry.json"

  foreach ($path in @($statePath, $templatePath, $launcherPath, $registryPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
      throw "Falta archivo necesario: $path"
    }
  }

  $json = [IO.File]::ReadAllText($statePath, [Text.Encoding]::UTF8)
  $parsed = $json | ConvertFrom-Json
  if (-not $parsed.roadmap -or -not $parsed.roadmap.phases) {
    throw "El Estado Estructurado no tiene roadmap.phases."
  }
  $template = [IO.File]::ReadAllText($templatePath, [Text.Encoding]::UTF8)
  $token = "__ARKI_STATE_JSON__"
  if (-not $template.Contains($token)) { throw "Plantilla sin marcador de datos." }

  # Embed JSON as inert text; never allow source text to close its script element.
  $safeJson = $json.Replace("&", "\u0026").Replace("<", "\u003c").Replace(">", "\u003e")
  $registryJson = [IO.File]::ReadAllText($registryPath, [Text.Encoding]::UTF8)
  $registry = $registryJson | ConvertFrom-Json
  if ($registry.schema -ne "ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1" -or @($registry.ideas).Count -eq 0) {
    throw "Registro de piezas invalido."
  }
  $registryToken = "__ARKI_ASSEMBLY_JSON__"
  if (-not $template.Contains($registryToken)) { throw "Plantilla sin marcador de piezas." }
  $safeRegistry = $registryJson.Replace("&", "\u0026").Replace("<", "\u003c").Replace(">", "\u003e")
  $page = $template.Replace($token, $safeJson).Replace($registryToken, $safeRegistry)
  $outputDir = Join-Path ([Environment]::GetFolderPath("LocalApplicationData")) "ARKI\MaquetaViva"
  [IO.Directory]::CreateDirectory($outputDir) | Out-Null
  $output = Join-Path $outputDir "index.html"
  [IO.File]::WriteAllText($output, $page, (New-Object Text.UTF8Encoding($false)))

  # The first launch installs a desktop shortcut; subsequent launches just open the page.
  try {
    $desktop = [Environment]::GetFolderPath("DesktopDirectory")
    if (-not [string]::IsNullOrWhiteSpace($desktop)) {
      $shortcutPath = Join-Path $desktop "ARKI - Maqueta Viva.lnk"
      if (-not (Test-Path -LiteralPath $shortcutPath)) {
        $shell = New-Object -ComObject WScript.Shell
        $shortcut = $shell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $launcherPath
        $shortcut.WorkingDirectory = $RepoRoot
        $shortcut.Description = "Abre ARKI Maqueta Viva con el estado local del proyecto"
        $shortcut.IconLocation = "$env:SystemRoot\System32\shell32.dll,14"
        $shortcut.Save()
        Write-Host "ACCESO_DIRECTO_CREADO=$shortcutPath"
      }
    }
  } catch {
    Write-Warning "No se pudo crear el acceso directo; la pagina sigue disponible: $($_.Exception.Message)"
  }

  Write-Host "ARKI_MAQUETA_VIVA=READY"
  Write-Host "STATE_DATE=$($parsed.updated_at)"
  Write-Host "STATE_PHASES=$(@($parsed.roadmap.phases).Count)"
  Write-Host "ASSEMBLY_IDEAS=$(@($registry.ideas).Count)"
  Write-Host "OUTPUT=$output"
  Start-Process -FilePath $output
} catch {
  Write-Error "ARKI_MAQUETA_VIVA_FAILED: $($_.Exception.Message)"
  exit 1
}
