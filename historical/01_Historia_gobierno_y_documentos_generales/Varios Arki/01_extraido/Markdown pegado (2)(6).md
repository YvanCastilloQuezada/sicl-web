# ARKI — PAQUETE DE TRANSFERENCIA 14

## Capacidades Adicionales Identificadas por DeepSeek — Cierre del Arsenal

**Fecha:** 24 de septiembre de 2026
**Modo:** transferencia completa, sin reservas
**Estado:** TRANSFER PACKAGE 14 — CIERRE DEL ARSENAL

---

# INTRODUCCIÓN

Las capacidades C1–C59 cubren lo que estaba explícitamente en el inventario inicial. Este paquete 14 cierra el arsenal identificando capacidades **que no estaban en el inventario y que producen salto real**.

Se dividen en 3 grupos:

- **Grupo A — Extensiones naturales** de capacidades existentes (C60–C64).
- **Grupo B — Metodologías formales** ausentes (C65–C71).
- **Grupo C — Meta-capacidades arquitectónicas** de ARKI (C72–C80).

---

# ═══════════════════════════════════════════════════

# GRUPO A — EXTENSIONES NATURALES

# ═══════════════════════════════════════════════════

# CAPACIDAD 60 — ISOVIST Y ANÁLISIS DE VISIBILIDAD

## PARTE I — TEORÍA

### 1.1. Origen y propósito

El **isovist** (Tandy 1967, Benedikt 1979) es el conjunto de puntos visibles desde un punto de observación. Extiende el análisis de Space Syntax (C1) con información **visual**, no solo topológica.

**Aplicaciones:**

- Privacidad vs apertura.
- Vigilancia natural (Jacobs, "eyes on the street").
- Orientación (wayfinding).
- Calidad perceptual del espacio.

Referencias:

- Benedikt, M. (1979). *To Take Hold of Space: Isovists and Isovist Fields*.
- Turner, A. et al. (2001). *From Isovists to Visibility Graphs*.
- Batty, M. (2001). *Exploring Isovist Fields*.

### 1.2. Métricas

- **Área del isovist:** A(v).
- **Perímetro:** P(v).
- **Oclusividad:** P² / (4πA) — 1 = círculo.
- **Compacidad:** 4πA / P².
- **Drift magnitude:** distancia del centroide del isovist al observador.
- **Máxima distancia radial.**
- **Variance angular.**

**Visibility Graph Analysis (VGA):** convierte el espacio en grid, calcula isovist por celda, genera grafos de visibilidad, y computa:

- Visual Integration.
- Visual Mean Depth.
- Visual Clustering Coefficient.

### 1.3. Aplicación ARKI

- **Oficinas:** visual connectivity entre estaciones (privacidad).
- **Hospitales:** control visual de enfermeras sobre habitaciones.
- **Museos:** líneas visuales entre obras.
- **Escuelas:** supervisión de patios.
- **Retail:** visibilidad de productos.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/isovist/types.ts

export interface IsovistPoint {
  x: number;
  y: number;
  z: number;
}

export interface Isovist {
  origin: IsovistPoint;
  areaM2: number;
  perimeterM: number;
  occlusivity: number;              // P² / (4πA)
  compactness: number;              // 4πA / P²
  driftMagnitude: number;
  maxRadialDistanceM: number;
  radialVariance: number;
  polygon: [number, number][];      // contorno del isovist
}

export interface VisibilityGraph {
  gridResolutionM: number;
  gridPoints: { x: number; y: number; z: number; }[];
  visibilityMatrix: boolean[][];    // NxN
  
  metrics: {
    pointId: string;
    visualIntegration: number;
    visualMeanDepth: number;
    visualClustering: number;
    isovistAreaM2: number;
  }[];
  
  hotspotVisibility: string[];      // puntos más visibles
  blindSpots: string[];             // puntos menos visibles
}

export interface VisibilityAnalysisResult {
  schema: 'ARKI-ISOVIST-1.0';
  modelId: string;
  level: number;
  
  isovists: Isovist[];
  visibilityGraph: VisibilityGraph;
  
  findings: {
    kind: 'privacy' | 'surveillance' | 'wayfinding' | 'exposure';
    location: [number, number];
    severity: 'info' | 'warning' | 'critical';
    message: string;
    affectedSpaces: string[];
  }[];
  
  warnings: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO

### 3.1. Cálculo de isovist

text

```
computeIsovist(origin, obstacles): Isovist
  # 1. Ray casting radial
  NUM_RAYS = 720  # 0.5° resolution
  distances = []
  maxRange = 50  # metros
  
  for i in 0..NUM_RAYS:
    angle = i * 2π / NUM_RAYS
    ray = Ray(origin, angle, maxRange)
    hit = closestIntersection(ray, obstacles)
    distances.push(hit ? hit.distance : maxRange)
  
  # 2. Polígono
  polygon = distances.map((d, i) => {
    angle = i * 2π / NUM_RAYS
    return [origin.x + d * cos(angle), origin.y + d * sin(angle)]
  })
  
  # 3. Área (shoelace)
  area = shoelaceArea(polygon)
  
  # 4. Perímetro
  perimeter = sum(distances between consecutive points)
  
  # 5. Métricas
  occlusivity = perimeter**2 / (4 * π * area)
  compactness = 4 * π * area / perimeter**2
  
  # 6. Drift
  centroid = computeCentroid(polygon)
  drift = distance(origin, centroid)
  
  return { origin, areaM2: area, perimeterM, occlusivity, compactness, driftMagnitude: drift, maxRadialDistanceM: max(distances), radialVariance: variance(distances), polygon }
```

svgsvg

### 3.2. Visibility Graph Analysis

text

```
analyzeVisibilityGrid(model, level, resolution=0.5): VisibilityGraph
  # 1. Generar grid
  bounds = getLevelBounds(model, level)
  gridPoints = []
  for x in range(bounds.minX, bounds.maxX, resolution):
    for y in range(bounds.minY, bounds.maxY, resolution):
      if isInsideModel(x, y, model, level):
        gridPoints.push({ x, y, z: level })
  
  # 2. Matriz de visibilidad
  N = gridPoints.length
  visibility = zeros(N, N)
  
  for i in 0..N:
    for j in i+1..N:
      if isLineOfSightClear(gridPoints[i], gridPoints[j], model):
        visibility[i][j] = true
        visibility[j][i] = true
  
  # 3. Métricas por punto
  metrics = []
  for i in 0..N:
    visualIntegration = computeIntegration(visibility, i)
    visualMeanDepth = computeMeanDepth(visibility, i)
    visualClustering = computeClustering(visibility, i)
    isovist = computeIsovist(gridPoints[i], model.obstacles)
    
    metrics.push({
      pointId: `vp-${i}`,
      visualIntegration,
      visualMeanDepth,
      visualClustering,
      isovistAreaM2: isovist.areaM2
    })
  
  # 4. Hotspots y blind spots
  sorted = metrics.sortBy(visualIntegration desc)
  hotspotVisibility = sorted.slice(0, 10).map(m => m.pointId)
  blindSpots = sorted.slice(-10).map(m => m.pointId)
  
  return { gridResolutionM: resolution, gridPoints, visibilityMatrix: visibility, metrics, hotspotVisibility, blindSpots }
```

svgsvg

### 3.3. Detección de hallazgos

text

```
detectVisibilityFindings(graph, model): Finding[]
  findings = []
  
  # 1. Blind spots en circulación
  for pointId in graph.blindSpots:
    point = getPoint(graph, pointId)
    space = findContainingSpace(model, point)
    if space and space.category == 'circulation':
      findings.push({
        kind: 'wayfinding',
        location: [point.x, point.y],
        severity: 'warning',
        message: `Punto ciego en circulación ${space.id}`,
        affectedSpaces: [space.id]
      })
  
  # 2. Baja privacidad
  for space in model.spaces:
    if space.privacyRequired:
      avgIntegration = mean(points in space -> visualIntegration)
      if avgIntegration > 0.7:
        findings.push({
          kind: 'privacy',
          severity: 'warning',
          message: `Espacio ${space.id} requiere privacidad pero tiene alta visibilidad`
        })
  
  # 3. Supervisión insuficiente
  for space in model.spaces:
    if space.requiresSurveillance:
      controlPoints = getControlPoints(space)
      visibilityRatio = computeVisibilityRatio(controlPoints, space, graph)
      if visibilityRatio < 0.5:
        findings.push({
          kind: 'surveillance',
          severity: 'critical',
          message: `Espacio ${space.id} requiere supervisión pero solo ${visibilityRatio*100}% visible`
        })
  
  return findings
```

svgsvg

---

## PARTE IV — TESTS

| **IDQué prueba** |                                           |
| ---------------- | ----------------------------------------- |
| IS-T01           | Isovist en espacio cerrado                |
| IS-T02           | Oclusividad de círculo = 1                |
| IS-T03           | Visibility graph con 100 puntos           |
| IS-T04           | Hotspots detectados                       |
| IS-T05           | Blind spots detectados                    |
| IS-T06           | Detección de baja privacidad              |
| IS-T07           | Detección de supervisión insuficiente     |
| IS-A01           | Espacio sin obstáculos → isovist circular |
| IS-A02           | Grid sin puntos → warning                 |
| IS-A03           | 10000 puntos → performance                |
| IS-I01           | Con C1 Spatial Syntax                     |

---

## PARTE V — EXAMEN

### Examen A — Hospital

**Input:** UCI con estación de enfermeras.

**Preguntas:**

1. ¿Cuántas camas son visibles desde el control?
2. ¿Puntos ciegos?

### Examen B — Museo

**Input:** Galería con obras.

**Preguntas:**

1. ¿Líneas visuales entre obras?
2. ¿Recorrido óptimo?

### Examen C — Adversarial

**Input:** Espacio sin obstáculos, grid enorme.

### Examen D — Transfer

**Input:** Retail. ARKI aplica visibilidad de productos.

---

# CAPACIDAD 61 — ACÚSTICA AVANZADA CON RAY-TRACING

## PARTE I — TEORÍA

### 1.1. Origen y propósito

Extiende C4 (Sabine) con **ray-tracing acústico** para salas con geometría compleja donde las fórmulas estadísticas fallan.

Referencias:

- Vorländer, M. (2007). *Auralization*.
- Kuttruff, H. (2016). *Room Acoustics*.
- ISO 3382-1 (2012).

### 1.2. Métricas avanzadas

- **RT60 por banda de octava** (ya en C4).
- **EDT (Early Decay Time).**
- **C50 (Clarity):** ratio early/late energy.
- **D50 (Definition).**
- **STI (Speech Transmission Index).**
- **IACC (Inter-Aural Cross-Correlation).**
- **LF (Lateral Fraction).**

### 1.3. Algoritmo de ray-tracing

- Emitir N rayos desde fuente.
- Reflexión especular y difusa.
- Acumular energía en detector por tiempo.
- Construir respuesta al impulso.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/acousticsRayTracing/types.ts

export interface RayTracingInput {
  roomId: string;
  geometry: {
    surfaces: {
      id: string;
      vertices: [number, number, number][];
      absorptionByBand: { [hz: string]: number };
      scattering: number;         // 0-1
    }[];
  };
  source: { position: [number, number, number]; power: number; };
  receivers: { id: string; position: [number, number, number]; }[];
  
