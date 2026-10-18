# ARKI-SOLVER-MAP-001 — Spatial geometry graphs, BIM IFC and CAD

**Research scope.** This report covers one solver family: spatial geometry graphs, BIM/IFC interchange, geospatial coordinate and topology operations, and CAD boundary-representation (B-Rep) modeling. The candidate set is limited to **Three.js**, **web-ifc**, **IfcOpenShell**, the **GDAL/PROJ/GEOS** geospatial stack, and **Open CASCADE Technology (OCCT)** where CAD-kernel behavior is relevant. Aurora and Aurora artifacts were not used. No software was installed or executed.

**Access date.** Official documentation, repositories, license pages, and primary validation sources were accessed on **2026-09-24**. “Unknown” is used when an official source did not establish a fact; it is not an inference from project popularity or third-party packaging.

## Executive conclusion

No single candidate covers the complete family. The defensible architecture is a composed stack with explicit boundaries:

1. **Three.js** is the browser visualization and interaction layer. It supplies scene graphs, geometry objects, cameras, renderers, ray casting, loaders, and exporters, but it is not an IFC validator, CAD kernel, or geospatial topology engine. Its official repository describes WebGL and WebGPU renderers, with SVG and CSS3D available as add-ons.[1] [2]
2. **web-ifc** is the browser/Node IFC parsing and writing layer. Its API is WebAssembly-backed and exposes model opening, geometry/property access, and model closing. The official project documents browser, Node, multithreaded, and standalone C++/executable targets and publishes regression models.[3] [4]
3. **IfcOpenShell** is the strongest open-source BIM/IFC authoring, geometry-processing, conversion, and validation candidate. It provides C++ and Python APIs, CLI applications, headless deployment options, IFC schema support, geometry conversion, and validation. Its validation module is useful for syntax/type/inverse/cardinality and optional EXPRESS-rule checks, but its own documentation states that some parse-stage, duplicate-ID, entity-name, and WHERE-rule problems are not all caught by that function.[5] [6]
4. **GDAL/PROJ/GEOS** is the geospatial subsystem. GDAL handles raster/vector data translation and processing; PROJ handles coordinate reference systems and transformations; GEOS supplies two-dimensional computational geometry and topology. Together they are appropriate for site/context GIS, CRS normalization, vector validity, buffering, intersections, and spatial indexing. They do not replace a BIM semantic model or a 3D mechanical CAD kernel.[7] [8] [9]
5. **OCCT** is the appropriate open-source CAD-kernel candidate for exact 2D/3D geometric modeling, topology, Boolean operations, shape healing, STEP/IGES exchange, and tessellation. Its core is C++ and its distribution is LGPL 2.1 with a special exception, while the vendor also offers a commercial license. It is a kernel/platform, not a complete professional CAD product or engineering authority.[10] [11]

For ARKI’s C1–C80 map, the highest direct relevance is **C01, C02, C05, C11, C27–C29, C35, C37, C44–C46, C60, C63, C69–C70, C76–C77, C79, and C80**. **C34 (RVT/RFA), C36 (point clouds), C38–C43 (gbXML, concurrency, BCF, CDE/ISO 19650, PKI, immutable audit), and most simulation, certification, and professional-engineering capabilities are not established by this family.** The local ARKI matrix explicitly marks C37 as partial and warns against an IFC4.3 round-trip claim; it also marks IfcOpenShell as requiring a capability probe.[12]

The professional boundary remains decisive: ARKI is not a licensed architect, engineer, certifier, or authority having jurisdiction. The project’s professional validation matrix requires professional validation for structures, MEP, fire/life safety, vertical transport, façade actions, certification, regulated procurement, and legal contracts.[13] A geometry or IFC pass is therefore evidence about a file or computation, not approval of a building or design.

## Candidate comparison

