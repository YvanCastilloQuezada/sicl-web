import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { executeIntegratedArchitectCycle } from "../arkiIntegratedArchitectCycle";
import type { IntegratedArchitectInput } from "../arkiIntegratedArchitectCycle";
import { exportRenderDataForAllPartis } from "../gia/visualization/exportRenderData";
import { buildVisualRequestFromRenderData } from "../gia/visualization/buildVisualRequest";

export const visualizationRouter = router({
  /**
   * Devuelve los N RenderData del ciclo para un proyecto (uno por PARTI).
   * Input: el fixture completo (IntegratedArchitectInput) o projectId si ya está en DB.
   * Para esta primera versión, recibe el input completo (como el test de exportRenderData).
   */
  getRenderDataForAllPartis: protectedProcedure
    .input(z.object({ input: z.unknown() }))
    .mutation(async ({ input }) => {
      const cycleInput = input.input as IntegratedArchitectInput;
      if (!cycleInput || typeof cycleInput !== "object") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "input must be an IntegratedArchitectInput object" });
      }
      const cycle = await executeIntegratedArchitectCycle(cycleInput);
      const renderDatas = exportRenderDataForAllPartis(cycle);
      return {
        projectId: cycle.project.projectId,
        nPartis: renderDatas.length,
        renderDatas,
      };
    }),

  /**
   * Devuelve el RenderData de un PARTI concreto (por partiId).
   */
  getRenderDataForParti: protectedProcedure
    .input(z.object({ input: z.unknown(), partiId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const cycleInput = input.input as IntegratedArchitectInput;
      const cycle = await executeIntegratedArchitectCycle(cycleInput);
      const all = exportRenderDataForAllPartis(cycle);
      const found = all.find((rd) => rd.partiId === input.partiId);
      if (!found) {
        throw new TRPCError({ code: "NOT_FOUND", message: `PARTI ${input.partiId} not found. Available: ${all.map((rd) => rd.partiId).join(", ")}` });
      }
      return found;
    }),

  /**
   * Devuelve el VisualGenerationRequest (prompt + SVG de referencia) por PARTI.
   * Es el puente a IA: el prompt se deriva del cálculo, no de descripción libre.
   */
  getVisualRequestForParti: protectedProcedure
    .input(z.object({
      input: z.unknown(),
      partiId: z.string().min(1),
      quality: z.enum(["HD", "2K", "FULL_HD", "4K", "8K", "16K"]).default("2K"),
      purpose: z.enum(["EXTERIOR_RENDER", "INTERIOR_RENDER", "MATERIAL_STUDY", "AR_OVERLAY", "SITE_CONTEXT"]).default("EXTERIOR_RENDER"),
      language: z.enum(["es", "en"]).default("es"),
    }))
    .mutation(async ({ input }) => {
      const cycle = await executeIntegratedArchitectCycle(input.input as IntegratedArchitectInput);
      const all = exportRenderDataForAllPartis(cycle);
      const renderData = all.find((rd) => rd.partiId === input.partiId);
      if (!renderData) {
        throw new TRPCError({ code: "NOT_FOUND", message: `PARTI ${input.partiId} not found. Available: ${all.map((rd) => rd.partiId).join(", ")}` });
      }
      const visualRequest = buildVisualRequestFromRenderData(renderData, {
        quality: input.quality,
        purpose: input.purpose,
        language: input.language,
      });
      return visualRequest;
    }),
});
