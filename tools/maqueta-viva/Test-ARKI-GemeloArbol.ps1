# ARKI Tree Twin: sequential, fail-fast local verification.
# Usage: pwsh -NoProfile -File .\tools\maqueta-viva\Test-ARKI-GemeloArbol.ps1
# Scope: isolated experimental worktree only. Does not modify main or canonical assets.
param([switch]$SkipBrowser, [switch]$SkipInstall)
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$Repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "../.."))
$Branch = "docs/av-ui-001-preparation-20261010"
$Ref = "refs/remotes/origin/$Branch"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportDir = Join-Path $env:LOCALAPPDATA "ARKI/ArbolVivo/Tests"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
$Report = Join-Path $ReportDir "ARKI-TREE-TWIN-$Stamp.log"
$Results = [Collections.Generic.List[string]]::new()
function Log([string]$Line) {
  $entry = "$(Get-Date -Format 'HH:mm:ss') $Line"
  Write-Host $entry
  Add-Content -LiteralPath $Report -Value $entry -Encoding utf8
}
function Step([string]$Name, [scriptblock]$Work) {
  Log "START $Name"
  try { & $Work; $Results.Add("PASS $Name"); Log "PASS $Name" }
  catch { $Results.Add("FAIL $Name : $_"); Log "FAIL $Name : $_"; throw }
}
function Run([string]$Exe, [string[]]$CommandArgs) {
  if (-not $CommandArgs -or $CommandArgs.Count -eq 0) { throw "No arguments supplied to $Exe" }
  & $Exe @CommandArgs
  if ($LASTEXITCODE -ne 0) { throw "$Exe failed (exit $LASTEXITCODE): $($CommandArgs -join ' ')" }
}
function BrowserPath {
  foreach($name in @("msedge.exe","chrome.exe")) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if($cmd) { return $cmd.Source }
  }
  foreach($candidate in @(
    "${env:ProgramFiles(x86)}/Microsoft/Edge/Application/msedge.exe",
    "$env:ProgramFiles/Microsoft/Edge/Application/msedge.exe",
    "$env:ProgramFiles/Google/Chrome/Application/chrome.exe",
    "$env:LOCALAPPDATA/Google/Chrome/Application/chrome.exe"
  )) { if(Test-Path -LiteralPath $candidate) { return $candidate } }
  return $null
}
try {
  Step "01 PREFLIGHT / ISOLATED REPO" {
    foreach($tool in @("git","node","pwsh")) { if(-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "Missing $tool" } }
    if(-not (Test-Path -LiteralPath (Join-Path $Repo ".git"))) { throw "Experimental repository/worktree missing: $Repo" }
    Push-Location $Repo
    try {
      $remote = (& git remote get-url origin).Trim()
      if($LASTEXITCODE -ne 0 -or $remote -notmatch 'YvanCastilloQuezada/sicl-web(\.git)?$') { throw "Unexpected remote: $remote" }
      $dirty = @(& git status --porcelain)
      if($LASTEXITCODE -ne 0 -or $dirty.Count -gt 0) { throw "Worktree not clean; refusing to overwrite local work" }
      $active = & git symbolic-ref --quiet --short HEAD 2>$null
      if($LASTEXITCODE -eq 0 -and $active -ne $Branch) { throw "Unsafe active branch: $active" }
      Log "REPO=$Repo"
    } finally { Pop-Location }
  }
  Step "02 FETCH / DETACH EXPERIMENTAL HEAD" {
    Push-Location $Repo
    try {
      Run "git" @("fetch","origin","+refs/heads/${Branch}:${Ref}")
      $sha = (& git rev-parse $Ref).Trim()
      if($LASTEXITCODE -ne 0 -or $sha -notmatch '^[0-9a-f]{40}$') { throw "Unresolved experimental SHA" }
      Run "git" @("switch","--detach",$sha)
      $head = (& git rev-parse "HEAD").Trim()
      if($head -ne $sha) { throw "Checkout mismatch" }
      Log "EXPERIMENTAL_SHA=$sha"
    } finally { Pop-Location }
  }
  Step "03 JAVASCRIPT SYNTAX + SYNTHETIC REGRESSION" {
    Push-Location $Repo
    try {
      Run "node" @("--version")
      Run "node" @("--check","tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs")
      Run "node" @("tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs")
    } finally { Pop-Location }
  }
  if($SkipInstall -and -not $SkipBrowser) { throw "Cannot verify current browser build with -SkipInstall; remove flag or also specify -SkipBrowser" }
  if(-not $SkipInstall) {
    Step "04 INSTALL / EMBED SOURCES / REPEAT REGRESSION" {
      Push-Location $Repo
      try { Run "pwsh" @("-NoProfile","-File",(Join-Path $PSScriptRoot "Install-ARKI-ArbolVivo.ps1")) }
      finally { Pop-Location }
    }
  } else { Log "SKIP 04 INSTALL (explicit flag)" }
  if(-not $SkipBrowser) {
    Step "05 REAL BROWSER E3 HEADLESS / UI + WORKSPACE" {
      $browser = BrowserPath
      if(-not $browser) { throw "Edge/Chrome not found; browser E3 cannot be marked PASS" }
      $install = Join-Path $env:LOCALAPPDATA "ARKI/ArbolVivo"
      $currentSha = (& git -C $Repo rev-parse HEAD).Trim()
      $expected = "ARKI-ARBOL-VIVO-$($currentSha.Substring(0,8)).html"
      $htmlFile = Get-Item -LiteralPath (Join-Path $install $expected) -ErrorAction SilentlyContinue
      if(-not $htmlFile) { throw "Installed HTML not found; remove -SkipInstall" }
      $html = [IO.File]::ReadAllText($htmlFile.FullName,[Text.UTF8Encoding]::new($false,$true))
      $probe = @'
<script>
(function(){
 const result=document.createElement("pre");result.id="arki-e3-result";document.body.append(result);
 const check=(ok,msg)=>{if(!ok)throw Error(msg)};
 try{
   check(document.querySelectorAll("#tree button.phase").length>=10,"F1-F10 not rendered");
   check(document.getElementById("twin-add-phase"),"F11 add control missing");
   document.getElementById("twin-new-phase").value="F11";
   document.getElementById("twin-phase-name").value="Coordinación territorial experimental";
   document.getElementById("twin-add-phase").click();
   check(twinPhaseSnapshot().some(p=>p.id==="F11"),"F11 not added");
   check(document.querySelectorAll("#tree button.phase").length>=11,"F11 not rendered");
   const before=exportTwinWorkspace();
   check(JSON.parse(before).canonicalMutation===false,"Canonical mutation flag");
   check(removeTwinPhase("F11").status==="REMOVED_FROM_ALTERNATIVE_TWIN","F11 removal");
   show();
   check(!twinPhaseSnapshot().some(p=>p.id==="F11"),"F11 persisted after removal");
   check(importTwinWorkspace(before).status==="IMPORTED_ALTERNATIVE_WORKSPACE","Workspace import");
   show();
   check(twinPhaseSnapshot().some(p=>p.id==="F11"),"F11 not restored");
   check(document.getElementById("twin-run"),"Simulation control missing");
   document.getElementById("twin-id").value="I-21";
   document.getElementById("twin-run").click();
   check(document.getElementById("twin-result").textContent.includes("SIMULACIÓN LOCAL"),"Simulation not shown");
   result.textContent="ARKI_E3_PASS";
   result.setAttribute("data-status","PASS");
 }catch(error){result.textContent="ARKI_E3_FAIL: "+error.message;result.setAttribute("data-status","FAIL")}
})();
</script>
'@
      if(-not $html.Contains("</body>")) { throw "Invalid HTML body" }
      $tempDir = Join-Path $ReportDir "e3-$Stamp"
      New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
      $probePath = Join-Path $tempDir "probe.html"
      [IO.File]::WriteAllText($probePath,$html.Replace("</body>","$probe`n</body>"),[Text.UTF8Encoding]::new($false))
      $profile = Join-Path $tempDir "browser-profile"
      $psi = [Diagnostics.ProcessStartInfo]::new()
      $psi.FileName = $browser
      foreach($arg in @("--headless","--disable-gpu","--no-first-run","--no-default-browser-check","--disable-extensions","--user-data-dir=$profile","--virtual-time-budget=8000","--dump-dom",([Uri]$probePath).AbsoluteUri)) { [void]$psi.ArgumentList.Add($arg) }
      $psi.UseShellExecute = $false
      $psi.RedirectStandardOutput = $true
      $psi.RedirectStandardError = $true
      $process = [Diagnostics.Process]::Start($psi)
      try {
        $stdout = $process.StandardOutput.ReadToEndAsync()
        $stderr = $process.StandardError.ReadToEndAsync()
        if(-not $process.WaitForExit(45000)) { $process.Kill($true); throw "Browser E3 timeout" }
        $dom = $stdout.GetAwaiter().GetResult()
        $errors = $stderr.GetAwaiter().GetResult()
        [IO.File]::WriteAllText((Join-Path $tempDir "browser-dom.html"),$dom)
        if($process.ExitCode -ne 0 -or $dom -notmatch 'id="arki-e3-result"[^>]*data-status="PASS"' -or $dom -notmatch 'ARKI_E3_PASS') {
          Log "BROWSER_STDERR=$($errors.Substring(0,[Math]::Min(500,$errors.Length)))"
          throw "Browser E3 failed: see $tempDir/browser-dom.html"
        }
        Log "BROWSER=$browser"
        Log "E3_DOM=$tempDir/browser-dom.html"
      } finally { $process.Dispose() }
    }
  } else { Log "SKIP 05 BROWSER E3 (explicit flag; NOT VERIFIED)" }
  Step "06 POSTCONDITIONS / NO CANONICAL MUTATION" {
    Push-Location $Repo
    try {
      $dirty = @(& git status --porcelain)
      if($LASTEXITCODE -ne 0 -or $dirty.Count -gt 0) { throw "Unexpected repo changes" }
      $head = (& git rev-parse HEAD).Trim()
      $remote = (& git rev-parse $Ref).Trim()
      if($head -ne $remote) { throw "Experimental SHA drift" }
      Log "HEAD_UNCHANGED=$head"
    } finally { Pop-Location }
  }
  Log "RESULT=PASS; synthetic=$true; browser=$(-not $SkipBrowser); install=$(-not $SkipInstall)"
} catch {
  Log "RESULT=FAIL; $_"
  Write-Host "REPORT=$Report"
  exit 1
} finally {
  foreach($item in $Results) { Log $item }
}
Write-Host "REPORT=$Report"
exit 0