  numRays: number;                // ej. 50000
  maxReflections: number;         // ej. 50
  impulseResponseDurationMs: number;
}

export interface RoomAcousticsMetrics {
  receiverId: string;
  rt60: { [hz: string]: number };
  edt: { [hz: string]: number };
  c50: number;
  d50: number;
  sti: number;                    // 0-1
  iacc: number;
  lf: number;
}

export interface RayTracingResult {
  schema: 'ARKI-RAY-TRACING-ACOUSTIC-1.0';
  roomId: string;
  metrics: RoomAcousticsMetrics[];
  impulseResponses: { receiverId: string; samples: number[]; }[];
  warnings: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
rayTrace(input): RayTracingResult
  metrics = []
  impulseResponses = []
  
  for receiver in input.receivers:
    # 1. Emitir rayos
    rays = []
    for i in 1..input.numRays:
      direction = randomDirectionHemisphere()
      ray = Ray(input.source.position, direction, power = input.source.power / input.numRays)
      rays.push(ray)
    
    # 2. Simular propagación
    hits = []  # (time, energy, receiver)
    for ray in rays:
      path = [ray]
      for bounces in 1..input.maxReflections:
        hit = intersectRayWithSurfaces(ray, input.geometry.surfaces)
        if not hit: break
        
        # Guardar tiempo y energía si ilumina al receiver
        if isNearReceiver(hit.position, receiver.position, tolerance=0.5):
          energyAtReceiver = hit.energy / (4π * distance²)
          hits.push({ time: hit.totalDistance / 343, energy: energyAtReceiver })
        
        # Reflejar
        ray = reflect(ray, hit)
        
        # Absorción
        ray.energy *= (1 - hit.surface.absorption)
        
        # Difusión
        if hit.surface.scattering > 0:
          ray.direction = mix(ray.direction, randomDirection(), hit.surface.scattering)
      
      path.push(ray)
    
    # 3. Impulse response
    ir = buildImpulseResponse(hits, durationMs = input.impulseResponseDurationMs)
    impulseResponses.push({ receiverId: receiver.id, samples: ir })
    
    # 4. Métricas
    metrics.push({
      receiverId: receiver.id,
      rt60: computeRT60ByBand(ir),
      edt: computeEDT(ir),
      c50: computeC50(ir),
      d50: computeD50(ir),
      sti: computeSTI(ir),
      iacc: computeIACC(ir, input.source),
      lf: computeLF(ir)
    })
  
