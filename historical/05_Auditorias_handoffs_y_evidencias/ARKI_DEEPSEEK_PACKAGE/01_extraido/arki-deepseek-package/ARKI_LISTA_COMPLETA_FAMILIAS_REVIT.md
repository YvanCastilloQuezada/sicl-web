# ARKI — Lista completa de familias según Revit

## 1. Clasificación principal de familias en Revit

Revit organiza sus objetos en tres grandes grupos. Esta clasificación debe ser la base del catálogo BIM de ARKI.

| Tipo de familia | Qué significa | Ejemplos | Tratamiento recomendado en ARKI |
|---|---|---|---|
| Familias de sistema | Ya forman parte del entorno de Revit y no se cargan como archivos `.rfa` independientes | Muros, pisos, techos, cielos rasos, escaleras, rampas, barandas, niveles, ejes y vistas | Implementarlas como clases paramétricas nativas del modelo central |
| Familias cargables | Se crean fuera del proyecto y se cargan como componentes reutilizables | Puertas, ventanas, muebles, equipos, luminarias, aparatos sanitarios, equipos mecánicos | Implementarlas mediante un catálogo de familias con parámetros, geometría, costos, 4D y mantenimiento |
| Familias in situ | Se modelan dentro de un proyecto para elementos especiales o únicos | Esculturas, geometrías especiales, piezas singulares, encuentros complejos | Permitirlas como componentes excepcionales, siempre vinculadas a una categoría y con advertencia de mantenimiento |

Una familia adicional puede ser **anidada**. Una familia anidada contiene otras familias. Por ejemplo, una mampara puede contener perfiles, vidrio, puerta, manija, cerradura y sellos. ARKI debe soportar esta composición para evitar duplicar objetos.

## 2. Familias arquitectónicas y de edificación

### 2.1 Muros y sistemas verticales

Los muros son familias de sistema compuestas por capas y materiales.

- Muro básico.
- Muro compuesto.
- Muro estructural.
- Muro no estructural.
- Muro de albañilería confinada.
- Muro de concreto armado.
- Muro de concreto prefabricado.
- Muro de drywall.
- Muro de fibrocemento.
- Muro de panel metálico.
- Muro cortina.
- Muro cortina inclinado.
- Muro cortina de vidrio.
- Muro cortina de aluminio.
- Muro cortina de acero.
- Muro cortina ventilado.
- Muro cortafuego.
- Muro acústico.
- Muro sanitario.
- Muro de contención.
- Muro pantalla.
- Muro de sótano.
- Muro de gaviones.
- Muro de piedra.
- Muro de tierra compactada.
- Muro paisajístico.
- Panel de muro cortina.
- Panel sólido.
- Panel de vidrio.
- Panel metálico.
- Panel perforado.
- Panel acústico.
- Panel sanitario.
- Panel fotovoltaico de fachada.
- Montante de muro cortina.
- Travesaño de muro cortina.
- Tapajunta de muro cortina.

### 2.2 Puertas

- Puerta simple.
- Puerta doble.
- Puerta corrediza.
- Puerta plegable.
- Puerta giratoria.
- Puerta automática.
- Puerta batiente.
- Puerta de vidrio.
- Puerta de aluminio y vidrio.
- Puerta metálica.
- Puerta de acero inoxidable.
- Puerta de madera.
- Puerta contraplacada.
- Puerta laminada.
- Puerta cortafuego.
- Puerta acústica.
- Puerta hermética hospitalaria.
- Puerta de quirófano.
- Puerta de cámara frigorífica.
- Puerta de emergencia.
- Puerta de evacuación.
- Puerta de baño.
- Puerta de seguridad.
- Portón vehicular.
- Portón industrial.
- Portón corredizo.
- Portón levadizo.
- Puerta de mantenimiento.
- Puerta de gabinete.
- Puerta de registro.
- Hoja de puerta.
- Marco de puerta.
- Cierrapuertas.
- Barra antipánico.
- Cerradura.
- Manija.
- Bisagra.
- Visor de puerta.
- Burlete.
- Sello cortahumo.