| Candidate | License / openness | Main runtime and language | Python API | CLI / headless position | Primary role | Recommendation |
|---|---|---|---|---|---|---|
| Three.js | MIT; open source | JavaScript/TypeScript ecosystem; browser-first WebGL/WebGPU | No official Python API established | Browser visualization; Node/headless rendering is not guaranteed by the cited official docs | Scene graph, interactive 3D, ray casting, rendering | Use as presentation and interaction layer, not as the geometry authority |
| web-ifc | MPL-2.0 repository license; open source | C++ compiled to WebAssembly; JavaScript/TypeScript API; browser and Node outputs | No official Python API established | Node and standalone C++/executable are documented; suitable for headless IFC parsing with runtime setup | IFC read/write, schema entities, geometry/property extraction | Use for web/Node IFC ingestion; pair with IfcOpenShell or buildingSMART validation for stronger validation |
| IfcOpenShell | LGPL-3.0-or-later for core/ecosystem; some add-ons have GPL exceptions | C++ core, Python bindings, JavaScript through Pyodide, WASM and native deployments | Yes; official bindings expose core and high-level authoring/analysis | CLI applications and headless server deployments explicitly documented | BIM/IFC authoring, conversion, geometry, validation, clash/query utilities | Preferred open-source IFC authority for server-side processing, subject to schema/fixture validation |
| GDAL / PROJ / GEOS | GDAL MIT; PROJ X/MIT; GEOS LGPL | C/C++; SWIG Python for GDAL; native APIs and command-line utilities | GDAL official SWIG bindings; PROJ/GEOS Python support is not claimed here | Strong CLI/headless posture; batch processing is a normal use | GIS formats, CRS transforms, 2D topology and validity | Use for geospatial context and coordinate/topology preprocessing, not BIM semantics or B-Rep CAD |
| OCCT | LGPL 2.1 with special exception; alternative commercial license available | C++ class libraries; Tcl-based DRAW test harness | No official first-party Python API established in the cited sources | Core can be embedded headlessly; DRAW is a test harness and may use X graphics | Exact CAD geometry/topology, B-Rep, Boolean operations, shape healing, STEP/IGES | Use when true CAD-kernel operations or robust STEP/IGES exchange are required; isolate license and kernel-version risk |

## Detailed findings

### Three.js

**What it is.** Three.js is a general-purpose JavaScript 3D library. The official documentation exposes scene primitives, `Object3D`, `BufferGeometry`, `Raycaster`, cameras, loaders, renderers, math utilities, and exporters. The repository README states that the current builds include WebGL and WebGPU renderers, while SVG and CSS3D are add-ons.[1] [2]

**License and commercial status.** The official repository license page identifies the MIT License. MIT permits commercial use, modification, distribution, and private use subject to preserving copyright and license notices; the source page also lists warranty and liability limitations.[14] This is open source, not a commercial solver. Commercial support or products built around it are separate matters and are **not established here**.

**APIs, input/output, and execution.** The primary API is JavaScript/TypeScript-oriented and operates on in-memory scenes, buffers, textures, cameras, and render targets. Official add-on loaders and exporters cover common mesh and scene formats, including glTF, OBJ, PLY, STL, FBX, Collada, USD, and others, but the cited official documentation does not establish native IFC, STEP, IGES, DWG, DXF, or geospatial CRS semantics.[1] It can be used in a browser. A fully deterministic, headless renderer requires a separately selected graphics runtime and an application-specific setup; the cited official sources do not guarantee a headless server mode, exact pixel determinism, or cross-GPU reproducibility. **Headless: UNKNOWN as an official Three.js guarantee. Determinism: UNKNOWN as a project guarantee; application-level geometry calculations can be made deterministic, while rendering can vary by backend, driver, precision, and timing.**

**Testing and active development.** The official documentation and repository are current and extensive, but the sources reviewed here do not specify a single supported conformance suite for professional CAD/BIM correctness. Testability is therefore high for application-level scene graph, geometry, serialization, and interaction tests, but not equivalent to IFC schema validation or CAD-kernel robustness testing. Exact release cadence and long-term support policy are **UNKNOWN** from the cited pages.

