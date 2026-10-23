// @ts-nocheck -- juegos portados de la web original
import { useEffect, useMemo, useRef, useState } from "react";
import type { Day } from "@/lib/days";

const btn = "pill-button pill-dark";
const option = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-left transition hover:bg-secondary";

function Reward({ text }: { text: string }) {
  return <p className="mt-5 rounded-2xl bg-secondary p-4 text-center text-lg animate-in fade-in zoom-in">{text}</p>;
}

export function DayContent({ day, onLastSurprise }: { day: Day; onLastSurprise: () => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl">{day.title}</h2>
      <div className="mt-5">{render(day, onLastSurprise)}</div>
    </div>
  );
}

function render(day: Day, onLastSurprise: () => void) {
  switch (day.type) {
    case "message": return <p className="whitespace-pre-line text-lg leading-relaxed">{day.text}</p>;
    case "quiz": return <Quiz day={day} />;
    case "scratch": return <Scratch prize={day.prize} />;
    case "memory": return <Memory emojis={day.emojis} reward={day.reward} />;
    case "gift": return <Gift inside={day.inside} />;
    case "riddle": return <Riddle day={day} />;
    case "reasons": return <Reasons reasons={day.reasons} />;
    case "coupon": return <Coupon coupon={day.coupon} detail={day.detail} />;
    case "letter": return <Letter21 onLastSurprise={onLastSurprise} />;
  }
}

function Letter21({ onLastSurprise }: { onLastSurprise: () => void }) {
  return (
    <div className="space-y-4 text-lg leading-relaxed">
      {/* Carta del día 21: texto provisional hasta que Gonzalo la escriba */}
      <p>Lucía,</p>
      <p>Hoy por fin es el día. Llevas 21 días abriendo una casilla y hoy es la última.</p>
      <p>Aquí irá la carta que te estoy escribiendo. 🩵</p>
      <p className="signature">— Gonzalo</p>
      <div className="pt-4 text-center">
        <button className={btn} onClick={onLastSurprise}>Una última sorpresa ✨</button>
        <p className="final-ps mt-3 text-sm text-muted-foreground">PD: busca bien en la sorpresa</p>
      </div>
    </div>
  );
}

