import { useMemo } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildL00L08HouseLearningPilot, evaluateLearningCycle, recordControlledEducationalProof, recordExplanation, recordPractice } from "@/components/arkiLearningCycle";

const phases = ["PRINCIPLE", "EXPLANATION", "PRACTICE", "EVALUATION", "CORRECTION", "TRANSFER", "HUMAN_REVIEW"] as const;

export default function ArkiLearningPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const lesson = useMemo(() => {
    const pilot = buildL00L08HouseLearningPilot();
    const explained = recordExplanation(pilot, { attemptId: "visible-explanation", statement: "Room name is not an activity model; relationships remain multidimensional.", evidenceRefs: ["KU-L00-001", "KU-L02-001", "KU-L05-001"], unknowns: ["household schedule", "site orientation"], contradictions: ["courtyard preference versus privacy"], epistemicState: "HYPOTHESIS" });
    const practiced = recordPractice(explained, { attemptId: "visible-practice", statement: "HOUSE-A21 keeps three independent topology hypotheses before coordinates.", evidenceRefs: pilot.topologyEvidence?.hypothesisIds ?? [], unknowns: ["service route", "structural feasibility"], contradictions: ["openness versus privacy"], epistemicState: "HYPOTHESIS" });
    const evaluated = evaluateLearningCycle(practiced);
    const acquired = recordControlledEducationalProof(evaluated, { proofId: "L09-L32-sample-01", level: "L09", principleApplied: "functional unit is not a room", nonApplicationDeclared: "reference dimensions are not project requirements", transferDeclared: "transfer to a small non-residential context with changed users", evidenceRefs: ["P-L09-01", "synthetic-fixture"], unknowns: ["real project evidence", "jurisdiction"], result: "PASS_WITH_OBSERVATIONS", dataClass: "SYNTHETIC_CONTROLLED_EDUCATIONAL_PROOF", reviewer: "PRODUCT_OWNER_DELEGATED" });
    return { pilot, evaluated: acquired };
  }, []);
  const { pilot, evaluated } = lesson;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]">ARKI SCHOOL</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">{t("learning.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#718078]">{t("learning.subtitle")}</p>
      </div>
      <Button variant="outline" onClick={() => navigate("/")}>{t("learning.back")}</Button>
    </div>

    <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div><CardTitle className="font-serif text-xl">{t("learning.pilot")}</CardTitle><p className="mt-1 text-sm text-[#718078]">{pilot.practices[0].context.description}</p></div>
        <Badge variant="outline">{evaluated.maturity}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 md:grid-cols-7">{phases.map((phase, index) => <div key={phase} className={`rounded-md border p-2 text-center text-[10px] font-semibold tracking-wide ${index <= 3 ? "border-[#d07b4a] bg-[#fff4ed] text-[#a95e35]" : "border-[#d4d8d0] text-[#718078]"}`}>{phase}</div>)}</div>
        <div className="flex flex-wrap gap-2"><Badge variant="secondary">{t("learning.not_mature")}</Badge><Badge variant="outline">PRACTICED_WITH_OBSERVATIONS</Badge><Badge variant="outline">{t("learning.review_pending")}</Badge><Badge variant="outline">HYPOTHESIS / UNKNOWN</Badge></div>
      </CardContent>
    </Card>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none"><CardHeader><CardTitle className="font-serif text-xl">{t("learning.practice")}</CardTitle></CardHeader><CardContent className="space-y-3">{pilot.practices.map((practice) => <div key={practice.practiceId} className="rounded-md border border-[#d4d8d0] p-3"><div className="flex items-center justify-between gap-2"><strong className="text-sm">{practice.canonicalPracticeId}</strong><Badge variant="outline">{practice.type}</Badge></div><p className="mt-2 text-sm text-[#405049]">{practice.prompt}</p><p className="mt-2 text-xs text-[#718078]">{practice.expectedTrace.join(" · ")}</p></div>)}</CardContent></Card>
      <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none"><CardHeader><CardTitle className="font-serif text-xl">{t("learning.topology")}</CardTitle></CardHeader><CardContent className="space-y-3"><div className="rounded-md border border-[#d4d8d0] p-3"><p className="text-xs uppercase tracking-wide text-[#718078]">{t("learning.evidence")}</p><p className="mt-1 font-mono text-sm">{pilot.topologyEvidence?.fixtureId}</p><div className="mt-3 grid gap-2">{pilot.topologyEvidence?.hypothesisIds.map((id) => <div key={id} className="rounded bg-[#eef2ed] px-3 py-2 text-sm font-medium">{id} · HYPOTHESIS</div>)}</div></div><p className="text-xs text-[#718078]">{t("learning.unknowns")}: {evaluated.attempts.flatMap((attempt) => attempt.unknowns).filter((value, index, all) => all.indexOf(value) === index).join(" · ")}</p></CardContent></Card>
    </div>

    <Card className="border-[#d07b4a] bg-[#fff4ed] shadow-none"><CardHeader><CardTitle className="font-serif text-xl">{t("learning.human_gate")}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-[#6f3d23]">{t("learning.human_gate_text")}</p><div className="mt-4 flex flex-wrap gap-2"><Badge className="bg-[#d07b4a] text-white">{evaluated.assessment?.outcome}</Badge><Badge variant="outline">{evaluated.assessment?.missingEvidence.length ? `${evaluated.assessment.missingEvidence.length} missing evidence` : "evidence traced"}</Badge></div></CardContent></Card>
  </div>;
}