**Limitations and professional boundary.** Three.js is a visualization and interaction engine. It does not provide IFC entity semantics, IFC schema validation, geodetic datum transformations, robust polygon validity rules, or exact B-Rep Boolean operations. It can display results produced by other solvers, but a rendered mesh must not be treated as the authoritative BIM or engineering model. It is relevant to C01/C02 spatial presentation, C11/C27–C29 graph visualization, C44 dashboards, C60 isovist visualization, C63 feasibility communication, C76/C77 debugging and explanation, and C79/C80 wayfinding visualization. It does not establish C34, C35, C37, or professional engineering capabilities by itself.

### web-ifc

**What it is.** web-ifc is documented as a JavaScript library to read and write IFC files at native speeds. The official usage example creates `IfcAPI`, calls `Init`, opens a model from a string or `UInt8Array`, queries geometry or properties by model ID, and closes the model.[3] The project documentation says that its C++ implementation is compiled to WebAssembly and emits browser, Node, multithreaded, and native artifacts. It also states that the library can be used as a standalone C++ library or executable.[3] [4]

**License and commercial status.** The official repository’s `LICENSE.md` identifies the source form as subject to the Mozilla Public License, version 2.0, including the file-level copyleft and larger-work provisions.[15] This is open source. A commercial product may embed it while complying with MPL obligations; no separate commercial support or warranty was verified from the official sources reviewed.

**APIs, input/output, and execution.** The official API is JavaScript/TypeScript and is available through browser and Node WASM wrappers. The docs list `web-ifc.wasm`, `web-ifc-mt.wasm`, `web-ifc-node.wasm`, API wrappers, TypeScript declarations, schema declarations, property/log helpers, and a browser worker for multithreading.[3] The documented input is IFC data as a string or byte array, and the output is accessible model geometry, properties, schema entities, and written IFC data. **Python API: not established by the official web-ifc sources reviewed.** **Headless: supported in the narrow sense that Node and native C++/executable outputs are documented; exact deployment behavior still depends on WASM/runtime configuration.**

**Testing, determinism, and active development.** The official repository documents a library of test models under `tests/public` and a regression command that detects geometry changes. That is strong evidence for repeatable fixture-based testing.[3] It is not a guarantee of full IFC schema, semantic, or cross-version round-trip conformance. The project publishes a “live build” for testing newest fixes, which demonstrates ongoing maintenance but can also introduce moving inputs; production should pin versions and WASM binaries.[3] **Determinism: no formal guarantee was found.** For the same pinned binary, input bytes, settings, and single-threaded execution, deterministic behavior is a reasonable test hypothesis, not a verified project-wide contract. Multithreading and geometry tessellation should be regression-tested.

**Limitations and professional boundary.** web-ifc is an IFC interchange/parser layer rather than a complete BIM authoring platform, geospatial engine, or CAD kernel. The local ARKI tool matrix specifically says to preserve bounded web-ifc evidence and make **no IFC4.3 round-trip claim**.[12] The correct validation chain is web-ifc fixture/regression tests plus IfcOpenShell and/or the official buildingSMART Validation Service. The service documentation describes checks for STEP syntax, IFC schema, schema compliance, and normative rules.[16] web-ifc is directly relevant to C37 and supports C01/C02/C44/C60/C63/C76/C77 when IFC geometry and properties are brought into a web scene. It does not establish C34 RVT/RFA support, C35 governed DWG/DXF, or professional engineering approval.

### IfcOpenShell

**What it is.** IfcOpenShell is an open-source IFC library for developers and BIM power users. The official documentation describes C++ and Python APIs, `IfcConvert`, command-line utilities, geometry processing, authoring, clash detection, model comparison, IDS, BCF-related tooling, and other ecosystem components.[5]

