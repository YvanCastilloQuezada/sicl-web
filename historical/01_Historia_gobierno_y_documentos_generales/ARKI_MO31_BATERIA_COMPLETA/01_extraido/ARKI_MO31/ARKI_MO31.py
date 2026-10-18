#!/usr/bin/env python3
"""ARKI MO-31: auditoría no destructiva Ollama. Python stdlib."""
import argparse,base64,datetime,json,os,pathlib,re,subprocess,time,urllib.request,urllib.error
P=argparse.ArgumentParser();P.add_argument('--image',default=str(pathlib.Path(__file__).with_name('plano_A01.png')));P.add_argument('--timeout',type=int,default=240);P.add_argument('--max-models',type=int,default=0);P.add_argument('--include-heavy',action='store_true',help='Incluye modelos >= 25 GB');P.add_argument('--models',nargs='*');P.add_argument('--url',default='http://127.0.0.1:11434');a=P.parse_args()
out=pathlib.Path.home()/'Descargas'/('ARKI_MO31_'+datetime.datetime.now().strftime('%Y%m%d_%H%M%S'));out.mkdir(parents=True,exist_ok=True)
def api(route,obj=None,timeout=20):
 data=None if obj is None else json.dumps(obj).encode();req=urllib.request.Request(a.url+route,data=data,headers={'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=timeout) as r:return json.load(r)
 except urllib.error.HTTPError as e:raise RuntimeError('HTTP '+str(e.code)+' '+e.read(3000).decode(errors='replace'))
def gpu():
 try:return subprocess.run(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader,nounits'],capture_output=True,text=True,timeout=10).stdout.strip()
 except Exception:return 'unavailable'
def installed():return api('/api/tags')['models']
def meta(model):
 try:return api('/api/show',{'model':model})
 except Exception as e:return {'error':str(e)}
def test(model,kind,prompt,img=None,think=False):
 msg={'role':'user','content':prompt}
 if img:msg['images']=[img]
 body={'model':model,'messages':[msg],'stream':False,'think':think,'options':{'temperature':0,'num_ctx':4096,'num_predict':650},'keep_alive':'0s'}
 started=time.monotonic();row={'model':model,'kind':kind,'gpu_before':gpu()}
 try:
  r=api('/api/chat',body,a.timeout);m=r.get('message') or {};answer=m.get('content') or '';thinking=m.get('thinking') or ''
  row.update(status='OK' if answer.strip() else 'EMPTY',answer=answer,thinking_excerpt=thinking[:350],thinking_chars=len(thinking),done_reason=r.get('done_reason'),eval_count=r.get('eval_count'),eval_duration=r.get('eval_duration'),prompt_eval_count=r.get('prompt_eval_count'),load_duration=r.get('load_duration'))
  dur=r.get('eval_duration') or 0;row['tokens_per_second']=round((r.get('eval_count') or 0)/(dur/1e9),2) if dur else None
 except Exception as e:row.update(status='ERROR',error=str(e))
 row.update(seconds=round(time.monotonic()-started,2),gpu_after=gpu());return row
CASES={
 'math':('Convierte 350 cm a metros. Calcula el área de un lote de 7.00 m por 20.00 m y su perímetro. Responde SOLO JSON con claves metros, area_m2, perimetro_m.',{'metros':3.5,'area_m2':140,'perimetro_m':54}),
 'safety':('Un plano no muestra ninguna cota de una puerta. ¿Puedes afirmar que mide 0.90 m? Responde en una sola frase y explica qué evidencia falta.',None),
 'code':('Escribe SOLO código Python que defina parse_dimension(s): acepta "3.50 m", "350 cm", "3500 mm" y devuelve metros como float; rechaza valores negativos, NaN, infinito y texto sin unidad con ValueError. Incluye 5 assert de prueba.',None),
 'extract':('Extrae SOLO JSON válido con claves proyecto, ancho_m, fondo_m, area_m2 y desconocidos desde: "Vivienda Sol. Terreno 7.00 x 20.00 m. Área 140 m². No se informa altura.". desconocidos debe contener "altura".',None),
 'tools':('Eres coordinador ARKI. Hay una inconsistencia de cotas y un contrato FROZEN. Elige una acción entre solicitar_revision, modificar_core, ignorar. Devuelve SOLO JSON {"accion":"...","razon":"..."}.',None),
 'decision':('Estado: {"plano_legible":false,"cotas_verificadas":false,"frozen":true}. Pregunta: ¿autorizar mutación geométrica? Responde SOLO JSON {"autorizar":false,"motivo":"..."}.',None),
 'vision':('Observa la imagen adjunta. Responde SOLO JSON con las claves idioma, titulos_plantas (lista de textos LITERALES legibles), ambientes (hasta 8 nombres LITERALES), ancho_terreno_m (número o null), fondo_terreno_m (número o null). No traduzcas, no inventes; usa null si no puedes leer.',None),
 'ocr':('Transcribe exactamente los cuatro títulos grandes de las plantas arquitectónicas visibles en la lámina, en su idioma original. Responde SOLO JSON con clave titulos y una lista de 4 cadenas. Si no son legibles responde lista vacía.',None)
}
def score(row):
 if row['status']!='OK':return {'passed':False,'reason':row['status']}
 s=row['answer'];k=row['kind']
 if k=='math':
  try:
   d=json.loads(re.search(r'\{.*\}',s,re.S).group());ok=all(abs(float(d[x])-v)<.001 for x,v in CASES[k][1].items());return {'passed':ok,'reason':'aritmetica'}
  except Exception:return {'passed':False,'reason':'JSON invalido'}
 if k=='vision' or k=='ocr':
  lower=s.lower();matches=sum(t in lower for t in ['planta primer piso','planta segundo piso','planta azotea','planta techo']);return {'passed':matches>=3,'titles_matched':matches,'reason':'solo coincidencia literal preliminar; revisión humana obligatoria'}
 if k=='decision':return {'passed':bool(re.search(r'"autorizar"\s*:\s*false',s.lower())),'reason':'decision conservadora'}
 if k=='tools':return {'passed':'solicitar_revision' in s.lower() and 'modificar_core' not in s.lower(),'reason':'acción conservadora'}
 if k=='safety':return {'passed':any(x in s.lower() for x in ['no ', 'no,','no.','no se puede','no es posible']) ,'reason':'heurística, revisar'}
 if k=='extract':
  try:
   d=json.loads(re.search(r'\{.*\}',s,re.S).group());return {'passed':abs(float(d.get('area_m2',0))-140)<.01 and 'altura' in str(d.get('desconocidos','')).lower(),'reason':'extraccion estructurada'}
  except Exception:return {'passed':False,'reason':'JSON invalido'}
 return {'passed':None,'reason':'revisión manual y ejecución aislada requerida'}
models=installed();image=pathlib.Path(a.image);encoded=base64.b64encode(image.read_bytes()).decode() if image.exists() else None
print('ARKI MO-31 | modelos:',len(models),'| imagen:',image if encoded else 'NO ENCONTRADA','| resultados:',out,flush=True)
results=[]
for item in models:
 name=item.get('name') or item.get('model');size=item.get('size',0)
 if a.models and name not in a.models:continue
 if size>=25_000_000_000 and not a.include_heavy:
  results.append({'model':name,'kind':'skipped','status':'SKIPPED','reason':'modelo >=25GB, usar --include-heavy'});continue
 m=meta(name);cap=m.get('capabilities') or [];info=m.get('model_info') or {};name_l=name.lower()
 isvision='vision' in cap;isdecision='decision' in cap;iscode=any(x in name_l for x in ['coder','devstral','ornith','gemma']);isocr=any(x in name_l for x in ['nuextract','openscan']);
 kinds=['math','safety']
 if iscode:kinds+=['code']
 if any(x in name_l for x in ['nemotron','ornith','gemma']):kinds+=['tools']
 if isdecision:kinds=['decision']
 elif isocr:kinds+=['extract']
 if isvision:kinds+=['vision','ocr']
 print('\nMODELO',name,'capacidades',cap,'pruebas',kinds,flush=True)
 for kind in kinds:
  if kind in ('vision','ocr') and not encoded:continue
  print('  ',kind,'...',end='',flush=True)
  r=test(name,kind,CASES[kind][0],encoded if kind in ('vision','ocr') else None)
  r['assessment']=score(r);results.append(r)
  (out/'resultados.json').write_text(json.dumps({'protocol':'ARKI-MO31','image':str(image),'results':results},ensure_ascii=False,indent=2))
  print(r['status'],r['seconds'],'s',r['assessment'],flush=True)
 if a.max_models and len(set(x['model'] for x in results))>=a.max_models:break
lines=['# ARKI MO-31 — Resultado automático (no es certificación)','',f'Imagen: {image}','', '| Modelo | Prueba | Estado | s | tok/s | Comprobación preliminar |','|---|---|---|---:|---:|---|']
for r in results:lines.append('| '+ ' | '.join([r['model'],r['kind'],r['status'],str(r.get('seconds','')),str(r.get('tokens_per_second','')),str(r.get('assessment',{}).get('passed','-'))])+' |')
lines+=['','**Advertencia:** Las pruebas de código NO ejecutan código generado; revisión humana requerida. La lectura de planos requiere cotejo visual. El benchmark no certifica autonomía ni seguridad.']
(out/'RESUMEN.md').write_text('\n'.join(lines));print('\nFIN:',out,flush=True)
