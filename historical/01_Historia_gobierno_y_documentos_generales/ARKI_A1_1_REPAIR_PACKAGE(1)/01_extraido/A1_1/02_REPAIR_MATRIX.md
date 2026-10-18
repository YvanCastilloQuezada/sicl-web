# Repair matrix

| Historical state | Route | Root cause confirmed | Repair applied | Final state |
|---|---|---|---|---|
| UNKNOWN | `/arki-book` | No; route renders | None | RENDERED |
| UNKNOWN | `/arki-research-review` | Permission/data response, not lazy | None | RENDERED / explicit permission message |
| UNKNOWN | `/help/operations` | Slow Markdown evaluation/render only | None | RENDERED_SLOW |
| UNKNOWN | `/security-events` | Permission/data response, not lazy | None | RENDERED / explicit permission message |
| UNKNOWN | `/sources` | Authentication redirect | None | CONTROLLED_AUTH |
| UNKNOWN | `/spatial` | Core HTTP 503 | None | CONTROLLED_CORE_BLOCK |

`A1_1_NO_PRODUCT_REPAIR_REQUIRED` is deliberate: mutating these routes would violate diagnose-before-mutate and would risk hiding real authorization/Core conditions.