**License and commercial status.** The official documentation states that IfcOpenShell and its libraries are licensed under **LGPL-3.0-or-later**, with Bonsai and IfcSverchok identified as GPL-3.0-or-later exceptions.[5] This is open source. No separate commercial license for the core was verified in the cited sources. The LGPL obligations must be reviewed for the exact component and distribution form.

**APIs, input/output, and execution.** The official Python page states that IfcOpenShell-Python provides bindings to the C++ core and high-level analysis and authoring functions, with the C++ capabilities available in Python.[6] The introduction lists native and WASM deployments, Docker, AWS Lambda, Google Colab, C++, Python, and JavaScript through Pyodide. It explicitly says tools can be used as developer libraries, CLI applications, or graphical interfaces, including headless server tools.[5] Supported model and data forms listed by the official documentation include IFC2X3, IFC4, IFC4.3, custom schemas loaded at runtime, IFC-SPF, IFCJSON, IFCXML, IFCHDF5, MySQL, and SQLite.[5]

**Validation and testability.** IfcOpenShell has a first-party validation module and CLI. The documented command is `python -m ifcopenshell.validate file.ifc --rules`, with JSON, detailed fields, and SPF output options.[17] The validator checks entity attribute types, inverse cardinality, simple/select/enumeration/aggregation constraints, GUIDs, headers, and optional EXPRESS rules. The same documentation explicitly limits the function: some parse-stage syntax errors, duplicate numeric identifiers, invalid entity names, and certain global WHERE-rule checks are not caught by that function.[17] Consequently, an ARKI gate should combine IfcOpenShell validation, schema-specific fixtures, geometry regression tests, and buildingSMART validation rather than treating one local command as universal proof.

**Determinism and active development.** The official documentation demonstrates a mature, broad tool ecosystem and extensive geometry test claims, but no blanket determinism guarantee was found. Determinism should be measured for pinned versions, schema, units, precision settings, input bytes, and conversion options. Exact active-development cadence and support-level commitments are **UNKNOWN** from the cited pages; the documentation’s current version and ecosystem do establish ongoing maintenance, not a contractual SLA.

**Limitations and professional boundary.** IfcOpenShell can author, inspect, convert, query, validate, and tessellate IFC, but it does not make a model legally approved or professionally signed. IFC is an information exchange standard, not a substitute for structural calculations, fire/life-safety review, MEP sizing, code authority approval, or construction documentation. IfcOpenShell is directly relevant to C37 and is a useful foundation for C01/C02/C05/C08–C10/C23–C29/C40/C44–C46/C63/C69–C70/C76–C80 where those capabilities are limited to model information, geometry, rules, and evidence. It does not provide a Revit host for C34, and it should not be represented as proving C06/C07 or other professional engineering capabilities without qualified external validation.

### GDAL / PROJ / GEOS

This is one geospatial subsystem, but the components have distinct responsibilities and licenses.

#### GDAL

GDAL is an open-source **MIT-licensed** translator library for raster and vector geospatial data formats.[7] Official Python documentation describes SWIG-generated Python bindings for GDAL/OGR whose classes and methods generally match the C++ API. The bindings expose `gdal`, `ogr`, `osr`, `gdal_array`, and `gdalconst`, and support NumPy array integration.[18] Official programs include dataset information and conversion, raster and vector processing, reprojection, geometry checking and repair, SQL, rasterization, tiling, and more.[19]

GDAL has a strong headless/CLI posture. The official command documentation lists batch-oriented commands and notes that the newer `gdal` command is provisional until future project stabilization, so production pipelines should pin versions and use stable utilities where necessary.[19] The official testing guide documents a comprehensive Python `pytest` and C++ GoogleTest suite run through CTest, with subset selection, fixtures, and optional Valgrind workflows.[20] It also warns that some tests depend on state from earlier tests, which is a useful testability caveat. `ReadAsArray()` can copy an entire raster band or dataset and may be prohibitively memory-intensive for large data unless explicitly subsetted.[18]