### 2.3 Ventanas y vidrios

- Ventana fija.
- Ventana abatible.
- Ventana proyectante.
- Ventana corrediza.
- Ventana oscilobatiente.
- Ventana pivotante.
- Ventana tipo guillotina.
- Ventana de techo.
- Tragaluces.
- Lucernarios.
- Claraboyas.
- Ventana hospitalaria.
- Ventana acústica.
- Ventana cortafuego.
- Ventana de aluminio.
- Ventana de PVC.
- Ventana de acero.
- Ventana de madera.
- Vidrio simple.
- Vidrio templado.
- Vidrio laminado.
- Vidrio insulado o DVH.
- Vidrio de control solar.
- Vidrio de baja emisividad.
- Vidrio acústico.
- Vidrio cortafuego.
- Vidrio serigrafiado.
- Vidrio opaco.
- Vidrio traslúcido.
- Vidrio reflectivo.
- Policarbonato alveolar.
- Policarbonato compacto.
- Acrílico.
- Panel translúcido.
- Baranda de vidrio.
- Mampara de vidrio.
- Mampara de aluminio y vidrio.
- Mampara de acero y vidrio.
- Mampara sanitaria.
- Mampara acústica.
- Mampara hospitalaria.
- Mampara modular de oficina.
- Mampara fija.
- Mampara corrediza.
- Mampara plegable.
- Mampara con puerta integrada.
- Perfilería de aluminio.
- Perfilería de acero.
- Junquillo.
- Sello de silicona.
- Herraje de vidrio.
- Riel.
- Freno de piso.
- Manija de mampara.

### 2.4 Pisos, cielos y acabados

- Piso básico.
- Piso compuesto.
- Piso estructural.
- Piso elevado.
- Piso técnico.
- Piso de concreto pulido.
- Piso de porcelanato.
- Piso cerámico.
- Piso de piedra.
- Piso de mármol.
- Piso de granito.
- Piso de madera.
- Piso laminado.
- Piso vinílico.
- Piso de caucho.
- Piso conductivo hospitalario.
- Piso antideslizante.
- Piso podotáctil.
- Piso exterior.
- Piso industrial.
- Piso deportivo.
- Vereda.
- Rampa.
- Zócalo.
- Contrazócalo.
- Cielo raso básico.
- Cielo raso compuesto.
- Cielo suspendido.
- Cielo acústico.
- Cielo sanitario.
- Cielo metálico.
- Cielo modular.
- Cielo de drywall.
- Cielo de fibra mineral.
- Cielo de madera.
- Cielo tensado.
- Fascia.
- Cornisa.
- Moldura.
- Acabado de muro.
- Revestimiento cerámico.
- Revestimiento pétreo.
- Revestimiento de madera.
- Revestimiento metálico.
- Pintura.
- Impermeabilización.
- Aislación térmica.
- Aislación acústica.
- Barrera de vapor.

### 2.5 Techos y cubiertas

- Techo básico.
- Techo compuesto.
- Techo estructural.
- Techo plano.
- Techo inclinado.
- Techo a dos aguas.
- Techo a cuatro aguas.
- Techo diente de sierra.
- Techo curvo.
- Techo metálico.
- Techo de teja.
- Techo de losa.
- Techo verde.
- Cubierta de policarbonato.
- Cubierta de vidrio.
- Cubierta termoacústica.
- Cubierta industrial.
- Cubierta de membrana.
- Canaleta.
- Cumbrera.
- Limahoya.
- Limatesa.
- Bajada pluvial.
- Flashing.
- Panel solar de cubierta.
- Claraboya.
- Lucernario.

### 2.6 Circulación vertical y protección

- Escalera recta.
- Escalera en L.
- Escalera en U.
- Escalera helicoidal.
- Escalera de caracol.
- Escalera metálica.
- Escalera de concreto.
- Escalera prefabricada.
- Escalera de emergencia.
- Escalera marina.
- Escalera de mantenimiento.
- Rampa recta.
- Rampa curva.
- Rampa accesible.
- Ascensor.
- Montacargas.
- Plataforma elevadora.
- Baranda.
- Pasamanos.
- Balaustre.
- Baranda metálica.
- Baranda de vidrio.
- Baranda de acero inoxidable.
- Reja.
- Cerco.
- Malla metálica.
- Cerramiento provisional.
- Línea de vida.
- Protección de borde.

