from dataclasses import dataclass
from datetime import datetime, timezone
def now_iso(): return datetime.now(timezone.utc).isoformat()
@dataclass(frozen=True)
class Event:
    id: object
    timestamp: str
    project_id: str
    type: str
    payload: dict
    actor: str
    source: str
