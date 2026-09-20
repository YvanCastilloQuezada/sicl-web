/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Router } from "wouter";
import ArkiBookPage, { BOOK_VOLUMES } from "@/pages/ArkiBookPage";

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

  it("shows public reading by default and exposes internal ARKI material only through its filter", () => {
    renderBook();
    expect(screen.getByRole("heading", { name: /Arquitectura como conocimiento/ })).toBeTruthy();
    expect(screen.queryByText("Contratos, gates y matrices de ANEXO I")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^MASTER/ }));
    fireEvent.click(screen.getByRole("button", { name: /Interno ARKI/ }));
    expect(screen.getByText("Contratos, gates y matrices de ANEXO I")).toBeTruthy();
    expect(screen.getByText("P9.4, P10 y M1: protocolos internos")).toBeTruthy();
  });
});
