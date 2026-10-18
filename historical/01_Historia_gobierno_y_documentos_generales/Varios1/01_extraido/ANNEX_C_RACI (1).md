# ANNEX C — MATRIZ RACI

La asignación distingue responsabilidad operativa de autoridad final. Las asignaciones inferidas se marcan **INFERIDA** y deben confirmarse por Human Authority.

| Dominio | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Mapper / captura | Mapper Operator | Human Authority (INFERIDA) | The Eye | Runtime |
| The Eye / revisión | Eye Reviewer | Human Authority | Mapper Operator | World Engine |
| World Engine / versionado | World Engine service | Human Authority | Eye Reviewer | Runtime/LUKA |
| Human Authority / publicación | Human Authority | Propietario | Eye Reviewer, Legal/Compliance | Runtime |
| Field Voice Copilot | Copilot/LUKA service | Human Authority para decisiones | Mapper Operator | Audit |
| LUKA AR | AR Runtime | Product/Owner (INFERIDA) | World Engine, Human Authority | User |
| QR / QR Lab | QR Studio | Product/Owner (INFERIDA) | Security | User |
| Controller Lab / Remote TV | Controller UI | Product/Owner (INFERIDA) | TV integration owner | User |
| Field Gate | Field Operator | Human Authority | Security, Eye Reviewer | Owner |
| Administración | Admin service | Owner/Human Authority | Security | Audit |
| Usuario final | User | Product/Owner (INFERIDA) | Support | Audit |
| MJP CORE | Protected Core owners | Protected Core authority | Read-only integration consumers | Audit |

RACI no concede permisos por sí sola. Los permisos efectivos deben comprobarse en backend, procedimientos protegidos, contratos compartidos y pruebas negativas. Una interfaz que muestra una acción no demuestra que el actor pueda ejecutarla.