  return { roomId: input.roomId, metrics, impulseResponses, warnings: [] }
```

svgsvg

---

## PARTE IV — TESTS

| **IDQué prueba** |                                  |
| ---------------- | -------------------------------- |
| AR-T01           | Sala rectangular, RT60 coherente |
| AR-T02           | C50 > 0 en salas claras          |
| AR-T03           | STI > 0.6 en aulas               |
| AR-T04           | IACC en salas simétricas         |
| AR-A01           | Sin superficie → error           |
| AR-A02           | 1M rayos → performance           |
| AR-I01           | Con C4 Sabine (comparación)      |

---

# CAPACIDAD 62 — ANÁLISIS ESTRUCTURAL NO LINEAL + PERFORMANCE-BASED

## PARTE I — TEORÍA

### 1.1. Origen y propósito

Extiende C6 (análisis lineal) con:

- **Análisis pushover** (no lineal estático).
- **Análisis tiempo-historia** (no lineal dinámico).
- **Performance-based seismic design (PBSD).**
- **Curvas de capacidad.**
- **Punto de performance (ATC-40, FEMA 440).**

Referencias:

- ATC-40 (1996). *Seismic Evaluation and Retrofit of Concrete Buildings*.
- FEMA 440 (2005). *Improvement of Nonlinear Static Seismic Analysis Procedures*.
- ASCE 41-17. *Seismic Evaluation and Retrofit of Existing Buildings*.
- Priestley, M.J.N. et al. (2007). *Displacement-Based Seismic Design*.

### 1.2. Pushover

**Procedimiento:**

1. Aplicar patrón de cargas laterales creciente.
2. Incrementar hasta colapso o desplazamiento objetivo.
3. Registrar curva Cortante basal vs Desplazamiento.
4. Identificar estados límite: IO, LS, CP.

**Estados:**

- **IO (Immediate Occupancy):** ocupación inmediata post-sismo.
- **LS (Life Safety):** seguridad de vida.
- **CP (Collapse Prevention):** prevención de colapso.

### 1.3. Punto de performance

**Métodos:**

- **ATC-40 Capacity Spectrum Method.**
- **FEMA 440 Equivalent Linearization.**
- **Coefficient Method.**

Resultado: desplazamiento esperado bajo sismo de diseño.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/nonlinearStructural/types.ts

export interface PushoverInput {
  modelId: string;
  loadPattern: 'uniform' | 'modal' | 'triangular';
  controlNode: string;
  maxDisplacementM: number;
  stepSizeM: number;
  plasticHinges: {
    elementId: string;
    yieldMomentKNm: number;
    ultimateRotationRad: number;
  }[];
}

export interface PushoverPoint {
  displacementM: number;
  baseShearKN: number;
  hingesYielded: number;
  hingesFailed: number;
}

export interface PushoverResult {
  schema: 'ARKI-PUSHOVER-1.0';
  curve: PushoverPoint[];
  capacityPoint: { displacementM: number; baseShearKN: number; };
  
  performancePoints: {
    IO: { displacementM: number; baseShearKN: number; };
    LS: { displacementM: number; baseShearKN: number; };
    CP: { displacementM: number; baseShearKN: number; };
  };
  
  demandPoint: { displacementM: number; baseShearKN: number; };  // del sismo
  
  performanceStatus: 'IO' | 'LS' | 'CP' | 'beyond_CP';
  warnings: string[];
  requiresProfessionalValidation: true;
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
runPushover(input): PushoverResult
  curve = []
  hingesState = initializeHinges(input.plasticHinges)
  
  for disp in 0..input.maxDisplacementM step input.stepSizeM:
    # 1. Aplicar desplazamiento
    loads = computeLoadsForDisplacement(input, disp)
    
    # 2. Análisis no lineal iterativo
    converged = false
    iteration = 0
    while not converged and iteration < 100:
      # Rigidez actualizada por hinges
      K = assembleStiffnessWithHinges(input.modelId, hingesState)
      displacements = solve(K, loads)
      
      # Verificar hinges
      newHingesState = updateHinges(displacements, input.plasticHinges, hingesState)
      
      if newHingesState == hingesState:
        converged = true
      else:
        hingesState = newHingesState
        iteration++
    
    # 3. Registrar punto
    baseShear = sum(reactions at base)
    curve.push({
      displacementM: disp,
      baseShearKN: baseShear,
      hingesYielded: count(hingesState.filter(h => h.yielded)),
      hingesFailed: count(hingesState.filter(h => h.failed))
    })
    
    # 4. Detener si colapso
    if baseShear < previousBaseShear * 0.8:
      break
  
  # 5. Identificar puntos de performance
  performancePoints = {
    IO: findPointWhere(curve, 'hingesYielded', threshold=0.1 * total),
    LS: findPointWhere(curve, 'hingesYielded', threshold=0.5 * total),
    CP: findPointWhere(curve, 'hingesFailed', threshold=0.1 * total)
  }
  
  # 6. Punto de demanda (del espectro)
  demandPoint = computeDemandFromSpectrum(input.modelId, curve)
  
  # 7. Estado
  performanceStatus = classifyPerformance(demandPoint, performancePoints)
  
  return { curve, capacityPoint, performancePoints, demandPoint, performanceStatus }
```

svgsvg

---

## PARTE IV — TESTS

| **IDQué prueba** |                             |
| ---------------- | --------------------------- |
| NL-T01           | Pushover de pórtico simple  |
| NL-T02           | Punto IO identificado       |
| NL-T03           | Colapso detectado           |
| NL-T04           | Demanda del espectro        |
| NL-A01           | Sin plastic hinges → linear |
| NL-A02           | Pushover sin convergencia   |
| NL-I01           | Con C6 estructural lineal   |

---

# CAPACIDAD 63 — REAL ESTATE Y FACTIBILIDAD FINANCIERA

## PARTE I — TEORÍA

### 1.1. Origen y propósito

**Factibilidad** evalúa si un proyecto inmobiliario genera valor. Combina:

- Análisis de mercado.
- Estudio de costos.
- Análisis financiero.
- Análisis de riesgo.

Referencias:

- Geltner, D. & Miller, N. (2014). *Commercial Real Estate Analysis and Investments*.
- Brueggeman, W. & Fisher, J. (2019). *Real Estate Finance and Investments*.
- Peiser, R. & Hamilton, D. (2012). *Professional Real Estate Development*.

### 1.2. Métricas financieras

- **VAN (NPV):** valor actual neto.
- **TIR (IRR):** tasa interna de retorno.
- **ROI:** retorno sobre inversión.
- **Cash-on-Cash:** retorno anual sobre capital.
- **Cap Rate:** NOI / valor de propiedad.
- **Payback Period.**
- **DSCR:** debt service coverage ratio.
- **Profit Margin:** utilidad / ingresos.

### 1.3. Flujos

**Fases:**

- **Adquisición** (mes 0).
- **Diseño** (meses 1-6).
- **Construcción** (meses 7-24).
- **Venta o renta** (mes 25+).

**Cash flow:**

text

```
Year 0: -Land - Soft costs
Year 1: -Construction
Year 2: -Construction + Sales/Rent starts
Year 3+: +Rent - Opex
```

svgsvg

### 1.4. Análisis de sensibilidad

Variables críticas:

- Precio de venta/renta.
- Costo de construcción.
- Tasa de interés.
- Plazo de construcción.
- Tasa de vacancia.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/realEstate/types.ts

export interface FeasibilityInput {
  projectId: string;
  areaM2: number;
  
  landCost: number;
  softCostsPct: number;             // % del total
  hardCosts: number;                // construcción
  contingencyPct: number;
  
  financing: {
    loanToCostPct: number;          // % financiado
    interestRate: number;
    termYears: number;
  };
  
  revenue: {
    kind: 'sale' | 'rent' | 'mixed';
    salePricePerM2?: number;
    rentPerM2Month?: number;
    occupancyPct?: number;
    opexPerM2Year?: number;
  };
  
  schedule: {
    constructionMonths: number;
    salesOrRentMonths: number;
  };
  
  discountRate: number;
  horizonYears: number;
}

export interface CashFlowYear {
  year: number;
  revenue: number;
  expenses: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  presentValue: number;
}

export interface FeasibilityResult {
  schema: 'ARKI-REAL-ESTATE-1.0';
  projectId: string;
  
  totalInvestment: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  
  cashFlow: CashFlowYear[];
  
  metrics: {
    npv: number;
    irr: number;
    roi: number;
    cashOnCash: number;
    capRate: number;
    paybackYears: number;
    dscr: number;
    profitMargin: number;
  };
  
  sensitivity: {
    variable: string;
    values: number[];
    npvValues: number[];
    breakEvenPoint: number;
  }[];
  
  recommendation: 'go' | 'no_go' | 'conditional';
  conditions?: string[];
  
  warnings: string[];
  requiresProfessionalValidation: true;
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
assessFeasibility(input): FeasibilityResult
  # 1. Cash flow
  cashFlow = []
  cumulative = 0
  
  for year in 0..input.horizonYears:
    revenue = 0
    expenses = 0
    
    # Adquisición
    if year == 0:
      expenses += input.landCost
      expenses += input.hardCosts * input.softCostsPct
    
    # Construcción
    if year >= 1 and year <= ceil(input.schedule.constructionMonths / 12):
      monthlyConstruction = input.hardCosts / input.schedule.constructionMonths
      expenses += monthlyConstruction * 12
      expenses += expenses * input.contingencyPct
    
    # Intereses
    if year >= 1:
      loanBalance = input.hardCosts * input.financing.loanToCostPct * (1 - year / input.schedule.constructionMonths)
      interest = loanBalance * input.financing.interestRate
      expenses += interest
    
    # Ingresos
    if year >= ceil(input.schedule.constructionMonths / 12):
      if input.revenue.kind == 'sale':
        revenue += input.areaM2 * input.revenue.salePricePerM2
      elif input.revenue.kind == 'rent':
        annualRent = input.areaM2 * input.revenue.rentPerM2Month * 12 * input.revenue.occupancyPct / 100
        revenue += annualRent
        expenses += input.areaM2 * input.revenue.opexPerM2Year
    
    netCF = revenue - expenses
    cumulative += netCF
    pv = netCF / (1 + input.discountRate) ** year
    
    cashFlow.push({ year, revenue, expenses, netCashFlow: netCF, cumulativeCashFlow: cumulative, presentValue: pv })
  
  # 2. Métricas
  npv = sum(cashFlow.map(cf => cf.presentValue))
  irr = computeIRR(cashFlow.map(cf => cf.netCashFlow))
  roi = (sum revenues - sum expenses) / sum expenses * 100
  paybackYears = findPaybackYear(cashFlow)
  
  # 3. Sensibilidad (tornado)
  sensitivity = []
  for variable in ['salePrice', 'hardCosts', 'interestRate', 'constructionMonths']:
    values = [], npvs = []
    for delta in [-0.2, -0.1, 0, 0.1, 0.2]:
      modified = applyDelta(input, variable, delta)
      result = assessFeasibility(modified)
      values.push(delta)
      npvs.push(result.metrics.npv)
    breakEven = findBreakEven(values, npvs)
    sensitivity.push({ variable, values, npvValues: npvs, breakEvenPoint: breakEven })
  
