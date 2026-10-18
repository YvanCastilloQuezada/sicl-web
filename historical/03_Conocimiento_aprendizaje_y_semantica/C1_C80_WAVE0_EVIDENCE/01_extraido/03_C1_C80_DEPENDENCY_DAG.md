# C1–C80 Executable Dependency DAG — Wave 0

```mermaid
flowchart TD
  W0[WAVE 0 Registry + Test Harness] --> W1[WAVE 1 Identity / Epistemic / Evidence / Provenance / Units]
  W1 --> W2[WAVE 2 Architectural Intelligence C1-C5]
  W1 --> W3[WAVE 3 Engineering Model + Solver Interface C6-C10]
  W1 --> W4[WAVE 4 BIM / IFC / CAD Interoperability C34-C43]
  W1 --> W5[WAVE 5 Simulation + Optimization C11-C22]
  W3 --> W6[WAVE 6 Construction / Lifecycle / O&M C8-C10,C23-C26]
  W2 --> W7[WAVE 7 Analytics / Learning / Explanation C44-C59,C76-C78]
  W4 --> W8[WAVE 8 Collaboration / Standards / Certifications C39-C53]
  W1 --> W9[WAVE 9 Avatar / Luka / WebXR / Experience C30-C33,C75,C79-C80]
  W3 --> W6
  W4 --> W6
  W5 --> W7
  W6 --> W7
  HUMAN[Human Authority] -. gate .-> W2
  HUMAN -. gate .-> W3
  HUMAN -. gate .-> W4
  HUMAN -. gate .-> W5
  HUMAN -. gate .-> W6
  HUMAN -. gate .-> W7
  HUMAN -. gate .-> W8
  HUMAN -. gate .-> W9
```

Wave 0 does not claim that this DAG is runtime-executed. It is the dependency plan required before activation. The actual critical path is W0 → W1 → W2/W3/W4, with simulation, lifecycle, learning, collaboration, and experience downstream.
