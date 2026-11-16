import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Gift, X, BookOpen, Images, Ticket, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { availablePrize, clawPrizes, clawQuestions, nextQuestion, type ClawPrize } from "@/lib/claw";

const STORAGE_KEY = "lucia-day13-machine-v3";
const icons = { Carta: BookOpen, Foto: Images, Vale: Ticket };
type Phase = "nocoin" | "coin" | "question" | "idle" | "down" | "up" | "deliver" | "ready" | "breaking";
type Saved = { opened: string[]; broken: string[]; used: number[] };

export function SurpriseMachine() {
  const [open, setOpen] = useState(false);
  return <><h3 className="font-serif text-3xl">{"\n"}</h3><p className="text-sm text-muted-foreground">Echa una moneda, acierta la pregunta y atrapa una bola. Si fallas… una bola se rompe para siempre.</p><Button className="cm-launch" onClick={() => setOpen(true)}><Gift /> Jugar</Button>{open && <Machine onClose={() => setOpen(false)} />}</>;
}

function Machine({ onClose }: { onClose: () => void }) {
  const [x, setX] = useState(50);
  const [tilt, setTilt] = useState(0);
  const [phase, setPhase] = useState<Phase>("nocoin");
  const [saved, setSaved] = useState<Saved>({ opened: [], broken: [], used: [] });
  const [current, setCurrent] = useState<ClawPrize>();
  const [shown, setShown] = useState<ClawPrize>();
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number>();
  const [cracking, setCracking] = useState<string>();
  const [toast, setToast] = useState<string>();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  const { opened, broken, used } = saved;
  const valid = (id: unknown): id is string => typeof id === "string" && clawPrizes.some(p => p.id === id);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (s && typeof s === "object") setSaved({ opened: Array.isArray(s.opened) ? s.opened.filter(valid) : [], broken: Array.isArray(s.broken) ? s.broken.filter(valid) : [], used: Array.isArray(s.used) ? s.used.filter((n: unknown) => typeof n === "number") : [] });
    } catch { /* Storage is optional. */ }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; timers.current.forEach(clearTimeout); };
  }, []);
  const persist = (s: Saved) => { setSaved(s); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* optional */ } };
  const flash = (t: string) => { setToast(t); later(1800, () => setToast(undefined)); };

  const move = (dir: -1 | 1) => {
    if (phase !== "idle") return;
    setX(v => Math.max(14, Math.min(86, v + dir * 12)));
    setTilt(dir); later(260, () => setTilt(0));
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (shown) setShown(undefined); else if (phase !== "question") onClose(); }
      if (/INPUT|BUTTON/.test((e.target as HTMLElement)?.tagName ?? "")) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      if (e.key === " " || e.key === "ArrowDown") { e.preventDefault(); grab(); }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  });

  const remaining = clawPrizes.filter(p => !opened.includes(p.id) && !broken.includes(p.id));
  const over = remaining.length === 0;

  const insertCoin = () => {
    if (phase !== "nocoin" || over) return;
    setPhase("coin");
    later(900, () => { setQIndex(nextQuestion(used)); setPicked(undefined); setPhase("question"); });
  };
  const answer = (i: number) => {
    if (picked !== undefined) return;
    setPicked(i);
    const ok = i === clawQuestions[qIndex]!.answer;
    const nextUsed = [...used, qIndex].slice(-clawQuestions.length + 1);
    later(1100, () => {
      if (ok) { persist({ ...saved, used: nextUsed }); setPhase("idle"); flash("¡Correcto! Mueve el gancho y atrapa una bola"); return; }
      const victim = remaining[Math.floor(Math.random() * remaining.length)]!;
      setPhase("breaking"); setCracking(victim.id);
      later(1400, () => { setCracking(undefined); persist({ ...saved, used: nextUsed, broken: [...broken, victim.id] }); setPhase("nocoin"); flash("¡Fallaste! Una bola se ha roto 💥"); });
    });
  };
  const grab = () => {
    if (phase !== "idle") return;
    const prize = availablePrize(x, opened, broken);
    if (!prize) return;
    setX(prize.x); setCurrent(prize); setPhase("down");
    later(1100, () => setPhase("up"));
    later(2200, () => { setX(18); setPhase("deliver"); });
    later(3200, () => setPhase("ready"));
  };
  const reveal = () => {
    if (!current || phase !== "ready") return;
    persist({ ...saved, opened: [...new Set([...opened, current.id])] });
    setShown(current); setCurrent(undefined); setPhase("nocoin");
  };

  const status = phase === "ready" ? "RECOGE TU CÁPSULA" : over ? "FIN DE LA PARTIDA" : phase === "nocoin" ? "INSERTA UNA MONEDA" : phase === "coin" ? "MONEDA ACEPTADA…" : phase === "question" ? "RESPONDE LA PREGUNTA" : phase === "breaking" ? "¡CRACK!" : phase === "idle" ? "¡ATRAPA UNA BOLA!" : "GANCHO EN MARCHA…";
  const q = clawQuestions[qIndex]!;
  return <section className="cm-screen" role="dialog" aria-modal="true" aria-label="Máquina de gancho del día 13">
    <header className="cm-header"><span>DÍA 13 · LUCÍA & GONZALO</span><Button variant="ghost" size="icon" aria-label="Cerrar máquina" onClick={onClose}><X /></Button></header>
    <div className="cm-layout"><div className="cm-stage">
      <div className={`cm-cabinet cm-phase-${phase} ${phase === "breaking" ? "cm-shake" : ""}`}>
        <div className="cm-crown"><span>EDICIÓN ESPECIAL</span><h1>LA MÁQUINA<br />DE LAS SORPRESAS</h1><div className={`cm-lights ${phase === "idle" || phase === "coin" ? "cm-lights-on" : ""}`}>✦ &nbsp; L & G &nbsp; ✦</div></div>
        <div className="cm-glass">
          <div className="cm-rail" />
          <div className={`cm-carriage ${tilt ? "cm-sway" : ""}`} style={{ left: `${x}%` }}><div className="cm-cable" /><div className="cm-claw"><i /><i /><i /></div>{(phase === "up" || phase === "deliver") && <span className="cm-ball cm-held" />}</div>
          <div className="cm-balls">{clawPrizes.filter(p => !opened.includes(p.id) && !(current?.id === p.id && phase !== "down")).map((p, i) => {
            const dead = broken.includes(p.id);
            return <span key={p.id} className={`cm-ball cm-ball-${i % 3} ${dead ? "cm-broken" : ""} ${cracking === p.id ? "cm-cracking" : ""} ${phase === "idle" && !dead && availablePrize(x, opened, broken)?.id === p.id ? "cm-target" : ""}`} style={{ left: `${p.x}%` }}><small>{dead ? "✕" : i + 1}</small></span>;
          })}</div>
          {toast && <div className="cm-toast">{toast}</div>}
          <div className="cm-glass-shine" /><div className="cm-bottom-rail" />
        </div>
        <div className="cm-console"><div className="cm-joystick" style={{ transform: `rotate(${tilt * 22}deg)` }}><i /></div><div className="cm-controls"><Button size="icon" aria-label="Mover gancho a la izquierda" disabled={phase !== "idle"} onClick={() => move(-1)}><ArrowLeft /></Button><Button size="icon" aria-label="Bajar gancho" className="cm-drop" disabled={phase !== "idle"} onClick={grab}><ArrowDown /></Button><Button size="icon" aria-label="Mover gancho a la derecha" disabled={phase !== "idle"} onClick={() => move(1)}><ArrowRight /></Button></div>
          <button type="button" className={`cm-coin-slots ${phase === "nocoin" && !over ? "cm-coin-ready" : ""}`} aria-label="Echar moneda" disabled={phase !== "nocoin" || over} onClick={insertCoin}><span /><span />{phase === "coin" && <b className="cm-coin" />}</button></div>
        <div className="cm-base"><div className="cm-floral-panel" /><Button className={`cm-hatch ${phase === "ready" ? "cm-hatch-ready" : ""}`} aria-label="Abrir cápsula" disabled={phase !== "ready"} onClick={reveal}>{phase === "ready" ? <span className="cm-ball" /> : <span />}</Button><b>{status}</b></div>
        <div className="cm-feet"><i /><i /></div>
      </div>
      {phase === "nocoin" && !over && <Button className="cm-launch cm-coin-cta" onClick={insertCoin}><Coins /> Echar moneda</Button>}
    </div><aside className="cm-collection"><p className="cm-eyebrow">TUS SORPRESAS</p><h2>{opened.length} <span>/ {clawPrizes.length}</span></h2>{broken.length > 0 && <p className="cm-broken-count">💥 {broken.length} bola{broken.length > 1 ? "s" : ""} rota{broken.length > 1 ? "s" : ""}</p>}<div className="cm-prize-list">{clawPrizes.map(p => { const Icon = icons[p.kind]; const collected = opened.includes(p.id); const dead = broken.includes(p.id); return <Button key={p.id} variant="ghost" className="cm-prize-item" disabled={!collected} onClick={() => setShown(p)}><Icon /><span><small>{p.kind}</small><b>{collected ? p.name : dead ? "Bola rota 💥" : "Por descubrir"}</b></span>{collected && p.photo && <img src={p.photo} alt="" />}</Button>; })}</div>
      {over && <Button variant="outline" onClick={() => persist({ opened, broken: [], used: [] })} disabled={broken.length === 0}>Reparar bolas rotas y reintentar</Button>}</aside></div>
    {phase === "question" && <div className="cm-reveal" role="dialog" aria-modal="true" aria-label="Pregunta"><article className="cm-paper cm-quiz"><p className="cm-eyebrow">PREGUNTA · SI FALLAS SE ROMPE UNA BOLA</p><h2>{q.q}</h2><div className="cm-options">{q.options.map((o, i) => <Button key={o} variant="outline" className={picked === undefined ? "" : i === q.answer ? "cm-opt-ok" : picked === i ? "cm-opt-bad" : ""} onClick={() => answer(i)}>{o}</Button>)}</div></article></div>}
    {shown && <div className="cm-reveal" role="dialog" aria-modal="true" aria-label="Sorpresa abierta"><div className="cm-confetti" aria-hidden>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.08}s` }} />)}</div><article className={`cm-paper cm-paper-${shown.kind.toLowerCase()}`}><Button variant="ghost" size="icon" className="cm-paper-close" aria-label="Cerrar premio" onClick={() => setShown(undefined)}><X /></Button><p className="cm-eyebrow">{shown.kind} · L & G</p><h2>{shown.name}</h2>{shown.photo ? <img src={shown.photo} alt={shown.name} /> : <p className="cm-letter-text">{shown.detail}</p>}<Button className="cm-launch" onClick={() => setShown(undefined)}>Volver a la máquina</Button></article></div>}
  </section>;
}