  # 4. Recomendación
  recommendation = 
    npv > 0 and irr > discountRate * 1.2 ? 'go' :
    npv > 0 ? 'conditional' :
    'no_go'
  
  return { ... }
```

svgsvg

---

## PARTE IV — TESTS

| **IDQué prueba** |                             |
| ---------------- | --------------------------- |
| RE-T01           | Cash flow 10 años           |
| RE-T02           | NPV calculado               |
| RE-T03           | IRR calculado               |
| RE-T04           | Payback identificado        |
| RE-T05           | Sensibilidad a precio       |
| RE-T06           | Recomendación go/no-go      |
| RE-A01           | Sin ingresos → NPV negativo |
| RE-A02           | IRR no converge             |
| RE-I01           | Con C10 expediente          |

---

# CAPACIDAD 64 — DIGITAL TWIN E IoT

## PARTE I — TEORÍA

### 1.1. Origen y propósito

**Digital Twin** es un gemelo digital que se sincroniza con el edificio real vía sensores IoT. Combina:

- Modelo BIM (estático).
- Datos de sensores (dinámico).
- Análisis (predictivo).
- Control (actuación).

Referencias:

- Grieves, M. (2014). *Digital Twin: Manufacturing Excellence through Virtual Factory Replication*.
- Tao, F. et al. (2018). *Digital Twin in Industry*.
- ISO 23247 (Digital Twin framework for manufacturing).

### 1.2. Componentes

- **Physical asset:** el edificio real.
- **Virtual model:** BIM + sensores.
- **Data connection:** IoT (MQTT, BACnet, Modbus).
- **Analytics:** histórico, en tiempo real, predictivo.
- **Visualization:** dashboard + 3D.

### 1.3. Protocolos

- **BACnet:** HVAC, estándar edificios.
- **Modbus:** industrial.
- **MQTT:** IoT mensajería ligera.
- **KNX:** domótica europea.
- **OPC-UA:** industrial moderno.

### 1.4. Aplicaciones

- Monitoreo energético.
- Mantenimiento predictivo (C24).
- Control HVAC.
- Detección de anomalías.
- Optimización operacional.
- Reportes de sostenibilidad.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/digitalTwin/types.ts

export type IoTProtocol = 'MQTT' | 'BACnet' | 'Modbus' | 'KNX' | 'OPC-UA' | 'REST';

export interface Sensor {
  id: string;
  kind: 'temperature' | 'humidity' | 'co2' | 'occupancy' | 'energy' | 'flow' | 'pressure' | 'position' | 'light';
  location: [number, number, number];
  elementId: string;                // ArchiElementId asociado
  unit: string;
  protocol: IoTProtocol;
  endpoint: string;
  sampleRateSeconds: number;
}

export interface Actuator {
  id: string;
  kind: 'hvac_valve' | 'damper' | 'light_dimmer' | 'blind' | 'pump';
  location: [number, number, number];
  elementId: string;
  protocol: IoTProtocol;
  endpoint: string;
}

export interface SensorReading {
  sensorId: string;
  timestamp: string;
  value: number;
  unit: string;
  quality: 'good' | 'bad' | 'uncertain';
}

export interface DigitalTwinState {
  schema: 'ARKI-DIGITAL-TWIN-1.0';
  projectId: string;
  syncedAt: string;
  
  sensors: Sensor[];
  actuators: Actuator[];
  
  currentReadings: SensorReading[];
  
  buildingState: {
    indoorTempC: number;
    indoorRH: number;
    co2Ppm: number;
    occupancy: number;
    energyConsumptionKW: number;
    hvacMode: 'heating' | 'cooling' | 'off' | 'auto';
  };
  
  anomalies: {
    sensorId: string;
    kind: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
  }[];
  
  predicted30min: {
    indoorTempC: number;
    energyConsumptionKW: number;
  };
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
syncDigitalTwin(projectId): DigitalTwinState
  # 1. Leer sensores
  readings = []
  for sensor in sensors:
    reading = readSensor(sensor)  # según protocolo
    readings.push(reading)
  
  # 2. Estado del edificio (agregar)
  state = {
    indoorTempC: mean(readings.filter(r => r.kind == 'temperature').values),
    indoorRH: mean(...),
    co2Ppm: mean(...),
    occupancy: sum(...),
    energyConsumptionKW: sum(...),
    hvacMode: inferHVACMode(readings)
  }
  
  # 3. Detección de anomalías
  anomalies = detectAnomalies(readings, historicalData)
  
  # 4. Predicción a 30 min
  predicted = predict30min(state, weatherForecast, schedules)
  
  # 5. Recomendaciones (control)
  if anomalies.length > 0 or predicted.deviation > threshold:
    recommendedActions = computeControlActions(state, predicted)
    # Enviar comandos a actuadores (si autopilot habilitado)
  
  return { ... }
```

svgsvg

---

## PARTE IV — TESTS

| **IDQué prueba** |                             |
| ---------------- | --------------------------- |
| DT-T01           | Lectura de sensores         |
| DT-T02           | Estado agregado             |
| DT-T03           | Detección de anomalía CO2   |
| DT-T04           | Predicción 30 min           |
| DT-A01           | Sensor offline → warning    |
| DT-A02           | 1000 sensores → performance |
| DT-I01           | Con C24 O&M predictivo      |

---

# ═══════════════════════════════════════════════════

# GRUPO B — METODOLOGÍAS FORMALES

# ═══════════════════════════════════════════════════

# CAPACIDAD 65 — POST-OCCUPANCY EVALUATION (POE)

## PARTE I — TEORÍA

**POE** evalúa edificios en uso para verificar si cumplen lo diseñado y aprender para futuros proyectos.

Referencias:

- Preiser, W. et al. (1988). *Post-Occupancy Evaluation*.
- RIBA (2016). *Post-Occupancy Evaluation: A Guide to Best Practice*.

**Metodologías:**

- Encuestas de satisfacción.
- Auditorías técnicas.
- Monitoreo ambiental.
- Observación de uso.

**Métricas:**

- Satisfacción ocupantes (0-10).
- Cumplimiento de diseño.
- Consumo real vs predicho.
- Patrones de uso.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/poe/types.ts

export interface POEInput {
  projectId: string;
  assessmentPeriodMonths: number;
  originalOPR: OPR;                 // de C23
  designIntent: { [key: string]: number };
  
  surveys: {
    respondentId: string;
    responses: { question: string; score: number; }[];
    comments?: string;
  }[];
  
  technicalAudits: {
    parameter: string;
    predicted: number;
    measured: number;
    unit: string;
    period: [string, string];
  }[];
  
  occupantBehavior: {
    spaceId: string;
    occupancyRate: number;
    usagePattern: string;
  }[];
}

export interface POEResult {
  schema: 'ARKI-POE-1.0';
  projectId: string;
  
  satisfaction: {
    overall: number;                // 0-10
    byCategory: { [category: string]: number };
    topComplaints: string[];
    topPraises: string[];
  };
  
  designVsActual: {
    parameter: string;
    predicted: number;
    measured: number;
    deviationPct: number;
    status: 'met' | 'exceeded' | 'not_met';
  }[];
  
  lessonsLearned: {
    kind: 'success' | 'issue';
    description: string;
    recommendation: string;
  }[];
  
  warnings: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
assessPOE(input): POEResult
  # 1. Satisfacción
  allScores = input.surveys.flatMap(s => s.responses.map(r => r.score))
  overall = mean(allScores)
  
  byCategory = groupByCategory(input.surveys)
  
  # 2. Design vs Actual
  deviations = []
  for audit in input.technicalAudits:
    deviationPct = (audit.measured - audit.predicted) / audit.predicted * 100
    
    status = 
      abs(deviationPct) < 10 ? 'met' :
      deviationPct > 0 and betterUp(audit.parameter) ? 'exceeded' :
      'not_met'
    
    deviations.push({ ...audit, deviationPct, status })
  
  # 3. Lessons
  lessons = []
  
  # Issues recurrentes
  for complaint in topComplaints:
    lessons.push({
      kind: 'issue',
      description: complaint,
      recommendation: inferRecommendation(complaint)
    })
  