## 3. Familias estructurales

### 3.1 Concreto y elementos estructurales

- Columna rectangular.
- Columna circular.
- Columna prefabricada.
- Columna de concreto armado.
- Viga rectangular.
- Viga invertida.
- Viga de borde.
- Viga de cimentación.
- Viga de acero revestida.
- Losa maciza.
- Losa aligerada.
- Losa nervada.
- Losa colaborante.
- Losa prefabricada.
- Losa reticular.
- Cimentación corrida.
- Zapata aislada.
- Zapata combinada.
- Zapata conectada.
- Losa de cimentación.
- Pilote.
- Encepado.
- Pedestal.
- Sobrecimiento.
- Muro estructural.
- Muro de corte.
- Muro de contención.
- Dintel.
- Placa.
- Correa de concreto.
- Elemento prefabricado.

### 3.2 Estructuras metálicas

- Columna metálica.
- Viga metálica.
- Viga armada.
- Viga reticulada.
- Cercha.
- Pórtico metálico.
- Correa tipo C.
- Correa tipo Z.
- Perfil I.
- Perfil H.
- Perfil tubular.
- Perfil angular.
- Perfil canal.
- Perfil conformado en frío.
- Arriostre diagonal.
- Arriostre horizontal.
- Cruz de San Andrés.
- Tirante.
- Tensor.
- Placa base.
- Placa de conexión.
- Cartela.
- Ángulo de conexión.
- Conexión empernada.
- Conexión soldada.
- Perno de anclaje.
- Perno estructural.
- Soldadura.
- Rigidizador.
- Apoyo metálico.
- Junta de dilatación.
- Estructura espacial.
- Malla espacial.
- Marquesina.
- Pasarela.
- Plataforma.
- Torre metálica.
- Mástil.
- Estructura para panel solar.
- Soporte de fachada.
- Soporte de equipos.
- Soporte de tuberías.
- Soporte de bandejas.
- Escalera metálica.
- Baranda metálica.
- Reja metálica.
- Portón metálico.

### 3.3 Armaduras y refuerzo

- Barra de refuerzo.
- Barra recta.
- Barra doblada.
- Estribo.
- Armadura longitudinal.
- Armadura transversal.
- Malla electrosoldada.
- Refuerzo de muro.
- Refuerzo de losa.
- Refuerzo de viga.
- Refuerzo de columna.
- Refuerzo de cimentación.
- Refuerzo de abertura.
- Conector de corte.
- Acoplador mecánico.
- Placa embebida.
- Inserto estructural.
- Anclaje químico.
- Anclaje mecánico.

### 3.4 Encofrados y obra temporal

- Encofrado de columna.
- Encofrado de viga.
- Encofrado de losa.
- Encofrado de muro.
- Encofrado de zapata.
- Encofrado de escalera.
- Encofrado metálico.
- Encofrado de madera.
- Encofrado fenólico.
- Encofrado mixto.
- Encofrado prefabricado.
- Puntal.
- Torre de apuntalamiento.
- Arriostre temporal.
- Plataforma de trabajo.
- Andamio.
- Baranda provisional.
- Cerco provisional.
- Módulo de obra.
- Caseta temporal.
- Protección de vaciado.

## 4. Familias MEP

### 4.1 Mecánicas y HVAC

- Equipo mecánico.
- Unidad manejadora de aire.
- Fan coil.
- Split.
- VRF.
- Chiller.
- Torre de enfriamiento.
- Bomba de calor.
- Caldera.
- Intercambiador.
- Ventilador.
- Extractor.
- Inyector de aire.
- Recuperador de calor.
- Rejilla de suministro.
- Rejilla de retorno.
- Difusor.
- Toma de aire exterior.
- Damper.
- Silenciador.
- Filtro.
- Caja VAV.
- Ducto rectangular.
- Ducto circular.
- Ducto flexible.
- Ducto de extracción.
- Ducto de humo.
- Aislamiento de ducto.
- Soporte de ducto.
- Accesorio de ducto.
- Tubería de refrigerante.
- Tubería de agua helada.
- Tubería de condensado.
- Termostato.
- Sensor.
- Controlador.
- BMS.

