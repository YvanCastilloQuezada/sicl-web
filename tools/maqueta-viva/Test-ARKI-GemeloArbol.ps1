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
      Run -Exe "git" -CommandArgs @("fetch","origin","+refs/heads/${Branch}:${Ref}")
      $sha = (& git rev-parse $Ref).Trim()
      if($LASTEXITCODE -ne 0 -or $sha -notmatch '^[0-9a-f]{40}$') { throw "Unresolved experimental SHA" }
      Run -Exe "git" -CommandArgs @("switch","--detach",$sha)
      $head = (& git rev-parse "HEAD").Trim()
      if($head -ne $sha) { throw "Checkout mismatch" }
      Log "EXPERIMENTAL_SHA=$sha"
    } finally { Pop-Location }
  }
  Step "03 JAVASCRIPT SYNTAX + SYNTHETIC REGRESSION" {
    Push-Location $Repo
    try {
      Run -Exe "node" -CommandArgs @("--version")
      Run -Exe "node" -CommandArgs @("--check","tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs")
      Run -Exe "node" -CommandArgs @("tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs")
    } finally { Pop-Location }
  }
  Step "03C ADN-MC-001 CONTINUOUS IMPROVEMENT REFERENCE" {
    Push-Location $Repo
    try {
      Run -Exe "node" -CommandArgs @("tools/maqueta-viva/arki-adn-mejora-continua.test.cjs")
      Log "ADN_MC_001=PASS; EXPERIMENTAL_ONLY; CORE_CANONICAL=UNCHANGED"
    } finally { Pop-Location }
  }
  Step "03B SIGNED RECEIPT / INDEPENDENT NODE VERIFIER" {
    $FixtureDir = Join-Path ([IO.Path]::GetTempPath()) ("ARKI-TWIN-SIGNATURE-" + [guid]::NewGuid().ToString("N"))
    try {
      Push-Location $Repo
      try {
        Run -Exe "node" -CommandArgs @("tools/maqueta-viva/Generate-ARKI-Twin-Signed-Fixture.cjs",$FixtureDir)
        $key = Join-Path $FixtureDir "ARKI-TWIN-SYNTHETIC-PUBLIC-KEY.json"
        $envelope = Join-Path $FixtureDir "ARKI-TWIN-SYNTHETIC-SIGNED-RECEIPTS.json"
        if(-not (Test-Path -LiteralPath $key) -or -not (Test-Path -LiteralPath $envelope)) { throw "Synthetic signature fixture not created" }
        Run -Exe "node" -CommandArgs @("tools/maqueta-viva/Verify-ARKI-Twin-Receipts.cjs",$key,$envelope)
        $tampered = Join-Path $FixtureDir "ARKI-TWIN-TAMPERED.json"
        $signed = Get-Content -LiteralPath $envelope -Raw | ConvertFrom-Json
        $signed.payload = $signed.payload.Replace('"UNKNOWN"','"SUCCESS"')
        $signed | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $tampered -Encoding utf8
        & node "tools/maqueta-viva/Verify-ARKI-Twin-Receipts.cjs" $key $tampered 2>$null | Out-Null
        if($LASTEXITCODE -eq 0) { throw "Tampered signed receipt unexpectedly accepted" }
        Log "SIGNED_FIXTURE=PASS; TAMPER_REJECTION=PASS; REAL_EXECUTION=NOT_CLAIMED"
      } finally { Pop-Location }
    } finally {
      if(Test-Path -LiteralPath $FixtureDir) { Remove-Item -LiteralPath $FixtureDir -Recurse -Force }
    }
  }
  if($SkipInstall -and -not $SkipBrowser) { throw "Cannot verify current browser build with -SkipInstall; remove flag or also specify -SkipBrowser" }
  if(-not $SkipInstall) {
    Step "04 INSTALL / EMBED SOURCES / REPEAT REGRESSION" {
      Push-Location $Repo
      try { Run -Exe "pwsh" -CommandArgs @("-NoProfile","-File",(Join-Path $PSScriptRoot "Install-ARKI-ArbolVivo.ps1")) }
      finally { Pop-Location }
    }
  } else { Log "SKIP 04 INSTALL (explicit flag)" }
  if(-not $SkipBrowser) {
    Step "05 REAL BROWSER E3-E10 / A-B-C + RECEIPTS + MESH + RECOVERY" {
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
   check(document.getElementById("twin-set-dependencies"),"E4 dependency control missing");
   check(addTwinPhase("F12","Dependencias territoriales experimentales").status==="ADDED_TO_ALTERNATIVE_TWIN","F12 creation");
   document.getElementById("twin-new-phase").value="F12";
   document.getElementById("twin-phase-dependencies").value="F11,F4";
   document.getElementById("twin-set-dependencies").click();
   check(twinPhaseSnapshot().find(p=>p.id==="F12").dependencies.join(",")==="F11,F4","E4 UI dependency edit");
   check(incrementalImpact({kind:"DEPENDENCY",id:"F11"}).affected.includes("F12"),"E4 phase propagation");
   check(setTwinPhaseDependencies("F11","F12").status==="PHASE_DEPENDENCY_CYCLE","E4 cycle rejection");
   check(removeTwinPhase("F11").status==="PHASE_HAS_DEPENDENTS","E4 orphan guard");
   const e4Workspace=exportTwinWorkspace();
   check(importTwinWorkspace(e4Workspace).status==="IMPORTED_ALTERNATIVE_WORKSPACE","E4 workspace DAG roundtrip");
   check(twinPhaseSnapshot().find(p=>p.id==="F12").dependencies.includes("F11"),"E4 DAG persisted");
   const savedBrowser=saveTwinBrowser();
   check(savedBrowser.status==="SAVED_TO_LOCAL_BROWSER","E4 local browser storage: "+savedBrowser.status);
   check(setTwinPhaseDependencies("F12","F4").status==="ALTERNATIVE_DEPENDENCIES_UPDATED","E4 mutation before browser restore");
   check(loadTwinBrowser().status==="IMPORTED_ALTERNATIVE_WORKSPACE","E4 local browser restore");
   check(twinPhaseSnapshot().find(p=>p.id==="F12").dependencies.includes("F11"),"E4 browser storage retained DAG");
   check(document.getElementById("e5-generate"),"E5 candidate generation button missing");
   document.getElementById("e5-generate").click();
   const e5=synthesizeNewBranches();
   check(e5.status==="RULE_BASED_CANDIDATES_ONLY"&&e5.candidates.length>0,"E5 synthesis failed");
   check(e5.candidates.every(c=>c.status==="PROPOSED_ONLY"&&c.evidence==="UNKNOWN"&&c.canonicalMutation===false),"E5 proposal integrity");
   check(document.getElementById("e5-candidates").textContent.includes("hipótesis"),"E5 candidate display failed");
   const branchId=e5.candidates[0].id;
   check(addE5AlternativeBranch(branchId).status==="ADDED_TO_ALTERNATIVE_BRANCHES","E5 alternative branch adoption");
   const branchWorkspace=exportTwinWorkspace();
   check(removeE5AlternativeBranch(branchId).status==="REMOVED_ALTERNATIVE_BRANCH","E5 alternative branch removal");
   check(importTwinWorkspace(branchWorkspace).status==="IMPORTED_ALTERNATIVE_WORKSPACE","E5 alternative branch workspace import");
   check(e5BranchSnapshot().some(x=>x.id===branchId),"E5 adopted branch not persisted");
   show();
   check(document.getElementById("tree").textContent.includes(branchId),"E5 adopted branch not rendered in tree");
   check(document.getElementById("e6-record"),"E6 evidence record control missing");
   document.getElementById("e6-branch").value=branchId;
   document.getElementById("e6-reference").value="ARKI experimental review note 001";
   document.getElementById("e6-observation").value="The documented dependency is not independently verified";
   document.getElementById("e6-outcome").value="CONTRADICTS";
   document.getElementById("e6-record").click();
   check(e6EvidenceSnapshot().length===1,"E6 evidence observation not recorded");
   check(e6BranchAssessment(branchId).decision==="REVIEW_CONTRADICTIONS","E6 contradiction not surfaced");
   check(removeE5AlternativeBranch(branchId).status==="BRANCH_HAS_EVIDENCE","E6 evidence deletion guard");
   const e6Portable=exportTwinWorkspace();
   check(importTwinWorkspace(e6Portable).status==="IMPORTED_ALTERNATIVE_WORKSPACE","E6 evidence workspace roundtrip");
   check(e6EvidenceSnapshot()[0].status==="UNVERIFIED","E6 evidence promoted unexpectedly");
   check(document.getElementById("e7-record"),"E7 decision record control missing");
   document.getElementById("e7-branch").value=branchId;
   document.getElementById("e7-action").value="DEFER";
   document.getElementById("e7-rationale").value="Await independent review of contradictory source material";
   document.getElementById("e7-record").click();
   check(e7DecisionSnapshot().length===1,"E7 provisional decision not recorded");
   check(e7DecisionState(branchId).latestAction==="DEFER","E7 provisional decision state incorrect");
   check(e7DecisionImpact(branchId).status==="IMPACT_ESTIMATE_ONLY","E7 impact estimate missing");
   check(document.getElementById("e7-ledger").textContent.includes("PROVISIONAL_ONLY"),"E7 ledger not displayed");
   const e7Portable=exportTwinWorkspace();
   check(importTwinWorkspace(e7Portable).status==="IMPORTED_ALTERNATIVE_WORKSPACE","E7 decision workspace roundtrip");
   check(e7DecisionSnapshot()[0].status==="PROVISIONAL_ONLY","E7 decision unexpectedly promoted");
   check(document.getElementById("e8-reconcile"),"E8 reconciliation control missing");
   const decisionReceipt=JSON.stringify(e7DecisionSnapshot());
   check(addE6Evidence(branchId,"Later source ARKI-E8-001","Later observation requires rechecking the provisional decision","INCONCLUSIVE").status==="EVIDENCE_OBSERVATION_RECORDED","E8 late observation");
   document.getElementById("e8-reconcile").click();
   const e8=e8ReconciliationReport();
   check(e8.issues.some(x=>x.kind==="EVIDENCE_CHANGED_SINCE_DECISION"),"E8 stale decision not detected");
   check(JSON.stringify(e7DecisionSnapshot())===decisionReceipt,"E8 must not rewrite historical decision");
   check(document.getElementById("e8-report").textContent.includes("EVIDENCE_CHANGED_SINCE_DECISION"),"E8 report not rendered");
   check(document.getElementById("e9-create"),"E9 revision control missing");
   const originalDecisionId=e7DecisionSnapshot()[0].decisionId;
   check(e9ReviewStatus(originalDecisionId).status==="REVISION_REQUIRED","E9 should detect stale decision after E8 evidence");
   const originalDecisionReceipt=JSON.stringify(e7DecisionSnapshot());
   document.getElementById("e9-parent").value=originalDecisionId;
   document.getElementById("e9-action").value="INVESTIGATE";
   document.getElementById("e9-rationale").value="Reconsider late evidence before taking any architectural action";
   document.getElementById("e9-create").click();
   check(e9RevisionSnapshot().length===1,"E9 review not recorded");
   check(e9ReviewStatus(originalDecisionId).status==="CURRENT_PROVISIONAL_RECEIPT","E9 review did not refresh provisional receipt");
   check(JSON.stringify(e7DecisionSnapshot())===originalDecisionReceipt,"E9 altered historical decision");
   const e9Portable=exportTwinWorkspace();
   check(importTwinWorkspace(e9Portable).status==="IMPORTED_ALTERNATIVE_WORKSPACE","E9 review workspace roundtrip");
   check(e9RevisionSnapshot()[0].status==="PROVISIONAL_ONLY","E9 review unexpectedly promoted");
   check(!e8ReconciliationReport().issues.some(x=>x.kind==="EVIDENCE_CHANGED_SINCE_DECISION"&&x.id===originalDecisionId),"Reviewed E9 decision must not remain stale in E8");
   check(addE9Revision(originalDecisionId,"DEFER","Attempt to fork a superseded decision").status==="STALE_REVISION_PARENT","E9 fork guard failed");

   check(document.getElementById("e10-evaluate"),"E10 readiness control missing");
   const e10Before=JSON.stringify({decisions:e7DecisionSnapshot(),revisions:e9RevisionSnapshot(),evidence:e6EvidenceSnapshot()});
   document.getElementById("e10-evaluate").click();
   const e10=e10ReadinessReport();
   check(e10.status==="NOT_READY_FOR_CANONICAL_PROMOTION","E10 must block unverified canonical promotion");
   check(e10.blockers.includes("DOCUMENTARY_VERIFICATION"),"E10 missing verification gate");
   check(e10.blockers.includes("CANONICAL_PROMOTION"),"E10 missing canonical authorization gate");
   check(e10.checks.some(x=>x.id==="EXTERNAL_E2E_CERTIFICATION"&&x.status==="NOT_ASSESSED"),"E10 must not claim external E2E certification");
   check(document.getElementById("e10-report").textContent.includes("NOT_READY_FOR_CANONICAL_PROMOTION"),"E10 readiness panel not rendered");
   check(JSON.stringify({decisions:e7DecisionSnapshot(),revisions:e9RevisionSnapshot(),evidence:e6EvidenceSnapshot()})===e10Before,"E10 mutated historical receipts");
   const recoveryBaseline=exportTwinWorkspace();
   const recoveryInvalid=JSON.parse(recoveryBaseline);
   recoveryInvalid.history.versions[0].canonicalMutation=true;
   check(importTwinWorkspace(JSON.stringify(recoveryInvalid)).status==="INVALID_WORKSPACE_HISTORY","Persistence: invalid history not rejected");
   check(exportTwinWorkspace()===recoveryBaseline,"Persistence: invalid history mutated live state");
   const recoveryValid=JSON.parse(recoveryBaseline);
   check(importTwinPhases(recoveryValid.phases,true).status==="IMPORTED_ALTERNATIVE_PHASES","Persistence: phase preflight failed");
   check(importStructuralHistory(recoveryValid.history,true).status==="IMPORTED_LOCAL_HISTORY","Persistence: history preflight failed");
   check(exportTwinWorkspace()===recoveryBaseline,"Persistence: preflight mutated live state");
   const twinBefore=exportTwinWorkspace();
   check(document.getElementById("twin-command-center"),"ÁRBOL Gemelo Digital panel missing");
   check(twinObservation().canonicalMutation===false&&twinObservation().verification==="UNKNOWN","Twin observer claimed verification");
   for(const mode of ["tree","brain","3d"]){
     document.getElementById("twin-view-"+mode).click();
     check(twinViewMode===mode,"Twin view not switched: "+mode);
     check(document.getElementById("twin-visual").querySelector("svg"),"Twin SVG missing: "+mode);
     check(document.getElementById("twin-visual").querySelectorAll("[data-twin-id]").length>=10,"Twin nodes missing: "+mode);
   }
   const twinPick=document.getElementById("twin-visual").querySelector('[data-twin-id="F10"]');
   check(twinPick,"Twin F10 selection missing");
   twinPick.click();
   check(selected==="F10","Twin views did not synchronize selected phase");
   const twinLatest=structuralHistory.at(-1)?.version;
   check(twinLatest,"Twin historical snapshot missing");
   const twinSelector=document.getElementById("twin-version");
   twinSelector.value=twinLatest;
   twinSelector.dispatchEvent(new Event("change",{bubbles:true}));
   check(twinObservation().version===twinLatest,"Twin timeline did not select historical snapshot");
   check(document.getElementById("twin-inspector").textContent.includes(twinLatest),"Twin inspector does not show historical version");
   twinSelector.value="CURRENT";twinSelector.dispatchEvent(new Event("change",{bubbles:true}));
   check(twinObservation().version==="CURRENT","Twin timeline failed to return to current state");
   const impactToggle=document.getElementById("twin-impact-toggle");
   check(impactToggle,"Twin impact control missing");
   impactToggle.click();
   check(twinImpactVisible===true,"Impact control failed to activate");
   check(document.getElementById("twin-inspector").textContent.includes("PROPAGACIÓN DOCUMENTAL"),"Impact inspector not visible");
   const twinImpact=twinDependencyImpact(twinObservation(),selected);
   check(twinImpact.canonicalMutation===false&&twinImpact.simulation==="NOT_EXECUTED","Impact report claimed simulation");
   impactToggle.click();
   check(twinImpactVisible===false,"Impact control failed to deactivate");
   const compare=document.getElementById("twin-compare");
   check(compare,"Three-alternative control missing");
   compare.click();
   check(document.getElementById("twin-scenarios").textContent.includes("A ·")&&document.getElementById("twin-scenarios").textContent.includes("B ·")&&document.getElementById("twin-scenarios").textContent.includes("C ·"),"Three alternatives not displayed");
   const receiptData={schema:"ARKI-TWIN-EXECUTION-RECEIPTS-1",receipts:[{id:"E3-1",producer:"Core",outcome:"UNKNOWN",timestamp:"2026-10-10T14:00:00Z",operation:"observation",commit:"a".repeat(40)}]};
   check(importTwinReceipts(receiptData).status==="IMPORTED_UNVERIFIED_RECEIPTS","External receipts not accepted");
   check(twinExternalReceipts[0].authentication==="UNVERIFIED_EXTERNAL_CLAIM","External receipts falsely authenticated");
   const geometryData={schema:"ARKI-TWIN-AGK-MESH-1",canonicalMutation:false,sourceCommit:"b".repeat(40),vertices:[[0,0,0],[1,0,0],[0,1,0]],triangles:[[0,1,2]]};
   check(importTwinAgkMesh(geometryData).status==="IMPORTED_UNVERIFIED_AGK_MESH","External mesh not accepted");
   document.getElementById("twin-view-3d").click();
   check(document.getElementById("twin-visual").querySelector("polygon"),"Imported 3D mesh not rendered");
   check(document.getElementById("twin-geometry-status").textContent.includes("AUTENTICIDAD UNKNOWN"),"External mesh misrepresented as verified");
   const malformedGeometry={...geometryData,triangles:[[0,1,500]]};
   check(importTwinAgkMesh(malformedGeometry).status==="INVALID_AGK_MESH","Invalid mesh not rejected");
   check(twinAgkMesh.triangles.length===1,"Rejected mesh mutated external state");
   check(twinTimelineReport().canonicalMutation===false,"Timeline mutated canonical state");
   const operationalAudit=twinOperationalAudit();
   check(operationalAudit.schema==="ARKI-TWIN-OPERATIONAL-AUDIT-1","Operational audit missing");
   check(operationalAudit.canonicalPromotion==="BLOCKED"&&operationalAudit.operationalVerification==="NOT_VERIFIED","Audit improperly authorized runtime");
   check(operationalAudit.gates.some(g=>g.id==="PRODUCER_IDENTITY"&&g.state==="BLOCKED"),"Producer provenance gate not blocked");
   check(document.getElementById("twin-export-audit"),"Audit export control missing");
   check(document.getElementById("twin-check-fingerprint"),"Fingerprint comparison control missing");

   check(exportTwinWorkspace()===twinBefore,"Twin visualization mutated workspace");
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
  if(-not $SkipBrowser) {
    Step "06 REAL BROWSER RESTART / PERSISTENT PROFILE RECOVERY" {
      $browser = BrowserPath
      if(-not $browser) { throw "Browser unavailable for restart recovery" }
      $install = Join-Path $env:LOCALAPPDATA "ARKI/ArbolVivo"
      $sha = (& git -C $Repo rev-parse HEAD).Trim()
      $installed = Join-Path $install "ARKI-ARBOL-VIVO-$($sha.Substring(0,8)).html"
      $baseHtml = [IO.File]::ReadAllText($installed,[Text.UTF8Encoding]::new($false,$true))
      if(-not $baseHtml.Contains("</body>")) { throw "Recovery HTML missing body" }
      $recoveryDir = Join-Path $ReportDir "restart-$Stamp"
      New-Item -ItemType Directory -Force -Path $recoveryDir | Out-Null
      $probeFile = Join-Path $recoveryDir "restart-probe.html"
      $profile = Join-Path $recoveryDir "persistent-edge-profile"
      $stageOne = @'
<script>
(function(){
 const result=document.createElement("pre");result.id="arki-restart-result";document.body.append(result);
 try {
   const add=addTwinPhase("F14","Persistencia tras reinicio experimental");
   if(add.status!=="ADDED_TO_ALTERNATIVE_TWIN")throw Error("Cannot create F14");
   const candidates=synthesizeNewBranches().candidates;
   if(!candidates.length)throw Error("No documentary candidates");
   const branchId=candidates[0].id;
   if(addE5AlternativeBranch(branchId).status!=="ADDED_TO_ALTERNATIVE_BRANCHES")throw Error("Cannot adopt branch");
   if(addE6Evidence(branchId,"ARKI restart probe evidence","Synthetic observation retained across independent browser processes","INCONCLUSIVE").status!=="EVIDENCE_OBSERVATION_RECORDED")throw Error("Cannot record evidence");
   const decision=addE7Decision(branchId,"DEFER","Await independent verification after browser restart");
   if(decision.status!=="PROVISIONAL_DECISION_RECORDED")throw Error("Cannot record decision");
   const revision=addE9Revision(decision.decisionId,"INVESTIGATE","Check that the revision chain persists across browser restarts");
   if(revision.status!=="PROVISIONAL_REVISION_RECORDED")throw Error("Cannot record revision");
   const snapshot=recordStructuralSnapshot({kind:"DEPENDENCY",id:"F14"});
   if(snapshot.status!=="SNAPSHOT_RECORDED_IN_MEMORY")throw Error("Cannot snapshot restart state: "+snapshot.status);
   const saved=saveTwinBrowser();
   if(saved.status!=="SAVED_TO_LOCAL_BROWSER")throw Error("Storage save: "+saved.status);
   const original=JSON.parse(exportTwinWorkspace());
   if(!original.phases.phases.some(p=>p.id==="F14")||original.history.versions.length<1||original.alternativeBranches.length!==1||original.evidenceLedger.length!==1||original.decisionLedger.length!==1||original.revisionLedger.length!==1)throw Error("Incomplete saved workspace");
   result.textContent="ARKI_RESTART_STAGE_1_PASS";
   result.setAttribute("data-status","PASS");
 } catch(error){result.textContent="ARKI_RESTART_STAGE_1_FAIL: "+error.message;result.setAttribute("data-status","FAIL")}
})();
</script>
'@
      $stageTwo = @'
<script>
(function(){
 const result=document.createElement("pre");result.id="arki-restart-result";document.body.append(result);
 try {
   if(twinPhaseSnapshot().some(p=>p.id==="F14"))throw Error("State was not reset before reload");
   const loaded=loadTwinBrowser();
   if(loaded.status!=="IMPORTED_ALTERNATIVE_WORKSPACE")throw Error("Storage reload: "+loaded.status);
   const workspace=JSON.parse(exportTwinWorkspace());
   if(!workspace.phases.phases.some(p=>p.id==="F14"))throw Error("F14 lost across restart");
   if(!workspace.history.versions.some(x=>x.trigger?.id==="F14"))throw Error("History lost across restart");
   if(workspace.alternativeBranches.length!==1||workspace.evidenceLedger.length!==1||workspace.decisionLedger.length!==1||workspace.revisionLedger.length!==1)throw Error("Documentary chain lost across restart");
   if(workspace.evidenceLedger[0].branchId!==workspace.alternativeBranches[0].id||workspace.decisionLedger[0].branchId!==workspace.alternativeBranches[0].id||workspace.revisionLedger[0].rootDecisionId!==workspace.decisionLedger[0].decisionId)throw Error("Broken provenance chain across restart");
   if(workspace.revisionLedger[0].status!=="PROVISIONAL_ONLY"||workspace.evidenceLedger[0].status!=="UNVERIFIED")throw Error("Historical status was promoted across restart");
   if(e9ReviewStatus(workspace.decisionLedger[0].decisionId).status!=="CURRENT_PROVISIONAL_RECEIPT")throw Error("Revision state not restored");
   if(workspace.canonicalMutation!==false)throw Error("Canonical mutation detected");
   result.textContent="ARKI_RESTART_STAGE_2_PASS";
   result.setAttribute("data-status","PASS");
 } catch(error){result.textContent="ARKI_RESTART_STAGE_2_FAIL: "+error.message;result.setAttribute("data-status","FAIL")}
})();
</script>
'@
      foreach($stage in @(1,2)) {
        $probe = if($stage -eq 1){$stageOne}else{$stageTwo}
        [IO.File]::WriteAllText($probeFile,$baseHtml.Replace("</body>","$probe`n</body>"),[Text.UTF8Encoding]::new($false))
        $psi = [Diagnostics.ProcessStartInfo]::new()
        $psi.FileName = $browser
        foreach($arg in @("--headless","--disable-gpu","--no-first-run","--no-default-browser-check","--disable-extensions","--user-data-dir=$profile","--virtual-time-budget=8000","--dump-dom",([Uri]$probeFile).AbsoluteUri)) { [void]$psi.ArgumentList.Add($arg) }
        $psi.UseShellExecute = $false
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $process = [Diagnostics.Process]::Start($psi)
        try {
          $stdout = $process.StandardOutput.ReadToEndAsync()
          $stderr = $process.StandardError.ReadToEndAsync()
          if(-not $process.WaitForExit(45000)) { $process.Kill($true); throw "Restart stage $stage timeout" }
          $dom = $stdout.GetAwaiter().GetResult()
          $errors = $stderr.GetAwaiter().GetResult()
          $domPath = Join-Path $recoveryDir "restart-stage-$stage-dom.html"
          [IO.File]::WriteAllText($domPath,$dom)
          $passText = "ARKI_RESTART_STAGE_${stage}_PASS"
          if($process.ExitCode -ne 0 -or $dom -notmatch 'id="arki-restart-result"[^>]*data-status="PASS"' -or -not $dom.Contains($passText)) {
            Log "RESTART_STDERR_STAGE_${stage}=$($errors.Substring(0,[Math]::Min(500,$errors.Length)))"
            throw "Browser restart stage $stage failed: $domPath"
          }
          Log "RESTART_STAGE_${stage}=PASS"
        } finally { $process.Dispose() }
      }
      Log "RESTART_PROFILE=$profile"
    }
  } else { Log "SKIP 06 BROWSER RESTART (explicit flag; NOT VERIFIED)" }
  Step "07 POSTCONDITIONS / NO CANONICAL MUTATION" {
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
