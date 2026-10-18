from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

from sicl.design_knowledge import list_items

OUT = Path('/tmp')
SCOPES = ['pais','macro_region','region','provincia_metropoli','distrito_ciudad','zona_barrio_sector','parcela_sitio','edificacion','sistema','espacio','objeto']
LABELS = ['País','Macro-región','Región','Provincia/Metrópoli','Distrito/Ciudad','Zona/Barrio/Sector','Parcela/Sitio','Edificación','Sistema','Espacio','Objeto']
items = [x for x in list_items() if x['knowledge_item_id'].startswith('ITEM-APL-')]
by_id = {x['knowledge_item_id']: x for x in items}
edges = [(x['knowledge_item_id'], target) for x in items for target in x['related_item_ids']]
counts = {scope: sum(scope in x['applicable_scales'] for x in items) for scope in SCOPES}

# For an interpretable aggregate network, assign each pattern to its first canonical scope.
primary = {x['knowledge_item_id']: x['applicable_scales'][0] for x in items}
edge_scope = Counter((primary[a], primary[b]) for a,b in edges if a in primary and b in primary)
M = [[edge_scope[(s,t)] for t in SCOPES] for s in SCOPES]

plt.style.use('dark_background')
fig = plt.figure(figsize=(19, 11), facecolor='#07111f')
gs = fig.add_gridspec(2, 2, height_ratios=[1, 1.35], hspace=.32, wspace=.18, top=.88)
accent = '#f2c94c'
blue = '#4ea1ff'
cyan = '#58d5c9'

ax = fig.add_subplot(gs[0, :])
ax.set_facecolor('#0b1b2d')
bars = ax.bar(range(len(SCOPES)), [counts[s] for s in SCOPES], color=[cyan if i < 6 else blue for i in range(11)], edgecolor='#dcecff', linewidth=.5)
ax.set_xticks(range(len(SCOPES)), LABELS, rotation=18, ha='right', fontsize=9)
ax.set_ylabel('Patrones aplicables (conteo por escala)', fontsize=11)
ax.set_title('APL-253 · Distribución multiescala', loc='left', fontsize=18, fontweight='bold', color='white')
ax.text(0, 1.02, 'Una referencia puede pertenecer a varias SpatialScopes; los conteos no suman 253.', transform=ax.transAxes, color='#9bb1c8', fontsize=10)
ax.grid(axis='y', alpha=.15)
for bar, value in zip(bars, counts.values()):
    ax.text(bar.get_x()+bar.get_width()/2, value+3, str(value), ha='center', va='bottom', fontsize=10, color='white')
ax.set_ylim(0, max(counts.values())*1.18)

ax2 = fig.add_subplot(gs[1, 0])
ax2.set_facecolor('#0b1b2d')
cmap = LinearSegmentedColormap.from_list('nightgold', ['#0b1b2d','#174b73','#4ea1ff','#f2c94c'])
im = ax2.imshow(M, cmap=cmap, aspect='auto')
ax2.set_xticks(range(11), LABELS, rotation=50, ha='right', fontsize=8)
ax2.set_yticks(range(11), LABELS, fontsize=8)
ax2.set_title('Relaciones APL par-escala\n(red agregada por escala primaria)', fontsize=13, loc='left')
ax2.set_xlabel('Escala primaria del destino')
ax2.set_ylabel('Escala primaria del origen')
for i in range(11):
    for j in range(11):
        if M[i][j]: ax2.text(j, i, str(M[i][j]), ha='center', va='center', fontsize=7, color='white')
fig.colorbar(im, ax=ax2, fraction=.046, pad=.04, label='Relaciones')

ax3 = fig.add_subplot(gs[1, 1])
ax3.set_facecolor('#0b1b2d')
nodes = [x['knowledge_item_id'] for x in items]
node_index = {node: i for i, node in enumerate(nodes)}
import numpy as np
angles = np.linspace(0, 2*np.pi, len(nodes), endpoint=False)
pos = {node: (np.cos(angle), np.sin(angle)) for node, angle in zip(nodes, angles)}
node_colors = [SCOPES.index(primary[n]) for n in nodes]
for source, target in edges:
    x1, y1 = pos[source]; x2, y2 = pos[target]
    ax3.plot([x1, x2], [y1, y2], color='#70a8d8', alpha=.035, linewidth=.3, zorder=1)
ax3.scatter([pos[n][0] for n in nodes], [pos[n][1] for n in nodes], s=20, c=node_colors, cmap=cmap, alpha=.95, linewidths=.15, edgecolors='white', zorder=2)
# Label only the 10 representative nodes to keep the full network readable.
rep = [f'ITEM-APL-{n:03d}' for n in [14,31,61,94,106,108,127,162,205,249]]
for n in rep:
    ax3.text(pos[n][0], pos[n][1], n.replace('ITEM-APL-','APL-'), fontsize=7, color='#f2c94c', ha='left', va='bottom')
ax3.set_title('Red de relaciones source-derived\n253 nodos · 2.265 enlaces · 0 aislados', fontsize=13, loc='left')
ax3.text(.01, .01, 'Color = escala primaria · etiquetas = muestra representativa', transform=ax3.transAxes, fontsize=8, color='#9bb1c8')
ax3.axis('off')

fig.suptitle('SiMS-DeI · Design Knowledge APL-253', fontsize=22, fontweight='bold', color='white', x=.04, ha='left', y=.985)
fig.text(.04, .945, 'Metadatos estructurados · relaciones source-derived · vista de cobertura y conectividad', color='#9bb1c8', fontsize=11)
fig.savefig(OUT/'APL253-spatialscopes-relations.png', dpi=180, bbox_inches='tight', facecolor=fig.get_facecolor())

# Separate high-resolution network-only view.
fig2, axn = plt.subplots(figsize=(15, 13), facecolor='#07111f')
axn.set_facecolor('#0b1b2d')
for source, target in edges:
    x1, y1 = pos[source]; x2, y2 = pos[target]
    axn.plot([x1, x2], [y1, y2], color='#70a8d8', alpha=.045, linewidth=.35, zorder=1)
axn.scatter([pos[n][0] for n in nodes], [pos[n][1] for n in nodes], s=28, c=node_colors, cmap=cmap, alpha=.95, linewidths=.2, edgecolors='white', zorder=2)
for n in rep:
    axn.text(pos[n][0], pos[n][1], n.replace('ITEM-APL-','APL-'), fontsize=8, color='#f2c94c', ha='left', va='bottom')
axn.set_title('APL-253 · Red source-derived\n253 patrones · 2.265 relaciones · 629 cross-scale bajo el criterio reportado', color='white', fontsize=18, loc='left', pad=15)
axn.text(.01, .01, 'Visualización topológica: posición = layout de red, no importancia arquitectónica.', transform=axn.transAxes, fontsize=9, color='#9bb1c8')
axn.axis('off')
fig2.savefig(OUT/'APL253-relationship-network.png', dpi=220, bbox_inches='tight', facecolor=fig2.get_facecolor())

summary = {'patterns': len(items), 'relationships': len(edges), 'isolated': len(set(by_id)-{n for e in edges for n in e}), 'scope_counts': counts, 'primary_scope_matrix': M}
(OUT/'APL253-visual-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2))
print(json.dumps(summary, ensure_ascii=False, indent=2))
print(f'OUTPUT={OUT}/APL253-spatialscopes-relations.png')
print(f'NETWORK={OUT}/APL253-relationship-network.png')
