import type { ConstructionModel } from "@shared/arkiConstructionOntology";
import SceneModel3D from "../canvas/SceneModel3D";

export default function SceneModelModule({ model }: { model: ConstructionModel | null }) {
  return <div className="arki-module-body scene-module-body"><SceneModel3D model={model} /></div>;
}
