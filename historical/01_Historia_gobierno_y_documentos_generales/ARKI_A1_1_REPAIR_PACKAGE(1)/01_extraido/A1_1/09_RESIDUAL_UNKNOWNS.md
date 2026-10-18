# Residual unknowns

`UNKNOWN remaining at closure: 0` for the exact 14-route A1.1 scope.

Residual operational limitations are not unknown route states:

1. Core-dependent screens remain unavailable until a real Core transport is configured (`HTTP 503`).
2. Protected screens require the appropriate authenticated/administrative session.
3. `/help/operations` has a measurable cold-load performance concern due to its large Markdown payload and should be investigated in a separate, explicitly scoped performance task. It is not an A1.1 functional blocker.
