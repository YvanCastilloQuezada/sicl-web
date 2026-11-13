import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e17);
scene.fog = new THREE.Fog(0x0a0e17, 45, 220);

const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(18, 15, 25);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.getElementById('canvas-host').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 8, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 + 0.1;

scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(18, 32, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left:-32, right:32, top:32, bottom:-32 });
scene.add(sun);
scene.add(new THREE.GridHelper(60, 60, 0x223344, 0x0f1820));

const STATUS_COLOR = { PASS:0x2ecc71, PASS_WEB_ONLY:0xf1c40f, FAIL:0xe74c3c, BLOCKED:0xe67e22, NOT_RUN:0x7f8c8d, UNKNOWN:0x34495e, INPUT:0x9b59b6 };

const tower = new THREE.Group(); scene.add(tower);
const generatedGroup = new THREE.Group(); generatedGroup.position.set(20, 0, 0); scene.add(generatedGroup);
const meshes = {};
let phases = {};
let currentTs = null;

function statusOf(r){
  if (!r) return 'NOT_RUN';
  const s = String(r.status || r.result || '').toUpperCase();
  if (s.includes('PASS_WEB_ONLY')) return 'PASS_WEB_ONLY';
  if (s.includes('FAIL'))          return 'FAIL';
  if (s.includes('BLOCK'))         return 'BLOCKED';
  if (s.includes('PASS'))          return 'PASS';
  return 'UNKNOWN';
}

function buildTower(){
  while (tower.children.length) tower.remove(tower.children[0]);
  Object.keys(meshes).forEach(k=>delete meshes[k]);
  const H = 1.6, GAP = 0.25;
  for (let i=0;i<10;i++){
    const name = `F${i+1}`;
    const st   = statusOf(phases[name]);
    const color= STATUS_COLOR[st] ?? STATUS_COLOR.UNKNOWN;
    const geo  = new THREE.BoxGeometry(6, H, 6);
    const mat  = new THREE.MeshStandardMaterial({
      color, roughness:0.5, metalness:0.15,
      transparent: st==='NOT_RUN'||st==='UNKNOWN',
      opacity: (st==='NOT_RUN'||st==='UNKNOWN') ? 0.28 : 0.95,
      wireframe: st==='NOT_RUN'
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.y = i*(H+GAP) + H/2;
    m.userData = { phase:name, status:st, receipt: phases[name] };
    m.castShadow = m.receiveShadow = true;
    tower.add(m); meshes[name]=m;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color:0x000000, transparent:true, opacity:0.35 }));
    edges.position.copy(m.position); tower.add(edges);
  }
  // F11 Base
  const f11geo = new THREE.BoxGeometry(8, 0.9, 8);
  const f11mat = new THREE.MeshStandardMaterial({ color: STATUS_COLOR.INPUT, emissive: 0x4a235a, emissiveIntensity: 0.45, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.7 });
  const f11 = new THREE.Mesh(f11geo, f11mat);
  f11.position.y = -1.0;
  f11.userData = { phase: 'F11', status: 'INPUT', receipt: null };
  f11.castShadow = f11.receiveShadow = true;
  tower.add(f11); meshes['F11'] = f11;

  const cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 128;
  const cx = cvs.getContext('2d');
  cx.fillStyle = '#9b59b6'; cx.fillRect(0,0,256,128);
  cx.fillStyle = '#fff'; cx.font = 'bold 64px system-ui'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
  cx.fillText('F11 · ?', 128, 64);
  const tex = new THREE.CanvasTexture(cvs);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest:false }));
  label.position.set(0, 1.2, 0); label.scale.set(4, 2, 1);
  f11.add(label);
}

// ── Cargar SOLO GLB/GLTF (ignorar OBJ) ──
async function loadGeometry(files){
  while (generatedGroup.children.length) generatedGroup.remove(generatedGroup.children[0]);
  const gl = new GLTFLoader();
  for (const f of files){
    const url = '/assets/' + encodeURIComponent(f);
    try {
      const res = await gl.loadAsync(url);
      generatedGroup.add(res.scene);
    } catch(e){
      console.warn('Error cargando GLTF:', f);
    }
  }
}

const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();
renderer.domElement.addEventListener('click', e => {
  const r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX-r.left)/r.width)*2 - 1;
  mouse.y = -((e.clientY-r.top)/r.height)*2 + 1;
  ray.setFromCamera(mouse, camera);
  const hits = ray.intersectObjects(Object.values(meshes), false);
  if (!hits.length) return;
  const ph = hits[0].object.userData.phase;
  if (ph === 'F11') document.getElementById('f11-text').focus();
  else renderPanel(ph);
});

