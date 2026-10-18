# LUCA / MiLukita — System Map AS-IS

## Evidence-backed map

```text
CURRENT MAIN CHECKOUT
main@37d03d1
  └── governance + work orders + smoke evidence
      └── no executable product tree verified here

STRUCTURED BRANCH EVIDENCE
origin/feature/luca-spatial-intelligence-control-center@bc652e7

USER / DEVICE
  │
  ├── OAuth identity / consent / device / session
  │
  ├── Web surfaces
  │   ├── TV / overlay / games
  │   ├── Touch Remote / keyboard / trackpad
  │   ├── Territorial Field Entry / Mapper
  │   ├── The Eye / review queue
  │   └── AR / Lukita / discovery
  │
  ├── Input and perception
  │   ├── touch / keyboard / QR
  │   ├── GPS and camera — physical validation required
  │   ├── voice — provider/runtime dependent
  │   └── OCR — not demonstrated in this audit
  │
  └── server/domain layer
      ├── identity and participation
      ├── control, pairing, sessions, commands
      ├── CaptureSession
      ├── WorldObject
      ├── Claims / Sources / Evidence
      ├── Territorial Trust / consistency
      ├── The Eye decisions
      ├── publication filter
      ├── agents / routing / governance
      └── MJP CORE boundary
          │
          ├── Drizzle relational persistence
          ├── object storage / hashes
          ├── audit events
          └── published runtime / control receiver
```

## Two distinct flows

### Territorial flow

`CREATE CAPTURE → OBSERVE → CLAIM/SOURCE/EVIDENCE → PROPOSE/UNDER_REVIEW → EYE DECISION → HUMAN AUTHORITY → PUBLISHED VERSION → RUNTIME`

### Device-control flow

`REGISTER DEVICE → OWNERSHIP CHECK → PAIRING → AUTHORIZED SESSION → COMMAND → ACK/OBSERVED STATE → AUDIT → REVOCATION`

## What is not proven

A public, production-grade world graph; complete OCR; physical AR; automatic semantic conversion from observation to architecture; autonomous publication; production cloud identity; and a universal remote that controls arbitrary devices are not demonstrated by the current evidence.
