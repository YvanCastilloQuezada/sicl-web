# ARKI — Bloque C: wireflows y plan de pruebas

**Estado:** Entregado para verificación de UI-1  
**Objetivo:** Verificar gateway, shell, perfiles locales e integración gradual de Home.tsx

## 1. Wireflow de acceso

```text
Gateway ARKI
→ seleccionar Visitante / Usuario / Especialista / Corporativo
→ guardar perfil local
→ abrir shell BIM
→ mostrar módulos permitidos
→ mantener proyecto y versión visibles
→ salir
→ eliminar perfil local
→ volver al gateway
```

## 2. Wireflow de generación

```text
Usuario / Especialista / Corporativo
→ Generador
→ seleccionar familia
→ seleccionar variante
→ introducir ciudad, área, aforo y niveles
→ Generar propuesta
→ revisar planta, corte y 3D conceptual
→ revisar modelo constructivo, costos y expediente
→ guardar versión
→ comparar versiones
→ exportar
```

## 3. Wireflow de especialista

```text
Especialista
→ seleccionar disciplina
→ abrir Modelo BIM
→ filtrar elementos
→ seleccionar elemento
→ consultar Info Box
→ revisar materiales, metrados, costo y relaciones
→ crear observación o estado de revisión
→ dejar pendiente la aprobación si no existe backend
```

## 4. Wireflow de costos e interferencias

```text
Corporativo
→ Presupuesto o Clashes
→ consultar estado del módulo
→ filtrar por disciplina, severidad o versión
→ revisar elementos relacionados
→ abrir evidencia
→ exportar reporte cuando el dominio lo soporte
```

La UI debe marcar como conceptual la detección heurística actual y como pendiente el BCF formal.

## 5. Matriz de pruebas

| Prueba | Resultado esperado | Evidencia |
|---|---|---|
| Abrir gateway | Cuatro accesos visibles | Captura o navegador |
| Entrar como visitante | Solo módulos públicos disponibles | Navegador |
| Entrar como usuario | Generador y proyecto disponibles | Navegador |
| Entrar como especialista | Disciplinas y coordinación visibles | Navegador |
| Entrar como corporativo | Costos, clashes y gobierno visibles | Navegador |
| Salir | Regresa al gateway y limpia perfil local | Navegador |
| Ctrl/Cmd+K | Toast de comandos | Navegador |
| Ctrl/Cmd+S | Toast de borrador local | Navegador |
| Escape | Cierra toast o cancela contexto | Navegador |
| Generar propuesta | Home.tsx genera sin regresión | Navegador + test |
| Guardar versión | Historial local aumenta | Navegador |
| Comparar | Diferencias visibles con dos versiones | Navegador |
| Exportar IFC | Descarga archivo semántico | Navegador |
| TypeScript | Sin errores | `pnpm check` |
| Producción | Build completo | `pnpm build` |
| Núcleo constructivo | PASS | `test-constructive.ts` |
| Módulos profesionales | PASS | `test-professional.ts` |
| Expediente | PASS | `test-technical-dossier.ts` |
| Serialización | PASS | `test-serialization.ts` |
| Coherencia de muros | PASS | `test-wall-coherence.ts` |
| Presupuesto | PASS | `test-budget-reconciliation.ts` |
| Recálculo | PASS | `test-recalculation.ts` |

## 6. Restricciones verificables

No se acepta una ruta vacía. No se acepta un botón decorativo. No se acepta `E2E VERIFIED` sin evidencia de navegador. Los perfiles locales no se consideran autenticación real. Los módulos futuros deben mostrar estado explícito.

## 7. Criterio de cierre

El Bloque C queda listo para ejecutar cuando el navegador compruebe los flujos de gateway, shell, salida, atajos y generación. La verificación del dominio debe repetir todos los scripts existentes después de cada cambio del shell.

## Referencias

[1]: file:///home/ubuntu/generador-familias/ARKI_CONTRATO_UI_BIM_CORPORATIVO_V2.md "Contrato corporativo de interfaz BIM ARKI"
[2]: file:///home/ubuntu/generador-familias/ARKI_DECISION_BLOQUE_A_DEEPSEEK.md "Decisión formal para el Bloque A"