### 4.2 Sanitarias

- Aparato sanitario.
- Inodoro.
- Lavatorio.
- Lavadero.
- Urinario.
- Bidé.
- Ducha.
- Tina.
- Lavaplatos.
- Fregadero industrial.
- Bebedero.
- Barra de apoyo.
- Grifería.
- Válvula.
- Medidor de agua.
- Tanque elevado.
- Cisterna.
- Tanque hidroneumático.
- Bomba de agua.
- Bomba de desagüe.
- Trampa de grasa.
- Separador de sólidos.
- Sumidero.
- Canaleta sanitaria.
- Caja de registro.
- Cámara de inspección.
- Tubería de agua fría.
- Tubería de agua caliente.
- Tubería de desagüe.
- Tubería de ventilación.
- Tubería contra incendio.
- Rociador.
- Gabinete contra incendio.
- Manguera contra incendio.
- Hidrante.
- Válvula de control.
- Soporte de tubería.
- Aislamiento de tubería.

### 4.3 Eléctricas

- Equipo eléctrico.
- Tablero general.
- Tablero de distribución.
- Tablero de emergencia.
- Tablero de fuerza.
- Centro de control de motores.
- Transformador.
- Grupo electrógeno.
- UPS.
- Banco de baterías.
- Inversor.
- Panel fotovoltaico.
- Batería solar.
- Medidor.
- Interruptor.
- Tomacorriente.
- Tomacorriente hospitalario.
- Tomacorriente industrial.
- Tomacorriente de piso.
- Interruptor simple.
- Interruptor doble.
- Sensor de movimiento.
- Detector de presencia.
- Luminaria interior.
- Luminaria exterior.
- Luminaria de emergencia.
- Luminaria de evacuación.
- Luminaria industrial.
- Luminaria deportiva.
- Luminaria escénica.
- Proyector.
- Balasto.
- Caja eléctrica.
- Bandeja portacables.
- Canaleta eléctrica.
- Conduit.
- Conduit flexible.
- Accesorio de conduit.
- Cable.
- Alimentador.
- Puesta a tierra.
- Pararrayos.
- Barra equipotencial.

### 4.4 Comunicaciones y baja tensión

- Punto de datos.
- Punto de voz.
- Punto de televisión.
- Punto de audio.
- Punto de video.
- Cámara CCTV.
- Cámara exterior.
- Control de acceso.
- Lector biométrico.
- Lector de tarjeta.
- Cerradura electrónica.
- Intercomunicador.
- Videoportero.
- Punto de llamada de enfermera.
- Rack.
- Gabinete de comunicaciones.
- Patch panel.
- Switch.
- Router.
- Access point.
- Servidor.
- Antena.
- Amplificador.
- Altavoz.
- Micrófono.
- Consola de audio.
- Pantalla de información.
- Señal digital.
- Detector de humo.
- Detector térmico.
- Pulsador de alarma.
- Sirena.
- Panel de alarma.
- Sensor de gas.
- Sensor de inundación.
- Sensor de temperatura.
- Sensor de ocupación.

### 4.5 Transporte vertical y especialidades

- Ascensor de pasajeros.
- Ascensor camillero.
- Ascensor hospitalario.
- Ascensor panorámico.
- Montacargas.
- Montacamas.
- Escalera mecánica.
- Pasillo móvil.
- Plataforma salvaescaleras.
- Puerta automática.
- Sistema de estacionamiento.
- Barrera vehicular.
- Torniquete.
- Control de peaje.

## 5. Mobiliario y equipamiento

### 5.1 Mobiliario general