GDAL is highly relevant to site/context data, cadastral or survey datasets supported by installed drivers, CRS-aware dataset processing, and C63 feasibility context. It is not an IFC semantic engine, a general 3D B-Rep kernel, or proof of DWG/DXF governance. Exact driver availability and behavior vary by build; driver-specific support must be tested rather than inferred.

#### PROJ

PROJ is an open-source project under the **X/MIT license**. Its official documentation defines it as software for transforming coordinates between coordinate reference systems, including cartographic projections and geodetic transformations, and says it supports more than one hundred map projections.[8] Its API can be embedded in applications, and its official repository lists CLI programs such as `proj`, `cs2cs`, `geod`, `cct`, `gie`, `projinfo`, and `projsync`.[21]

PROJ is suitable for explicit CRS and datum transformations in a reproducible pipeline, provided the CRS definitions, grid packages, network behavior, and version are pinned. The official repository warns that resource packages may be installed locally or fetched from a CDN by a network-enabled build.[21] That means network access and resource versioning can affect reproducibility. **Determinism is not claimed as a blanket guarantee**; use local, pinned resources for audit-sensitive work. PROJ is headless by design through its API and CLI. It does not provide polygon topology, IFC semantics, or CAD B-Rep.

#### GEOS

GEOS is an open-source **LGPL** C/C++ computational-geometry library implementing the OGC Simple Features model. Official documentation lists predicates, union/intersection/difference, buffers, validity, spatial indexes, WKT/WKB I/O, and a reentrant C API with long-term API/ABI stability.[9] The C++ API may change across releases, while the C API is the safer target for dynamically linked integrations.[22] The repository also documents `geosop` as a CLI and points to test documentation.[22]

GEOS is primarily two-dimensional vector geometry. It is relevant to polygon validity, adjacency, containment, buffering, intersections, and spatial graph construction for C01, C02, C11, C27–C29, C60, C63, C69–C70, C79, and C80. It is not a 3D solids kernel, BIM schema engine, or IFC validator. GEOS shares testing data with JTS, which helps identify implementation versus algorithm failures, but no universal determinism guarantee was found.[9] [22]

### Open CASCADE Technology (OCCT)

**What it is.** OCCT is an open-source C++ platform for 3D surface and solid modeling, CAD data exchange, and visualization. The official overview describes foundation, modeling-data, modeling-algorithm, mesh, visualization, data-exchange, and application-framework modules.[10] It supports geometric and topological modeling, tessellated data, STEP, IGES, STL, VRML, glTF, OBJ, shape healing, and application-specific CAD data.[10]

**License and commercial status.** The official repository states that OCCT is free software under LGPL 2.1 with a special exception in `OCCT_LGPL_EXCEPTION.txt`, and that it may alternatively be used under an Open CASCADE commercial license or contractual agreement.[11] This is the one candidate in this report with an explicitly documented commercial licensing route. The exact commercial terms, pricing, support, certification, and contractual warranties are **UNKNOWN** from the cited pages.

**APIs, input/output, and headless execution.** OCCT functionality is primarily exposed as C++ libraries. The official documentation describes data exchange for STEP AP203/AP214/AP242, IGES, glTF, OBJ, VRML, and STL, plus XDE attributes such as colors, layers, names, and materials.[10] The core can be embedded in a non-GUI application, but the cited pages do not establish an official first-party Python API. The DRAW test harness is a Tcl command interpreter with a graphical X-based viewer and scriptable geometry/topology commands; its executable is `DRAWEXE`.[23] Therefore, **headless core use is feasible in an application-specific C++ build, while headless DRAW graphics is UNKNOWN and should not be assumed**.

