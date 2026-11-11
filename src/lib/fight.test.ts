import { describe, it, expect } from "vitest";
import { createFight, applyFightAction, advanceFight, specialNames } from "./fight";
describe("combate del día 13", () => {
  it("ambos personajes empiezan con 100 de vida", () => { const s = createFight(0); expect(s.fighters.lucia.hp).toBe(100); expect(s.fighters.gonzalo.hp).toBe(100); });
  it("cada ronda dura 99 segundos", () => { const s = createFight(500); expect(s.deadline).toBe(99500); expect(advanceFight(s, 99499).phase).toBe("fight"); expect(advanceFight(s, 99500).phase).toBe("roundover"); });
  it("termina como máximo en la tercera ronda", () => { let s = createFight(0); for (let i=0;i<3;i++) { s=advanceFight(s,s.deadline); if(i<2) s=advanceFight(s,s.nextRoundAt); } expect(s.phase).toBe("finished"); expect(s.round).toBe(3); });
  it("Gonzalo tiene Ignorar y Lucía tarda una hora maquillándose", () => { expect(specialNames.gonzalo).toBe("Ignorar"); expect(specialNames.lucia).toBe("Tardar 1h maquillándose"); });
  it("el especial exige energía y aturde al rival", () => { const s=createFight(0); expect(applyFightAction(s,"gonzalo","special",1).fighters.lucia.hp).toBe(100); s.fighters.gonzalo.energy=100; const n=applyFightAction(s,"gonzalo","special",1); expect(n.fighters.lucia.hp).toBe(68); expect(n.fighters.lucia.stunnedUntil).toBe(2201); });
  it("bloqueo reduce el daño y el enfriamiento impide spam", () => { let s=createFight(0); s=applyFightAction(s,"lucia","block",1); s=applyFightAction(s,"gonzalo","heavy",2,()=>1); expect(s.fighters.lucia.hp).toBe(95); expect(applyFightAction(s,"gonzalo","heavy",3).fighters.lucia.hp).toBe(95); });
});