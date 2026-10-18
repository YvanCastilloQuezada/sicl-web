# Performance report — F0

The frontend was rebuilt without changing the backend or data model. Production build completed successfully in approximately 22 seconds in the validation run. The build continues to report known chunks larger than 500 kB, especially IFC geometry and the main application bundle. This is recorded as a follow-up optimization, not a functional blocker.

The shared shell adds one navigation/context surface, while route modules remain code-split. The previous infinite-looking authentication state is now bounded: after five seconds of unresolved auth loading, the shell presents an explicit authentication-required state rather than an unbounded spinner.

The exact cold `/help/operations` before/after timing was not remeasured in this pass because the browser interaction required real authentication. It remains `RESIDUAL_UNKNOWN` rather than being declared fixed.