- Escritorio.
- Mesa de trabajo.
- Mesa de reunión.
- Mesa de comedor.
- Mesa escolar.
- Mesa de laboratorio.
- Mesa clínica.
- Silla operativa.
- Silla ejecutiva.
- Silla escolar.
- Silla de visita.
- Sillón.
- Sofá.
- Banco.
- Banca.
- Butaca.
- Cama.
- Cama camarote.
- Camarote.
- Armario.
- Clóset.
- Archivador.
- Locker.
- Estantería.
- Librero.
- Góndola.
- Vitrina.
- Mostrador.
- Recepción.
- Counter.
- Mueble bajo.
- Mueble alto.
- Mueble empotrado.
- Gabinete.
- Mueble de cocina.
- Mueble de baño.
- Mueble de enfermería.
- Mueble de laboratorio.
- Mueble de farmacia.
- Mueble de biblioteca.
- Mueble de taller.
- Mueble de almacén.
- Mueble urbano.
- Bote de basura.
- Dispensador.
- Espejo.
- Cortina.
- Persiana.
- Divisor móvil.

### 5.2 Equipamiento de salud

- Cama hospitalaria.
- Camilla.
- Camilla de emergencia.
- Silla de ruedas.
- Silla de diálisis.
- Mesa de operaciones.
- Lámpara quirúrgica.
- Monitor multiparámetro.
- Ventilador mecánico.
- Máquina de anestesia.
- Desfibrilador.
- Electrocardiógrafo.
- Ecógrafo.
- Equipo de rayos X.
- Tomógrafo.
- Resonador.
- Mamógrafo.
- Autoclave.
- Esterilizador.
- Analizador de laboratorio.
- Microscopio.
- Refrigerador médico.
- Congelador médico.
- Incubadora.
- Lavadora hospitalaria.
- Central de gases medicinales.
- Panel de cabecera.
- Sistema de llamado de enfermera.
- Carro de paro.
- Carro de curaciones.
- Dispensador médico.
- Lavamanos clínico.
- Cortina hospitalaria.

### 5.3 Equipamiento educativo

- Carpeta escolar.
- Pizarra.
- Pizarra digital.
- Proyector.
- Pantalla interactiva.
- Computadora escolar.
- Tablet.
- Impresora.
- Mesa de laboratorio.
- Módulo de ciencias.
- Módulo de química.
- Módulo de física.
- Equipamiento de taller.
- Horno de laboratorio.
- Torno.
- Fresadora.
- Estantería de biblioteca.
- Lockers.
- Equipamiento deportivo.
- Tablero deportivo.
- Gradería.

### 5.4 Equipamiento de oficinas

- Computadora de escritorio.
- Computadora portátil.
- Monitor.
- Docking station.
- Impresora.
- Escáner.
- Servidor.
- Rack.
- Switch.
- Router.
- Access point.
- Teléfono IP.
- Cámara de videoconferencia.
- Micrófono de sala.
- Pantalla de sala.
- Televisor.
- Proyector.
- Cafetera.
- Refrigeradora.
- Microondas.
- Dispensador de agua.
- Trituradora de papel.
- UPS.
- Silla ergonómica.
- Escritorio regulable.

### 5.5 Equipamiento comercial

- Góndola.
- Estantería comercial.
- Vitrina refrigerada.
- Vitrina seca.
- Caja registradora.
- Terminal POS.
- Balanza.
- Escáner de código de barras.
- Congeladora.
- Refrigeradora comercial.
- Máquina de hielo.
- Horno comercial.
- Cocina industrial.
- Campana extractora.
- Lavavajillas industrial.
- Pantalla publicitaria.
- Tótem digital.
- Señalética comercial.
- Torniquete.
- Barrera vehicular.

### 5.6 Equipamiento industrial

- Máquina de producción.
- Línea de producción.
- Transportador.
- Puente grúa.
- Grúa viajera.
- Polipasto.
- Compresor.
- Caldera.
- Tanque.
- Reactor.
- Bomba industrial.
- Chiller industrial.
- Torre de enfriamiento.
- Extractor industrial.
- Colector de polvo.
- Máquina de soldadura.
- Torno industrial.
- Prensa.
- Horno industrial.
- Tablero de control.
- PLC.
- Instrumento de medición.
- Ducha de emergencia.
- Lavaojos.
- EPP.

