$ErrorActionPreference = "Stop"
$Root="C:\ARKI\labs\solvespace-t7-auto"
$SS="C:\ARKI\labs\solvespace-t7b1\solvespace"
$Build="C:\ARKI\labs\solvespace-t7b1\build"
New-Item -ItemType Directory -Force -Path $Root | Out-Null
Set-Location $Root
$Header=Get-ChildItem $SS -Recurse -File -Filter slvs.h | Select-Object -First 1
$Lib=Get-ChildItem $Build -Recurse -File -Filter slvs.lib | Select-Object -First 1
$Dll=Get-ChildItem $Build -Recurse -File -Filter slvs.dll | Select-Object -First 1
if(!$Header -or !$Lib -or !$Dll){ throw "T7_AUTO_PRECHECK_FAILED" }
Copy-Item $Dll.FullName "$Root\slvs.dll" -Force
if(!(Get-Command cl.exe -ErrorAction SilentlyContinue)){
  $vc="C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
  $envLines=cmd.exe /c ('"' + $vc + '" >nul && set')
  foreach($line in $envLines){ if($line -match '^([^=]+)=(.*)$'){ [Environment]::SetEnvironmentVariable($matches[1],$matches[2],"Process") } }
}
if(!(Get-Command cl.exe -ErrorAction SilentlyContinue)){ throw "MSVC_NOT_AVAILABLE" }
$C=@'
#include <stdio.h>
#include <string.h>
#include "slvs.h"
#define NP 1024
#define NE 512
#define NC 512
#define NF 512
typedef struct { Slvs_Param p[NP]; Slvs_Entity e[NE]; Slvs_Constraint c[NC]; Slvs_hConstraint f[NF]; int np,ne,nc; Slvs_hGroup fixed,g; Slvs_hEntity wp,n; Slvs_hParam hp; Slvs_hEntity he; Slvs_hConstraint hc; } M;
static Slvs_hParam P(M*m,Slvs_hGroup g,double v){Slvs_hParam h=m->hp++;m->p[m->np++]=Slvs_MakeParam(h,g,v);return h;}
static void init(M*m){memset(m,0,sizeof(*m));m->fixed=1;m->g=2;m->hp=1;m->he=100;m->hc=1;Slvs_hEntity o=m->he++;m->e[m->ne++]=Slvs_MakePoint3d(o,m->fixed,P(m,m->fixed,0),P(m,m->fixed,0),P(m,m->fixed,0));m->n=m->he++;m->e[m->ne++]=Slvs_MakeNormal3d(m->n,m->fixed,P(m,m->fixed,1),P(m,m->fixed,0),P(m,m->fixed,0),P(m,m->fixed,0));m->wp=m->he++;m->e[m->ne++]=Slvs_MakeWorkplane(m->wp,m->fixed,o,m->n);}
static Slvs_hEntity pt(M*m,double x,double y){Slvs_hEntity h=m->he++;m->e[m->ne++]=Slvs_MakePoint2d(h,m->g,m->wp,P(m,m->g,x),P(m,m->g,y));return h;}
static Slvs_hEntity line(M*m,Slvs_hEntity a,Slvs_hEntity b){Slvs_hEntity h=m->he++;m->e[m->ne++]=Slvs_MakeLineSegment(h,m->g,m->wp,a,b);return h;}
static Slvs_hEntity arc(M*m,Slvs_hEntity ctr,Slvs_hEntity a,Slvs_hEntity b){Slvs_hEntity h=m->he++;m->e[m->ne++]=Slvs_MakeArcOfCircle(h,m->g,m->wp,m->n,ctr,a,b);return h;}
static Slvs_hConstraint con(M*m,int t,double v,Slvs_hEntity pa,Slvs_hEntity pb,Slvs_hEntity ea,Slvs_hEntity eb){Slvs_hConstraint h=m->hc++;m->c[m->nc++]=Slvs_MakeConstraint(h,m->g,t,m->wp,v,pa,pb,ea,eb);return h;}
static Slvs_System solve(M*m){Slvs_System s;memset(&s,0,sizeof(s));s.param=m->p;s.params=m->np;s.entity=m->e;s.entities=m->ne;s.constraint=m->c;s.constraints=m->nc;s.failed=m->f;s.faileds=NF;s.calculateFaileds=1;Slvs_Solve(&s,m->g);return s;}
static int ok(Slvs_System*s){return s->result==SLVS_RESULT_OKAY||s->result==SLVS_RESULT_REDUNDANT_OKAY;}
static void rep(const char*id,const char*n,Slvs_System*s){printf("%s | %s | %s | result=%d | dof=%d | failed=%d",id,n,ok(s)?"PASS":"OBSERVATION",s->result,s->dof,s->faileds);if(s->faileds){printf(" | handles=");for(int i=0;i<s->faileds;i++)printf("%u%s",(unsigned)s->failed[i],i+1<s->faileds?",":"");}printf("\n");}
static void tangent_arc_line(void){M m;init(&m);Slvs_hEntity c=pt(&m,0,0),a=pt(&m,5,0),b=pt(&m,0,5),l2=pt(&m,5,8);Slvs_hEntity ar=arc(&m,c,a,b),ln=line(&m,a,l2);con(&m,SLVS_C_ARC_LINE_TANGENT,0,0,0,ar,ln);m.c[m.nc-1].other=0;Slvs_System s=solve(&m);rep("T715-09","ARC_LINE_TANGENT",&s);}
static void tangent_curve_curve(void){M m;init(&m);Slvs_hEntity c1=pt(&m,0,0),a1=pt(&m,0,-5),b1=pt(&m,5,0);Slvs_hEntity c2=pt(&m,10,0),a2=pt(&m,5,0),b2=pt(&m,10,5);Slvs_hEntity ar1=arc(&m,c1,a1,b1),ar2=arc(&m,c2,a2,b2);con(&m,SLVS_C_POINTS_COINCIDENT,0,b1,a2,0,0);con(&m,SLVS_C_CURVE_CURVE_TANGENT,0,0,0,ar1,ar2);m.c[m.nc-1].other=1;m.c[m.nc-1].other2=0;Slvs_System s=solve(&m);rep("T715-10","CURVE_CURVE_TANGENT",&s);}
static void conflict_single(void){M m;init(&m);Slvs_hEntity a=pt(&m,0,0),b=pt(&m,10,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,a,b,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,12,a,b,0,0);Slvs_System s=solve(&m);rep("T713-B4-01","SINGLE_CONTRADICTION",&s);}
static void two_conflicts(void){M m;init(&m);Slvs_hEntity a=pt(&m,0,0),b=pt(&m,10,0),c=pt(&m,30,0),d=pt(&m,40,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,a,b,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,12,a,b,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,c,d,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,14,c,d,0,0);Slvs_System s=solve(&m);rep("T713-B4-02","TWO_CONTRADICTIONS",&s);}
static void redundant(void){M m;init(&m);Slvs_hEntity a=pt(&m,0,0),b=pt(&m,10,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,a,b,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,a,b,0,0);Slvs_System s=solve(&m);rep("T713-B4-03","REDUNDANT_COMPATIBLE",&s);}
static void redundant_conflict(void){M m;init(&m);Slvs_hEntity a=pt(&m,0,0),b=pt(&m,10,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,a,b,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,10,a,b,0,0);con(&m,SLVS_C_PT_PT_DISTANCE,12,a,b,0,0);Slvs_System s=solve(&m);rep("T713-B4-04","REDUNDANT_PLUS_CONFLICT",&s);}
int main(void){printf("ARKI_T7_AUTONOMOUS_PHASE1\n");tangent_arc_line();tangent_curve_curve();conflict_single();two_conflicts();redundant();redundant_conflict();printf("T7_AUTO_PHASE1_COMPLETED=YES\nAGK_MODIFIED=NO\nLIBSLVS_ROLE=ORACLE_ONLY\n");return 0;}
'@
$src="$Root\t7_auto_phase1.c"
Set-Content $src $C -Encoding ASCII
& cl.exe /nologo /TC "/I$($Header.DirectoryName)" $src "/Fo$Root\t7_auto_phase1.obj" "/Fe$Root\t7_auto_phase1.exe" /link $Lib.FullName
$cc=$LASTEXITCODE
Write-Host "T7_AUTO_COMPILE_EXIT=$cc"
if($cc -ne 0){ throw "T7_AUTO_COMPILE_FAILED" }
$out=& "$Root\t7_auto_phase1.exe" 2>&1
$rc=$LASTEXITCODE
$out | Tee-Object -FilePath "$Root\T7_AUTO_PHASE1_RESULTS.txt"
Write-Host "T7_AUTO_PROCESS_EXIT=$rc"
Write-Host "T7_AUTO_LOG=$Root\T7_AUTO_PHASE1_RESULTS.txt"
Write-Host "SOLVESPACE_SOURCE_MODIFIED=NO"
Write-Host "AGK_MODIFIED=NO"
Write-Host "GPL_CODE_COPIED_INTO_ARKI=NO"
Write-Host "POWERSHELL_REMAINS_OPEN=YES"
