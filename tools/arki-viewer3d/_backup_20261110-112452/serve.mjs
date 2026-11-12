import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.resolve(__dirname, '../..');
const PUBLIC  = path.join(__dirname, 'public');
const ARCHIVE = path.join(ROOT, 'artifacts/_archive');
const portArg = process.argv.find(a => a.startsWith('--port=')) || '--port=7070';
const port    = Number(portArg.split('=')[1]);

const MIME = {
  '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.glb':'model/gltf-binary','.gltf':'model/gltf+json','.obj':'text/plain',
  '.ifc':'application/octet-stream','.log':'text/plain','.txt':'text/plain'
};
const json = (res,o,s=200)=>{res.writeHead(s,{'Content-Type':'application/json'});res.end(JSON.stringify(o));};

const server = http.createServer((req,res)=>{
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === '/api/runs') {
    const runs = fs.existsSync(ARCHIVE)
      ? fs.readdirSync(ARCHIVE).filter(d=>fs.statSync(path.join(ARCHIVE,d)).isDirectory()).sort().reverse()
      : [];
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
        const files = fs.readFileSync(p,'utf8').split('\n').filter(Boolean);
        return json(res, { files });
      }
    }
    return json(res, { files: [] });
  }

  // ── F11: registrar prueba libre ──────────────────────────────────
  if (url.pathname === '/api/f11' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { ts, text, targetPhase } = JSON.parse(body || '{}');
        if (!ts || !text) return json(res, { error: 'ts y text son obligatorios' }, 400);
        const dir = path.join(ARCHIVE, ts);
        if (!fs.existsSync(dir)) return json(res, { error: 'corrida no encontrada: '+ts }, 404);
        const file = path.join(dir, 'f11-annotations.json');
        const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : [];
        const entry = {
          id: Date.now(),
          text,
          targetPhase: targetPhase || null,
          at: new Date().toISOString(),
          status: 'RECORDED'   // no ejecutado — solo registrado
        };
        list.push(entry);
        fs.writeFileSync(file, JSON.stringify(list, null, 2));
        json(res, { ok: true, entry, count: list.length });
      } catch (e) { json(res, { error: String(e) }, 400); }
    });
    return;
  }

  // ── F11: listar pruebas de una corrida ───────────────────────────
  if (url.pathname.startsWith('/api/f11/')) {
    const ts = url.pathname.split('/')[3];
    const file = path.join(ARCHIVE, ts, 'f11-annotations.json');
    if (!fs.existsSync(file)) return json(res, { annotations: [] });
    try { return json(res, { annotations: JSON.parse(fs.readFileSync(file,'utf8')) }); }
    catch(e) { return json(res, { annotations: [] }); }
  }

  let full;
  if (url.pathname.startsWith('/assets/')) {
    full = path.join(ROOT, decodeURIComponent(url.pathname.slice('/assets/'.length)));
  } else {
    const p = url.pathname === '/' ? '/index.html' : url.pathname;
    full = path.join(PUBLIC, p);
  }
  if (!full.startsWith(ROOT)) return res.writeHead(403).end();
  if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) return res.writeHead(404).end('not found');
  res.writeHead(200,{'Content-Type':MIME[path.extname(full)]||'application/octet-stream'});
  fs.createReadStream(full).pipe(res);
});

server.listen(port, ()=>console.log(`ARKI F1–F10 + F11 · Visor 3D → http://localhost:${port}`));
