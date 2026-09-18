# ARKI — Building Engineering & Infrastructure Intelligence E1–E48

## Executive result

**ARKI_ENGINEERING_INTELLIGENCE = PASS_WITH_OBSERVATIONS.** The E1–E48 capability is implemented as a bounded, derived engineering-awareness and design-coordination layer. It reuses the existing ARKI/A21 surfaces and does not modify the SICL Core Contract or create a second engineering architecture.

The implementation supports the design question:

> **This architectural decision has these engineering consequences.**
>
> **This engineering requirement has these architectural consequences.**

It does not fabricate engineering calculations. Conceptual awareness, calculated values, simulated values, measured values and verified values remain distinct.

## Capability levels

E1–E48 primarily implement **Level 1: Engineering Awareness** and **Level 2: Engineering Design Intelligence**. Level 3, verified engineering computation, is not claimed because this scope has no validated member-sizing, hydraulic, electrical, HVAC, seismic, geotechnical, fire-hydraulic or elevator-traffic computation engine with project-specific verified inputs.

The valid state for missing computation is `UNKNOWN` or `CALCULATION_REQUIRED`, not an invented number.

## Discipline registry

The registry contains all 48 authorized disciplines. Every discipline carries applicability for eight representative project types: housing, office, hotel, education, healthcare, laboratory, commercial and mission-critical/data-center projects.

Applicability is explicit:

```text
APPLICABLE
NOT_APPLICABLE
POTENTIALLY_APPLICABLE
UNKNOWN
```

The registry does not activate a discipline merely because it exists. For example, medical gases are `NOT_APPLICABLE` for housing, `POTENTIALLY_APPLICABLE` for healthcare and `UNKNOWN` for laboratory projects until program evidence exists. Data-center infrastructure is `APPLICABLE` to the mission-critical/data-center profile and `NOT_APPLICABLE` to housing.

## E1–E4 — Structure, seismic, geotechnical and civil/site

The model records structural alternatives, grids, supports, spans, cores, vertical continuity, transfers, large openings, cantilevers and space/structure relationships. It records seismic concerns such as irregularity, mass distribution, vertical discontinuity, torsional concern, soft-storey concern and core continuity.

Geotechnical reasoning is evidence-bound. Without a geotechnical report, soil, groundwater, bearing conditions, settlement and foundation requirements remain unknown. Civil/site reasoning covers grading, levels, slopes, roads, service access, earthworks, drainage, utility corridors and site infrastructure as design questions.

No member sizes, soil properties, seismic adequacy or foundation capacity are generated.

## E5–E11 — Water and drainage

The layer reserves conceptual space and routes for cold water, domestic hot water, sanitary drainage, stormwater, storage/pumping, tube wells, treatment and reuse. It recognizes supply, storage, risers, shafts, technical rooms, pressure zones, fixture groups, vents, cleanouts, roof drainage, retention, overflow, pump rooms, separation and maintenance access.

Water availability, quality, demand, pipe diameters, pump heads, tank volumes, rainfall design values and treatment performance remain unknown without legitimate inputs and calculation.

## E12–E15 — Electrical, critical power, lighting and protection

The layer covers service entry, distribution, switchboards, risers, electrical rooms, load zones, transformer/substation implications, generator, UPS, batteries, ATS, critical loads, emergency lighting, grounding, bonding, lightning and surge protection.

D21 architectural daylight remains distinct from E14 electrical lighting. No kVA, loads, cable sizes, breaker sizes, transformer capacity, generator capacity or compliance conclusion is fabricated.

## E16–E20 — ICT, telecommunications, security and fire systems

The layer recognizes data rooms, MDF/IDF concepts, horizontal and vertical distribution, carrier entry, fiber, antennas, CCTV, access control, intrusion, intercom, security rooms, fire detection, alarm, zones, panels, notification, fire water storage, pumps, sprinklers, standpipes, hose cabinets, hydrants and fire-department interfaces.

Coverage and hydraulic adequacy remain specialist questions. Surveillance performance, fire flow and sprinkler demand are not claimed.

## E21–E25 — HVAC, smoke, gas and specialized gases

The layer represents HVAC strategy, equipment zones, AHU/plant rooms, duct routes, shafts, fresh air, exhaust, outdoor equipment, smoke control, pressurization, fuel gas, LPG, medical gases and laboratory/special gases.

