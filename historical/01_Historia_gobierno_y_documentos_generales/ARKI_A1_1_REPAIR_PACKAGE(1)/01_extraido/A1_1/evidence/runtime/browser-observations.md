# Browser observations

## Runtime

Fresh production runtime: `PORT=4002 NODE_ENV=production node dist/index.js`.

Public base: `https://4002-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer`.

## Exact route observations

| Route | Observable result | Evidence captured |
|---|---|---|
| `/arki` | ARKI Web App and Command Center render; Core reports explicit HTTP 503 in the data panel | `page_texts/4002-..._arki___a11r_1.md`, screenshot `screenshots/4002-..._arki___2026-09-25_01-11-44_1045.webp` |
| `/arki-device-bridge` | Device Bridge renders modes and capability detection | `page_texts/4002-..._arki-device-bridge___a11r_15.md` |
| `/arki-operations` | Operations Lab renders command palette, preview, traceability and export controls | `page_texts/4002-..._arki-operations___a11r_3.md` |
| `/audit` | Audit workspace renders timeline and human-authority controls | `page_texts/4002-..._audit_audit.md` |
| `/help/user` | Full user manual renders with headings and table of contents | `page_texts/4002-..._help_user___a11r_5.md` |
| `/comparisons` | Route renders; explicit `Core no configurado ... HTTP 503` | `page_texts/4002-..._comparisons___a11r_6.md` |
| `/evaluations` | Route renders; explicit `Core no configurado ... HTTP 503` | `page_texts/4002-..._evaluations___a11r_7.md` |
| `/arki-parametric-runtime` | Authentication boundary remains controlled | `page_texts/4002-..._arki-parametric-runtime___a11r_8.md` |
| `/arki-book` | `ARKI · LIBRO VIVO` and chapter index render; timed 2/5/10/15 s checks were rendered | `page_texts/4002-..._arki-book___a11r_9.md`, `console_outputs/exec_result_2026-09-25_01-08-21_845.txt` |
| `/arki-research-review` | Review UI renders; permission message is visible | `page_texts/4002-..._arki-research-review___a11r_10.md` |
| `/help/operations` | Long manual renders after extended wait; 29,537 characters observed and no loading text remained | `console_outputs/exec_result_2026-09-25_01-10-30_375.txt` |
| `/security-events` | Security page renders; explicit admin permission/unavailable message | `page_texts/4002-..._security-events___a11r_12.md` |
| `/sources` | Authentication redirect to `manus.im/app-auth` observed | `console_outputs/exec_result_2026-09-25_01-11-18_836.txt` |
| `/spatial` | Spatial route renders explicit `Spatial representation unavailable` and Core HTTP 503 | `page_texts/4002-..._spatial___a11r_14.md` |

The `...` notation above abbreviates the stable hostname in filenames only; the files exist under the absolute paths referenced in the A1.1 final report's evidence index. No screenshot or console observation was used as permission to bypass auth or fabricate Core data.

## No mutation

No browser click, form submission, Core write, authentication bypass, project mutation, or external publication was performed during this verification.
