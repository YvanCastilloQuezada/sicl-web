# ARKI CAD Licensing Matrix

| Candidate | Technical license posture | Web/SaaS / distribution | ARKI decision |
|---|---|---|---|
| ODA Drawings SDK | Annual ODA membership; commercial tiers and product extensions require contract review. | ODA public pricing distinguishes Commercial from Sustaining/Founding; Web/SaaS must not be assumed under Commercial. | **Commercial approval required; benchmark only now.** |
| Autodesk RealDWG | Licensing handled through Tech Soft 3D; current public pricing is annual and user-count dependent. | Distribution and hosting terms require OEM/partner contract. Public RealDWG information does not authorize ARKI's SaaS architecture by itself. | **Do not implement without written deployment approval.** |
| GNU LibreDWG | GPLv3 or later. Commercial use is permitted, but distribution obligations may apply to covered works. | Backend-only SaaS analysis differs from distributing binaries; exact architecture needs legal review. | **Legal review required; baseline only.** |
| ODA File Converter | Free/example download; not an independent commercial SDK. | ODA states non-members may use it only for non-commercial applications. | **Diagnostic/non-commercial only.** |

## Approval boundary

This matrix is not a purchase recommendation or legal opinion. No license has been purchased. Before implementation, ARKI must define whether the use is benchmark, development, internal corporate, commercial service, Web/SaaS, redistribution or customer-side deployment. Those categories cannot be conflated.

## Sources

[ODA pricing](https://www.opendesign.com/pricing), [ODA File Converter FAQ](https://www.opendesign.com/faq/question/what-are-oda-viewer-and-oda-file-converter), [Autodesk RealDWG](https://aps.autodesk.com/developer/overview/realdwg-api), [Tech Soft 3D EULA](https://www.techsoft3d.com/legal/eula/), [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