**Testing, determinism, and limitations.** Draw is explicitly a test harness, and its scripts can create, modify, inspect, and Boolean-operate on shapes. It is suitable for repeatable kernel-level tests when scripts, inputs, tolerance settings, and build versions are pinned.[23] The official sources do not promise global deterministic results across platforms, compilers, floating-point modes, or parallel algorithms. Shape healing can change a shape’s representation and, for fixing operations, can modify, remove, or create sub-shapes; this is a functional limitation that must be recorded in any evidence report.[10]

OCCT is directly relevant to C11/C12 geometry and topology operations, C35 only for the CAD formats explicitly supported by the selected OCCT data-exchange components, C36 only where a separately verified point-cloud/mesh workflow is added, C60 for geometric visibility preprocessing, C63/C69–C70 for geometry-based feasibility and trade studies, and C67 for manufacturing geometry preparation. It does not provide BIM semantics, IFC validation, Revit RVT/RFA support, geospatial CRS transformation, or professional design approval. DWG/DXF support is not established by the cited base OCCT documentation and must be marked **UNKNOWN** unless a separately licensed/verified component is selected.

## C1–C80 relevance map

The mapping below follows the local ARKI capability registry and matrix. “Direct” means the candidate family can supply a concrete geometry, model, interchange, visualization, or evidence primitive. It does not mean that the full ARKI capability is implemented or professionally validated.

| Capabilities | Relevance and boundary |
|---|---|
| **C01 Spatial Syntax; C02 Programa Arquitectónico + Circulación** | Direct support for graph/geometry representation, spatial relationships, adjacency, visibility, and visualization. GEOS supplies 2D predicates and indexes; Three.js displays and interacts; IFC tools preserve building entities and relationships. Full architectural reasoning remains ARKI/application logic. |
| **C03–C04; C17–C22; C48–C53; C61–C62** | No direct solver claim. Geometry can be input or preprocessing, but thermal, daylight, acoustics, CFD, fire, energy, certification, and nonlinear structural results require separate validated solvers and professional review. |
| **C05 Normativa como Código** | Partial support. IFC/schema/IDS validation and GEOS geometry checks can implement data and geometric rules. Code interpretation and jurisdictional acceptance remain outside this family. |
| **C06–C10; C23–C26** | Partial data/geometry support only. IFC authoring, quantities, schedules, clash queries, and as-built comparison are possible in IfcOpenShell, but professional structural/MEP, commissioning, predictive maintenance, LCA/LCC, and technical-expedient claims are not established. |
| **C11 Shape Grammars; C12 Optimización Topológica; C27 Pattern Language; C28 Tipología; C29 Razonamiento Formal** | Foundational geometry/graph support. GEOS and OCCT can supply operations; Three.js can visualize; application algorithms and validation oracles are still required. |
| **C13–C16; C47; C54–C59; C72** | No native optimizer, Monte Carlo, ML, meta-learning, transfer learning, or risk-governance solver is established. These candidates can be called as geometry/data evaluators inside an external algorithm. |
| **C30–C33** | Three.js can support visualization and WebXR-adjacent presentation, but avatars, contextual guidance, and AR/WebXR capability are not established by the cited sources. |
| **C34 Revit RVT/RFA** | Not established. None of the cited official sources provides a native Revit host or RVT/RFA authoring API. |
| **C35 DWG/DXF Gobernado** | Partial/unknown. OCCT’s cited base exchange list does not include DWG/DXF; GDAL driver support is build-dependent and not a governed CAD claim. A dedicated verified component is required. |
| **C36 Point Cloud** | Not established by the cited primary sources as a point-cloud solver. Mesh and raster/vector workflows may be useful, but no point-cloud conformance claim should be made. |
| **C37 IFC4x3** | Strongest direct target, especially IfcOpenShell and web-ifc. The local matrix requires a capability probe and explicitly prohibits an IFC4.3 round-trip claim without bounded evidence.[12] Use buildingSMART validation and pinned fixture tests. |
| **C38–C43** | gbXML, multiuser concurrency, BCF/CDE/ISO 19650, PKI, and immutable audit are not established as complete capabilities. IfcOpenShell has BCF/IDS-related tools, but that is not the same as a complete governed CDE, PKI, or audit authority. |
| **C44 Dashboards; C45 Predicción de Desviaciones; C46 Benchmark** | Partial. Three.js and geospatial/IFC outputs can visualize and compare data; prediction and benchmark governance need application services and reference datasets. |
| **C60 Isovist y Visibilidad** | Direct geometric foundation. Three.js ray casting and scene queries, GEOS 2D operations, and IFC/mesh extraction can support a bounded implementation. Exact visibility semantics, occlusion rules, and test oracle must be specified. |
| **C63 Real Estate / Factibilidad** | Partial context geometry, site CRS, IFC quantities, and visualization support. Financial, legal, planning, and market conclusions remain outside the solver family. |
| **C64–C68** | Digital twin/IoT, post-occupancy, bio/neuroarchitecture, fabrication, and industrialized construction are at most downstream integration targets. OCCT can prepare CAD geometry; no end-to-end professional capability is established. |
| **C69 Value Engineering; C70 MCDA** | Partial geometry, quantities, alternatives, and comparison support. The decision model, weights, uncertainty, and audit trail are application responsibilities. |
| **C71; C73–C75** | Real-options, contracts/procurement, specialized-building judgments, and self-hosting governance are not native solver capabilities. Headless deployment can help C75 operationally, but does not establish the full capability. |
| **C76 Debugging Asistido; C77 Auto-Explicación** | Partial evidence support. Validation diagnostics, geometry snapshots, model diffs, and deterministic fixtures can feed explanations. They do not make explanations correct without an explicit oracle and provenance contract. |
| **C78 Simulación de Roles Especialistas** | No native multi-agent or professional-role engine. Outputs can be consumed by an external orchestration layer. |
| **C79 Diseño Universal; C80 Wayfinding y Señalética** | Partial geometric and visualization support. Accessibility rules, signage standards, and professional review remain required. |