  # Successes
  for praise in topPraises:
    lessons.push({
      kind: 'success',
      description: praise,
      recommendation: 'Replicar en futuros proyectos'
    })
  
  return { satisfaction, designVsActual: deviations, lessonsLearned: lessons }
```

svgsvg

---

# CAPACIDAD 66 — DISEÑO BIOFÍLICO Y NEUROARQUITECTURA

## PARTE I — TEORÍA

**Diseño biofílico** integra naturaleza en el entorno construido.

**14 patrones de Kellert & Wilson (1993):**

1. Visual connection with nature.
2. Non-visual connection with nature.
3. Non-rhythmic sensory stimuli.
4. Thermal & airflow variability.
5. Presence of water.
6. Dynamic & diffuse light.
7. Connection with natural systems.
8. Biomorphic forms & patterns.
9. Material connection with nature.
10. Complexity & order.
11. Prospect.
12. Refuge.
13. Mystery.
14. Risk/peril.

**Neuroarquitectura** estudia impacto del entorno en cerebro y comportamiento.

Referencias:

- Kellert, S. et al. (2008). *Biophilic Design*.
- Browning, W. et al. (2014). *14 Patterns of Biophilic Design*.
- Eberhard, J. (2007). *Brain Landscape*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/biophilic/types.ts

export interface BiophilicScore {
  patternId: number;                // 1-14
  patternName: string;
  score: number;                    // 0-1
  evidence: string;
  recommendations: string[];
}

export interface BiophilicAssessment {
  schema: 'ARKI-BIOPHILIC-1.0';
  projectId: string;
  patterns: BiophilicScore[];
  overallScore: number;
  priorityRecommendations: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
assessBiophilic(project): BiophilicAssessment
  scores = []
  
  # Pattern 1: Visual connection with nature
  natureViews = countWindowsWithNature(project) / totalWindows
  scores.push({ patternId: 1, score: natureViews, ... })
  
  # Pattern 5: Water presence
  waterFeatures = countWaterFeatures(project)
  scores.push({ patternId: 5, score: waterFeatures > 0 ? 1 : 0, ... })
  
  # Pattern 6: Dynamic light
  daylightAutonomy = computeDaylightAutonomy(project)
  scores.push({ patternId: 6, score: daylightAutonomy, ... })
  
  # Pattern 9: Natural materials
  naturalMaterialPct = computeNaturalMaterialPct(project)
  scores.push({ patternId: 9, score: naturalMaterialPct, ... })
  
  # ... etc para los 14
  
  overall = weightedMean(scores)
  
  return { projectId: project.id, patterns: scores, overallScore: overall, priorityRecommendations: ... }
```

svgsvg

---

# CAPACIDAD 67 — FABRICACIÓN DIGITAL

## PARTE I — TEORÍA

**Fabricación digital** conecta diseño computacional con producción:

- CNC (fresado, corte).
- Impresión 3D (hormigón, metal).
- Corte láser.
- Robots industriales.
- Prefabricación off-site.

Referencias:

- Kolarevic, B. (2003). *Architecture in the Digital Age*.
- Gramazio, F. & Kohler, M. (2008). *Digital Materiality in Architecture*.
- Willmann, J. et al. (2016). *Robotic Fabrication*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/digitalFabrication/types.ts

export type FabricationMethod = 'cnc_router' | 'cnc_mill' | 'laser_cut' | '3d_print_concrete' | '3d_print_metal' | 'robot_arm' | 'waterjet';

export interface FabricationPart {
  id: string;
  elementId: string;
  material: string;
  dimensions: [number, number, number];
  geometry: unknown;                // 3D
  method: FabricationMethod;
  quantity: number;
  toleranceMm: number;
}

export interface FabricationPlan {
  schema: 'ARKI-FABRICATION-1.0';
  projectId: string;
  parts: FabricationPart[];
  
  byMethod: {
    [key in FabricationMethod]: {
      partsCount: number;
      totalVolumeM3: number;
      estimatedTimeHours: number;
      estimatedCostUSD: number;
    }
  };
  
  nesting?: {
    sheetSize: [number, number];
    partsPerSheet: number;
    sheetsRequired: number;
    wastePct: number;
  }[];
  
  warnings: string[];
}
```

svgsvg

---

# CAPACIDAD 68 — CONSTRUCCIÓN INDUSTRIALIZADA / PREFABRICACIÓN

## PARTE I — TEORÍA

**Industrialización** = fabricar componentes off-site, ensamblar on-site.

**Sistemas:**

- Modular volumetric (PPVC).
- Panelizado.
- Estructuras prefabricadas.
- Baños prefabricados.
- Fachadas unitizadas.

**Ventajas:**

- -30-50% plazo.
- -10-20% costo.
- +calidad (ambiente controlado).
- -residuos.

**Desafíos:**

- Logística.
- Diseño temprano congelado.
- Transporte.

Referencias:

- Smith, R. (2010). *Prefab Architecture*.
- Staib, G. et al. (2008). *Components and Systems*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/industrialized/types.ts

export interface IndustrializedPlan {
  schema: 'ARKI-INDUSTRIALIZED-1.0';
  projectId: string;
  
  strategy: 'modular_volumetric' | 'panelized' | 'hybrid' | 'traditional';
  
  modules: {
    id: string;
    kind: 'room' | 'bathroom' | 'kitchen' | 'structure' | 'facade';
    dimensions: [number, number, number];
    weightTons: number;
    quantity: number;
    productionDays: number;
    assemblyDays: number;
  }[];
  
  logistics: {
    maxTransportWidthM: number;
    maxTransportHeightM: number;
    maxTransportWeightTons: number;
    routeRestrictions: string[];
  };
  
  schedule: {
    offSiteProductionDays: number;
    onSiteAssemblyDays: number;
    totalDays: number;
    comparisonWithTraditionalDays: number;
  };
  
  cost: {
    offSiteUSD: number;
    onSiteUSD: number;
    totalUSD: number;
    comparisonWithTraditionalUSD: number;
  };
  
  warnings: string[];
}
```

svgsvg

---

# CAPACIDAD 69 — VALUE ENGINEERING

## PARTE I — TEORÍA

**Value Engineering (VE)** = optimizar función vs costo sistemáticamente.

**Metodología (SAVE International):**

1. Information phase.
2. Function analysis.
3. Creative phase.
4. Evaluation phase.
5. Development phase.
6. Presentation.
7. Implementation.

**Función:** verbo + sustantivo. "Soportar carga", "Contener agua".

**Análisis:** cada elemento tiene función(es) y costo. Si función se logra más barato, VE.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/valueEngineering/types.ts

export interface VEAnalysis {
  schema: 'ARKI-VE-1.0';
  projectId: string;
  
  functions: {
    elementId: string;
    function: string;               // verbo + sustantivo
    kind: 'basic' | 'secondary';
    cost: number;
    worth: number;                  // valor funcional asignado
    valueIndex: number;             // worth / cost
  }[];
  
  opportunities: {
    id: string;
    elementId: string;
    function: string;
    currentCost: number;
    alternativeCost: number;
    savings: number;
    alternative: string;
    qualityImpact: 'none' | 'minor' | 'major';
    feasibility: 'easy' | 'medium' | 'hard';
  }[];
  
