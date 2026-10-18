# BKH-4 Open Questions v1.1

| ID | Question | Answer | Status |
|---|---|---|---|
| Q1 | What is a transaction? | A versioned governed unit of proposed change, not a UI action, snapshot or regeneration. | DECIDED |
| Q2 | What is the canonical commit boundary? | Canonical source mutations are atomic within a declared boundary; derived state receives an explicit disposition. | DECIDED |
| Q3 | Can snapshots provide atomic commit or crash recovery? | No. Current evidence does not demonstrate a durable atomic commit primitive. | IMPLEMENTATION_PREREQUISITE |
| Q4 | Who may commit? | Only the governed commit authority after required technical gates and Human Authority requirements pass. | IMPLEMENTATION_PREREQUISITE |
| Q5 | What happens when evidence is missing? | The transaction remains `UNKNOWN`; missing evidence never becomes valid or satisfied. | DECIDED |
| Q6 | How is a stale transaction handled? | It becomes `STALE` or `CONFLICT`; silent overwrite, retry and merge are prohibited by default. | DECIDED |
| Q7 | Are nested transactions supported in v1? | No. A composed internal operation remains within its parent transaction. | DECIDED |
| Q8 | Are undo and redo snapshot loads? | No. They are new governed operations that preserve history and require revalidation. | DECIDED |
| Q9 | What is the relationship with BKH-1/2/3? | BKH-4 orchestrates and governs; it does not duplicate relationship, constraint or regeneration authority. | DECIDED |
| Q10 | Who owns Geometry, Quantity, Cost and Schedule? | BKH-0 found parallel candidates. No owner is selected in this contract. | ARCHITECTURAL_DECISION_REQUIRED |

## Gate consequence

Because Q3 is not demonstrated by current persistence evidence, `ATOMIC_COMMIT_PERSISTENCE = IMPLEMENTATION_PREREQUISITE`. BKH4-6 and the crash-recovery implementation gate remain blocked until a real durable primitive is designed and verified. No snapshot shortcut is permitted.