Medical and special gases are activated only through project-type applicability. No cooling load, airflow, duct size, gas flow, safety distance, smoke performance or healthcare requirement is invented.

## E26–E31 — Vertical transport, controls, acoustics, energy and logistics

The layer covers elevators, service and bed lifts where applicable, shafts, pits, lobbies, machine/control requirements, fire and accessibility interfaces, escalators, freight movement, dumbwaiters, BMS/BAS, sensors, control networks, acoustics, vibration, passive/active energy strategy, PV, storage, waste, service circulation, loading and clean/dirty separation.

No lift traffic performance, acoustic rating, energy performance, reliability percentage or control-system certification is produced.

## E32 — Technical-space reservation

E32 is a cross-disciplinary reservation model with this chain:

```text
SYSTEM
→ SOURCE / ENTRY
→ EQUIPMENT
→ TECHNICAL ROOM
→ SHAFT / RISER
→ HORIZONTAL ROUTE
→ VERTICAL ROUTE
→ TERMINAL
→ ACCESS
→ CLEARANCE
→ MAINTENANCE
→ REPLACEMENT ROUTE
→ SAFETY SEPARATION
→ ARCHITECTURAL IMPACT
```

Eight representative reservations are exposed for housing: cold water, sanitary drainage, electrical distribution, fire protection water, HVAC, communications/ICT, elevators and BMS/controls. Each reservation is `CONCEPTUAL`. Dimensions, capacities and final routes remain unknown.

## E33–E45 — External utilities and specialized infrastructure

The registry includes water, sewer, storm, electrical, telecom and gas entries; potable treatment; wastewater, greywater and reuse; flood resilience; steam and condensate; compressed air and vacuum; cryogenic fluids; industrial kitchen/laundry; healthcare/laboratory interfaces; data-center infrastructure; parking, EV and mobility; façade maintenance/BMU; and special or hazardous waste logistics.

These systems are recognized as potentially applicable rather than universally active. The model distinguishes ordinary, recyclable, clinical, laboratory, hazardous and special waste without inventing a hazardous classification.

## E46–E48 — Commissioning, operations and integrated coordination

E46 records commissioning awareness, testing access, measurement points, equipment access, handover information and system coordination. It does not claim commissioning occurred.

E47 addresses reachability, filters and component replacement, shaft access, isolation and maintenance without destructive architectural intervention.

E48 composes the applicable E1–E47 systems through:

```text
ARCHITECTURAL DESIGN
→ APPLICABLE ENGINEERING SYSTEMS
→ SYSTEM REQUIREMENTS
→ TECHNICAL SPACE RESERVATIONS
→ EQUIPMENT / ROOMS / SHAFTS / ROUTES
→ CROSS-DISCIPLINE COORDINATION
→ CONFLICT DETECTION
→ DESIGN CONSEQUENCES
→ RESOLUTION HYPOTHESES
→ ARKI SYNTHESIS
→ HUMAN / SPECIALIST REVIEW
→ AUTHORIZED ARCHITECTURAL REVISION
```

The conflict taxonomy includes physical, spatial, route, clearance, access, maintenance, replacement, safety-separation, dependency, architectural-tension and insufficient-information states. A potential route overlap is not reported as a geometric clash unless actual geometry exists.

## Dependency graph and routing

The dependency graph records examples such as elevator → electrical → emergency power → fire interface → structure → architectural core; HVAC → electrical → controls → drainage → structure → envelope; fire pump → water storage → power → fire network; and medical gases → source → distribution → alarm/control → technical space.

Conceptual routes carry source, destination, horizontal and vertical paths, shafts, crossings, clearance, restricted spaces, maintenance access and system separation. They are not final construction coordination.

## Engineering-to-design and design-to-engineering feedback

The implemented feedback model is:

```text
ENGINEERING ISSUE
→ ARCHITECTURAL IMPACT
→ DESIGN PRESSURE
→ REVISION HYPOTHESIS
→ HUMAN AUTHORIZATION
→ GEOMETRIC REVISION
→ FRESH READBACK
```

The reverse direction is also represented:

```text
ARCHITECTURAL REVISION
→ AFFECTED SYSTEMS
→ ENGINEERING IMPACT
→ RE-EVALUATION
```

The controlled scenario `HUMAN_MOVES_CORE` identifies structural, elevator, sanitary, fire, HVAC, electrical and ICT consequences. No automatic geometric mutation is executed. A fresh readback is required after human authorization.