## Validation, determinism, and evidence protocol

A production ARKI adapter should record the exact library version, compiler/runtime, operating system, input hash, schema or CRS, units, precision/tolerance settings, optional data grids, thread mode, and output hash. For web-ifc, pin both JavaScript and WASM artifacts. For IfcOpenShell, record the schema and validation flags. For PROJ, use local pinned resource data rather than relying on network fetches. For GEOS and OCCT, record the API/kernel version and tolerance model.

A minimum IFC evidence chain is: (1) parse/read test; (2) model and property extraction test; (3) geometry regression fixture; (4) IfcOpenShell validation with JSON logs; (5) buildingSMART Validation Service result where the file can be submitted; and (6) explicit loss report for conversions. The buildingSMART IFC 4.3.2.0 documentation is the primary schema reference and states that it is the latest available documentation of that specification, while the validation service documentation describes the service’s syntax, schema, and normative-rule areas.[16] [24]

A minimum spatial-geometry evidence chain is: (1) unit and CRS declaration; (2) GEOS validity and predicate tests for 2D operations; (3) PROJ forward/inverse or known-control-point tests; (4) OCCT shape validity and Boolean/STEP fixture tests where CAD is used; and (5) Three.js visual regression only as presentation evidence, not as geometry truth.

## Open unknowns and explicit non-claims

The following remain **UNKNOWN** from the official sources reviewed and must not be filled by inference:

- A universal deterministic-execution guarantee for any candidate, especially cross-platform GPU rendering, multithreaded WASM, floating-point geometry, and CAD healing.
- A first-party Python API for web-ifc or OCCT from the cited official documentation.
- A formal Three.js official headless-server guarantee and exact pixel-reproducibility policy.
- Exact commercial pricing, contractual support, certification, and warranty terms for OCCT’s commercial license.
- Native governed DWG/DXF support across this family; the cited OCCT base documentation does not list those formats.
- End-to-end IFC4.3 round-trip conformance for web-ifc or IfcOpenShell in ARKI’s exact export/import pipeline.
- Official release cadence, long-term support policy, or SLA for any candidate.
- Professional acceptance of an ARKI-generated model, calculation, or submission. The local matrix explicitly requires professional validation and disclaims licensed-practitioner status.[13]

