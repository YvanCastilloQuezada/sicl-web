# Planes virtuales asistidos v1.0.0

**Estado:** activo exclusivamente para el piloto con créditos virtuales. Un plan guarda una selección de seis números y habilita un descuento virtual al momento de confirmar cada boleto. No crea boletos por sí mismo, no descuenta créditos al registrarse, no se renueva automáticamente y no tiene valor monetario.

## Regla de consentimiento

Cada confirmación de boleto requiere una acción explícita del usuario autenticado. El servidor valida que la ronda esté abierta, que la selección coincida con el plan, que el plan esté activo, que haya confirmaciones disponibles y que el saldo virtual cubra el costo final. La transacción de billetera conserva la referencia del plan y la auditoría registra que la compra automática es `false`.

| Plan | Duración máxima | Confirmaciones disponibles | Descuento virtual |
|---|---:|---:|---:|
| Semanal | 1 semana | 4 | 0 % |
| Mensual | 4 semanas | 16 | 10 % |
| Trimestral | 12 semanas | 48 | 20 % |
| Semestral | 24 semanas | 96 | 30 % |
| Anual | 48 semanas | 192 | 40 % |

Los planes solo se habilitan para Lotería 29, 39, 49 y 59. La persona puede pausar, reanudar o cancelar el plan. La cancelación no genera reembolso porque no se cobra ningún saldo por adelantado; las confirmaciones restantes dejan de estar disponibles.

## Límites permanentes del piloto

> Los descuentos se aplican únicamente a créditos virtuales y no representan una oferta comercial en soles. Cada boleto continúa siendo una decisión separada del usuario.

No se integran cobros, Yape, tarjetas, conversión a PEN, renovación automática, cron de compras ni transferencias. Una función futura con dinero real exigiría un producto separado, autorización aplicable, reglas propias, consentimiento verificable y revisión legal.

## Evidencia

La prueba HTTP aislada crea una cuenta temporal, registra un plan mensual de Lotería 59, confirma manualmente diez boletos con el descuento de 10 %, comprueba un débito de 18 créditos y seis confirmaciones restantes, cancela el plan y elimina todos los registros temporales al finalizar. La API pública declara explícitamente `virtualOnly: true` y `automaticPurchase: false`.
