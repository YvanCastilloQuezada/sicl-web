# ARKI Browser Functional Verification

**Date:** 2026-09-21  
**Scope:** Published ARKI/SICL Command Center, navigation and key read-only flows.  
**Authority:** Verification only; this document does not certify professional compliance, remote SICL Core availability, or production deployment.

## Results

| Surface | Desktop/mobile evidence | Functional result | Epistemic boundary |
|---|---|---|---|
| Home (`/`) | Desktop and mobile screenshots captured | Loads the ARKI workspace, project modules, resources, synthetic-data entry point and canonical command builder | Synthetic demo is explicitly marked synthetic; no real decision is created |
| Live Book (`/arki-book`) | Desktop and mobile screenshots captured | Loads independently with search, public/internal reading toggle, Junior/Senior/Master/Crazy profiles, reader/volume filters, interactive index and chapter buttons | Public content is separated from internal contracts |
| Control Center (`/control-center`) | Desktop and mobile screenshots captured | Search accepts `MC-03`, autocomplete exposes `MC-03 · ARKI Assembly`, selecting it opens a record card with status, description, source path and close/copy controls; category/status filters are present | Read-only registry; it is not the source of truth |
| Decision & Audit (`/audit#audit`) | Browser route verified | Loads the human workflow, project selector, secure report action, recommendation, human review and decision controls; empty state reports no events/reviews/decisions | Decision requires explicit human authority; no records were fabricated |
| Council (`/audit#council`) | Opened from the live sidebar | Loads the read-only analytical layer and reports `Insufficient data` with zero canonical objects when the canonical endpoint is unavailable | Council observes; it does not create recommendations, reviews or decisions |

## Responsive result

The captured 375×812 viewport remains readable for Home, Live Book and Control Center. Navigation and filters stack without observed horizontal overflow. The 1280×720 viewport preserves the compact header, project selector, search controls and primary result cards.

## Reproduction

1. Open `/` and verify the ARKI workspace and module index.
2. Open `/arki-book`; enter a chapter term in the book search and select a profile or volume.
3. Open `/control-center`; enter `MC-03` in the search input and select the autocomplete result.
4. Open `/audit#audit`; confirm the human workflow and empty-state boundaries.
5. Click `Council / Recommendation`; confirm that the Council view is read-only and reports insufficient canonical data rather than inventing findings.

## Final status

`BROWSER_FUNCTIONAL_VERIFICATION = PASS_WITH_BOUNDS`

`HUMAN_AUTHORITY_PRESERVED = YES`

`REMOTE_CORE_E2E = NOT_DEMONSTRATED`

`PROFESSIONAL_EXPORT_CERTIFICATION = NOT_DEMONSTRATED`


## Additional responsive evidence

A full-page mobile capture at `375×812` was taken for `/audit`, showing the project index, human boundary, event timeline, HumanReviews and Decisions cards, followed by the Recommendation → HumanReview → Decision forms without observed horizontal overflow. Council was opened functionally from the same sidebar and verified as a separate read-only state on desktop; the screenshot service resolves the hash route to the audit shell when given `/audit#council`, so the mobile capture is evidence for the shared responsive shell, not a separate mobile Council content assertion.

`COUNCIL_MOBILE_CONTENT_CAPTURE = NOT_SEPARATELY_CAPTURED`
`AUDIT_MOBILE_FULL_PAGE = PASS`
`COUNCIL_DESKTOP_FUNCTIONAL = PASS`