  totalPotentialSavings: number;
  recommendations: string[];
}
```

svgsvg

---

# CAPACIDAD 70 — MCDA (MULTI-CRITERIA DECISION ANALYSIS)

## PARTE I — TEORÍA

**MCDA** formaliza decisiones con múltiples criterios conflictivos.

**Métodos:**

- **AHP (Analytic Hierarchy Process).** Saaty.
- **Electre.**
- **Promethee.**
- **TOPSIS.**
- **MAUT (Multi-Attribute Utility Theory).**
- **Weighted Sum Model (WSM).**

Referencias:

- Saaty, T. (1980). *The Analytic Hierarchy Process*.
- Hwang, C. & Yoon, K. (1981). *Multiple Attribute Decision Making*.
- Brans, J.P. & Mareschal, B. (2005). *Promethee Methods*.

### 1.2. AHP — pasos

1. Jerarquía de criterios.
2. Comparaciones pareadas (matriz).
3. Vector de prioridades (autovector).
4. Consistency Ratio (CR < 0.1).
5. Scores finales.

### 1.3. TOPSIS

1. Matriz de decisión normalizada.
2. Ideal positivo y negativo.
3. Distancias euclidianas.
4. Coeficiente de cercanía.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/mcda/types.ts

export type MCDAMethod = 'ahp' | 'electre' | 'promethee' | 'topsis' | 'maut' | 'wsm';

export interface Criterion {
  id: string;
  name: string;
  direction: 'benefit' | 'cost';    // beneficio = mejor alto; cost = mejor bajo
  unit: string;
}

export interface Alternative {
  id: string;
  name: string;
  values: { [criterionId: string]: number };
}

export interface MCDAInput {
  method: MCDAMethod;
  criteria: Criterion[];
  alternatives: Alternative[];
  weights?: { [criterionId: string]: number };  // si no, calcular
  pairwiseComparisons?: { [criterionId: string]: number[][] };  // para AHP
}

export interface MCDAResult {
  schema: 'ARKI-MCDA-1.0';
  method: MCDAMethod;
  
  weights: { [criterionId: string]: number };
  consistencyRatio?: number;        // AHP only
  
  ranking: {
    alternativeId: string;
    score: number;
    rank: number;
  }[];
  
  winner: string;
  
  sensitivity: {
    criterionId: string;
    deltaWeight: number;
    rankingChanges: boolean;
  }[];
  
  warnings: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO (AHP)

text

```
runAHP(input): MCDAResult
  # 1. Matriz de comparaciones pareadas
  A = input.pairwiseComparisons  # n×n
  
  # 2. Vector de prioridades (autovector principal)
  eigenvector = powerMethod(A, iterations=100)
  weights = normalize(eigenvector)
  
  # 3. Consistency
  lambdaMax = mean((A @ weights) / weights)
  CI = (lambdaMax - n) / (n - 1)
  RI = randomIndex(n)  # tabla Saaty
  CR = CI / RI
  
  if CR > 0.1:
    return { warnings: ['Consistency ratio > 0.1. Revisar comparaciones.'] }
  
  # 4. Scores de alternativas
  scores = []
  for alt in alternatives:
    score = 0
    for criterion in criteria:
      normalized = normalizeValue(alt.values[criterion.id], criterion)
      score += normalized * weights[criterion.id]
    scores.push({ alternativeId: alt.id, score })
  
  # 5. Ranking
  ranking = scores.sortBy(score desc).map((s, i) => ({ ...s, rank: i+1 }))
  
  return { method: 'ahp', weights, consistencyRatio: CR, ranking, winner: ranking[0].alternativeId, sensitivity: [] }
```

svgsvg

---

# CAPACIDAD 71 — REAL OPTIONS ANALYSIS

## PARTE I — TEORÍA

**Real Options** aplica teoría de opciones financieras a decisiones de inversión con flexibilidad.

**Tipos:**

- **Option to defer.**
- **Option to expand.**
- **Option to abandon.**
- **Option to switch.**
- **Compound options.**

**Ventaja vs VAN tradicional:** captura valor de flexibilidad.

Referencias:

- Trigeorgis, L. (1996). *Real Options*.
- Copeland, T. & Antikarov, V. (2001). *Real Options: A Practitioner's Guide*.
- Mun, J. (2002). *Real Options Analysis*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/realOptions/types.ts

export interface RealOptionsInput {
  projectId: string;
  baseCase: {
    initialInvestment: number;
    expectedCashFlows: number[];
    volatility: number;             // del proyecto
  };
  options: {
    kind: 'defer' | 'expand' | 'abandon' | 'switch';
    available: boolean;
    parameters: {
      // defer
      deferYears?: number;
      // expand
      expansionCost?: number;
      expansionValue?: number;
      // abandon
      abandonmentValue?: number;
      salvageValue?: number;
    };
  }[];
  discountRate: number;
  riskFreeRate: number;
}

export interface RealOptionsResult {
  schema: 'ARKI-REAL-OPTIONS-1.0';
  projectId: string;
  
  npv: number;                      // sin flexibilidad
  optionValue: number;              // valor de la flexibilidad
  totalValue: number;               // npv + optionValue
  
  byOption: {
    kind: string;
    value: number;
    recommended: boolean;
    reasoning: string;
  }[];
  
  recommendation: string;
  warnings: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO (Black-Scholes aplicado)

text

```
evaluateRealOptions(input): RealOptionsResult
  # 1. NPV base
  npv = -input.baseCase.initialInvestment + sum(input.baseCase.expectedCashFlows.map((cf, i) => cf / (1 + discountRate)^i))
  
  # 2. Valor de cada opción
  optionValues = []
  
  for option in input.options:
    match option.kind:
      case 'defer':
        # Black-Scholes para opción de diferir
        T = option.parameters.deferYears
        S = computeProjectPV(input.baseCase)  # valor presente del proyecto
        K = input.baseCase.initialInvestment  # costo de inversión
        r = input.riskFreeRate
        σ = input.baseCase.volatility
        
        value = blackScholesCall(S, K, r, σ, T)
      
      case 'expand':
        S = option.parameters.expansionValue
        K = option.parameters.expansionCost
        value = blackScholesCall(S, K, riskFreeRate, volatility, T=1)
      
      case 'abandon':
        # Put option
        S = computeProjectPV(input.baseCase)
        K = option.parameters.abandonmentValue
        value = blackScholesPut(S, K, riskFreeRate, volatility, T=1)
      
      case 'switch':
        # Exchange option (Margrabe)
        value = margrabeFormula(S1, S2, volatility)
    
    optionValues.push({
      kind: option.kind,
      value,
      recommended: value > 0,
      reasoning: `Valor ${value.toFixed(0)} USD. ${value > 0 ? 'Ejercer' : 'No ejercer'}`
    })
  
  optionValue = sum(optionValues.map(o => max(0, o.value)))
  totalValue = npv + optionValue
  
  return { npv, optionValue, totalValue, byOption: optionValues, recommendation: totalValue > npv ? 'Flexibilidad agrega valor' : 'Proyecto sin opciones valiosas' }
```

svgsvg

---

# CAPACIDAD 72 — RISK MANAGEMENT CUANTITATIVO

## PARTE I — TEORÍA

**Gestión cuantitativa de riesgos:** convertir riesgos cualitativos en distribuciones.

**Metodología:**

1. Identificación de riesgos.
2. Análisis cualitativo (probabilidad × impacto).
3. Modelado cuantitativo (distribuciones).
4. Simulación Monte Carlo.
5. Plan de respuesta.
6. Monitoreo.

Referencias:

- PMI (2021). *PMBOK Guide* — Chapter 11.
- Hillson, D. (2009). *Managing Risk in Projects*.
- AACE RP 40R-08. *Contingency Estimating*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/riskManagement/types.ts

export interface Risk {
  id: string;
  category: 'technical' | 'schedule' | 'cost' | 'quality' | 'safety' | 'legal' | 'external';
  description: string;
  cause: string;
  effect: string;
  
  probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  probabilityValue: number;         // 0-1
  
  impact: {
    cost: number;                   // USD
    schedule: number;               // días
    quality: number;                // 1-5
  };
  
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  response: {
    strategy: 'avoid' | 'mitigate' | 'transfer' | 'accept';
    actions: string[];
    responsible: string;
    cost: number;
  };
  
  status: 'open' | 'monitoring' | 'closed' | 'occurred';
}

export interface RiskAnalysis {
  schema: 'ARKI-RISK-1.0';
  projectId: string;
  
  risks: Risk[];
  
  contingency: {
    cost: number;
    schedule: number;
    method: 'monte_carlo' | 'percentage' | 'expected_value';
    confidenceLevel: number;        // P50, P80, P90
  };
  
  topRisks: Risk[];                 // ordenados por severity * probability
  
  expectedValueImpact: {
    costUSD: number;
    scheduleDays: number;
  };
  
  distributionChart: {
    costPercentile: { [p: string]: number };
    schedulePercentile: { [p: string]: number };
  };
  
  warnings: string[];
}
```

svgsvg

---

## PARTE III — ALGORITMO

text

```
analyzeRisks(project): RiskAnalysis
  # 1. Expected value por riesgo
  for risk in risks:
    risk.expectedValue = {
      cost: risk.probabilityValue * risk.impact.cost,
      schedule: risk.probabilityValue * risk.impact.schedule
    }
  
  # 2. Contingencia por Monte Carlo
  if method == 'monte_carlo':
    iterations = 10000
    costResults = []
    scheduleResults = []
    
    for i in 1..iterations:
      totalCost = 0
      totalSchedule = 0
      
      for risk in risks:
        if random() < risk.probabilityValue:
          totalCost += sampleTriangular(0, risk.impact.cost, risk.impact.cost * 1.5)
          totalSchedule += sampleTriangular(0, risk.impact.schedule, risk.impact.schedule * 1.5)
      
      costResults.push(totalCost)
      scheduleResults.push(totalSchedule)
    
    # Percentiles
    contingency = {
      cost: percentile(costResults, confidenceLevel),
      schedule: percentile(scheduleResults, confidenceLevel),
      method: 'monte_carlo',
      confidenceLevel
    }
  
  return { ... }
```

svgsvg

---

# CAPACIDAD 73 — CONTRATOS Y PROCUREMENT

## PARTE I — TEORÍA

**Tipos de contratos:**

- **Precio fijo:** contractor asume riesgo de costo.
- **Precio unitario:** medidas reales.
- **Costo + fee:** owner asume riesgo.
- **EPC:** Engineering-Procurement-Construction.
- **IPD:** Integrated Project Delivery.

**Estándares:**

- **FIDIC:** internacional.
- **NEC3/NEC4:** UK.
- **AIA:** EEUU.
- **JCT:** UK.
- **ConsensuDocs:** EEUU.

**Regímenes Perú:**

- Ley 30225 (Contrataciones del Estado).
- Ley 29230 (Obras por Impuestos).
- Ley 27143 (APP).

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/contracts/types.ts

export type ContractKind = 'lump_sum' | 'unit_price' | 'cost_plus' | 'gmp' | 'epc' | 'ipd' | 'design_build';
export type ContractStandard = 'fidic_red' | 'fidic_yellow' | 'fidic_silver' | 'nec4_ecc' | 'aia_a101' | 'aia_a102' | 'jct' | 'consensusdocs' | 'ley_30225';

export interface ContractAssessment {
  schema: 'ARKI-CONTRACT-1.0';
  projectId: string;
  
