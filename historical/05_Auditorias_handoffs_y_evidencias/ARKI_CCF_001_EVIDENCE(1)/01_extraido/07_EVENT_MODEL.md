# Global Event Model

The event projection normalizes legacy Autopilot records into `eventId`, timestamp, areaId, eventType, severity, summary, status, evidenceRefs and correlationId, while retaining task, tool, reason, result and next-action fields where available.

Current stream count: 29 records. Ordering is verified. The same source is rendered in Director, Live and Forensic views.

This CCF artifact is bounded by Human Authority, PF-H01, the canonical-state firewall, and the explicit scope of ARKI-CCF-001. CCF is observability, navigation, coordination and governed control; it is not ARKI's brain, a truth store, a canonical mutation engine, or a source of professional certification.
