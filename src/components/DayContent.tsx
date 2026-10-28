// @ts-nocheck -- juegos portados de la web original
import { useEffect, useMemo, useRef, useState } from "react";
import type { Day } from "@/lib/days";
import { JigsawPuzzle } from "@/components/JigsawPuzzle";
import { PhotoDates } from "@/components/PhotoDates";
import { CoupleQuestions } from "@/components/CoupleQuestions";
import { FortuneCookie } from "@/components/FortuneCookie";
import { SecretSafe } from "@/components/SecretSafe";
import { RelationshipClock } from "@/components/RelationshipClock";
import { LoveCompass } from "@/components/LoveCompass";
import { photos } from "@/lib/media";

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
    case "photomemory": return <PhotoMemory reward={day.reward} />;
    case "photodates": return <PhotoDates />;
    case "surprisechoice": return <SurpriseChoice />;
    case "roulette": return <SurpriseRoulette />;
    case "couplequestions": return <CoupleQuestions />;
    case "puzzle": return <JigsawPuzzle image={day.image} reward={day.reward} />;
    case "gift": return <Gift inside={day.inside} />;
    case "riddle": return <Riddle day={day} />;
    case "reasons": return <Reasons reasons={day.reasons} />;
    case "coupon": return <Coupon coupon={day.coupon} detail={day.detail} />;
    case "letter": return <Letter21 onLastSurprise={onLastSurprise} />;
    case "journey": return <LuciaJourney />;
    case "wordsearch": return <WordSearch />;
    case "fortunecookie": return <FortuneCookie message={day.message} />;
    case "safe": return <SecretSafe code={day.code} message={day.message} />;
    case "relationshipclock": return <RelationshipClock />;
    case "lovecompass": return <LoveCompass />;
  }
}


function SurpriseChoice() {
  const storageKey = "lucia-day7-surprise-choice";
  const surprises = [
    "Te debo un masaje 🩵",
    "Ver una peli juntos. No negociable. 🎬",
    "Te compro algo que te haga ilusión 🎁",
    "Durante un día, hacemos todo lo que tú quieras 👑",
  ];
  const [chosen, setChosen] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved !== null && Number.isInteger(Number(saved)) && Number(saved) >= 0 && Number(saved) < surprises.length) {
        setChosen(Number(saved));
      }
    } catch {}
  }, []);

  const choose = (index: number) => {
    if (chosen !== null) return;
    try { window.localStorage.setItem(storageKey, String(index)); } catch {}
    setChosen(index);
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">Hay 4 sorpresas, pero solo puedes elegir una… 🤫🩵</p>
      <div className="grid grid-cols-2 gap-3">
        {surprises.map((surprise, index) => (
          <button key={index} type="button" onClick={() => choose(index)} disabled={chosen !== null}
            className={`aspect-square rounded-2xl border-2 p-3 text-center transition ${chosen === index ? "border-primary bg-secondary" : "border-border bg-primary text-primary-foreground"} ${chosen !== null && chosen !== index ? "opacity-50" : "hover:scale-[1.02]"}`}>
            {chosen === index ? (
              <span className="flex h-full flex-col items-center justify-center gap-2">
                <span className="text-3xl">🩵</span>
                <span className="text-sm font-semibold">{surprise}</span>
              </span>
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-2">
                <span className="text-4xl">❓</span>
                <span className="text-sm font-medium">Sorpresa {index + 1}</span>
              </span>
            )}
          </button>
        ))}
      </div>
      {chosen !== null && <p className="rounded-2xl bg-secondary p-4 text-center text-sm">¡Esta es tu sorpresa! Las otras tres ya se quedan guardadas para siempre… cerradas 🤭</p>}
    </div>
  );
}

