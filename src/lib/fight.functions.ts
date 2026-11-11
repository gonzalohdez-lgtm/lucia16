import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createFight, applyFightAction, advanceFight, otherFighter, type FightState, type Fighter } from "./fight";
const character = z.enum(["lucia", "gonzalo"]);
const codeSchema = z.string().regex(/^[A-Z2-9]{8}$/);
const sessionSchema = z.object({ code: codeSchema, token: z.string().uuid() });
export const createFightRoom = createServerFn({ method: "POST" }).inputValidator(z.object({ character })).handler(async ({ data }) => {
  const { createRoom } = await import("./fight-room.server");
  return createRoom(data.character, createFight(Date.now(), true));
});
export const joinFightRoom = createServerFn({ method: "POST" }).inputValidator(z.object({ code: codeSchema })).handler(async ({ data }) => {
  const { joinRoom } = await import("./fight-room.server");
  return joinRoom(data.code);
});
export const updateFightRoom = createServerFn({ method: "POST" }).inputValidator(sessionSchema.extend({ action: z.enum(["quick", "heavy", "block", "special"]).optional() })).handler(async ({ data }) => {
  const { readRoom, saveRoom } = await import("./fight-room.server");
  for(let attempt=0;attempt<4;attempt++) {
    const room = await readRoom(data.code, data.token);
    const actor: Fighter = room.isHost ? room.host_character as Fighter : otherFighter(room.host_character as Fighter);
    const state = room.state as unknown as FightState;
    const next = data.action ? applyFightAction(state, actor, data.action, Date.now()) : advanceFight(state, Date.now());
    if (JSON.stringify(next) === JSON.stringify(state) || await saveRoom(room, next)) return { state: next, character: actor };
  }
  throw new Error("La partida está ocupada. Vuelve a intentarlo.");
});