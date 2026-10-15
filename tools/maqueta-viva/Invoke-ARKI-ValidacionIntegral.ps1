# ARKI experimental Windows verification. No checkout, no source edits.
# Run from clean experimental worktree after pinning the expected SHA.
param([Parameter(Mandatory=$true)][string]$ExpectedSha)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$desktop = [Environment]::GetFolderPath('Desktop')
$report = Join-Path $desktop "ARKI-VALIDACION-INTEGRAL-$stamp"
New-Item -ItemType Directory -Path $report -Force | Out-Null
$log = Join-Path $report 'VALIDACION-COMPLETA.txt'
$results = [System.Collections.Generic.List[object]]::new()
$failure = $null
$transcriptStarted = $false
function Step([string]$name,[scriptblock]$run) {
 Write-Host "=== $name ===" -ForegroundColor Cyan
 try {
  $global:LASTEXITCODE=0
  & $run
  if($LASTEXITCODE -ne 0) { throw "EXIT_CODE=$LASTEXITCODE" }
  $results.Add([pscustomobject]@{Prueba=$name;Resultado='PASS'})
  Write-Host "PASS $name" -ForegroundColor Green
 } catch {
  $results.Add([pscustomobject]@{Prueba=$name;Resultado='FAIL';Detalle=$_.Exception.Message})
  Write-Host "FAIL $name : $($_.Exception.Message)" -ForegroundColor Red
  throw
 }
}
try {
 Start-Transcript -Path $log -Force | Out-Null
 $transcriptStarted=$true
 Set-Location $root
 Step '01 Entorno' {
  Write-Host "PowerShell $($PSVersionTable.PSVersion)"
  node --version
  if($LASTEXITCODE -ne 0){throw 'NODE_NOT_FOUND'}
  git --version
  if($LASTEXITCODE -ne 0){throw 'GIT_NOT_FOUND'}
 }
 Step '02 Identidad y worktree limpio' {
  $head=(git rev-parse HEAD).Trim()
  if($LASTEXITCODE -ne 0 -or $head -ne $ExpectedSha){throw "SHA_MISMATCH $head"}
  if(@(git status --porcelain).Count -gt 0){throw 'DIRTY_WORKTREE'}
  Write-Host "Verified SHA $head"
 }
 $js=@(
  'arki-adn-mejora-continua.cjs',
  'arki-adn-mejora-continua.test.cjs',
  'arki-adn-observer.cjs',
  'arki-adn-observer.test.cjs',
  'arki-multiscale-design.cjs',
  'arki-multiscale-design.test.cjs',
  'arki-multiscale-portfolio.cjs',
  'arki-multiscale-portfolio.test.cjs',
  'av-ui-001-readonly-prototype.test.cjs',
  'Test-ARKI-Twin-Signatures.cjs'
 )
 Step '03 Sintaxis completa' {
  foreach($file in $js) {
   node --check "tools/maqueta-viva/$file"
   if($LASTEXITCODE -ne 0){throw "SYNTAX_FAILED $file"}
  }
 }
 Step '04 ADN-MC' {node tools/maqueta-viva/arki-adn-mejora-continua.test.cjs}
 Step '05 Observador y ledger' {node tools/maqueta-viva/arki-adn-observer.test.cjs}
 Step '06 Diseño 7 escalas' {node tools/maqueta-viva/arki-multiscale-design.test.cjs}
 Step '07 Propagación multiescala' {node tools/maqueta-viva/arki-multiscale-portfolio.test.cjs}
 Step '08 Firmas sintéticas' {node tools/maqueta-viva/Test-ARKI-Twin-Signatures.cjs}
 Step '09 Gemelo Digital documental' {node tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs}
 Step '10 Suite Windows/Edge' {pwsh -NoProfile -File './tools/maqueta-viva/Test-ARKI-GemeloArbol.ps1'}
 Step '11 Integridad final' {
  $head=(git rev-parse HEAD).Trim()
  if($head -ne $ExpectedSha){throw "HEAD_CHANGED $head"}
  if(@(git status --porcelain).Count -gt 0){throw 'WORKTREE_MODIFIED'}
 }
} catch {$failure=$_.Exception.Message}
finally {
 $results | Export-Csv -Path (Join-Path $report 'RESULTADOS.csv') -NoTypeInformation -Encoding UTF8
 $results | Format-Table -AutoSize
 if($transcriptStarted){try{Stop-Transcript|Out-Null}catch{}}
 Write-Host "INFORMES: $report" -ForegroundColor Yellow
 if($failure){Write-Host "ARKI VALIDACION: FAIL $failure" -ForegroundColor Red;exit 1}
 Write-Host 'ARKI VALIDACION EXPERIMENTAL: PASS (NO PRUEBA CORE/AGK REAL)' -ForegroundColor Green
 exit 0
}