## Recommendation

Adopt a **layered, evidence-gated stack** rather than choosing one universal solver. Use **IfcOpenShell** as the server-side IFC/BIM authority, **web-ifc** for browser/Node IFC ingestion where its pinned fixtures pass, **Three.js** for scene-graph visualization and interaction, **GDAL/PROJ/GEOS** for geospatial context and 2D spatial predicates, and **OCCT** only for workflows that genuinely require exact CAD topology, Booleans, shape healing, or STEP/IGES exchange. Keep each adapter’s output typed as a bounded evidence record. Do not promote any adapter from experimental geometry/interchange support to professional engineering, code approval, or external submission without a qualified reviewer and an applicable authoritative validation source.

## References

[1]: https://threejs.org/docs/ "Three.js official API documentation"
[2]: https://github.com/mrdoob/three.js "Three.js official GitHub repository"
[3]: https://thatopen.github.io/engine_web-ifc/docs/ "web-ifc official documentation"
[4]: https://github.com/ThatOpen/engine_web-ifc "web-ifc official GitHub repository"
[5]: https://docs.ifcopenshell.org/introduction.html "IfcOpenShell official introduction and ecosystem documentation"
[6]: https://docs.ifcopenshell.org/ifcopenshell-python.html "IfcOpenShell-Python official documentation"
[7]: https://github.com/OSGeo/gdal "GDAL official GitHub repository and license statement"
[8]: https://proj.org/ "PROJ official documentation"
[9]: https://libgeos.org/ "GEOS official documentation"
[10]: https://occt3d.com/dev/doc/overview/html/index.html "Open CASCADE Technology official overview"
[11]: https://github.com/Open-Cascade-SAS/OCCT "Open CASCADE Technology official repository and licensing options"
[12]: file:///home/ubuntu/generador-familias/C1_C80_WAVE0/10_TOOL_REQUIREMENT_MATRIX.md "ARKI local tool requirement matrix"
[13]: file:///home/ubuntu/generador-familias/C1_C80_WAVE0/11_PROFESSIONAL_VALIDATION_MATRIX.md "ARKI local professional validation matrix"
[14]: https://github.com/mrdoob/three.js/blob/dev/LICENSE "Three.js official MIT license file"
[15]: https://github.com/ThatOpen/engine_web-ifc/blob/main/LICENSE.md "web-ifc official MPL-2.0 license file"
[16]: https://buildingsmart.github.io/validate/ "buildingSMART Validation Service documentation"
[17]: https://docs.ifcopenshell.org/autoapi/ifcopenshell/validate/index.html "IfcOpenShell validation API and CLI documentation"
[18]: https://gdal.org/en/stable/api/python/python_bindings.html "GDAL official Python bindings documentation"
[19]: https://gdal.org/en/stable/programs/index.html "GDAL official command-line programs documentation"
[20]: https://gdal.org/en/stable/development/testing.html "GDAL official automated testing documentation"
[21]: https://github.com/OSGeo/PROJ "PROJ official GitHub repository and command-line utilities"
[22]: https://github.com/libgeos/geos "GEOS official GitHub repository and API/test guidance"
[23]: https://occt3d.com/dev/doc/overview/html/occt_user_guides__test_harness.html "OCCT official Draw Test Harness documentation"
[24]: https://standards.buildingsmart.org/IFC/DEV/IFC4_3/HTML/ "buildingSMART official IFC 4.3.2.0 specification documentation"

_All web sources and local ARKI matrices cited above were accessed on 2026-09-24._

**Author:** Manus AI
