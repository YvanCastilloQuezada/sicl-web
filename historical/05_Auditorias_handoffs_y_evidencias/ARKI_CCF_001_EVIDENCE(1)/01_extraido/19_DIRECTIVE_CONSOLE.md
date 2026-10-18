# PO Directive Console

The single directive surface records PO instructions as `PO_DIRECTIVE_RECEIVED` and declares the flow: directive → authority check → impact analysis → replan → execution. This bounded implementation records supervisory intent and does not silently execute consequential actions.

This CCF artifact is bounded by Human Authority, PF-H01, the canonical-state firewall, and the explicit scope of ARKI-CCF-001. CCF is observability, navigation, coordination and governed control; it is not ARKI's brain, a truth store, a canonical mutation engine, or a source of professional certification.
