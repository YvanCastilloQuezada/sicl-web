# Realtime Architecture

The current static React application uses bounded three-second polling over persisted JSON. Persistent state is the source; transport is delivery. On refresh/reconnect the page reloads state, catches up the event stream and returns to the selected mode. WebSocket/SSE is not introduced without a demonstrated need and a security gate.

This CCF artifact is bounded by Human Authority, PF-H01, the canonical-state firewall, and the explicit scope of ARKI-CCF-001. CCF is observability, navigation, coordination and governed control; it is not ARKI's brain, a truth store, a canonical mutation engine, or a source of professional certification.
