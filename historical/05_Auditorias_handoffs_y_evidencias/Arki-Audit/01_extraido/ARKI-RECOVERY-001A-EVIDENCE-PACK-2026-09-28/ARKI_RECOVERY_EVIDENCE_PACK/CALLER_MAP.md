===== generation.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:import hashlib
4:import itertools
5:import json
6:import random
7:from datetime import datetime, timezone
8:from typing import Any
10:from .domain import GeneratedAlternative, GenerationMethod, GenerationState

===== spatial_generator.py =====
--- imports/references ---

--- module imports ---
9:from __future__ import annotations
11:from dataclasses import dataclass
12:import hashlib
13:import math
14:from typing import Any, Mapping, Sequence
16:from .domain import SpatialScope
17:from .spatial import (
28:from .v11 import Alternative

===== optimization.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:from dataclasses import dataclass
4:from uuid import uuid4
5:from typing import Iterable
7:from .domain import Objective
8:from .v11 import Alternative, Evaluation

===== temporal.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:from dataclasses import asdict
5:from .domain import ScenarioBranch, ScenarioEvolution, TemporalCycle

===== planning_catalog.py =====
--- imports/references ---
docs/RFC-008_PLANNING_INSTRUMENTS.md:35:La estructura `src/sicl/planning_catalog.py` permanece vacía hasta que el Product Owner autorice y proporcione un corpus verificable.

--- module imports ---

===== design_knowledge.py =====
--- imports/references ---
docs/RFC-026_DESIGN_KNOWLEDGE_AND_MULTISCALE_DESIGN_GRAMMAR.md:14:El piloto funcional implementa `DesignKnowledgeSource`, `DesignKnowledgeItem`, `DesignPattern`, `DesignKnowledgeQuery`, `DesignKnowledgeResponse` y `DesignKnowledgeAgent` en `src/sicl/design_knowledge.py`. También expone el catálogo y la consulta del agente mediante `GET /v1/design-knowledge/catalog` y `POST /v1/design-knowledge/query`.

--- module imports ---
1:from __future__ import annotations
3:from dataclasses import asdict, dataclass, field
4:from enum import Enum
5:from typing import Any, Iterable
7:from .domain import SpatialScope

===== multiscale.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:from enum import Enum
5:from .domain import SpatialScope

===== bim_connectors.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:from dataclasses import dataclass
4:from typing import Any
6:from .bim import BIMFormat, BIMModelSnapshot

===== memory.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:import uuid
4:from dataclasses import asdict
5:from datetime import datetime, timezone
6:from typing import Any
8:from .domain import InstitutionalMemory, MemoryConfidence, MemoryState, MemoryType, Project, SpatialScope
9:from .errors import SICLError

===== capabilities.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:from dataclasses import dataclass, field
4:from enum import Enum
5:from typing import Iterable
7:from sicl.domain import SpatialScope

===== agents.py =====
--- imports/references ---

--- module imports ---
1:from __future__ import annotations
3:from abc import ABC, abstractmethod
4:from re import search
5:from uuid import uuid4
7:from .domain import Project
8:from .v11 import Alternative, Evaluation
