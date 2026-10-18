"""ARKI Guardian v0.3: autonomous local observer, proposal-only. Python stdlib."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import time
from datetime import datetime, timezone
from urllib.parse import urlparse
from urllib.request import Request, urlopen

SCHEMA = "ARKI-GUARDIAN-0.3"
ALLOWED = {"www.buildingsmart.org", "technical.buildingsmart.org", "www.opencascade.com", "dev.opencascade.org", "www.gob.pe"}

def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def digest(obj):
    return hashlib.sha256(canonical(obj).encode()).hexdigest()

def now():
    return datetime.now(timezone.utc).isoformat()

def db_open(path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path)
    db.execute("PRAGMA journal_mode=WAL")
    db.executescript("""
    CREATE TABLE IF NOT EXISTS observations(id TEXT PRIMARY KEY, kind TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS proposals(id TEXT PRIMARY KEY, subject TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', created_at TEXT NOT NULL, decided_at TEXT, actor TEXT);
    CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY AUTOINCREMENT, proposal_id TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL, delivered INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS runs(id INTEGER PRIMARY KEY AUTOINCREMENT, summary TEXT NOT NULL, created_at TEXT NOT NULL);
    """)
    db.commit()
    return db

def inspect_registry(registry):
    items = registry.get("capabilities", [])
    if not isinstance(items, list):
        raise ValueError("INVALID_CAPABILITIES")
    index = {}
    for c in items:
        key = c.get("id")
        if not isinstance(key, str) or not key or key in index:
            raise ValueError("INVALID_OR_DUPLICATE_ID")
        if c.get("phase") is not None and (type(c["phase"]) is not int or not 1 <= c["phase"] <= 10):
            raise ValueError("INVALID_PHASE")
        index[key] = c
    visiting, visited, cycles, order = set(), set(), [], []
    def visit(k, stack):
        if k in visiting:
            cycles.append(stack[stack.index(k):] + [k]); return
        if k in visited: return
        visiting.add(k)
        for d in sorted(index[k].get("dependencies", [])):
            if d in index: visit(d, stack+[d])
        visiting.remove(k); visited.add(k); order.append(k)
    for k in sorted(index): visit(k, [k])
    results = []
    for k in order:
        c = index[k]
        deps = c.get("dependencies", [])
        blockers = sorted(set(
            ["MISSING_DEPENDENCY:"+d for d in deps if d not in index] +
            ["UNVERIFIED_DEPENDENCY:"+d for d in deps if d in index and index[d].get("epistemic") not in ("VERIFIED", "FROZEN")] +
            (["UNKNOWN_PHASE"] if c.get("phase") is None else []) +
            (["UNVERIFIED_CAPABILITY"] if c.get("epistemic") not in ("VERIFIED", "FROZEN") else []) +
            (["MISSING_EVIDENCE"] if not c.get("evidence") else []) +
            (["DEPENDENCY_CYCLE"] if any(k in cyc for cyc in cycles) else [])
        ))
        results.append({"id": k, "phase": c.get("phase"), "blockers": blockers, "ready": not blockers})
    return {"order": order, "cycles": cycles, "capabilities": results}

def options(item):
    return [
        {"id":"A", "strategy":"CONNECT", "summary":"Reutilizar conexión existente tras superar gates", "eligible":not item["blockers"]},
        {"id":"B", "strategy":"ADAPT", "summary":"Adaptador subordinado con pruebas de contrato", "eligible":not item["blockers"]},
        {"id":"C", "strategy":"LAB", "summary":"Investigar en gemelo experimental sin promoción", "eligible":True},
    ]

def tick(db, registry, goal):
    if not isinstance(goal, dict) or not goal.get("statement") or not goal.get("acceptance"):
        raise ValueError("GOAL_AND_ACCEPTANCE_REQUIRED")
    inspected = inspect_registry(registry)
    added = []
    for item in inspected["capabilities"]:
        if item["ready"]: continue
        payload = {"schema": SCHEMA, "goal": goal, "capability":item, "options":options(item), "authority":"HUMAN", "execution":"PROPOSAL_ONLY"}
        pid = "G-" + digest(payload)[:20]
        exists = db.execute("SELECT id FROM proposals WHERE id=?", (pid,)).fetchone()
        if exists: continue
        db.execute("INSERT INTO proposals(id,subject,payload,status,created_at) VALUES(?,?,?,?,?)", (pid,item["id"],canonical(payload),"PENDING",now()))
        db.execute("INSERT INTO notifications(proposal_id,message,created_at) VALUES(?,?,?)", (pid,"ARKI solicita revisión: "+item["id"]+"; 3 alternativas disponibles",now()))
        added.append(pid)
    summary={"schema":SCHEMA,"goal":goal["statement"],"inspected":len(inspected["capabilities"]),"new_proposals":added,"cycles":inspected["cycles"]}
    db.execute("INSERT INTO runs(summary,created_at) VALUES(?,?)", (canonical(summary),now()))
    db.commit()
    return summary

def decision(db, pid, option, actor):
    if option not in ("A","B","C") or not actor.strip(): raise ValueError("INVALID_HUMAN_DECISION")
    row=db.execute("SELECT payload,status FROM proposals WHERE id=?",(pid,)).fetchone()
    if not row: raise ValueError("UNKNOWN_PROPOSAL")
    if row[1]!="PENDING": raise ValueError("ALREADY_DECIDED")
    payload=json.loads(row[0]); selected=next(o for o in payload["options"] if o["id"]==option)
    if not selected["eligible"]: raise ValueError("BLOCKED_OPTION")
    db.execute("UPDATE proposals SET status=?,decided_at=?,actor=? WHERE id=?",("APPROVED_OPTION_"+option,now(),actor,pid))
    db.commit()
    return {"proposal":pid,"selected":option,"actor":actor,"execution":"NOT_EXECUTED_REQUIRES_SEPARATE_GATE"}

def fetch_reference(url, max_bytes=250_000):
    parsed=urlparse(url)
    if parsed.scheme!="https" or parsed.hostname not in ALLOWED or parsed.username or parsed.password or parsed.port not in (None,443):
        raise ValueError("SOURCE_NOT_ALLOWLISTED")
    # No automatic crawling, redirects, credentials or arbitrary URLs.
    class NoRedirect(__import__('urllib.request',fromlist=['HTTPRedirectHandler']).HTTPRedirectHandler):
        def redirect_request(self,req,fp,code,msg,headers,newurl): raise ValueError("REDIRECT_BLOCKED")
    from urllib.request import build_opener
    opener=build_opener(NoRedirect)
    with opener.open(Request(url,headers={"User-Agent":"ARKI-Research-Observer/0.3"}),timeout=8) as response:
        data=response.read(max_bytes+1)
        if len(data)>max_bytes: raise ValueError("SOURCE_TOO_LARGE")
        return {"url":url,"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data),"content_type":response.headers.get("Content-Type","")}

def main():
    ap=argparse.ArgumentParser(description="ARKI local autonomous observer: proposal-only")
    ap.add_argument("command",choices=["once","watch","inbox","approve","research","status"])
    ap.add_argument("--db",default="guardian/guardian.sqlite3")
    ap.add_argument("--registry",default="examples/capabilities.json")
    ap.add_argument("--goal",default="guardian/goal.json")
    ap.add_argument("--interval",type=int,default=3600)
    ap.add_argument("--proposal")
    ap.add_argument("--option")
    ap.add_argument("--actor")
    ap.add_argument("--url")
    args=ap.parse_args()
    db=db_open(args.db)
    def cycle():
        registry=json.loads(Path(args.registry).read_text(encoding="utf8"))
        goal=json.loads(Path(args.goal).read_text(encoding="utf8"))
        return tick(db,registry,goal)
    if args.command=="once": print(json.dumps(cycle(),ensure_ascii=False,indent=2))
    elif args.command=="watch":
        if args.interval<60: raise ValueError("INTERVAL_MIN_60_SECONDS")
        print("ARKI Guardian activo; Ctrl+C para detener; no modifica código ni Core",flush=True)
        try:
            while True:
                try: print(json.dumps(cycle(),ensure_ascii=False),flush=True)
                except (OSError,ValueError) as e: print("OBSERVATION_FAILED:",e,flush=True)
                time.sleep(args.interval)
        except KeyboardInterrupt: pass
    elif args.command=="inbox":
        rows=db.execute("SELECT id,subject,status,created_at FROM proposals ORDER BY created_at DESC").fetchall()
        print(json.dumps([dict(zip(["id","subject","status","created_at"],r)) for r in rows],ensure_ascii=False,indent=2))
    elif args.command=="approve": print(json.dumps(decision(db,args.proposal or "",args.option or "",args.actor or ""),ensure_ascii=False,indent=2))
    elif args.command=="research":
        if not args.url: raise ValueError("URL_REQUIRED")
        finding=fetch_reference(args.url)
        db.execute("INSERT OR IGNORE INTO observations(id,kind,payload,created_at) VALUES(?,?,?,?)",(digest(finding),"RESEARCH_METADATA",canonical(finding),now()))
        db.commit(); print(json.dumps(finding,indent=2))
    elif args.command=="status":
        print(json.dumps({"pending":db.execute("SELECT count(*) FROM proposals WHERE status='PENDING'").fetchone()[0],"runs":db.execute("SELECT count(*) FROM runs").fetchone()[0],"observations":db.execute("SELECT count(*) FROM observations").fetchone()[0]},indent=2))
if __name__=="__main__": main()
