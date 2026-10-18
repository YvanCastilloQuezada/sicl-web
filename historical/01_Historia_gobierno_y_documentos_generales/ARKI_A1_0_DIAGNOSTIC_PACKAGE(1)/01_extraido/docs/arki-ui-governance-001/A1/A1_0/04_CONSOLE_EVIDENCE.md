# Console evidence

The immediate post-navigation console for `/arki` was empty. The console for `/arki-operations` contained the diagnostic performance expression output and no uncaught exception, dynamic-import rejection, MIME error, CSP error, or React error. `/arki-research-review` likewise produced no error output while its fallback persisted and then resolved after the longer wait. No evidence of a 404/500 chunk response was observed.

This is a bounded observation, not proof that every target has no hidden exception; the remaining targets are recorded as `UNKNOWN` where a clean route-specific console capture was not obtained.
