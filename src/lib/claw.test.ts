import { describe, expect, it } from "vitest";
import { availablePrize, clawPrizes, clawQuestions, nearestPrize, nextQuestion } from "./claw";

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
  it("una bola rota por fallar no se puede volver a coger", () => {
    expect(availablePrize(50, [], ["photo2"])?.id).not.toBe("photo2");
  });
  it("la pregunta de la comida favorita de Lucía ofrece las opciones nuevas", () => {
    const food = clawQuestions.find(q => q.q === "¿Cuál es la comida favorita de Lucía?");
    expect(food?.options).toEqual(["Hamburguesa", "Aceitunas", "Gonzalo", "McDonald's"]);
    expect(food?.options[food.answer]).toBe("Gonzalo");
  });
  it("hay preguntas suficientes para todas las bolas y no se repiten", () => {
    expect(clawQuestions.length).toBeGreaterThanOrEqual(clawPrizes.length);
    expect(nextQuestion([0, 1])).toBe(2);
  });
});
