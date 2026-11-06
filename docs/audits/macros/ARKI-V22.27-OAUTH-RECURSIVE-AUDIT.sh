#!/usr/bin/env bash
set -u

ROOT="$HOME/ARKI/canonical/sicl-web"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$HOME/ARKI-AUDIT-V22.27-OAUTH-RECURSIVE-$STAMP"

mkdir -p "$OUT"
cd "$ROOT" || exit 1
exec > >(tee "$OUT/00-V22.27-REPORT.txt") 2>&1

echo "ARKI V22.27 — RECURSIVE NODE + AUTH CONFIG AUDIT"
date -Is
echo "ROOT=$ROOT"
echo "OUT=$OUT"
echo "READ_ONLY=YES"
echo "LOGIN_ATTEMPTED=NO"
echo "ENVIRONMENT_ACTIVATION=NO"
echo "SERVICE_RESTARTED=NO"
echo "GIT_MUTATION=NO"
echo "SECRET_VALUES_PRINTED=NO"

echo
echo "=== GIT BASELINE ==="
git branch --show-current
git rev-parse HEAD
git status --short

echo
echo "=== SYSTEMD MAIN PID ==="
MAIN_PID="$(systemctl show sicl-web.service -p MainPID --value 2>/dev/null)"
echo "MAIN_PID=$MAIN_PID"

echo
echo "=== FULL PROCESS TREE ==="
pstree -ap "$MAIN_PID" 2>/dev/null || true

echo
echo "=== RECURSIVE PROCESS DISCOVERY ==="
ps -eo pid=,ppid=,user=,comm=,args= > "$OUT/processes.txt"

python3 - "$MAIN_PID" "$OUT/processes.txt" <<'PY'
import sys
root=int(sys.argv[1])
rows=[]
with open(sys.argv[2], encoding="utf-8", errors="replace") as f:
    for line in f:
        p=line.strip().split(None,4)
        if len(p)<4: continue
        try: pid,ppid=int(p[0]),int(p[1])
        except ValueError: continue
        rows.append((pid,ppid,p[2],p[3],p[4] if len(p)>4 else ""))

desc={root}
while True:
    before=len(desc)
    desc.update(pid for pid,ppid,*_ in rows if ppid in desc)
    if len(desc)==before: break

for pid,ppid,user,comm,args in rows:
    if pid in desc:
        print(f"PID={pid} PPID={ppid} USER={user} COMM={comm}")
        print(f"ARGS={args}")

print("=== NODE SERVER CANDIDATES ===")
found=[]
for pid,ppid,user,comm,args in rows:
    if pid in desc and comm.lower()=="node" and "server/_core/index.ts" in args:
        found.append(pid)
        print(f"SERVER_NODE_PID={pid}")
        print(f"SERVER_NODE_ARGS={args}")
if not found:
    print("SERVER_NODE_PID=NOT_FOUND")
PY

NODE_PID="$(
python3 - "$MAIN_PID" "$OUT/processes.txt" <<'PY'
import sys
root=int(sys.argv[1])
rows=[]
for line in open(sys.argv[2],encoding="utf-8",errors="replace"):
    p=line.strip().split(None,4)
    if len(p)<4: continue
    try: pid,ppid=int(p[0]),int(p[1])
    except ValueError: continue
    rows.append((pid,ppid,p[3],p[4] if len(p)>4 else ""))
desc={root}
while True:
    before=len(desc)
    desc.update(pid for pid,ppid,*_ in rows if ppid in desc)
    if len(desc)==before: break
for pid,ppid,comm,args in rows:
    if pid in desc and comm.lower()=="node" and "server/_core/index.ts" in args:
        print(pid)
        break
PY
)"

echo
echo "=== TARGET NODE PID ==="
echo "TARGET_NODE_PID=${NODE_PID:-NOT_FOUND}"

if [[ -n "${NODE_PID:-}" && -r "/proc/$NODE_PID/environ" ]]; then
  echo
  echo "=== NODE ENVIRONMENT KEY NAMES ==="
  tr '\0' '\n' < "/proc/$NODE_PID/environ" | sed 's/=.*//' | sort -u

  echo
  echo "=== AUTH CONFIG PRESENCE (VALUES WITHHELD) ==="
  python3 - "$NODE_PID" <<'PY'
import sys
pid=sys.argv[1]
try:
    raw=open(f"/proc/{pid}/environ","rb").read().split(b"\0")
except Exception as e:
    print("ENV_READ_ERROR="+type(e).__name__)
    raise SystemExit(0)
env={}
for item in raw:
    if b"=" in item:
        k,v=item.split(b"=",1)
        env[k.decode(errors="replace")]=v
keys=[
 "NODE_ENV","ARKI_IDENTITY_MODE","ARKI_MO08_LOCAL_AUTH","ARKI_DEV_OPEN",
 "ARKI_MO08_DATABASE_URL","ARKI_MO22_LOCAL_AUTH",
 "VITE_OAUTH_PORTAL_URL","VITE_APP_ID",
]
for key in keys:
    print(f"{key}={'PRESENT (value withheld)' if key in env else 'ABSENT'}")
PY
else
  echo "NODE_ENVIRONMENT=UNAVAILABLE"
fi

echo
echo "=== AUTH SOURCE ROUTE INVENTORY ==="
rg -n \
  "api/oauth/callback|app-auth|arki-local/login|arki-local/logout|MO08|MO22|authenticateLocalIdentity|startLogin|VITE_OAUTH_PORTAL_URL|VITE_APP_ID" \
  server/_core client/src \
  --glob '!**/*.map' \
  > "$OUT/auth-source-matches.txt" 2>&1 || true
cat "$OUT/auth-source-matches.txt"

echo
echo "=== BUNDLE AUTH MARKERS ==="
find dist/public/assets -type f -name '*.js' -print0 2>/dev/null |
while IFS= read -r -d '' file; do
  for marker in app-auth api/oauth/callback redirectUri redirect_uri; do
    count="$(grep -oF "$marker" "$file" 2>/dev/null | wc -l)"
    if [[ "$count" -gt 0 ]]; then
      printf 'FILE=%s MARKER=%s COUNT=%s\n' "$file" "$marker" "$count"
    fi
  done
done

echo
echo "=== FINAL SAFETY ==="
echo "READ_ONLY=YES"
echo "LOGIN_ATTEMPTED=NO"
echo "ENVIRONMENT_ACTIVATION=NO"
echo "SERVICE_RESTARTED=NO"
echo "GIT_MUTATION=NO"
echo "SECRET_VALUES_PRINTED=NO"
echo "REPORT=$OUT/00-V22.27-REPORT.txt"