### 5.7 Equipamiento deportivo

- Gradería.
- Butaca deportiva.
- Tablero electrónico.
- Marcador.
- Canasta.
- Arco.
- Red deportiva.
- Equipamiento de gimnasio.
- Máquina cardiovascular.
- Máquina de fuerza.
- Tatami.
- Colchoneta.
- Equipamiento de piscina.
- Filtro de piscina.
- Bomba de piscina.
- Clorador.
- Carril de natación.
- Banco de vestuario.
- Casillero.
- Ducha.
- Sauna.

### 5.8 Equipamiento cultural y de auditorios

- Butaca de auditorio.
- Escenario.
- Tarima.
- Atril.
- Púlpito.
- Cortina escénica.
- Telón.
- Proyector.
- Pantalla.
- Consola de audio.
- Micrófono.
- Altavoz.
- Amplificador.
- Iluminación escénica.
- Reflector.
- Sistema de traducción.
- Cabina de traducción.
- Equipamiento museográfico.
- Vitrina museográfica.
- Panel expositivo.

### 5.9 Equipamiento residencial y hotelero

- Cocina integral.
- Refrigeradora.
- Horno.
- Cocina.
- Campana.
- Lavadora.
- Secadora.
- Termotanque.
- Calentador.
- Aire acondicionado.
- Televisor.
- Sistema de intercomunicación.
- Caja fuerte.
- Minibar.
- Equipamiento de gimnasio.
- Mobiliario de habitación.
- Mobiliario de lobby.
- Equipamiento de lavandería.
- Equipamiento de cocina profesional.

### 5.10 Equipamiento de transporte

- Torniquete.
- Máquina de cobro.
- Validador.
- Señal digital.
- Pantalla de información.
- Boletería.
- Barrera vehicular.
- Equipo de control de acceso.
- Escáner de seguridad.
- Equipamiento de andén.
- Banco de espera.
- Máquina de rayos X.
- Sistema de megafonía.
- Cámara de seguridad.
- Equipamiento de estacionamiento.

## 6. Familias de sitio, urbanismo y paisaje

- Toposólido.
- Superficie topográfica.
- Plataforma de construcción.
- Región nivelada.
- Línea de propiedad.
- Parcela.
- Eje de vía.
- Carretera.
- Vereda.
- Ciclovía.
- Estacionamiento.
- Señal de tránsito.
- Semáforo.
- Poste.
- Luminaria urbana.
- Buzón.
- Cámara de servicios.
- Sumidero pluvial.
- Rejilla pluvial.
- Muro de contención.
- Talud.
- Escalera exterior.
- Rampa exterior.
- Bancas urbanas.
- Papeleras.
- Bolardos.
- Jardineras.
- Árbol.
- Arbusto.
- Césped.
- Planta ornamental.
- Sistema de riego.
- Fuente.
- Pérgola.
- Juego infantil.
- Equipamiento deportivo exterior.
- Cerco perimétrico.
- Portón de acceso.
- Caseta de vigilancia.
- Mobiliario urbano.

## 7. Familias de anotación y documentación

Estas familias no representan objetos físicos principales, pero son necesarias para producir planos y expedientes.

