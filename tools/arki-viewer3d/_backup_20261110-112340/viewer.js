import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader }     from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e17);
scene.fog = new THREE.Fog(0x0a0e17, 40, 200);

const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(20, 20, 28);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.getElementById('canvas-host').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 8, 0);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(18, 32, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left:-30, right:30, top:30, bottom:-30 });
scene.add(sun);
scene.add(new THREE.GridHelper(60, 60, 0x223344, 0x0f1820));

const STATUS_COLOR = {
  PASS:          0x2ecc71,
  PASS_WEB_ONLY: 0xf1c40f,
  FAIL:          0xe74c3c,
  BLOCKED:       0xe67e22,
  NOT_RUN:       0x7f8c8d,
  UNKNOWN:       0x34495e
};

const tower = new THREE.Group(); scene.add(tower);
const meshes = {};
let phases = {};

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
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color:0x000000, transparent:true, opacity:0.35 })
    );
    edges.position.copy(m.position);
    tower.add(edges);
  }
}

async function loadGeometry(files){
  const old = scene.getObjectByName('imported'); if (old) scene.remove(old);
  const group = new THREE.Group();
  group.name = 'imported';
  group.position.set(20, 0, 0);
  scene.add(group);
  const gl = new GLTFLoader();
  const ol = new OBJLoader();
  for (const f of files){
    const url = '/assets/' + encodeURIComponent(f);
    const low = f.toLowerCase();
    try {
      if (low.endsWith('.glb') || low.endsWith('.gltf')) group.add((await gl.loadAsync(url)).scene);
      else if (low.endsWith('.obj'))                    group.add(await ol.loadAsync(url));
    } catch(e){ console.warn('load fail', f, e); }
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
  if (hits.length) renderPanel(hits[0].object.userData.phase);
});

const $panel  = document.getElementById('panel');
const $status = document.getElementById('status-bar');
const $alt    = document.getElementById('alt-label');
const $sel    = document.getElementById('run-select');

function renderPanel(phase){
  const m = meshes[phase];
  if (!m){ $panel.innerHTML = '<p>Haz clic en un piso.</p>'; return; }
  const st = m.userData.status;
  const c  = (STATUS_COLOR[st] ?? STATUS_COLOR.UNKNOWN).toString(16).padStart(6,'0');
  $panel.innerHTML = `<h2>${phase}
    <span class="badge" style="background:#${c}">${st}</span></h2>
    <pre>${JSON.stringify(m.userData.receipt || {}, null, 2)}</pre>`;
}

function altOf(p){
  const list = Object.values(p).map(statusOf);
  if (!list.length) return '—';
  if (list.every(s=>s==='NOT_RUN')) return 'A0 · vacía';
  if (list.every(s=>s==='PASS_WEB_ONLY')) return 'A · web-only';
  if (list.every(s=>s==='PASS')) return 'B · web+core (si receipts lo indican)';
  if (list.some(s=>s==='FAIL'||s==='BLOCKED')) return 'con fallos';
  return 'mixta';
}

function legend(){
  document.getElementById('legend').innerHTML =
    Object.entries(STATUS_COLOR).map(([k,v])=>
      `<span class="legend-item"><i style="background:#${v.toString(16).padStart(6,'0')}"></i>${k}</span>`
    ).join('');
}

async function loadRun(ts){
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
  if (!runs.length){
    $status.textContent = 'Sin corridas en artifacts/_archive/. Ejecuta run-safe.sh.';
    return;
  }
  $sel.innerHTML = runs.map(r=>`<option value="${r}">${r}</option>`).join('');
  $sel.addEventListener('change', ()=>loadRun($sel.value));
  await loadRun(runs[0]);
}

(function loop(){ requestAnimationFrame(loop); controls.update(); renderer.render(scene,camera); })();
addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
boot();