const $panel  = document.getElementById('panel');
const $status = document.getElementById('status-bar');
const $alt    = document.getElementById('alt-label');
const $sel    = document.getElementById('run-select');
const $f11Text = document.getElementById('f11-text');
const $f11Mic  = document.getElementById('f11-mic');
const $f11Send = document.getElementById('f11-send');
const $f11Exec = document.getElementById('f11-exec');
const $f11View = document.getElementById('f11-view');
const $f11Tgt  = document.getElementById('f11-target');
const $progWrap= document.getElementById('f11-progress-wrap');
const $progFill= document.getElementById('f11-progress-fill');
const $progTxt = document.getElementById('f11-progress-text');

function renderPanel(phase){
  const m = meshes[phase];
  if (!m){ $panel.innerHTML = '<p>Haz clic en un piso.</p>'; return; }
  const st = m.userData.status;
  const c  = (STATUS_COLOR[st] ?? STATUS_COLOR.UNKNOWN).toString(16).padStart(6,'0');
  $panel.innerHTML = `<h2>${phase} <span class="badge" style="background:#${c}">${st}</span></h2>
    <pre>${JSON.stringify(m.userData.receipt || {}, null, 2)}</pre>`;
}
function altOf(p){
  const list = Object.values(p).map(statusOf);
  if (!list.length) return '—';
  if (list.some(s=>s==='FAIL'||s==='BLOCKED')) return 'con fallos';
  if (list.every(s=>s==='PASS_WEB_ONLY')) return 'A · web-only';
  return 'mixta';
}
function legend(){
  document.getElementById('legend').innerHTML = Object.entries(STATUS_COLOR).map(([k,v])=>`<span class="legend-item"><i style="background:#${v.toString(16).padStart(6,'0')}"></i>${k}</span>`).join('');
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null, recording = false, baseText = '';

function updateMicUI(){
  if (recording) { $f11Mic.classList.add('rec'); $f11Mic.textContent = '⏹'; }
  else { $f11Mic.classList.remove('rec'); $f11Mic.textContent = '🎤'; }
}

if (SR) {
  recognition = new SR();
  recognition.lang = 'es-ES'; recognition.continuous = true; recognition.interimResults = true;
  recognition.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) baseText += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    $f11Text.value = (baseText + interim).replace(/\s+/g, ' ').trimStart();
    $f11Text.style.height = 'auto'; $f11Text.style.height = ($f11Text.scrollHeight) + 'px';
  };
  recognition.onerror = (e) => { if (e.error === 'not-allowed') { alert('Permiso denegado.'); recording = false; updateMicUI(); } };
  recognition.onend = () => { if (recording) { try { recognition.start(); } catch(e){} } else { updateMicUI(); } };
  $f11Mic.addEventListener('click', () => {
    if (!recording) { baseText = $f11Text.value ? $f11Text.value + ' ' : ''; try { recognition.start(); recording = true; updateMicUI(); } catch(e){ alert('Error mic.'); } }
    else { recording = false; try { recognition.stop(); } catch(e){} updateMicUI(); }
  });
} else { $f11Mic.disabled = true; }

$f11Text.addEventListener('input', () => { $f11Text.style.height = 'auto'; $f11Text.style.height = ($f11Text.scrollHeight) + 'px'; });

$f11Send.addEventListener('click', async () => {
  const text = $f11Text.value.trim();
  if (!text) { $f11Text.focus(); return; }
  if (!currentTs) { alert('Primero selecciona una corrida.'); return; }
  
  $f11Send.disabled = true; $f11Send.textContent = '⏳';
  try {
    const r = await fetch('/api/f11', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ts: currentTs, text, targetPhase: $f11Tgt.value || null })
    });
    const d = await r.json();
    if (d.ok) { 
      $f11Text.value = ''; $f11Text.style.height = 'auto';
      if (recording){ recording=false; try{recognition.stop();}catch(e){}; updateMicUI(); }
      
      // Mostrar la respuesta del Core o el error en el panel
      if (d.core && !d.core.error) {
        $panel.innerHTML = `<h2>Core Response <span class="badge" style="background:#3498db">F3/F6</span></h2>
          <pre>${JSON.stringify(d.core, null, 2)}</pre>`;
      } else if (d.core && d.core.error) {
        $panel.innerHTML = `<h2>Error del Core <span class="badge" style="background:#e74c3c">Desconectado</span></h2>
          <p style="font-size:12px;color:#e74c3c">${d.core.error}</p>
          <p style="font-size:11px;color:#9fb3c8">${d.core.detail || ''}</p>
          <p style="font-size:11px;color:#9fb3c8;margin-top:10px"><strong>Nota:</strong> La orden se ha guardado en la Fase F11 (como borrador), pero el Core no la ha procesado.</p>`;
      } else {
        $panel.innerHTML = `<h2>Nota guardada</h2><p>No se recibió respuesta del Core.</p>`;
      }
    }
    else alert('Error: ' + (d.error || 'desconocido'));
  } catch(e){ alert('Error de red: ' + e); }
  $f11Send.disabled = false; $f11Send.textContent = '⬆️';
});