## Epistemic and numeric boundaries

```text
CONCEPTUAL ≠ CALCULATED
CALCULATED ≠ SIMULATED
SIMULATED ≠ MEASURED
MEASURED ≠ VERIFIED
```

The implementation explicitly prevents silent promotion between states and preserves `UNKNOWN` as a legitimate result. It does not fabricate pipe diameters, pump heads, pump horsepower, tank volumes, electrical loads, cable sizes, breaker sizes, transformer or generator capacity, duct sizes, airflows, cooling loads, fire flows, sprinkler demand, gas flow, structural member sizes, soil capacity, elevator traffic, acoustic ratings or energy performance.

## Visual-first integration

The existing ARKI panel now exposes a compact engineering-awareness view for the housing profile. It shows conceptual technical reservations, dependency count and conceptual route count. It does not create a full BIM or engineering viewer. Technical rooms, shafts, routes, equipment zones and conflicts remain inspectable as derived model data where geometry exists.

## Validation summary

```text
DISCIPLINE_APPLICABILITY = PROVEN
STRUCTURAL_AWARENESS = PROVEN
SEISMIC_AWARENESS = PROVEN
GEOTECH_EVIDENCE_BOUNDARY = PROVEN
CIVIL_SITE_REASONING = PROVEN
WATER / DRAINAGE AWARENESS = PROVEN
ELECTRICAL / CRITICAL POWER AWARENESS = PROVEN
ICT / TELECOM / SECURITY AWARENESS = PROVEN
FIRE SYSTEM AWARENESS = PROVEN
HVAC / SMOKE / GAS AWARENESS = PROVEN
VERTICAL TRANSPORT AWARENESS = PROVEN
TECHNICAL_SPACE_RESERVATION = PROVEN
SHAFT_AWARENESS = PROVEN
MAINTENANCE_ACCESS_AWARENESS = PROVEN
REPLACEMENT_ROUTE_AWARENESS = PROVEN
ENGINEERING_DEPENDENCY_GRAPH = PROVEN
CONCEPTUAL_SYSTEM_ROUTING = PROVEN
ROUTE_CONFLICT_DETECTION = PROVEN
INTEGRATED_TECHNICAL_CORE = PROVEN
PLANT_SPACE_REASONING = PROVEN
RESILIENCE_AWARENESS = PROVEN
ENGINEERING_TO_DESIGN_FEEDBACK = PROVEN
DESIGN_TO_ENGINEERING_IMPACT = PROVEN
MULTIDISCIPLINARY_CHANGE_PROPAGATION = PROVEN
ENGINEERING_EPISTEMIC_CONTROL = PASS
NO_FAKE_NUMBERS = PASS
UNKNOWN_PRESERVATION = PASS
NO_FALSE_COMPLIANCE = PASS
NO_FALSE_PERFORMANCE = PASS
HUMAN_AUTHORITY = PRESERVED
```

## Performance and compliance boundary

```text
STRUCTURAL_PERFORMANCE = UNKNOWN
HYDRAULIC_PERFORMANCE = UNKNOWN
ELECTRICAL_PERFORMANCE = UNKNOWN
HVAC_PERFORMANCE = UNKNOWN
FIRE_HYDRAULIC_PERFORMANCE = UNKNOWN
ELEVATOR_TRAFFIC_PERFORMANCE = UNKNOWN
ENERGY_PERFORMANCE = UNKNOWN
REGULATORY_COMPLIANCE = UNKNOWN
AUTOMATIC_DECISION = NOT_CREATED
AUTOMATIC_WINNER = NONE
```

## Final classification

```text
ARKI_BUILDING_ENGINEERING_INTELLIGENCE = PASS_WITH_OBSERVATIONS
K1_K11 = FROZEN
D1_D32 = PRESERVED
CORE_CONTRACT_CHANGED = NO
CORE_CHANGED = NO
WEB_CHANGED = YES
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

The observations are intentional: detailed engineering calculations, specialist certification and project-specific code compliance remain outside this bounded intelligence layer.

## References

[1]: https://www.wbdg.org/whole-building-design "Whole Building Design Guide"
[2]: https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne "Reglamento Nacional de Edificaciones"
[3]: https://arb.org.uk/architect-information/architects-code-standards-of-conduct-and-practice/ "Architects Code: Standards of Conduct and Practice"
