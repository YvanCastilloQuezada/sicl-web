# Acta técnica de aceptación — Tarea 26

**Proyecto:** Multi Juegos Perú / Ruleta Perú Online  
**Fecha:** 25 de agosto de 2026  
**Alcance:** piloto gratuito con créditos virtuales; la referencia de 1 crédito = 1 unidad PEN es contable y no cobrable.

## 1. Decisión de alcance

Se conserva **Lotería 39 MJP (6/39)** como modalidad existente y se incorpora **Lotería 39 · 5/39** como variante independiente. No se eliminan ni alteran rondas, boletos o comprobantes históricos de 6/39. La nueva variante usa el identificador técnico `loteria_39_5` y el prefijo de comprobante `AK`; MJP 6/39 conserva `loteria_39` y `AB`.

MJP Extra continúa siendo una opción separada con coste adicional de 1 crédito virtual. Las bolas de consuelo conservan sus costes adicionales definidos por la regla correspondiente. Ninguna de estas funciones habilita pagos, depósitos, retiros o conversión.

## 2. Tabla y RTP de 5/39

| Modalidad | Precio virtual | Tabla de premios enteros | RTP teórico | Margen teórico |
|---|---:|---|---:|---:|
| Lotería 39 · 5/39 | 1 crédito | 5 aciertos: 27 000; 4: 300; 3: 20; 2: 5 | 85,0011 % | 14,9989 % |
| Lotería 39 MJP · 6/39 | 1 crédito base | 6: 50 000; 5: 1 167; 4: 108; 3: 10; 2: 1 | 87,0902 % | 12,9098 % |

El RTP de 5/39 se calcula con la distribución hipergeométrica, sin depender de una muestra aleatoria: `P(k) = C(5,k) × C(34,5-k) / C(39,5)`. El retorno esperado se obtiene sumando `P(k) × premio(k)` y dividiendo entre el precio de 1 crédito. El resultado exacto usado por la calculadora es `0,8500113763271658`.

## 3. Integración realizada

La variante quedó incluida en el esquema Drizzle y en la migración `drizzle/0017_loud_enchantress.sql`, que solo amplía enums. Se integró en el motor autoritativo, configuración de simulación, generación de selecciones, simulador local, catálogo del cliente, transparencia pública, identificadores humanos y pruebas. El resto del catálogo mantiene sus precios y reglas S/1 ya publicados en el checkpoint anterior.

La página pública de transparencia ahora diferencia explícitamente MJP 6/39 de 5/39, muestra su tabla, RTP y margen, y evita presentar MJP Extra como parte del precio base.

## 4. Evidencia de validación

| Control | Resultado |
|---|---|
| `pnpm check` | Aprobado |
| Calculadora `pnpm rtp:all` | 23 modalidades con RTP mínimo igual o superior a 85 % |
| Pruebas específicas 5/39 y simulador | 9 aprobadas |
| Suite completa `pnpm test` | 20 archivos y 59 pruebas aprobadas |
| `pnpm build` | Aprobado |
| Migración de base de datos | Aplicada correctamente; no destructiva |

## 5. Observaciones y pendientes

El RTP es una expectativa matemática de largo plazo, no una garantía individual ni una prueba de rentabilidad neta. La rentabilidad definitiva debe incorporar impuestos, costos de operación, soporte, fraude, premios promocionales, pasarela y eventuales obligaciones regulatorias. Este acta no constituye autorización legal ni certificación de MINCETUR.

Antes de una operación con dinero real se requiere una decisión legal formal sobre la estructura 5/39 frente a 6/39, certificación independiente del generador y del proceso de auditoría, modelo financiero con costos reales, controles de edad e identidad mediante proveedor autorizado, geolocalización conforme a ley y autorización regulatoria aplicable. Hasta entonces, la activación de horarios automáticos queda preparada pero no equivale a operación comercial.

## 6. Archivos clave

| Área | Archivo |
|---|---|
| Variante y cálculo | `shared/lotteryVariants.ts` |
| Motor autoritativo | `server/pilot.ts` |
| Catálogo | `client/src/data/games.ts` |
| Simulador | `client/src/lib/practiceSimulator.ts` |
| Transparencia | `client/src/pages/TransparenciaPage.tsx` |
| Identificadores | `shared/ticketIdentifiers.ts` |
| Migración | `drizzle/0017_loud_enchantress.sql` |
| Pruebas | `server/lotteryVariants.test.ts`, `client/src/lib/practiceSimulator.test.ts` |
| Calculadora | `scripts/calculadora-rtp-todas.ts` |
