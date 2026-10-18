/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Router } from "wouter";
import ArkiBookPage, { BOOK_VOLUMES } from "@/pages/ArkiBookPage";
import { buildVisualResultsPdfDocument } from "@/components/CommandBar";

afterEach(() => cleanup());

const renderBook = () => render(
  React.createElement(Router, { hook: () => ["/arki-book", () => undefined] as const }, React.createElement(ArkiBookPage)),
);

describe("ARKI Living Book", () => {
  it("keeps the three volumes separated by purpose and audience", () => {
    expect(BOOK_VOLUMES.map((volume) => volume.id)).toEqual(["I", "II", "III"]);
    expect(BOOK_VOLUMES[0].audience).toContain("Estudiantes");
    expect(BOOK_VOLUMES[1].audience).toContain("docentes");
    expect(BOOK_VOLUMES[2].audience).toContain("investigadores");
    expect(BOOK_VOLUMES.flatMap((volume) => volume.chapters).some((chapter) => chapter.access === "INTERNAL_ONLY")).toBe(true);
  });

  it("provides a dedicated living chapter for every supported building typology", () => {
    const typologyChapters = BOOK_VOLUMES[2].chapters.filter((chapter) => chapter.id.startsWith("III-T-"));
    expect(typologyChapters.length).toBe(23);
    expect(typologyChapters.map((chapter) => chapter.title)).toEqual(expect.arrayContaining([
      "Vivienda: funcionamiento y diseño",
      "Restaurante: funcionamiento y diseño",
      "Salud: funcionamiento y diseño",
      "Espacio urbano público: funcionamiento y diseño",
    ]));
    expect(typologyChapters.every((chapter) => chapter.status === "LIVING" && chapter.access === "PUBLIC")).toBe(true);
  });

  it("shows public reading by default and exposes internal ARKI material only through its filter", () => {
    renderBook();
    expect(screen.getByRole("heading", { name: /Arquitectura como conocimiento/ })).toBeTruthy();
    expect(screen.queryByText("Contratos, gates y matrices de ANEXO I")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^MASTER/ }));
    fireEvent.click(screen.getByRole("button", { name: /Interno ARKI/ }));
    expect(screen.getByText("Contratos, gates y matrices de ANEXO I")).toBeTruthy();
    expect(screen.getByText("P9.4, P10 y M1: protocolos internos")).toBeTruthy();
  });

  it("offers an interactive index and reading preferences", () => {
    renderBook();
    expect(screen.getByText("Índice interactivo")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /01 · El ser humano y la medida del espacio/ }));
    expect(screen.getByText("El ser humano y la medida del espacio")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Aumentar tamaño del texto" }));
    fireEvent.click(screen.getByRole("button", { name: "Cambiar a tema papel" }));
    expect(document.querySelector(".arki-book-paper")).toBeTruthy();
  });

  it("exposes voice, camera, email, and WhatsApp actions", () => {
    renderBook();
    expect(screen.getByRole("button", { name: "Dictar encargo" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Añadir contexto visual" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enviar por correo" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Compartir por WhatsApp" })).toBeTruthy();
  });

  it("shows the listening indicator when ARKI voice recognition is active", async () => {
    renderBook();
    window.dispatchEvent(new CustomEvent("arki:voice-state", { detail: { active: true } }));
    await waitFor(() => expect(screen.getByText("Escuchando")).toBeTruthy());
    window.dispatchEvent(new CustomEvent("arki:voice-state", { detail: { active: false } }));
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
  });

  it("builds a printable PDF report without promoting visual observations to facts", () => {
    const html = buildVisualResultsPdfDocument([{ evidence_id: "EVD-1", observation_class: "PLAN_DIMENSION_ANNOTATION_VISIBLE", description: "Cota visible de forma aproximada", qualifier: "APPROXIMATE", uncertainty: "La imagen no permite confirmar la escala", status: "AI_PROPOSED" }], "ABC-DEF-123-456");
    expect(html).toContain("Guardar como PDF");
    expect(html).toContain("AI_PROPOSED");
    expect(html).toContain("Requieren revisión humana");
    expect(html).toContain("ABC-DEF-123-456");
  });
});