- Etiqueta de puerta.
- Etiqueta de ventana.
- Etiqueta de muro.
- Etiqueta de espacio.
- Etiqueta de ambiente.
- Etiqueta de equipo.
- Etiqueta de mobiliario.
- Etiqueta de material.
- Etiqueta de elemento estructural.
- Etiqueta de instalación.
- Etiqueta de tubería.
- Etiqueta de ducto.
- Etiqueta de bandeja.
- Etiqueta de luminaria.
- Etiqueta de aparato sanitario.
- Etiqueta de estructura metálica.
- Etiqueta de activo.
- Etiqueta de mantenimiento.
- Símbolo de sección.
- Símbolo de elevación.
- Símbolo de detalle.
- Símbolo de llamada.
- Símbolo de norte.
- Símbolo de nivel.
- Símbolo de pendiente.
- Símbolo de soldadura.
- Símbolo de conexión.
- Símbolo eléctrico.
- Símbolo sanitario.
- Símbolo mecánico.
- Símbolo contra incendio.
- Símbolo de seguridad.
- Símbolo de accesibilidad.
- Símbolo de demolición.
- Símbolo de obra nueva.
- Símbolo de existente.
- Nota general.
- Nota clave.
- Texto de modelo.
- Texto de anotación.
- Cota lineal.
- Cota alineada.
- Cota angular.
- Cota radial.
- Cota de diámetro.
- Cota de elevación.
- Cota de coordenadas.
- Cota de pendiente.
- Línea de detalle.
- Línea simbólica.
- Región de relleno.
- Región enmascarada.
- Componente de detalle.
- Componente repetido.
- Patrón de relleno.
- Perfil.
- Perfil de muro.
- Perfil de montante.
- Perfil de baranda.
- Perfil de cornisa.
- Perfil de canaleta.
- Perfil de aislamiento.
- Cajetín.
- Leyenda.
- Tabla de planificación.
- Cuadro de áreas.
- Cuadro de puertas.
- Cuadro de ventanas.
- Cuadro de acabados.
- Cuadro de equipos.
- Cuadro de mobiliario.
- Cuadro de activos.
- Cuadro de materiales.
- Cuadro de metrados.
- Cuadro de costos.
- Cuadro de mantenimiento.

## 8. Familias adaptativas, basadas en línea y especiales

ARKI debe clasificar cada componente por su comportamiento geométrico.

- Familia hospedada en muro.
- Familia hospedada en techo.
- Familia hospedada en piso.
- Familia hospedada en cara.
- Familia hospedada en plano de trabajo.
- Familia basada en nivel.
- Familia basada en línea.
- Familia basada en dos líneas.
- Familia basada en superficie.
- Familia basada en punto.
- Familia adaptativa de uno, dos, tres o más puntos.
- Familia repetitiva.
- Familia de componente de patrón.
- Familia de perfil.
- Familia de detalle lineal.
- Familia anidada.
- Familia compartida.
- Familia de masa conceptual.
- Familia in situ.
- Familia de fabricación.
- Familia de conexión estructural.
- Familia de soporte MEP.

## 9. Parámetros que ARKI debe incluir en cada familia

Cada familia del catálogo debe tener una ficha común. Los parámetros deben dividirse entre identidad, geometría, materiales, costos, planificación, operación y documentación.

### Identidad

- Código único.
- Nombre.
- Categoría Revit.
- Subcategoría.
- Disciplina.
- Especialidad.
- Tipología de obra.
- Fabricante.
- Modelo.
- Proveedor.
- Versión.
- Estado.

### Geometría

- Largo.
- Ancho.
- Alto.
- Espesor.
- Diámetro.
- Radio.
- Área.
- Volumen.
- Peso.
- Punto de inserción.
- Nivel.
- Eje.
- Orientación.
- Tolerancia.
.
### Materiales y acabados

- Material principal.
- Materiales por capa.
- Acabado interior.
- Acabado exterior.
- Color.
- Textura.
- Espesor de capa.
- Resistencia.
- Protección anticorrosiva.
- Aislamiento térmico.
- Aislamiento acústico.
- Resistencia al fuego.
- Control solar.

### Metrados y costos

- Unidad de medida.
- Cantidad.
- Metrado neto.
- Metrado bruto.
- Desperdicio.
- Partida.
- Código S10/CAPECO.
- Precio unitario.
- Costo directo.
- Mano de obra.
- Materiales.
- Equipos.
- Herramientas.
- Gastos generales.
- Utilidad.
- Impuestos.
- Moneda.
- Fecha de precio.

### 4D y construcción

- Actividad de ejecución.
- Predecesora.
- Duración.
- Cuadrilla.
- Recurso.
- Fecha planificada.
- Fecha real.
- Porcentaje programado.
- Porcentaje ejecutado.
- Estado de obra.
- Proveedor.
- Lote.
- Certificado.
- Inspección.
- Protocolo de calidad.

### Operación y mantenimiento