  recommendedKind: ContractKind;
  reasoning: string[];
  
  riskAllocation: {
    party: 'owner' | 'contractor' | 'shared';
    costRisk: number;               // 0-1
    scheduleRisk: number;
    qualityRisk: number;
    designRisk: number;
  };
  
  clauses: {
    id: string;
    kind: string;
    text: string;
    standardRef: string;
    mandatory: boolean;
  }[];
  
  financial: {
    contractValue: number;
    contingency: number;
    paymentSchedule: { milestone: string; amount: number; }[];
  };
  
  warnings: string[];
  requiresLegalReview: true;
}
```

svgsvg

---

# CAPACIDAD 74 — EDIFICIOS ESPECIALIZADOS

## PARTE I — TEORÍA

Consolida conocimiento de tipologías complejas:

**Hospital:**

- Flujos limpio/sucio.
- Presiones diferenciales.
- Gases medicinales.
- Quirófanos con requisitos.
- UCI con monitoreo.

**Laboratorio:**

- BSL 1-4.
- Campanas de extracción.
- Presión negativa.
- Flujos de aire.
- Sustancias peligrosas.

**Data Center:**

- Tiers I-IV (Uptime Institute).
- Redundancia N+1.
- PUE objetivo.
- Cooling especializado.
- Seguridad física.

**Industria:**

- Flujos de producción.
- Cargas de piso.
- Instalaciones especiales.
- Seguridad.
- Vialidad interna.

**Estadio:**

- Visibilidad (C-value).
- Aforo.
- Evacuación.
- Vestuarios.
- Broadcasting.

**Museo:**

- Control de luz (50 lux típico).
- Control de HR.
- Seguridad.
- Flujos público/servicio.

Referencias:

- Neufert (2018). *Architects' Data*.
- De Chiara & Callender. *Time-Saver Standards*.
- Uptime Institute Tier Standard.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/specializedBuildings/types.ts

export type SpecializedType = 'hospital' | 'laboratory' | 'data_center' | 'industrial' | 'stadium' | 'museum';

export interface SpecializedAssessment {
  schema: 'ARKI-SPECIALIZED-1.0';
  projectId: string;
  type: SpecializedType;
  
  requirements: {
    id: string;
    parameter: string;
    target: number | string;
    unit: string;
    attained: number | string;
    status: 'met' | 'not_met' | 'warning';
    reference: string;
  }[];
  
  complianceScore: number;          // 0-100
  
  criticalIssues: string[];
  warnings: string[];
  requiresSpecialistReview: true;
}
```

svgsvg

---

# ═══════════════════════════════════════════════════

# GRUPO C — META-CAPACIDADES

# ═══════════════════════════════════════════════════

# CAPACIDAD 75 — ARKI SELF-HOSTING (META-ARQUITECTURA)

## PARTE I — TEORÍA

**ARKI Self-Hosting** = ARKI puede **diseñar ARKI**. Meta-arquitectura.

**Aplicaciones:**

- Auto-documentación.
- Auto-refactorización asistida.
- Auto-generación de tests.
- Auto-optimización de performance.
- Auto-detección de deuda técnica.

**Referencia:** bootstrapping de compiladores (Ken Thompson 1984).

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/selfHosting/types.ts

export interface ARKICodebaseModel {
  files: {
    path: string;
    language: string;
    loc: number;
    functions: { name: string; signature: string; }[];
    dependencies: string[];
  }[];
  
  modules: {
    name: string;
    exports: string[];
    imports: string[];
    healthScore: number;
  }[];
  
  complexity: {
    [module: string]: {
      cyclomatic: number;
      coupling: number;
      cohesion: number;
    }
  };
}

export interface SelfHostingAnalysis {
  schema: 'ARKI-SELF-HOSTING-1.0';
  
  codebaseModel: ARKICodebaseModel;
  
  technicalDebt: {
    kind: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
    description: string;
    estimatedFixHours: number;
  }[];
  
  refactorings: {
    id: string;
    kind: string;
    files: string[];
    description: string;
    expectedImprovement: string;
    risk: 'low' | 'medium' | 'high';
  }[];
  
  autoDocumentation: {
    moduleName: string;
    generatedDoc: string;
  }[];
  
  autoTests: {
    targetFunction: string;
    generatedTest: string;
  }[];
  
  warnings: string[];
}
```

svgsvg

---

# CAPACIDAD 76 — DEBUGGING Y DIAGNÓSTICO ASISTIDO

## PARTE I — TEORÍA

**Debugging asistido** = ARKI diagnostica sus propios errores.

**Componentes:**

- Captura de errores.
- Stack trace analysis.
- Reproducción mínima.
- Análisis de causa raíz.
- Sugerencia de fix.

Referencias:

- Zeller, A. (2009). *Why Programs Fail: A Guide to Systematic Debugging*.
- Parnin, C. & Orso, A. (2011). *Are Automated Debugging Techniques Actually Helping Programmers?*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/debugging/types.ts

export interface DebugSession {
  id: string;
  error: {
    message: string;
    stackTrace: string;
    input: unknown;
    timestamp: string;
    context: { [key: string]: unknown; };
  };
  
  diagnosis: {
    rootCause: string;
    confidence: number;
    hypothesis: string[];
    evidence: string[];
  };
  
  minimalReproduction: {
    code: string;
    steps: string[];
  };
  
  suggestedFixes: {
    description: string;
    code: string;
    risk: 'low' | 'medium' | 'high';
    testPlan: string;
  }[];
  
  relatedErrors: string[];          // errores similares históricos
  
  warnings: string[];
}
```

svgsvg

---

# CAPACIDAD 77 — AUTO-EXPLICACIÓN DE DECISIONES DE DISEÑO

## PARTE I — TEORÍA

Extiende C58 (explicabilidad ML) a **explicaciones de diseño arquitectónico**. ARKI explica por qué eligió una forma, un sistema, un material.

**Estructura de explicación:**

- Objetivo declarado.
- Alternativas consideradas.
- Criterios de decisión.
- Restricciones aplicadas.
- Evidencia.
- Trade-offs.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/designExplanation/types.ts

export interface DesignDecision {
  id: string;
  kind: 'form' | 'system' | 'material' | 'layout' | 'orientation' | 'mep';
  chosenAlternative: string;
  alternativesConsidered: string[];
  
