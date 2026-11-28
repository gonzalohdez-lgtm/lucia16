import { describe, expect, it } from "vitest";
import { availablePrize, ballNumber, clawPrizes, clawQuestions, nearestPrize, questionForBall } from "./claw";

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
  it("cada bola tiene su propia pregunta y ninguna se repite", () => {
    const bound = clawPrizes.map(p => p.question);
    expect(new Set(bound).size).toBe(clawPrizes.length);
    expect(bound.every(i => i >= 0 && i < clawQuestions.length)).toBe(true);
    expect(questionForBall("photo2")?.q).toBe("¿Cuántos días exactos han pasado desde el día en que supimos de la existencia del otro?");
  });
  it("la bola de la pregunta de la ciudad da el vale del regalo", () => {
    const city = clawQuestions.findIndex(q => q.q === "¿A qué ciudad quiere viajar Gonzalo con Lucía?");
    const ball = clawPrizes.find(p => p.question === city);
    expect(ball?.kind).toBe("Vale");
    expect(ball?.name).toBe("Vale por un regalo que te tengo que dar");
    expect(ballNumber(ball!.id)).toBe(5);
  });
  it("la pregunta de la comida favorita de Lucía ofrece las opciones nuevas", () => {
    const food = clawQuestions.find(q => q.q === "¿Cuál es la comida favorita de Lucía?");
    expect(food?.options).toEqual(["Hamburguesa", "Aceitunas", "Gonzalo", "McDonald's"]);
    expect(food?.options[food.answer]).toBe("Gonzalo");
  });
  it("mantiene los números originales aunque desaparezcan las primeras bolas", () => {
    const remaining = clawPrizes.filter(p => p.id !== "letter1" && p.id !== "photo1");
    expect(remaining.map(p => ballNumber(p.id))).toEqual([3, 4, 5, 6, 7]);
    expect(ballNumber("photo2")).toBe(4);
  });
  it("la pregunta de los días exactos tiene 317 como respuesta correcta", () => {
    const days = clawQuestions.find(q => q.q === "¿Cuántos días exactos han pasado desde el día en que supimos de la existencia del otro?");
    expect(days?.options).toEqual(["308", "295", "317", "328"]);
    expect(days?.options[days.answer]).toBe("317");
  });
  it("el primer beso fue el 21 de febrero", () => {
    const kiss = clawQuestions.find(q => q.q === "¿Qué día fue nuestro primer beso?");
    expect(kiss?.options).toEqual(["21 de febrero", "13 de marzo", "22 de febrero", "13 de febrero"]);
    expect(kiss?.options[kiss.answer]).toBe("21 de febrero");
  });
  it("la ciudad correcta es Roma", () => {
    const city = clawQuestions.find(q => q.q === "¿A qué ciudad quiere viajar Gonzalo con Lucía?");
    expect(city?.options[city.answer]).toBe("Roma");
  });
});
