export type Fighter = "lucia" | "gonzalo";
export type FightAction = "quick" | "heavy" | "block" | "special";
export const fighterNames = { lucia: "LUCÍA", gonzalo: "GONZALO" };
export const specialNames = { lucia: "Tardar 1h maquillándose", gonzalo: "Ignorar" };
export const otherFighter = (f: Fighter): Fighter => f === "lucia" ? "gonzalo" : "lucia";
export type FighterState = { hp: number; energy: number; wins: number; blocking: boolean; stunnedUntil: number; readyAt: number; damage: number; hits: number; blocks: number; specials: number; criticals: number };
export type FightState = { fighters: Record<Fighter, FighterState>; round: number; phase: "waiting" | "fight" | "roundover" | "finished"; deadline: number; nextRoundAt: number; winner: Fighter | "draw" | null; roundWinner: Fighter | "draw" | null; event: { id: number; actor: Fighter; text: string; action: FightAction } | null; startedAt: number };
const fresh = (): FighterState => ({ hp: 100, energy: 0, wins: 0, blocking: false, stunnedUntil: 0, readyAt: 0, damage: 0, hits: 0, blocks: 0, specials: 0, criticals: 0 });
export function createFight(now: number, waiting = false): FightState {
  return { fighters: { lucia: fresh(), gonzalo: fresh() }, round: 1, phase: waiting ? "waiting" : "fight", deadline: now + 99000, nextRoundAt: 0, winner: null, roundWinner: null, event: null, startedAt: now };
}
function endRound(s: FightState, now: number) {
  const l = s.fighters.lucia.hp, g = s.fighters.gonzalo.hp;
  s.roundWinner = l === g ? "draw" : l > g ? "lucia" : "gonzalo";
  if (s.roundWinner !== "draw") s.fighters[s.roundWinner].wins++;
  if (s.round === 3 || s.fighters.lucia.wins === 2 || s.fighters.gonzalo.wins === 2) {
    s.phase = "finished";
    const lw = s.fighters.lucia.wins, gw = s.fighters.gonzalo.wins;
    s.winner = lw === gw ? "draw" : lw > gw ? "lucia" : "gonzalo";
  } else { s.phase = "roundover"; s.nextRoundAt = now + 3000; }
}
export function advanceFight(state: FightState, now: number): FightState {
  const s = structuredClone(state);
  if (s.phase === "fight" && now >= s.deadline) endRound(s, now);
  if (s.phase === "roundover" && now >= s.nextRoundAt) {
    s.round++; s.phase = "fight"; s.deadline = now + 99000; s.event = null;
    for (const f of Object.values(s.fighters)) Object.assign(f, { hp: 100, energy: 0, blocking: false, stunnedUntil: 0, readyAt: 0 });
  }
  return s;
}
export function applyFightAction(state: FightState, actor: Fighter, action: FightAction, now: number, random = Math.random): FightState {
  const s = advanceFight(state, now), a = s.fighters[actor], b = s.fighters[otherFighter(actor)];
  if (s.phase !== "fight" || now < a.readyAt || now < a.stunnedUntil || (action === "special" && a.energy < 100)) return s;
  a.readyAt = now + (action === "heavy" ? 1400 : action === "special" ? 2000 : 700);
  a.blocking = action === "block";
  let text = "¡BLOQUEO!";
  if (action !== "block") {
    const crit = action === "heavy" && random() < .25;
    let damage = action === "special" ? 32 : action === "heavy" ? (crit ? 24 : 17) : 9;
    if (b.blocking) { damage = Math.ceil(damage * .25); b.blocking = false; b.blocks++; text = "¡BLOQUEADO!"; }
    else text = action === "special" ? specialNames[actor] : crit ? "CRITICAL!" : "POW!";
    const dealt = Math.min(b.hp, damage); b.hp -= dealt; a.damage += dealt; a.hits++;
    if (crit) a.criticals++;
    if (action === "quick") a.hp = Math.min(100, a.hp + 3);
    if (action === "special") { a.energy = 0; a.specials++; b.stunnedUntil = now + 2200; }
    else a.energy = Math.min(100, a.energy + (action === "heavy" ? 28 : 20));
    b.energy = Math.min(100, b.energy + 10);
  } else a.energy = Math.min(100, a.energy + 12);
  s.event = { id: (s.event?.id ?? 0) + 1, actor, action, text };
  if (b.hp === 0) endRound(s, now);
  return s;
}