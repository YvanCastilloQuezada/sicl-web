# Core/auth separation

A1.1 did not alter Core or authentication. The evidence distinguishes:

- `BLOCKED_CORE`: `/comparisons`, `/evaluations`, and `/spatial` render route UI and explicitly report HTTP 503 / unavailable Core transport.
- `CONTROLLED_AUTH`: `/arki-parametric-runtime` and `/sources` reach an authentication boundary or redirect.
- Permission responses: `/arki-research-review` and `/security-events` render their route and show permission/unavailable messages.

No auth bypass was used. No local Core was enabled. No remote URL or token was configured. No Core failure was converted into a lazy failure.
