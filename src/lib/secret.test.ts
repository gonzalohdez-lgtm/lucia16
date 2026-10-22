import { describe, it, expect } from "vitest";
import { isDayOpen, checkPassword } from "./secret";

describe("calendario de adviento", () => {
  it("el día 21 no abre el 20 de diciembre", () => {
    expect(isDayOpen(21, new Date("2026-12-20T12:00:00Z"))).toBe(false);
  });
  it("el día 21 abre el 21 de diciembre", () => {
    expect(isDayOpen(21, new Date("2026-12-21T12:00:00Z"))).toBe(true);
  });
  it("nada abre en noviembre", () => {
    expect(isDayOpen(1, new Date("2026-11-30T12:00:00Z"))).toBe(false);
  });
  it("la contraseña ignora mayúsculas y tildes", () => {
    expect(checkPassword("LUCÍA16")).toBe(true);
    expect(checkPassword("otra")).toBe(false);
  });
});
