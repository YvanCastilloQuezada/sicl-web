import React, { useMemo } from "react";
import { Link2, MapPin, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoreProject } from "@/api/sicl-client";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";
import { deriveArchitecturalSpaceSemantics } from "./arquiArchitecturalSpaces";

type Props = { project?: CoreProject; representation: SpatialRepresentation; organization: SpatialDesignOrganization; fixture?: unknown[] };
export default function ArquiArchitecturalSpaceSemantics({ project, representation, organization, fixture }: Props) {
  const { t } = useTranslation();
  const semantics = useMemo(() => deriveArchitecturalSpaceSemantics(project, representation, organization, fixture), [fixture, organization, project, representation]);
  return <Card className="border-primary/30 bg-background p-4" aria-label="P1 architectural space semantics"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">P1 · {t("arqui.p1_eyebrow")}</p><h3 className="mt-1 text-lg font-semibold">{t("arqui.p1_title")}</h3><p className="mt-1 text-xs text-muted-foreground">{t("arqui.p1_description")}</p></div><Badge variant="outline">{t("arqui.p1_no_rooms")}</Badge></div>
    <div className="mt-3 grid gap-2 sm:grid-cols-6">{Object.entries(semantics.counts).map(([key, value]) => <div key={key} className="rounded border border-border p-2"><p className="text-[11px] text-muted-foreground">{t(`arqui.p1_count_${key}`)}</p><p className="text-lg font-semibold">{value}</p></div>)}</div>
    <div className="mt-3 space-y-2">{semantics.spaces.map((space) => <div key={space.spaceId} className="rounded border border-border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{space.name}</p><p className="text-xs text-muted-foreground">{space.spaceType} · {space.spaceId}</p></div><div className="flex gap-1"><Badge variant="secondary">{space.realizationStatus}</Badge><Badge variant="outline">{space.assignmentStatus}</Badge></div></div><div className="mt-2 grid gap-1 text-xs sm:grid-cols-3"><span>{t("arqui.p1_program_link")}: <strong>{space.programItemId}</strong></span><span>{t("arqui.p1_target_area")}: <strong>{space.targetArea === undefined ? t("arqui.p1_unknown") : `${space.targetArea} m²`}</strong></span><span>{t("arqui.p1_actual_area")}: <strong>{space.actualArea === undefined ? t("arqui.p1_unknown") : `${space.actualArea.toFixed(2)} m²`}</strong></span></div><p className="mt-1 text-xs text-muted-foreground">{t("arqui.p1_boundary")}: {space.boundaryStatus} · {t("arqui.p1_level")}: {space.levelReference ?? t("arqui.p1_unknown")}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Link2 className="h-3 w-3" />{t("arqui.p1_provenance")}: {space.provenance.join(" · ")}</p>{space.spatialElementId ? <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700"><MapPin className="h-3 w-3" />{t("arqui.p1_spatial_reference")}: {space.spatialElementId}</p> : <p className="mt-1 flex items-center gap-1 text-xs text-amber-700"><ShieldAlert className="h-3 w-3" />{t("arqui.p1_semantic_only")}</p>}</div>)}{semantics.spaces.length === 0 && <p className="text-sm text-muted-foreground">{t("arqui.p1_no_program")}</p>}</div>
    <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950"><p className="font-semibold">{t("arqui.p1_unknowns")}</p><p className="mt-1">{semantics.unknowns.length ? semantics.unknowns.join(" · ") : t("arqui.p1_no_unknowns")}</p><p className="mt-2">{t("arqui.p1_epistemic_note")}</p></div>
  </Card>;
}
