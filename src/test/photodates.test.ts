import { describe, expect, it } from "vitest";
import { pairs } from "@/components/PhotoDates";

describe("día 6 · fechas de las fotos", () => {
  it("la foto 2 corresponde al 13 de marzo", () => {
    expect(pairs.find((p) => p.id === "foto2")?.date).toBe("13 de marzo");
  });

  it("cada fecha solo aparece una vez", () => {
    const dates = pairs.map((p) => p.date);
    expect(new Set(dates).size).toBe(dates.length);
  });
});