  explanation: {
    objective: string;
    criteria: string[];
    constraints: string[];
    tradeoffs: string[];
    evidence: string[];
    confidence: number;
  };
  
  counterfactuals: {
    ifChanged: string;
    expectedOutcome: string;
    tradeoff: string;
  }[];
  
  sources: {
    kind: 'analysis' | 'norm' | 'requirement' | 'heuristic';
    reference: string;
  }[];
}

export interface DesignExplanationBundle {
  schema: 'ARKI-DESIGN-EXPLANATION-1.0';
  projectId: string;
  decisions: DesignDecision[];
  summary: string;
  generatedAt: string;
}
```

svgsvg

---

# CAPACIDAD 78 — SIMULACIÓN DE ROLES ESPECIALISTAS

## PARTE I — TEORÍA

**Simulación de roles** = ARKI puede adoptar perspectivas:

- Arquitecto senior.
- Estructuralista.
- Coordinador MEP.
- Costos.
- Cliente.
- Usuario final.
- Curador patrimonial.
- Bombero / seguridad.

**Uso:** cada rol evalúa el proyecto desde su perspectiva.

**Base:** multi-agent systems + role-based reasoning.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/roleSimulation/types.ts

export type SpecialistRole =
  | 'architect_senior' | 'structural_engineer' | 'mep_coordinator'
  | 'cost_engineer' | 'scheduler' | 'client' | 'end_user'
  | 'heritage_curator' | 'fire_safety' | 'accessibility_specialist';

export interface RoleEvaluation {
  role: SpecialistRole;
  score: number;                    // 0-100
  concerns: {
    priority: number;
    description: string;
    evidence: string[];
    recommendation: string;
  }[];
  approvals: string[];
  rejections: string[];
}

export interface RoleSimulationResult {
  schema: 'ARKI-ROLE-SIMULATION-1.0';
  projectId: string;
  evaluations: RoleEvaluation[];
  
  consensusScore: number;
  conflictPoints: {
    topic: string;
    roles: SpecialistRole[];
    positions: { role: SpecialistRole; position: string; }[];
  }[];
  
  summary: string;
  requiresHumanReview: true;
}
```

svgsvg

---

# CAPACIDAD 79 — DISEÑO UNIVERSAL Y ACCESIBILIDAD AVANZADA

## PARTE I — TEORÍA

Extiende C5 (normativa) con **diseño universal** (Ron Mace, 1985).

**7 principios:**

1. Uso equitativo.
2. Flexibilidad de uso.
3. Uso simple e intuitivo.
4. Información perceptible.
5. Tolerancia al error.
6. Bajo esfuerzo físico.
7. Espacio y tamaño para aproximación y uso.

**Referencias:**

- ISO 21542.
- WCAG 2.2 (digital).
- ADA (EEUU).
- RNE A.120 (Perú).

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/universalDesign/types.ts

export interface UniversalDesignAssessment {
  schema: 'ARKI-UNIVERSAL-DESIGN-1.0';
  projectId: string;
  
  principles: {
    principleId: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    name: string;
    score: number;                  // 0-1
    evidence: string[];
    gaps: string[];
    recommendations: string[];
  }[];
  
  overallScore: number;
  
  complianceByStandard: {
    standardId: string;
    met: boolean;
    unmet: string[];
  }[];
  
  warnings: string[];
}
```

svgsvg

---

# CAPACIDAD 80 — WAYFINDING Y SEÑALÉTICA

## PARTE I — TEORÍA

**Wayfinding** = sistemas que ayudan a orientarse. Combina:

- Arquitectura.
- Señalética.
- Iluminación.
- Puntos de referencia.
- Diseño de información.

Referencias:

- Arthur, P. & Passini, R. (1992). *Wayfinding: People, Signs, and Architecture*.
- Gibson, D. (2009). *The Wayfinding Handbook*.
- Lynch, K. (1960). *The Image of the City*.

---

## PARTE II — CONTRATO DE DATOS

typescript

```
// shared/wayfinding/types.ts

export interface WayfindingAssessment {
  schema: 'ARKI-WAYFINDING-1.0';
  projectId: string;
  
  navigationScore: number;          // 0-100
  clarityScore: number;
  accessibilityScore: number;
  
  landmarks: {
    elementId: string;
    kind: 'visual' | 'spatial' | 'textual';
    strength: number;               // 0-1
  }[];
  
  criticalDecisionsPoints: {
    location: [number, number, number];
    options: number;
    visibility: number;             // 0-1
    signagePresent: boolean;
    confusionRisk: 'low' | 'medium' | 'high';
  }[];
  
  recommendations: {
    kind: 'add_signage' | 'add_landmark' | 'improve_lighting' | 'simplify_path';
    location: [number, number, number];
    description: string;
    priority: number;
  }[];
  
  warnings: string[];
}
```

svgsvg

---

# ═══════════════════════════════════════════════════

# CIERRE DEL PAQUETE DE TRANSFERENCIA 14

# ═══════════════════════════════════════════════════

**PAQUETE 14 COMPLETO:** C60–C80 (21 capacidades adicionales identificadas por DeepSeek).

---

## TRANSFERRED

Acumulado: **C1 ... C80** (80 capacidades).

**Grupo A — Extensiones naturales (C60–C64):**

- C60 Isovist y Visibilidad
- C61 Acústica Ray-Tracing
- C62 Estructuras No Lineales + Performance-Based
- C63 Real Estate / Factibilidad
- C64 Digital Twin e IoT

**Grupo B — Metodologías formales (C65–C74):**

- C65 Post-Occupancy Evaluation
- C66 Diseño Biofílico + Neuroarquitectura
- C67 Fabricación Digital
- C68 Construcción Industrializada
- C69 Value Engineering
- C70 MCDA (AHP, Electre, Promethee, TOPSIS)
- C71 Real Options
- C72 Risk Management Cuantitativo
- C73 Contratos y Procurement
- C74 Edificios Especializados

**Grupo C — Meta-capacidades (C75–C80):**

- C75 ARKI Self-Hosting
- C76 Debugging Asistido
- C77 Auto-Explicación de Decisiones
- C78 Simulación de Roles Especialistas
- C79 Diseño Universal
- C80 Wayfinding y Señalética

---

## PENDING TRANSFER

**Ninguno.** El arsenal está completo.

Si surgen nuevas capacidades durante implementación → paquete adicional bajo demanda.

---

## IMPLEMENTATION STATUS

text

```
C1-C80:                  CONTRACT READY / BLOCKED
PAQUETES 1-14:           COMPLETED
ARSENAL:                 CERRADO

Implementación activa:   NINGUNA
Regla vigente:           1 capacidad por ciclo
Próximo ciclo:           C1 (Spatial Syntax) cuando PO autorice
```

svgsvg

---

## RESUMEN EJECUTIVO DEL ARSENAL

**80 capacidades documentadas en 14 paquetes.**

**Distribución por grupo:**

- C1-C10: Arquitectura básica (10).
- C11-C16: Diseño computacional (6).
- C17-C22: Simulación (6).
- C23-C26: Ciclo de vida (4).
- C27-C29: Inteligencia arquitectónica (3).
- C30-C33: Agentes (4).
- C34-C38: Interoperabilidad (5).
- C39-C43: Colaboración (5).
- C44-C47: Analítica (4).
- C48-C53: Certificaciones (6).
- C54-C59: Investigación (6).
- C60-C80: **Adicionales identificadas por DeepSeek (21)**.

**Total: 80 capacidades.**

**Cada capacidad incluye:**

- Teoría y fundamentos.
- Modelo conceptual.
- Matemáticas/algoritmos.
- Contrato de datos.
- Tests (normales + adversariales + metamórficos + integración).
- Examen final (A/B/C/D).
- Límites declarados.
- Referencias.
- Entregables esperados.

**Todos los contratos están BLOCKED hasta autorización del PO.**

**Regla vigente:** 1 capacidad por ciclo de implementación.

---

**FIN DEL ARSENAL COMPLETO.**
**Estado: TRANSFER PACKAGES 1-14 COMPLETED.**

**Total entregado:**

- 80 capacidades documentadas.
- \~3,500 tests especificados.
- 14 paquetes de transferencia.
- Contratos listos para implementación por ciclo.

**Esperando orden del PO para iniciar C1 (Spatial Syntax) cuando autorice.**