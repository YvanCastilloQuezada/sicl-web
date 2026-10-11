# ARKI AV-UI-001 local read-only installer.
# Run from any location: pwsh -File tools/maqueta-viva/Install-ARKI-ArbolVivo.ps1
# To preview a candidate: pwsh -File tools/maqueta-viva/Install-ARKI-ArbolVivo.ps1 -CandidateBranch feat/arbol-vivo-precedencias-seguras-20261010
param([string]$CandidateBranch = "docs/av-ui-001-preparation-20261010")
$ErrorActionPreference = "Stop"
$Repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if ($CandidateBranch -notmatch "^[A-Za-z0-9][A-Za-z0-9._/-]{0,150}$" -or $CandidateBranch.Contains("..") -or $CandidateBranch.Contains("//") -or $CandidateBranch.EndsWith("/")) { throw "Invalid branch" }
$Branch = $CandidateBranch
$Install = Join-Path $env:LOCALAPPDATA "ARKI\ArbolVivo"
$Ref = "refs/remotes/origin/$Branch"
Set-Location $Repo
$remote = (& git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $remote -notmatch 'YvanCastilloQuezada/sicl-web') { throw "Incorrect Git remote: $remote" }
$original = (& git rev-parse HEAD | Select-Object -First 1).Trim()
if ($LASTEXITCODE -ne 0 -or !$original) { throw "Cannot determine initial worktree HEAD" }
& git fetch origin "+refs/heads/${Branch}:${Ref}"
if ($LASTEXITCODE -ne 0) { throw "Failed to fetch experimental branch" }
$sha = (& git rev-parse $Ref).Trim()
if ($LASTEXITCODE -ne 0) { throw "Cannot resolve branch SHA" }
New-Item -ItemType Directory -Path $Install -Force | Out-Null
function Export-GitBlob([string]$Path,[string]$Destination) {
    $psi = [Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = "git"
    $psi.WorkingDirectory = $Repo
    $psi.ArgumentList.Add("show")
    $psi.ArgumentList.Add("${Ref}:${Path}")
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $process = [Diagnostics.Process]::Start($psi)
    try {
        $stream = [IO.File]::Create($Destination)
        try { $process.StandardOutput.BaseStream.CopyTo($stream) } finally { $stream.Dispose() }
        $err = $process.StandardError.ReadToEnd()
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) { throw "Git export failed for ${Path}: $err" }
    } finally { $process.Dispose() }
}
foreach($name in @("av-ui-001-readonly-prototype.html","av-ui-001-readonly-prototype.test.cjs","av-ui-001-dependency-fixture.json")) {
    Export-GitBlob "tools/maqueta-viva/$name" (Join-Path $Install $name)
}
$utf8 = [Text.UTF8Encoding]::new($false,$true)
$html = [IO.File]::ReadAllText((Join-Path $Install "av-ui-001-readonly-prototype.html"),$utf8)
if (!$html.Contains('id="selection-status"') -or !$html.Contains('id="tree"') -or !$html.Contains('id="twin-command-center"')) { throw "HTML integrity check failed: missing required structural IDs" }
if ($Branch -eq "feat/arbol-vivo-precedencias-seguras-20261010" -and (!$html.Contains('id="arki-tab-plan"') -or !$html.Contains('id="arki-tab-tree"') -or !$html.Contains('id="arki-tab-twin"') -or !$html.Contains('id="arki-tab-brain"') -or !$html.Contains('id="arki-tab-3d"') -or !$html.Contains('id="arki-proposal-panel"'))) { throw "Candidate branch missing required five tabs or proposal panel; refusing stale installation" }
Write-Host "SOURCE_BRANCH=$Branch"
Write-Host "SOURCE_SHA=$sha"
Write-Host "FIVE_TABS_SOURCE=$($html.Contains('id="arki-tab-plan"'))"
# Use explicit remote-tracking main as the current documentary source, not the stale detached checkout.
& git fetch origin "+refs/heads/main:refs/remotes/origin/main"
if ($LASTEXITCODE -ne 0) { throw "Cannot refresh canonical documentary source main" }
$stateFile = Join-Path $Install "ARKI_MASTER_MAP_STATE.json"
$registryFile = Join-Path $Install "assembly-registry.json"
function Export-CanonicalBlob([string]$Path,[string]$Destination) {
    $content = & git show "refs/remotes/origin/main:$Path"
    if ($LASTEXITCODE -ne 0) { throw "Missing canonical source: $Path" }
    [IO.File]::WriteAllText($Destination,($content -join [Environment]::NewLine),[Text.UTF8Encoding]::new($false))
}
Export-CanonicalBlob "docs/arki-master-map/ARKI_MASTER_MAP_STATE.json" $stateFile
Export-GitBlob "tools/maqueta-viva/assembly-registry.json" $registryFile
$state = [IO.File]::ReadAllText($stateFile,$utf8)
$registry = [IO.File]::ReadAllText($registryFile,$utf8)
$s = $state | ConvertFrom-Json
$g = $registry | ConvertFrom-Json
$catalogPath = Join-Path $Install "av-ui-001-capability-catalog.json"
Export-GitBlob "tools/maqueta-viva/av-ui-001-capability-catalog.json" $catalogPath
$catalogText = [IO.File]::ReadAllText($catalogPath,$utf8)
$catalogData = $catalogText | ConvertFrom-Json
if ($catalogData.schema -ne "ARKI-AV-CAPABILITY-CATALOG-0.1") { throw "Invalid capability catalog" }
if ($s.schema -ne "ARKI-MASTER-MAP-STATE-0.1" -or @($s.roadmap.phases).Count -ne 10) { throw "Invalid state" }
if ($g.schema -ne "ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1" -or @($g.ideas).Count -lt 1) { throw "Invalid registry" }
function JsonBootstrap([string]$Name,[string]$Json) {
    $base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Json))
    return "window.$Name=JSON.parse(new TextDecoder('utf-8').decode(Uint8Array.from(atob('$base64'),c=>c.charCodeAt(0))));"
}
$bootstrap = "<script>" + (JsonBootstrap "__ARKI_EMBEDDED_STATE__" $state) + (JsonBootstrap "__ARKI_EMBEDDED_REGISTRY__" $registry) + (JsonBootstrap "__ARKI_EMBEDDED_CAPABILITY_CATALOG__" $catalogText) + "</script>"
$pos = $html.IndexOf("<script>")
if ($pos -lt 0) { throw "No inline script found" }
$html = $html.Insert($pos,$bootstrap + [Environment]::NewLine)
$output = Join-Path $Install ("ARKI-ARBOL-VIVO-" + $sha.Substring(0,8) + ".html")
[IO.File]::WriteAllText($output,$html,[Text.UTF8Encoding]::new($false))
Push-Location $Install
try {
    & node ".\av-ui-001-readonly-prototype.test.cjs"
    if ($LASTEXITCODE -ne 0) { throw "AV-UI-001 regression FAILED; refusing to update shortcut" }
} finally { Pop-Location }
$desktop = [Environment]::GetFolderPath("Desktop")
$link = Join-Path $desktop "ARKI - Arbol Vivo Experimental.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($link)
$shortcut.TargetPath = $output
$shortcut.WorkingDirectory = $Install
$shortcut.Description = "ARKI Arbol Vivo experimental; read-only"
$shortcut.Save()
$finalHead = (& git rev-parse HEAD | Select-Object -First 1).Trim()
if ($LASTEXITCODE -ne 0 -or $finalHead -ne $original) { throw "Worktree HEAD changed unexpectedly" }
Write-Host "AV_UI_SHA=$sha"
Write-Host "PHASES=$(@($s.roadmap.phases).Count)"
Write-Host "LEAVES=$(@($g.ideas).Count)"
Write-Host "HISTORICAL_CAPABILITY_RECORDS=$(@($catalogData.records).Count)"
Write-Host "UTF8=PASS"
Write-Host "HTML=$output"
Write-Host "SHORTCUT=$link"
Start-Process -FilePath $output
