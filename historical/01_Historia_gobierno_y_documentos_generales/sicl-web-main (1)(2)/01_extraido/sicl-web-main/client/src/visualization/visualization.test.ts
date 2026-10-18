/** @vitest-environment jsdom */
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { transformParetoData } from "./models/paretoModel";
import { transformEventData } from "./models/eventModel";
import ParetoChart from "./charts/ParetoChart";
import EventTimeline from "./charts/EventTimeline";
import ChartEmptyState from "./charts/ChartEmptyState";

afterEach(cleanup);

describe("visualization models", () => {
  it("transforms Pareto front, dominated and incomplete alternatives", () => {
    const data = transformParetoData({ pareto_front: ["ALT-1"], dominated: ["ALT-2"], incomplete: ["ALT-3"], objectives: ["ENERGY_SAVINGS", "CONSTRUCTION_COST"], alternatives: [{ id: "ALT-1", ENERGY_SAVINGS: 80, CONSTRUCTION_COST: 500 }, { id: "ALT-2", ENERGY_SAVINGS: 40, CONSTRUCTION_COST: 800 }, { id: "ALT-3" }] });
    expect(data.points).toHaveLength(3);
    expect(data.points.map((point) => point.status)).toEqual(["front", "dominated", "incomplete"]);
    expect(data.axes.x.label).toBe("ENERGY_SAVINGS");
  });

  it("sorts events and builds a time range", () => {
    const data = transformEventData({ events: [{ id: "2", type: "B", timestamp: "2026-01-02", payload: "second" }, { id: "1", type: "A", timestamp: "2026-01-01", payload: "first" }] });
    expect(data.events.map((event) => event.id)).toEqual(["1", "2"]);
    expect(data.timeRange.min).toBeLessThan(data.timeRange.max ?? 0);
    expect(Object.keys(data.legend)).toEqual(["A", "B"]);
  });
});

describe("visualization charts", () => {
  it("renders Pareto SVG points and axis labels", () => {
    const data = transformParetoData({ pareto_front: ["ALT-1"], alternatives: [{ id: "ALT-1", ENERGY_SAVINGS: 80, CONSTRUCTION_COST: 500 }] });
    const view = render(React.createElement(ParetoChart, { data }));
    expect(view.container.querySelector("svg")).toBeTruthy();
    expect(view.container.querySelectorAll("circle")).toHaveLength(1);
    expect(view.getByText("ENERGY_SAVINGS")).toBeTruthy();
  });

  it("renders the event timeline", () => {
    const data = transformEventData([{ id: "1", type: "PROJECT_CREATED", timestamp: "2026-01-01", payload: {} }]);
    const view = render(React.createElement(EventTimeline, { data }));
    expect(view.container.querySelector("svg")).toBeTruthy();
    expect(view.container.querySelectorAll("circle")).toHaveLength(1);
  });

  it("renders a shared empty state", () => {
    const view = render(React.createElement(ChartEmptyState));
    expect(view.getByText("Sin datos para visualizar")).toBeTruthy();
  });
});
