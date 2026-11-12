import { describe, expect, it } from "vitest";
import { clawPrizes, nearestPrize } from "./claw";

describe("máquina del día 13", () => {
  it("incluye fotos nuestras, vales y cartas", () => {
    expect(new Set(clawPrizes.map(p => p.kind))).toEqual(new Set(["Foto", "Vale", "Carta"]));
    expect(clawPrizes.filter(p => p.kind === "Foto").every(p => p.photo?.startsWith("/__l5e/assets-v1/"))).toBe(true);
  });
  it("el gancho recoge la bola más cercana sin repetir premios", () => {
    expect(nearestPrize(50, [])?.id).toBe("photo2");
    expect(nearestPrize(50, ["photo2"])?.id).not.toBe("photo2");
    expect(nearestPrize(50, clawPrizes.map(p => p.id))).toBeUndefined();
  });
});