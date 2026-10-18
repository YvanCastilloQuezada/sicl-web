# Notas de investigación — RNG y regulación peruana

**Fecha:** 26 de agosto de 2026

## Fuentes observadas

1. Portal oficial MINCETUR: https://apuestasdeportivas.mincetur.gob.pe/

   El portal indica que la Ley N.° 31557, modificada por la Ley N.° 31806, y el Reglamento aprobado por el Decreto Supremo N.° 005-2023-MINCETUR establecen el tratamiento normativo de juegos a distancia y apuestas deportivas a distancia. También identifica a la DGJCMT como autoridad competente en la materia administrativa no tributaria y muestra secciones de legislación, registros, laboratorios de certificación autorizados, proveedores vinculados, plataformas, programas y modalidades.

2. Diario Oficial El Peruano, Decreto Supremo que aprueba el Reglamento de la Ley N.° 31557: https://busquedas.elperuano.pe/dispositivo/SE/2224342-1

   La página confirma la publicación del Decreto Supremo el 13/10/2023 y enlaza al visor PDF del acto normativo. El texto completo debe conservarse y ser revisado por asesor legal antes de traducirlo en requisitos de producto.

3. GLI, especificaciones técnicas de pruebas RNG: https://gaminglabs.com/getting-started/technical-specifications-for-rng-testing/

4. NIST SP 800-90A Rev. 1: https://csrc.nist.gov/pubs/sp/800/90/a/r1/final

5. ISO/IEC 17025:2017: https://www.iso.org/standard/66912.html

## Hallazgos conservados

El portal MINCETUR debe ser la fuente primaria para comprobar autoridad, registros y procedimientos peruanos. GLI-11/las especificaciones del laboratorio pueden servir como referencia técnica de evaluación de RNG, pero no sustituyen los requisitos peruanos ni una certificación aceptada por la autoridad. NIST SP 800-90A es una referencia de generadores deterministas de bits aleatorios; no es, por sí sola, una certificación de juego. ISO/IEC 17025 describe competencia e imparcialidad de laboratorios de ensayo y calibración; no certifica directamente el producto MJP.

La implementación MJP usa HMAC-SHA-256, semilla pública derivada y verificación reproducible. Esto debe ser revisado por un tercero mediante análisis de generación de entropía, custodia de secretos, separación de funciones, reproducción de resultados, pruebas estadísticas, pruebas de sesgo, resistencia a manipulación, auditoría de logs y control de cambios. El piloto sigue sin dinero real, pagos, retiros, conversión, KYC/AML real o autorización operativa.


## Verificación adicional mediante navegador

6. MINCETUR, trámite de autorización y registro (homologación) de plataformas tecnológicas: https://www.gob.pe/94256-autorizacion-y-registro-homologacion-y-o-renovacion-y-o-modificacion-de-las-plataformas-tecnologicas-de-los-juegos-a-distancia-y-o-de-las-apuestas-deportivas-a-distancia

   La página oficial describe el procedimiento mediante el cual MINCETUR autoriza y registra/homologa plataformas tecnológicas, exige certificación técnica de un laboratorio autorizado, formulario, identificación de la plataforma, proveedores vinculados y pago de derecho de trámite. La página consultada muestra un costo de S/ 317,30 y un plazo máximo publicado de 30 días hábiles; ambos deben verificarse nuevamente al momento de presentar un expediente porque pueden actualizarse.

7. NIST SP 800-90A Rev. 1: https://csrc.nist.gov/pubs/sp/800/90/a/r1/final

   NIST identifica la publicación como una recomendación para generar bits aleatorios mediante métodos deterministas basados en funciones hash o cifrados de bloque. Su alcance es criptográfico y técnico; no equivale a homologación de un juego, plataforma o laboratorio.
