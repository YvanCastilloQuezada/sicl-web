# ARKI Research Activation Modes v1.1

Supported modes are `PERIODIC_CHECK`, `PROJECT_NEED`, `UNKNOWN_RESOLUTION`, `STANDARD_CHANGE_CHECK`, `CURATOR_VERIFICATION`, `FORESIGHT_REVIEW` and `HUMAN_REQUEST`.

Every activation is represented by a structured `ResearchActivation` with purpose, scope, source policy, maximum sources, maximum duration, stopping conditions, evidence requirements and scheduler status. The current scheduler status is `NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED`.

No daemon, cron, background crawler or parallel scheduler was created by this addendum.
