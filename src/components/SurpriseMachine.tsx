import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Gift, X, BookOpen, Images, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clawPrizes, nearestPrize, type ClawPrize } from "@/lib/claw";

const STORAGE_KEY = "lucia-day13-machine-v2";
const icons = { Carta: BookOpen, Foto: Images, Vale: Ticket };
export function SurpriseMachine() {
  const [open, setOpen] = useState(false);
  return <><h3 className="font-serif text-3xl">La máquina de las sorpresas</h3><Button className="cm-launch" onClick={() => setOpen(true)}><Gift /> Jugar</Button>{open && <Machine onClose={() => setOpen(false)} />}</>;
}
function Machine({ onClose }: { onClose: () => void }) {
  const [x, setX] = useState(50);
  const [phase, setPhase] = useState<"idle" | "down" | "up" | "deliver" | "ready">("idle");
  const [opened, setOpened] = useState<string[]>([]);
  const [current, setCurrent] = useState<ClawPrize>();
  const [shown, setShown] = useState<ClawPrize>();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const locked = useRef(false);
  useEffect(() => {
    try { const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); if (Array.isArray(stored)) setOpened(stored.filter((id): id is string => typeof id === "string" && clawPrizes.some(p => p.id === id))); } catch { /* Storage is optional. */ }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; timers.current.forEach(clearTimeout); };
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (shown) setShown(undefined); else onClose(); }
      if (phase !== "idle" || shown || /INPUT|BUTTON/.test((e.target as HTMLElement)?.tagName ?? "")) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); setX(v => Math.max(14, Math.min(86, v + (e.key === "ArrowLeft" ? -12 : 12)))); }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose, phase, shown]);
  const grab = () => {
    if (locked.current || phase !== "idle") return;
    const prize = nearestPrize(x, opened);
    if (!prize) return;
    locked.current = true;
    setX(prize.x); setCurrent(prize); setPhase("down");
    timers.current.push(setTimeout(() => setPhase("up"), 1100));
    timers.current.push(setTimeout(() => { setX(18); setPhase("deliver"); }, 2200));
    timers.current.push(setTimeout(() => setPhase("ready"), 3200));
  };
  const reveal = () => {
    if (!current) return;
    const updated = [...new Set([...opened, current.id])];
    setOpened(updated); setShown(current); setCurrent(undefined); setPhase("idle"); locked.current = false;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Storage is optional. */ }
  };
  const complete = opened.length === clawPrizes.length;
  return <section className="cm-screen" role="dialog" aria-modal="true" aria-label="Máquina de gancho del día 13">
    <header className="cm-header"><span>DÍA 13 · LUCÍA & GONZALO</span><Button variant="ghost" size="icon" aria-label="Cerrar máquina" onClick={onClose}><X /></Button></header>
    <div className="cm-layout"><div className="cm-stage">
      <div className={`cm-cabinet cm-phase-${phase}`}>
        <div className="cm-crown"><span>EDICIÓN ESPECIAL</span><h1>LA MÁQUINA<br />DE LAS SORPRESAS</h1><div className="cm-lights">✦ &nbsp; L & G &nbsp; ✦</div></div>
        <div className="cm-glass">
          <div className="cm-rail" />
          <div className="cm-carriage" style={{ left: `${x}%` }}><div className="cm-cable" /><div className="cm-claw"><i /><i /><i /></div>{(phase === "up" || phase === "deliver") && <span className="cm-ball cm-held" />}</div>
          <div className="cm-balls">{clawPrizes.filter(p => !opened.includes(p.id) && !(current?.id === p.id && phase !== "down")).map((p, i) => <span key={p.id} className={`cm-ball cm-ball-${i % 3}`} style={{ left: `${p.x}%` }}><small>{i + 1}</small></span>)}</div>
          <div className="cm-glass-shine" /><div className="cm-bottom-rail" />
        </div>
        <div className="cm-console"><div className="cm-joystick"><i /></div><div className="cm-controls"><Button size="icon" title="Mover gancho a la izquierda" aria-label="Mover gancho a la izquierda" disabled={phase !== "idle" || complete} onClick={() => setX(v => Math.max(14, v - 12))}><ArrowLeft /></Button><Button size="icon" title="Bajar gancho" aria-label="Bajar gancho" className="cm-drop" disabled={phase !== "idle" || complete} onClick={grab}><ArrowDown /></Button><Button size="icon" title="Mover gancho a la derecha" aria-label="Mover gancho a la derecha" disabled={phase !== "idle" || complete} onClick={() => setX(v => Math.min(86, v + 12))}><ArrowRight /></Button></div><div className="cm-coin-slots"><span /><span /></div></div>
        <div className="cm-base"><div className="cm-floral-panel" /><Button className={`cm-hatch ${phase === "ready" ? "cm-hatch-ready" : ""}`} aria-label="Abrir cápsula" title="Abrir cápsula" disabled={phase !== "ready"} onClick={reveal}>{phase === "ready" ? <span className="cm-ball" /> : <span />}</Button><b>{phase === "ready" ? "RECOGE TU CÁPSULA" : complete ? "COLECCIÓN COMPLETA" : phase === "idle" ? "ELIGE TU BOLA" : "GANCHO EN MARCHA…"}</b></div>
        <div className="cm-feet"><i /><i /></div>
      </div>
    </div><aside className="cm-collection"><p className="cm-eyebrow">TUS SORPRESAS</p><h2>{opened.length} <span>/ {clawPrizes.length}</span></h2><div className="cm-prize-list">{clawPrizes.map(p => { const Icon = icons[p.kind]; const collected = opened.includes(p.id); return <Button key={p.id} variant="ghost" className="cm-prize-item" disabled={!collected} onClick={() => setShown(p)}><Icon /><span><small>{p.kind}</small><b>{collected ? p.name : "Por descubrir"}</b></span>{collected && p.photo && <img src={p.photo} alt="" />}</Button>; })}</div></aside></div>
    {shown && <div className="cm-reveal" role="dialog" aria-modal="true" aria-label="Sorpresa abierta"><article className={`cm-paper cm-paper-${shown.kind.toLowerCase()}`}><Button variant="ghost" size="icon" className="cm-paper-close" aria-label="Cerrar premio" onClick={() => setShown(undefined)}><X /></Button><p className="cm-eyebrow">{shown.kind} · L & G</p><h2>{shown.name}</h2>{shown.photo ? <img src={shown.photo} alt={shown.name} /> : <p className="cm-letter-text">{shown.detail}</p>}<Button className="cm-launch" onClick={() => setShown(undefined)}>Volver a la máquina</Button></article></div>}
  </section>;
}