let pollTimer = null;
function showProgress(current, done, total, msg){
  $progWrap.style.display = 'block';
  const pct = total ? Math.round((done/total)*100) : 0;
  $progFill.style.width = pct + '%';
  $progTxt.textContent = msg || (current ? `Ejecutando ${current} (${done}/${total})` : `${done}/${total}`);
}

async function pollStatus(){
  try {
    const s = await fetch('/api/execute/status').then(r=>r.json());
    if (s.running) {
      showProgress(s.current, s.done, s.total);
      $status.textContent = `▶ ${s.current || '…'} (${s.done}/${s.total})`;
    } else if (s.finishedAt) {
      showProgress(null, s.total, s.total, s.error ? '❌ Error' : `✓ ${s.total} fases`);
      $status.textContent = s.error ? 'Ejecución con error' : 'Ejecución completada';
      clearInterval(pollTimer); pollTimer = null;
      $f11Exec.disabled = false; $f11Exec.textContent = '▶️';
      if (s.runTs) {
        const runs = await fetch('/api/runs').then(r=>r.json());
        $sel.innerHTML = runs.map(r=>`<option value="${r}">${r}</option>`).join('');
        $sel.value = s.runTs;
        await loadRun(s.runTs);
      }
      setTimeout(()=>{ $progWrap.style.display = 'none'; }, 4000);
    }
  } catch(e){}
}

$f11Exec.addEventListener('click', async () => {
  if (pollTimer) return;
  const phase = $f11Tgt.value;
  const phases = phase ? [phase] : ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10'];
  if (!confirm(`¿Ejecutar ${phases.length === 10 ? 'F1–F10' : phase} ahora?`)) return;
  
  $f11Exec.disabled = true; $f11Exec.textContent = '⏳';
  showProgress(null, 0, phases.length, 'Iniciando…');
  try {
    const r = await fetch('/api/execute', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ phases })
    });
    const d = await r.json();
    if (!d.ok) throw new Error(d.error || 'no iniciado');
    pollTimer = setInterval(pollStatus, 1200);
    pollStatus();
  } catch(e){
    alert('No se pudo ejecutar: ' + e.message);
    $f11Exec.disabled = false; $f11Exec.textContent = '▶️';
    $progWrap.style.display = 'none';
  }
});

$f11View.addEventListener('click', async () => {
  if (!currentTs){ alert('Primero selecciona una corrida.'); return; }
  const phase = $f11Tgt.value || 'all';
  $panel.innerHTML = `<h2>👁 Salida · ${phase === 'all' ? 'todas' : phase}</h2><pre>Cargando…</pre>`;
  try {
    const d = await fetch(`/api/output/${currentTs}/${phase}`).then(r=>r.json());
    $panel.innerHTML = `<h2>👁 Salida · ${phase === 'all' ? 'todas' : phase} <span class="badge" style="background:#3498db">${currentTs}</span></h2><pre>${(d.output||'(vacío)').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</pre>`;
  } catch(e){ $panel.innerHTML = `<h2>👁 Salida</h2><pre>Error: ${e}</pre>`; }
});

async function loadRun(ts){
  currentTs = ts;
  $status.textContent = 'Cargando ' + ts + '…';
  const data = await fetch('/api/run/'+ts).then(r=>r.json());
  phases = data.phases || {};
  buildTower();
  $alt.textContent = 'Alternativa: ' + altOf(phases);
  const g = await fetch('/api/geometry?ts='+encodeURIComponent(ts)).then(r=>r.json());
  if (g.files?.length) await loadGeometry(g.files);
  $status.textContent = `Corrida ${ts} · ${Object.keys(phases).length} fases`;
}

async function boot(){
  legend();
  const runs = await fetch('/api/runs').then(r=>r.json());
  if (!runs.length){ $status.textContent = 'Sin corridas. Usa ▶️ para ejecutar.'; return; }
  $sel.innerHTML = runs.map(r=>`<option value="${r}">${r}</option>`).join('');
  $sel.addEventListener('change', ()=>loadRun($sel.value));
  await loadRun(runs[0]);
}

(function loop(){ requestAnimationFrame(loop); controls.update(); renderer.render(scene,camera); })();
addEventListener('resize', ()=>{ camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
boot();
