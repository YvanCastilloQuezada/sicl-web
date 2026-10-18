class TestReactionPlanner_RT88:
    def test_h004_blocked_dependency_cascades_to_dependents(self, planner):
        """RT-88: si A está BLOCKED, B que depende de A también queda BLOCKED."""
        from sicl.validity import ValidityReport, ArtifactValidity, DerivationValidity

        dv_a = DerivationValidity(
            "R_A", VersionedRef("Area", "A", 1), "STALE",
            discrepancies=({"reference": {"bad_schema": True}},),
            source_checks=("integrity_checks_R_A",),
        )
        av_a = ArtifactValidity(
            VersionedRef("Area", "A", 1), "FULLY_STALE", (dv_a,),
            {"totalDerivations": 1, "validCount": 0, "staleCount": 1, "invalidCount": 0, "uncertainCount": 0},
            {"action": "RECOMPUTE", "reason": "stale", "requiresHumanAuthority": False},
        )
        dv_b = DerivationValidity(
            "R_B", VersionedRef("Cost", "B", 1), "STALE",
            discrepancies=({
                "record_id": "R_B",
                "reference": {"entityType": "Area", "entityId": "A", "version": 1},
                "code": "VERSION_MISMATCH",
            },),
            source_checks=("integrity_checks_R_B",),
        )
        av_b = ArtifactValidity(
            VersionedRef("Cost", "B", 1), "FULLY_STALE", (dv_b,),
            {"totalDerivations": 1, "validCount": 0, "staleCount": 1, "invalidCount": 0, "uncertainCount": 0},
            {"action": "RECOMPUTE", "reason": "stale", "requiresHumanAuthority": False},
        )
        report = ValidityReport(1, None, (dv_a, dv_b), (av_a, av_b), {}, True)
        plan = planner.plan_reaction(report)
        action_b = next(action for action in plan.planned_actions if action.artifact_ref.entity_id == "B")
        assert action_b.status == ActionStatus.BLOCKED
        assert action_b.action_type == ActionType.ESCALATE
        assert "BLOCKED_DEPENDENCY" in action_b.reason
        assert action_b.blocked_by == (VersionedRef("Area", "A", 1),)
