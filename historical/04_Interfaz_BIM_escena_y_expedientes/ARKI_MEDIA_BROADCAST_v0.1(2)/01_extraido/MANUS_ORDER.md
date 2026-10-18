# ARKI-MEDIA-001A — Media/Broadcast Repository Audit + Starter Reconciliation

STATUS: PROPOSAL FOR EXECUTION
SCOPE: AUDIT / RECONCILIATION / BOUNDED FOUNDATION
NO MASS IMPLEMENTATION.

## Mission
Take the attached ARKI MEDIA / ARKI BROADCAST v0.1 starter and reconcile it with the real ARKI repositories before integrating anything.

## Existing truths
C30 Avatar ARKI is transferred/documented but not proven implemented merely by transfer.
Existing ARKI material already defines GLB/glTF avatar, rig/gestures/expressions, contextual guide, Luka/OCR and AR concepts.
The Avatar is an interface: `ARKI THINKS → AVATAR COMMUNICATES`.
Media/Broadcast must read canonical/validated project information; it must never become a Project State writer.

## Audit
Locate actual code/contracts for:
- Avatar/Archi
- GLB/glTF
- rig, gestures, expressions
- speech/audio
- Luka/OCR
- WebXR/AR
- media studio
- video ingest/decode/encode
- streaming
- captions
- Project State/read models
- provenance/evidence
- semantic curator
- existing Web branch `feat/spatial-pilot-media-studio-v1` if present/current
- any FFmpeg/WebCodecs/WebRTC/HLS/DASH/SRT/RTMP/NDI integrations
- any Unreal/NVIDIA/MetaHuman or equivalent integration

Classify starter parts:
`REUSE_EXISTING / EXTEND_EXISTING / ADAPT / REJECT_DUPLICATE / NEW_REQUIRED`.

## Architecture to establish
Bounded subsystems:
1 CONTENT_TRUTH_GATE
2 MULTILINGUAL_ENGINE
3 DIGITAL_HUMAN_ENGINE
4 VIRTUAL_STUDIO
5 MEDIA_ENGINE
6 BROADCAST_CONTROL
7 GLOBAL_DISTRIBUTION
8 GOVERNANCE_BUSINESS

Do not create eight autonomous brains. These are services/subsystems.

## Eight languages
Target architecture:
ES, EN, PT, FR, DE, IT, ZH, JA.
Do not claim language support until translation, terminology, TTS, pronunciation, timing, captions and lip-sync are actually tested for that language.

## Digital human
Design provider-neutral adapters for:
- TTS
- viseme/lip-sync
- facial expression
- gaze
- body gesture
- realtime render

Evaluate existing repository before choosing implementation.
Do not hard-wire one vendor into ARKI Core.

## Video/media
Audit and design adapters for:
- decode/encode: H.264, H.265/HEVC, AV1 where toolchain permits
- realtime vs offline render
- audio mix
- captions
- timecode/synchronization
- packaging
- hardware acceleration
- fallback

No codec/support claim without runtime evidence.

## Global broadcast
Separate:
A) Internet distribution: Web/OTT/FAST/IPTV/social.
B) Professional broadcast contribution/distribution: cable/satellite/terrestrial/operator-specific.

`STREAM EXISTS ≠ TV CARRIAGE`
`ENCODE SUCCESS ≠ BROADCAST ACCEPTANCE`
`GLOBAL CDN ≠ GLOBAL TV DISTRIBUTION`

No automatic publication.

## Authority
Required:
`CANONICAL READ MODEL → COMMUNICATION PLAN → AVATAR/MEDIA → QC → HUMAN APPROVAL → DISTRIBUTION`

Never:
`AVATAR → CANONICAL MUTATION`
or
`AI OUTPUT → AUTO BROADCAST`.

## Required outputs
- `ARKI_MEDIA_RECONCILIATION.md`
- `ARKI_MEDIA_ARCHITECTURE.md`
- `ARKI_AVATAR_CAPABILITY_MATRIX.csv`
- `ARKI_8_LANGUAGE_MATRIX.csv`
- `ARKI_CODEC_PIPELINE_MATRIX.csv`
- `ARKI_GLOBAL_DISTRIBUTION_MATRIX.csv`
- exact code paths found
- provider/tool candidates with status and evidence
- blockers/UNKNOWNs
- minimal implementation delta
- tests
- git baseline
- SHA-256 manifest
- evidence ZIP

## Tests/mutants
At minimum kill:
`AVATAR_TO_CANONICAL_WRITER`
`UNKNOWN_TO_BROADCAST_FACT`
`UNSOURCED_CLAIM_TO_SCRIPT`
`TRANSLATION_TO_VERIFIED_MEANING`
`TTS_SUCCESS_TO_LANGUAGE_VERIFIED`
`AUDIO_TO_LIPSYNC_VERIFIED`
`GESTURE_RANDOM_AS_SEMANTIC`
`ENCODE_SUCCESS_TO_TV_READY`
`STREAM_EXISTS_TO_GLOBAL_TV`
`NO_RIGHTS_TO_DISTRIBUTION`
`NO_HUMAN_APPROVAL_TO_PUBLISH`
`PROVIDER_ID_TO_ARKI_ID`

## Status
Allowed:
`MEDIA_BROADCAST_FOUNDATION_VERIFIED`
`PARTIAL`
`BLOCKED`
`FAILED`

Do not claim complete hyperrealistic avatar, 8-language verification, global TV distribution, or enterprise broadcast until evidenced.

NO PUSH.
NO PR.
NO MERGE.
NO DEPLOYMENT.
STOP after report + evidence.