- Código de activo.
- Responsable.
- Fecha de compra.
- Fecha de instalación.
- Garantía.
- Vida útil.
- Frecuencia de mantenimiento.
- Tipo de mantenimiento.
- Próximo mantenimiento.
- Manual técnico.
- Repuestos.
- Consumo energético.
- Estado operativo.
- Historial de fallas.

## 10. Catálogo mínimo de ARKI por tipología de obra

| Tipología | Familias prioritarias |
|---|---|
| Vivienda | Muros, puertas, ventanas, cocinas, baños, mobiliario, electrodomésticos, luminarias y equipos de seguridad |
| Multifamiliar | Núcleos, escaleras, ascensores, estacionamientos, cuartos técnicos, cocinas, baños y mobiliario |
| Salud | Ambientes clínicos, puertas herméticas, mamparas sanitarias, gases medicinales, camas, equipos médicos, HVAC y respaldo eléctrico |
| Educación | Aulas, laboratorios, talleres, carpetas, pizarras, proyectores, computadoras, biblioteca y deporte |
| Oficinas | Mamparas, salas, escritorios, computadoras, racks, videoconferencia, control de acceso y climatización |
| Comercio | Góndolas, vitrinas, cajas, refrigeración, POS, señalética, seguridad, escaleras mecánicas y pantallas |
| Industria | Estructuras metálicas, maquinaria, puentes grúa, tuberías, tableros, extracción, seguridad y mantenimiento |
| Deporte | Graderías, equipamiento deportivo, piscina, vestuarios, iluminación y sistemas de control |
| Cultura | Butacas, escenario, acústica, iluminación escénica, audio, video, museografía y seguridad |
| Hotel | Habitaciones, baños, lobby, cocinas, lavandería, climatización, control de acceso y mobiliario |
| Transporte | Andenes, torniquetes, boleterías, señalización, pantallas, CCTV, escaleras mecánicas y cobro |
| Religioso | Nave, altar, mobiliario litúrgico, vitrales, acústica, iluminación y campanario |
| Industrial especial | Equipos de proceso, tanques, bombas, estructuras, racks, control, seguridad y activos mantenibles |
| Paisajismo | Terreno, vegetación, riego, pavimentos, mobiliario urbano, iluminación y juegos |

## 11. Qué debe implementar ARKI primero

La lista completa no debe convertirse en cientos de objetos aislados. La implementación debe comenzar por un **catálogo paramétrico central** con plantillas reutilizables.

### Prioridad 1: envolvente y arquitectura

Muros, puertas, ventanas, vidrios, mamparas, pisos, techos, escaleras, rampas, barandas y acabados.

### Prioridad 2: estructura

Concreto, acero, conexiones, refuerzo, cimentaciones, encofrados y elementos temporales.

### Prioridad 3: MEP

Sanitarias, HVAC, eléctricas, comunicaciones, seguridad y contra incendio.

### Prioridad 4: mobiliario y equipamiento

Muebles fijos y móviles, equipos por tipología, computadoras, televisores, servidores, equipos médicos, maquinaria y activos.

### Prioridad 5: documentación y operación

Etiquetas, cuadros, planos, costos, actividades 4D, activos, mantenimiento, manuales y expediente.

## 12. Regla de integración con ARKI

Cada familia debe existir una sola vez en el catálogo central. El mismo objeto debe poder aparecer en 2D, 3D, presupuesto, cronograma, avance, expediente y mantenimiento.

> Una mampara no debe ser solamente una geometría. Debe ser un objeto con vidrio, perfilería, herrajes, metrados, partida, costo, actividad de montaje, estado de avance, garantía y mantenimiento.

La prioridad no es dibujar todas las familias de una vez. La prioridad es definir el contrato de datos que permita que cualquier familia nueva pueda conectarse automáticamente al modelo BIM, al presupuesto, al seguimiento de obra y al mantenimiento.

## Referencias

[1]: https://help.autodesk.com/view/RVT/2026/ENU/ "Autodesk Revit Help 2026"
[2]: manus-webdev://6e4624b6 "Checkpoint ejecutable de ARKI revisado durante la sesión"