function Letter21({ onLastSurprise }: { onLastSurprise: () => void }) {
  useEffect(() => {
    // Tras la falsa pantalla de error, avanzar automáticamente a la sorpresa final.
    const timer = window.setTimeout(onLastSurprise, 10000);
    return () => window.clearTimeout(timer);
  }, [onLastSurprise]);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#0078d7] p-6 text-white animate-in fade-in duration-500">
      <div className="w-full max-w-2xl font-mono">
        <p className="text-6xl font-light sm:text-8xl">:(</p>
        <h2 className="mt-8 text-2xl font-semibold sm:text-4xl">¡Vaya! Algo ha salido demasiado romántico.</h2>
        <p className="mt-5 text-base sm:text-xl">ERROR 404: NOVIO DEMASIADO ENAMORADO 🩵</p>
        <p className="mt-3 text-sm text-white/90 sm:text-base">No te preocupes, Lucía. Esto es un falso error y no le ha pasado nada a tu dispositivo.</p>
        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full origin-left animate-[error-countdown_10s_linear_forwards] bg-white" />
        </div>
        <p className="mt-3 text-sm text-white/90">Reiniciando el amor… y llevándote a la última sorpresa en 5 segundos.</p>
      </div>
      <style>{`@keyframes error-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }`}</style>
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


function PhotoMemory({ reward }: { reward: string }) {
  const images = useMemo(() => shuffle([
    { id: "p01", src: photos.p01 }, { id: "p02", src: photos.p02 },
    { id: "p03", src: photos.p03 }, { id: "p04", src: photos.p04 },
    { id: "p05", src: photos.p05 }, { id: "p06", src: photos.p06 },
    { id: "p01", src: photos.p01 }, { id: "p02", src: photos.p02 },
    { id: "p03", src: photos.p03 }, { id: "p04", src: photos.p04 },
    { id: "p05", src: photos.p05 }, { id: "p06", src: photos.p06 },
  ]), []);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);
  const flip = (i: number) => {
    if (locked || open.includes(i) || found.includes(images[i].id)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setTries(t => t + 1);
      if (images[next[0]].id === images[next[1]].id) {
        setFound(f => [...f, images[i].id]);
        setOpen([]);
      } else {
        setLocked(true);
        setTimeout(() => { setOpen([]); setLocked(false); }, 850);
      }
    }
  };
  return (
    <div>
      <p className="mb-4 text-center text-sm text-muted-foreground">Encuentra las 6 parejas de nuestras fotos 🩵</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((card, i) => {
          const show = open.includes(i) || found.includes(card.id);
          return (
            <button key={i} onClick={() => flip(i)} aria-label={show ? "Foto descubierta" : "Descubrir foto"}
              className={`aspect-square overflow-hidden rounded-2xl border border-border transition-all ${show ? "bg-background" : "bg-primary text-3xl text-primary-foreground hover:scale-[1.02]"}`}>
              {show ? <img src={card.src} alt="Recuerdo de Lucía y Gonzalo" className="h-full w-full object-cover" /> : "🩵"}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">Parejas: {found.length}/6 · Intentos: {tries}</p>
      {found.length === 6 && <Reward text={reward} />}
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


function LuciaJourney() {
  const [step, setStep] = useState(0);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);

  const stages = [
    { prompt: "¿Qué camino eliges?", options: ["Conocer a Gonzalo", "No conocer a Gonzalo"], correct: 0, loseText: "Has perdido" },
    { prompt: "¿Qué haces ahora?", options: ["Hablar con él", "No tener contacto con él", "Esperar a que él te hable"], correct: 0, loseText: "Has perdido" },
    { prompt: "¿Qué quieres?", options: ["Quiero que sea mi novio", "No quiero que sea mi novio"], correct: 0, loseText: "Has perdido" },
    { prompt: "¿Cuánto queréis durar?", options: ["Dejarlo al poco tiempo", "Durar un año con él", "Durar toda la vida"], correct: 2, loseText: "Habrás perdido" },
    { prompt: "¿Qué os gustaría tener?", options: ["Tener dos hijos", "Tener un hijo", "No tener nada"], correct: 0, loseText: "Has perdido" },
    { prompt: "¿Y al final?", options: ["Casarse", "No casarse"], correct: 0, loseText: "Has perdido" },
  ];

  const choose = (index: number) => {
    if (index !== stages[step].correct) {
      setLost(true);
      return;
    }
    if (step === stages.length - 1) setWon(true);
    else setStep((current) => current + 1);
  };

  const restart = () => { setStep(0); setLost(false); setWon(false); };

  return (
    <div className="space-y-5">
      {!won && !lost && (
        <>
          <p className="text-center text-sm text-muted-foreground">Una aventura de decisiones · Paso {step + 1} de {stages.length}</p>
          <div className="rounded-3xl border border-border bg-gradient-to-b from-secondary/70 to-background p-5 text-center">
            <p className="mb-2 font-serif text-xl font-semibold">Lucía</p>
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-border bg-card text-6xl shadow-sm" aria-label="Lucía, personaje del juego">👩🏻</div>
            {step === 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className={option} onClick={() => choose(0)}>↙️ <span className="block mt-2">Conocer a Gonzalo</span></button>
                <button className={option} onClick={() => choose(1)}>↘️ <span className="block mt-2">No conocer a Gonzalo</span></button>
              </div>
            ) : (
              <>
                <p className="mt-5 text-lg font-medium">{stages[step].prompt}</p>
                <div className="mt-3 space-y-2">
                  {stages[step].options.map((text, index) => (
                    <button key={text} className={option} onClick={() => choose(index)}>{text}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {lost && (
        <div className="animate-in zoom-in rounded-3xl border border-border bg-secondary/60 p-6 text-center">
          <div className="text-5xl">🥺</div>
          <h3 className="mt-3 font-serif text-3xl">Has perdido</h3>
          <p className="mt-2 text-muted-foreground">¡Vuelve a intentarlo! Seguro que encuentras el camino correcto 🩵</p>
          <button className={`${btn} mt-4`} onClick={restart}>Volver a jugar</button>
        </div>
      )}

      {won && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-secondary to-background p-5 text-center">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => <span key={i} className="absolute animate-bounce text-xl" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 90}%`, animationDelay: `${(i % 6) * 0.15}s` }}>{["✨", "🩵", "🎉", "💖"][i % 4]}</span>)}
          </div>
          <div className="relative animate-in fade-in zoom-in">
            <p className="eyebrow text-muted-foreground">Meta alcanzada</p>
            <h3 className="mt-2 font-serif text-3xl md:text-4xl">¡Felicidades, has ganado!</h3>
            <p className="mt-2 text-muted-foreground">Elegiste el camino de una vida juntos 🩵</p>
            <div className="my-6 flex items-end justify-center gap-2 sm:gap-4" aria-label="Lucía, Gonzalo y sus dos hijos cruzan la meta">
              <span className="text-5xl sm:text-6xl">👩🏻</span>
              <span className="text-5xl sm:text-6xl">👨🏻</span>
              <span className="text-3xl sm:text-4xl">🧒🏻</span>
              <span className="text-3xl sm:text-4xl">👧🏻</span>
            </div>
            <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-background">
              <div className="h-full w-full origin-left animate-[finish-line_1.4s_ease-out_forwards] rounded-full bg-primary" />
            </div>
            <p className="mt-4 text-sm">Lucía + Gonzalo + dos peques = para siempre 💍</p>
            <button className={`${btn} mt-4`} onClick={restart}>Jugar otra vez</button>
          </div>
        </div>
      )}
    </div>
  );
}


const SEARCH_WORDS = ["LUCIA", "HAMBURGUESA", "TEAMO", "HALLOWEEN", "CARNAVALES", "SECTA", "13MARZO"];
const GRID_SIZE = 15;

function makeWordGrid() {
  const directions = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  for (let attempt = 0; attempt < 300; attempt++) {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
    let success = true;
    for (const word of [...SEARCH_WORDS].sort((a,b) => b.length-a.length)) {
      let placed = false;
      for (let tries = 0; tries < 500 && !placed; tries++) {
        const [dr,dc] = directions[Math.floor(Math.random()*directions.length)];
        const r = Math.floor(Math.random()*GRID_SIZE), col = Math.floor(Math.random()*GRID_SIZE);
        const er = r + dr*(word.length-1), ec = col + dc*(word.length-1);
        if (er < 0 || er >= GRID_SIZE || ec < 0 || ec >= GRID_SIZE) continue;
        let fits = true;
        for (let k=0;k<word.length;k++) if (grid[r+dr*k][col+dc*k] && grid[r+dr*k][col+dc*k] !== word[k]) fits=false;
        if (!fits) continue;
        for (let k=0;k<word.length;k++) grid[r+dr*k][col+dc*k]=word[k];
        placed=true;
      }
      if (!placed) { success=false; break; }
    }
    if (success) {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return grid.map(row => row.map(ch => ch || letters[Math.floor(Math.random()*letters.length)]));
    }
  }
  return Array.from({length:GRID_SIZE},()=>Array.from({length:GRID_SIZE},()=>"A"));
}

function WordSearch() {
  const grid = useMemo(() => makeWordGrid(), []);
  const [start, setStart] = useState<[number,number] | null>(null);
  const [end, setEnd] = useState<[number,number] | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [trail, setTrail] = useState<{cells:[number,number][]; ok:boolean} | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const getCell = (target: EventTarget | null): [number,number] | null => {
    const el = target instanceof Element ? target.closest("[data-word-cell]") : null;
    if (!el) return null;
    return [Number(el.getAttribute("data-row")), Number(el.getAttribute("data-col"))];
  };
  const lineCells = (a:[number,number], b:[number,number]) => {
    const dr=b[0]-a[0], dc=b[1]-a[1];
    if (!(dr===0 || dc===0 || Math.abs(dr)===Math.abs(dc))) return [];
    const steps=Math.max(Math.abs(dr),Math.abs(dc));
    const sr=Math.sign(dr), sc=Math.sign(dc);
    return Array.from({length:steps+1},(_,i):[number,number]=>[a[0]+sr*i,a[1]+sc*i]);
  };
  const finish = (cell:[number,number] | null) => {
    if (!start || !cell) { setStart(null); setEnd(null); return; }
    const cells=lineCells(start,cell);
    const word=cells.map(([r,col])=>grid[r][col]).join("");
    const reverse=[...word].reverse().join("");
    const match=SEARCH_WORDS.find(w=>w===word || w===reverse);
    const ok=!!match && !found.includes(match);
    setTrail({cells,ok});
    if (ok && match) setFound(prev=>[...prev,match]);
    if (timer.current) clearTimeout(timer.current);
    timer.current=setTimeout(()=>setTrail(null), ok ? 1000 : 750);
    setStart(null); setEnd(null);
  };
  const trailCells = trail?.cells ?? (start && end ? lineCells(start,end) : []);
  const trailSet = new Set(trailCells.map(([r,col])=>r+"-"+col));
  const done=found.length===SEARCH_WORDS.length;
  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Encuentra las 7 palabras. Arrastra el cursor o el dedo desde la primera letra hasta la última; pueden estar en horizontal, vertical o diagonal.</p>
    <div className="grid grid-cols-15 gap-0.5 select-none touch-none rounded-xl border border-border bg-card p-1"
      style={{gridTemplateColumns:"repeat(15,minmax(0,1fr))"}}
      onPointerDown={e=>{const cell=getCell(e.target); if(cell){if(timer.current)clearTimeout(timer.current);setTrail(null);setStart(cell);setEnd(cell);(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);}}}
      onPointerMove={e=>{if(!start)return;const cell=getCell(document.elementFromPoint(e.clientX,e.clientY));if(cell)setEnd(cell);}}
      onPointerUp={e=>{if(start){const cell=getCell(document.elementFromPoint(e.clientX,e.clientY));finish(cell);}}}
      onPointerCancel={()=>{setStart(null);setEnd(null);}}>
      {grid.map((row,r)=>row.map((letter,col)=>{
        const key=r+"-"+col, isTrail=trailSet.has(key);
        const isFound=found.some(w=>false) || false;
        const color=isTrail ? (trail ? (trail.ok ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-primary/30") : "";
        return <div key={key} data-word-cell="true" data-row={r} data-col={col}
          className={`aspect-square flex items-center justify-center rounded-sm text-[clamp(8px,2.3vw,14px)] sm:text-sm font-semibold ${color || (isFound ? "bg-emerald-500 text-white" : "bg-background")} `}
          aria-label={letter}>{letter}</div>;
      }))}
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {SEARCH_WORDS.map(word=><div key={word} className={`rounded-xl border border-border px-3 py-2 text-center text-sm font-semibold tracking-wider ${found.includes(word) ? "bg-emerald-500/15 text-emerald-700 line-through" : "bg-background"}`}>{word}</div>)}
    </div>
    {trail && <p className={`text-center text-sm font-medium ${trail.ok ? "text-emerald-600" : "text-red-500"}`}>{trail.ok ? "¡Palabra correcta! 🟢" : "Esa palabra no es correcta. 🔴"}</p>}
    {done && <Reward text="¡Las has encontrado todas! 🩵" />}
  </div>;
}


const roulettePrizes = [
  { id: "letter", label: "Carta escrita por mí", icon: "💌", color: "#F6A6B8" },
  { id: "video", label: "Un vídeo nuestro", icon: "🎬", color: "#8EC5FC" },
  { id: "photo", label: "Una foto especial", icon: "📸", color: "#B8A1E3" },
  { id: "gift", label: "Un regalo sorpresa", icon: "🎁", color: "#F6C66D" },
  { id: "secret", label: "Un mensaje secreto", icon: "🤫", color: "#8FD6C1" },
  { id: "karts", label: "Una actividad juntos", icon: "🏎️", color: "#F39A78" },
];

function SurpriseRoulette() {
  const testMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("ruleta-test") === "1";
  const storageKey = testMode ? "lucia-roulette-test-v1" : "lucia-roulette-v1";
  const [spins, setSpins] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.spins)) setSpins(data.spins);
        if (Number.isInteger(data.selected)) setSelected(data.selected);
        if (data.showPrize === true) setShowPrize(true);
      }
    } catch {}
  }, []);

  const persist = (nextSpins: number[], nextSelected: number | null, reveal: boolean) => {
    try { window.localStorage.setItem(storageKey, JSON.stringify({ spins: nextSpins, selected: nextSelected, showPrize: reveal })); } catch {}
  };

  const spin = () => {
    if (spinning || spins.length >= 2) return;
    const available = roulettePrizes.map((_, i) => i);
    const result = available[Math.floor(Math.random() * available.length)];
    const next = [...spins, result];
    // Guardar el giro inmediatamente para que recargar durante la animación no lo permita repetir.
    setSpins(next);
    setSelected(result);
    setShowPrize(false);
    persist(next, result, false);
    setSpinning(true);
    const segment = 360 / roulettePrizes.length;
    const target = rotation + 360 * 5 + (360 - (result * segment + segment / 2));
    setRotation(target);
    window.setTimeout(() => {
      setSpinning(false);
      setShowPrize(true);
      persist(next, result, true);
    }, 4200);
  };


  const prize = selected === null ? null : roulettePrizes[selected];

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="rounded-3xl border border-pink-200/70 bg-gradient-to-br from-rose-50 via-white to-sky-50 p-4 sm:p-6">
        <p className="text-center text-sm font-medium text-rose-500">SOLO 2 GIROS · ELIGE BIEN 🩵</p>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-600">Solo tienes dos oportunidades. Aunque recargues la página, no podrás volver a girar cuando las hayas gastado. 🎁</p>
        <div className="relative mx-auto mt-6 aspect-square w-full max-w-[340px]">
          <div className="absolute -top-2 left-1/2 z-20 -translate-x-1/2 text-3xl drop-shadow">▼</div>
          <div className="absolute inset-0 rounded-full border-[7px] border-white shadow-xl transition-transform duration-[4200ms] ease-[cubic-bezier(0.12,0.75,0.08,1)]"
            style={{ transform: `rotate(${rotation}deg)`, background: `conic-gradient(${roulettePrizes.map((p, i) => `${p.color} ${i * 60}deg ${(i + 1) * 60}deg`).join(", ")})` }}>
            {roulettePrizes.map((p, i) => <div key={p.id} className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-2xl sm:text-3xl"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 60 + 30}deg) translateY(-105px) rotate(-${i * 60 + 30}deg)` }}>
              <span aria-label={p.label} title={p.label}>{p.icon}</span>
            </div>)}
          </div>
          <div className="absolute left-1/2 top-1/2 z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-white text-2xl shadow">🩵</div>
        </div>
        <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
          {roulettePrizes.map((p) => <div key={p.id} className="flex min-h-12 items-center gap-2 rounded-xl border bg-white/80 px-2 py-2 text-xs font-semibold text-slate-700 sm:text-sm" style={{ borderColor: p.color }}>
            <span className="text-lg">{p.icon}</span><span>{p.label}</span>
          </div>)}
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">Tiradas realizadas: <strong>{spins.length}/2</strong></p>
          <button type="button" onClick={spin} disabled={spinning || spins.length >= 2}
            className="mt-3 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50">
            {spinning ? "Girando… ✨" : spins.length >= 2 ? "HAS GASTADO TUS 2 GIROS 🔒" : "GIRAR LA RULETA 🎡"}
          </button>
        </div>
      </div>

      {spins.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
        {spins.map((index, i) => <div key={`${index}-${i}`} className="rounded-2xl border p-3 text-center" style={{ borderColor: roulettePrizes[index].color, backgroundColor: roulettePrizes[index].color + "22" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Opción {i + 1}</p>
          <p className="mt-1 font-semibold">{roulettePrizes[index].icon} {roulettePrizes[index].label}</p>
        </div>)}
      </div>}



      {showPrize && prize && <div className="rounded-3xl border-2 bg-background p-5 text-center shadow-lg animate-in fade-in zoom-in" style={{ borderColor: prize.color }}>
        <p className="text-4xl">{prize.icon}</p><h3 className="mt-2 font-serif text-2xl">{prize.label}</h3>
        <div className="mt-4 text-left">
          {prize.id === "letter" && <div className="rounded-2xl bg-rose-50 p-5 leading-relaxed text-slate-700">Si alguna vez te preguntas si eres importante para mí, quiero que recuerdes que sí, muchísimo. Me importan tus cosas, tus preocupaciones, tus ilusiones y hasta esos cotilleos que empiezas a contarme diciendo "no sabes lo que ha pasado". Me gusta escucharte porque me gusta conocerte cada vez más. Y aunque a veces no sepa qué responder, te prometo que estoy prestando atención. Bueno, casi siempre. Si me estás hablando mientras juego, repítemelo, por favor JAJAJA.</div>}
          {prize.id === "video" && <div><video controls playsInline preload="metadata" className="w-full rounded-2xl" src="/media/ruleta-video.mp4">Tu navegador no puede reproducir este vídeo.</video><p className="mt-3 text-center text-sm text-muted-foreground">Este es mi video favorito, porque fue el 13 de marzo</p></div>}
          {prize.id === "photo" && <div><img src="/media/ruleta-foto.jpeg" alt="Nuestra foto especial" className="mx-auto max-h-[520px] w-full rounded-2xl object-contain" /><p className="mt-3 text-center text-sm text-muted-foreground">Esta es mi foto favorita, porque es el día que "creíamos que cumplimos 6 meses" y la primera vez que te regalé flores</p></div>}
          {prize.id === "gift" && <p className="rounded-2xl bg-amber-50 p-5 text-center text-lg text-slate-700">Recuérdame la próxima vez que te vea que te dé este regalo. 🎁</p>}
          {prize.id === "secret" && <p className="rounded-2xl bg-emerald-50 p-5 text-center text-2xl font-semibold text-slate-700">Me pones 🩵</p>}
          {prize.id === "karts" && <div className="rounded-2xl bg-orange-50 p-5 text-center"><p className="text-4xl">🏎️</p><p className="mt-2 text-lg font-semibold text-slate-700">Vale por una actividad juntos</p><p className="mt-1 text-slate-600">¡Nos vamos a los karts! 🏁</p></div>}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{spins.length >= 2 ? "¡Has descubierto tus dos sorpresas! Ya no quedan más giros 🤭🩵" : "Te queda una oportunidad para descubrir otra sorpresa 🤭🩵"}</p>
      </div>}
    </div>
  );
}
