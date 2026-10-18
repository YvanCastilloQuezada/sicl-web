import { DoorOpen } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "../i18n/useTranslation";
import { accessLabel, type ArkiAccess } from "./ArkiGateway";
import type { ArkiModuleDefinition } from "./ArkiGateway";
import type { TranslationKey } from "../i18n/catalog";

const LABEL_KEYS: Record<string, TranslationKey> = { Data: "dataModule", Biblioteca: "library", Proyectos: "projectsModule", Generador: "generatorModule", "Modelo BIM": "bimModule", Planta: "plan", Corte: "section", "3D": "model3d", Metrados: "quantities", "PRESUP-5D": "budget5d", GASTOS: "expensesModule", "4D": "schedule4d", Clashes: "clashesModule", "EXP-TEC": "technicalDossier", "O-M": "operationsManagement", ADM: "administrationModule" };
export function moduleLabelKey(name: string) { return LABEL_KEYS[name] ?? name; }

/** Info Box espejo fijo a la izquierda; queda preparado para propiedades del proyecto. */
export default function ArkiNavigator({ access }: { access: ArkiAccess; activeModule?: string; modules?: readonly ArkiModuleDefinition[]; open?: boolean; onToggle?: () => void; onSelect?: (name: string) => void }) {
  const { t } = useTranslation();
  return <aside className="arki-info-box arki-left-info-box" aria-label="Info Box izquierdo">
    <div className="arki-info-head"><span>{t("infoBox")} · {t("pendingSelection")}</span><button onClick={() => toast.info(t("selectionUi2"))}>?</button></div>
    <div className="arki-info-empty"><DoorOpen size={22} /><strong>{t("noSelection")}</strong><p>El canvas aún no emite un contrato de selección. Cuando se integre, aquí aparecerán propiedades, materiales, metrados, costo y trazabilidad.</p></div>
    <div className="arki-info-status"><span className="arki-engine-dot" />{t(accessLabel(access))}<b>{t("local")}</b></div>
  </aside>;
}
