import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.resolve(__dirname, '../..');
const PUBLIC  = path.join(__dirname, 'public');
const ARCHIVE = path.join(ROOT, 'artifacts/_archive');
const RUNNER  = path.join(ROOT, 'scripts/arki-phase-evidence-runner.mjs');
const portArg = process.argv.find(a => a.startsWith('--port=')) || '--port=7070';
const port    = Number(portArg.split('=')[1]);

const CORE_URL = process.env.ARKI_CORE_URL || 'http://localhost:3000';
const CORE_PATH = '/api/core/projects';

// ¡AQUÍ ESTÁ LA VARIABLE QUE FALTABA!
const MIME = {
  '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.glb':'model/gltf-binary','.gltf':'model/gltf+json','.obj':'text/plain',
  '.ifc':'application/octet-stream','.log':'text/plain','.txt':'text/plain','.png':'image/png','.ico':'image/x-icon'
};

const json = (res,o,s=200)=>{res.writeHead(s,{'Content-Type':'application/json'});res.end(JSON.stringify(o));};
const tsNow = () => { const d=new Date(),p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`; };

const execState = { running: false, runTs: null, phases: [], current: null, done: 0, total: 0, results: {}, log: '', startedAt: null, finishedAt: null, error: null };

function runOnePhase(phase) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [RUNNER], { cwd: ROOT, env: { ...process.env, ARKI_PHASE: phase } });
    let buf = '';
    child.stdout.on('data', d => { buf += d; execState.log += d; });
    child.stderr.on('data', d => { buf += d; execState.log += d; });
    child.on('close', code => resolve({ code, buf }));
    child.on('error', err => resolve({ code: -1, buf: String(err) }));
  });
}

async function executeAll(phases) {
  execState.running = true; execState.runTs = tsNow(); execState.phases = phases;
  execState.current = null; execState.done = 0; execState.total = phases.length;
  execState.results = {}; execState.log = ''; execState.startedAt = new Date().toISOString();
  execState.finishedAt = null; execState.error = null;

  const outDir = path.join(ARCHIVE, execState.runTs);
  fs.mkdirSync(outDir, { recursive: true });
  const prevDir = path.join(ROOT, 'artifacts/arki-phase-evidence');
  if (fs.existsSync(prevDir)) try { fs.cpSync(prevDir, path.join(outDir, 'pre'), { recursive: true }); } catch(e){}

  try {
    for (const ph of phases) {
      execState.current = ph;
      execState.log += `\n===== RUN ${ph} =====\n`;
      const r = await runOnePhase(ph);
      execState.results[ph] = { code: r.code, at: new Date().toISOString() };
      fs.writeFileSync(path.join(outDir, `run-${ph}.log`), r.buf);
      const rec = path.join(prevDir, `receipt-${ph.toLowerCase()}.json`);
      if (fs.existsSync(rec)) try { fs.copyFileSync(rec, path.join(outDir, `receipt-${ph.toLowerCase()}.json`)); } catch(e){}
      execState.done++;
    }
  } catch (e) { execState.error = String(e); }
  finally { execState.running = false; execState.current = null; execState.finishedAt = new Date().toISOString(); }
}

const server = http.createServer((req,res)=>{
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === '/api/runs') {
    const runs = fs.existsSync(ARCHIVE) ? fs.readdirSync(ARCHIVE).filter(d=>fs.statSync(path.join(ARCHIVE,d)).isDirectory()).sort().reverse() : [];
    return json(res, runs);
  }

  if (url.pathname.startsWith('/api/run/')) {
    const ts  = url.pathname.split('/')[3];
    const dir = path.join(ARCHIVE, ts);
    if (!fs.existsSync(dir)) return json(res,{error:'not found'},404);
    const phases = {};
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^receipt-(f\d+)\.json$/i);
      if (m) { try { phases[m[1].toUpperCase()] = JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')); } catch(e){} }
    }
    return json(res, { ts, phases });
  }

  if (url.pathname === '/api/geometry') {
    if (!fs.existsSync(ARCHIVE)) return json(res,{files:[]});
    for (const d of fs.readdirSync(ARCHIVE).sort().reverse()) {
      const p = path.join(ARCHIVE, d, 'geometry-index.txt');
      if (fs.existsSync(p)) {
        const files = fs.readFileSync(p,'utf8').split('\n').filter(f => f.toLowerCase().match(/\.(glb|gltf)$/i));
        return json(res, { files });
      }
    }
    return json(res, { files: [] });
  }

  // ── ENVIAR AL SICL-WEB (puerto 3000) con Timeout ────────────────
  if (url.pathname === '/api/f11' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { ts, text, targetPhase } = JSON.parse(body || '{}');
        if (!ts || !text) return json(res, { error: 'ts y text son obligatorios' }, 400);
        const dir = path.join(ARCHIVE, ts);
        if (!fs.existsSync(dir)) return json(res, { error: 'corrida no encontrada' }, 404);
        
        const file = path.join(dir, 'f11-annotations.json');
        const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : [];
        list.push({ id: Date.now(), text, targetPhase: targetPhase || null, at: new Date().toISOString(), status: 'SENT_TO_CORE' });
        fs.writeFileSync(file, JSON.stringify(list, null, 2));

        let coreResponse = null;
        try {
          const fullUrl = `${CORE_URL}${CORE_PATH}`;
          console.log("Enviando a:", fullUrl);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const coreRes = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: text.slice(0, 50), description: text }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (coreRes.ok) {
            coreResponse = await coreRes.json();
          } else {
            const errText = await coreRes.text();
            coreResponse = { error: `Core HTTP ${coreRes.status}`, detail: errText };
          }
        } catch(e) {
          coreResponse = { error: 'No se pudo conectar al Core (timeout o caído)', detail: String(e) };
        }

        json(res, { ok: true, core: coreResponse });
      } catch (e) { json(res, { error: String(e) }, 400); }
    });
    return;
  }

  if (url.pathname.startsWith('/api/f11/')) {
    const ts = url.pathname.split('/')[3];
    const file = path.join(ARCHIVE, ts, 'f11-annotations.json');
    if (!fs.existsSync(file)) return json(res, { annotations: [] });
    try { return json(res, { annotations: JSON.parse(fs.readFileSync(file,'utf8')) }); } 
    catch(e) { return json(res, { annotations: [] }); }
  }

  if (url.pathname.startsWith('/api/output/')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const ts = parts[2], phase = parts[3];
    const dir = path.join(ARCHIVE, ts);
    if (!fs.existsSync(dir)) return json(res, { output: '', error: 'run no encontrado' }, 404);
    if (!phase || phase === 'all') {
      let out = '';
      for (const f of fs.readdirSync(dir).filter(f=>/^run-F\d+\.log$/.test(f)).sort()) out += `\n===== ${f} =====\n` + fs.readFileSync(path.join(dir,f),'utf8');
      return json(res, { output: out });
    }
    const file = path.join(dir, `run-${phase.toUpperCase()}.log`);
    if (!fs.existsSync(file)) return json(res, { output: '' });
    return json(res, { output: fs.readFileSync(file,'utf8') });
  }

  if (url.pathname === '/api/execute' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      if (execState.running) return json(res, { error: 'ya hay una ejecución en curso' }, 409);
      try {
        const { phases } = JSON.parse(body || '{}');
        const list = Array.isArray(phases) && phases.length ? phases.map(p => String(p).toUpperCase()) : ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10'];
        executeAll(list);
        json(res, { ok: true, runTs: execState.runTs, phases: list });
      } catch(e) { json(res, { error: String(e) }, 400); }
    });
    return;
  }

  if (url.pathname === '/api/execute/status') {
    return json(res, {
      running: execState.running, runTs: execState.runTs, phases: execState.phases,
      current: execState.current, done: execState.done, total: execState.total,
      results: execState.results, error: execState.error,
      logTail: execState.log.slice(-4000)
    });
  }

  let full;
  if (url.pathname.startsWith('/assets/')) full = path.join(ROOT, decodeURIComponent(url.pathname.slice('/assets/'.length)));
  else full = path.join(PUBLIC, url.pathname === '/' ? '/index.html' : url.pathname);

  if (!full.startsWith(ROOT)) return res.writeHead(403).end();
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) return res.writeHead(404).end('not found');
  res.writeHead(200,{'Content-Type':MIME[path.extname(full)]||'application/octet-stream'});
  fs.createReadStream(full).pipe(res);
});

server.listen(port, ()=>console.log(`ARKI F1–F11 · Visor 3D → http://localhost:${port}`));