function Quiz({ day }: { day: Extract<Day, { type: "quiz" }> }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  if (i >= day.questions.length)
    return (
      <div>
        <p>Has acertado {score} de {day.questions.length}.</p>
        {score === day.questions.length ? <Reward text={day.reward} /> : <button className={`${btn} mt-4`} onClick={() => { setI(0); setScore(0); }}>Otra vez</button>}
      </div>
    );
  const q = day.questions[i];
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Pregunta {i + 1}/{day.questions.length}</p>
      <p className="text-lg">{q.q}</p>
      {q.options.map((o, k) => (
        <button key={k} disabled={picked !== null}
          className={`${option} ${picked !== null && k === q.answer ? "!bg-primary text-primary-foreground" : ""} ${picked === k && k !== q.answer ? "!bg-destructive/20" : ""}`}
          onClick={() => { setPicked(k); if (k === q.answer) setScore((s) => s + 1); setTimeout(() => { setPicked(null); setI((n) => n + 1); }, 900); }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Scratch({ prize }: { prize: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const s = getComputedStyle(document.documentElement);
    ctx.fillStyle = s.getPropertyValue("--secondary") || "silver";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = s.getPropertyValue("--muted-foreground") || "gray";
    ctx.font = "600 18px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Rasca aquí ✨", c.width / 2, c.height / 2 + 6);
    ctx.globalCompositeOperation = "destination-out";
  }, []);
  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1 && e.pointerType === "mouse") return;
    const c = ref.current!; const r = c.getBoundingClientRect(); const ctx = c.getContext("2d")!;
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2); ctx.fill();
    if (Math.random() < 0.15) {
      const d = ctx.getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let k = 3; k < d.length; k += 64) if (d[k] === 0) n++;
      if (n / (d.length / 64) > 0.5) setDone(true);
    }
  };
  return (
    <div className="relative grid h-40 place-items-center overflow-hidden rounded-2xl border border-border bg-card p-4 text-center text-lg font-medium select-none">
      <span>{prize}</span>
      <canvas ref={ref} onPointerMove={scratch} onPointerDown={scratch} className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`} />
    </div>
  );
}

function shuffle<T>(a: T[]) { const t = [...a]; for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; } return t; }

function Memory({ emojis, reward }: { emojis: string[]; reward: string }) {
  const cards = useMemo(() => shuffle([...emojis, ...emojis]), [emojis]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || found.includes(cards[i])) return;
    const n = [...open, i]; setOpen(n);
    if (n.length === 2) {
      setTries((t) => t + 1);
      if (cards[n[0]] === cards[n[1]]) { setFound((f) => [...f, cards[i]]); setOpen([]); }
      else setTimeout(() => setOpen([]), 800);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((e, i) => { const show = open.includes(i) || found.includes(e); return (
          <button key={i} onClick={() => flip(i)} className={`aspect-square rounded-xl border border-border text-2xl transition ${show ? "bg-background" : "bg-primary"}`}>{show ? e : ""}</button>
        ); })}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Intentos: {tries}</p>
      {found.length === emojis.length && <Reward text={reward} />}
    </div>
  );
}

function Gift({ inside }: { inside: string }) {
  const [n, setN] = useState(0);
  return (
    <div className="text-center">
      {n >= 3 ? (
        <div className="animate-in zoom-in"><div className="text-6xl">✨💝✨</div><Reward text={inside} /></div>
      ) : (
        <>
          <button onClick={() => setN((x) => x + 1)} className="text-8xl transition active:scale-90" style={{ transform: `rotate(${n % 2 ? 8 : -8}deg) scale(${1 + n * 0.08})` }} aria-label="Abrir regalo">🎁</button>
          <p className="mt-3 text-sm text-muted-foreground">Toca el regalo {3 - n} {3 - n === 1 ? "vez" : "veces"} más</p>
        </>
      )}
    </div>
  );
}

function Riddle({ day }: { day: Extract<Day, { type: "riddle" }> }) {
  const [v, setV] = useState("");
  const [state, setState] = useState<"none" | "ok" | "bad">("none");
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/^(el|la)\s+/, "").trim();
  return (
    <form onSubmit={(e) => { e.preventDefault(); setState(norm(v) === norm(day.answer) ? "ok" : "bad"); }}>
      <p className="text-lg">{day.riddle}</p>
      {state !== "ok" && (
        <div className="mt-4 flex gap-2">
          <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Tu respuesta" className="flex-1 rounded-full border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring" />
          <button className={btn}>Probar</button>
        </div>
      )}
      {state === "bad" && <p className="mt-2 text-sm text-destructive">Nop… piénsalo otra vez 🤭</p>}
      {state === "ok" && <Reward text={day.reward} />}
    </form>
  );
}

function Reasons({ reasons }: { reasons: string[] }) {
  const [seen, setSeen] = useState<number[]>([]);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {reasons.map((r, i) => (
        <button key={i} onClick={() => setSeen((s) => [...s, i])} className={`min-h-20 rounded-2xl border border-border p-3 text-sm transition ${seen.includes(i) ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
          {seen.includes(i) ? r : `💌 ${i + 1}`}
        </button>
      ))}
    </div>
  );
}

function Coupon({ coupon, detail }: { coupon: string; detail: string }) {
  const [used, setUsed] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-dashed border-primary bg-secondary p-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Cupón</p>
      <p className="mt-2 font-serif text-2xl">{coupon}</p>
      <p className="mt-3 text-sm">{detail}</p>
      <button className={`${btn} mt-5`} onClick={() => setUsed(true)} disabled={used}>{used ? "Canjeado ✔ (enséñaselo a Gonzalo)" : "Canjear"}</button>
    </div>
  );
}
