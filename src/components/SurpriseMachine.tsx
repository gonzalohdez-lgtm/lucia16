import { useState } from "react";
import { Gift, Sparkles, X, Heart } from "lucide-react";

const prizes = [
  { id: "letter1", kind: "Carta", name: "Para cuando necesites recordar lo especial que eres", icon: "💌", detail: "Lucía, a veces puede que no te des cuenta de lo muchísimo que vales. Quiero que recuerdes que eres una persona increíble, que tienes una forma de hacer especiales hasta los momentos más normales y que tu presencia puede cambiarme un día entero. Nunca dudes de lo importante que eres." },
  { id: "letter7", kind: "Carta", name: "Gracias por ser tú", icon: "🩵", detail: "Gracias por tu manera de ser, por tus detalles, por las veces que me has escuchado y por todos esos gestos que quizá para ti son pequeños, pero que yo valoro muchísimo. No quiero que cambies para encajar en nada. Me encanta poder conocerte tal y como eres." },
  { id: "letter9", kind: "Carta", name: "Si hoy ha sido un día difícil", icon: "🌷", detail: "Si has tenido un día complicado, quiero que esta carta te recuerde que no tienes que poder con todo siempre. Puedes tener días malos, equivocarte, cansarte y necesitar desconectar. No tienes que demostrar nada. Mereces tranquilidad, cariño y muchos días bonitos." },
  { id: "photo", kind: "Foto", name: "Un recuerdo nuestro", icon: "📸", detail: "Esta sorpresa guarda una foto muy especial de los dos. 🩵", photo: null },
  { id: "wish", kind: "Vale", name: "Un deseo a elegir", icon: "🎟️", detail: "¡Tienes un deseo a elegir! Puedes pedirme un plan, una actividad o algo especial que te apetezca. La elección es tuya. 🩵" },
];

const STORAGE_KEY = "lucia-day13-machine-v2";

export function SurpriseMachine() {
  const [prize, setPrize] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "grabbing" | "bringing" | "opening" | "revealed">("idle");
  const [opened, setOpened] = useState<string[]>(() => {
    try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [showPrize, setShowPrize] = useState(false);

  const pull = () => {
    if (phase !== "idle" || prize !== null) return;
    const remaining = prizes.map((_, i) => i).filter(i => !opened.includes(prizes[i].id));
    if (!remaining.length) return;
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setPrize(next);
    setShowPrize(false);
    setPhase("grabbing");
    window.setTimeout(() => setPhase("bringing"), 950);
    window.setTimeout(() => setPhase("opening"), 1900);
    window.setTimeout(() => {
      setPhase("revealed");
      setShowPrize(true);
      const updated = [...opened, prizes[next].id];
      setOpened(updated);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    }, 2700);
  };

  const reset = () => { setPrize(null); setPhase("idle"); setShowPrize(false); };
  const current = prize === null ? null : prizes[prize];
  const allDone = opened.length === prizes.length;

  return <section className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-pink-200 bg-gradient-to-b from-rose-50 via-white to-violet-50 p-4 text-center shadow-xl sm:p-7">
    <p className="text-xs font-black tracking-[.3em] text-rose-500">L&G · EDICIÓN ESPECIAL</p>
    <h3 className="mt-2 font-serif text-3xl font-bold text-slate-800">La máquina de las sorpresas</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">El gancho elegirá una cápsula al azar. ¡Cada una esconde algo diferente!</p>

    <div className="relative mx-auto mt-7 max-w-sm rounded-[2rem] border-[7px] border-violet-300 bg-gradient-to-b from-violet-200 to-fuchsia-100 p-3 shadow-[inset_0_5px_15px_rgba(255,255,255,.8),0_12px_25px_rgba(139,92,246,.18)]">
      <div className="rounded-2xl border-4 border-white/80 bg-white/75 p-3">
        <div className="flex items-center justify-center gap-2 text-xs font-black tracking-[.2em] text-violet-600"><Sparkles size={15}/> MAGIC SURPRISES <Sparkles size={15}/></div>

        <div className="claw-machine relative mx-auto mt-3 h-64 overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-sky-50 to-purple-100">
          <div className="absolute inset-x-0 top-0 h-2 bg-white/80" />
          <div className={"claw-rail " + (phase !== "idle" ? "is-moving" : "")} />
          <div className={"claw-arm " + (phase !== "idle" ? "is-active" : "")}>
            <div className="claw-wire" />
            <div className="claw-hook">⌄</div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center gap-2 px-3 pb-3">
            {["#f9a8d4","#c4b5fd","#fcd34d","#a7f3d0","#fda4af","#93c5fd","#d8b4fe"].map((color,i)=><span key={i} className="machine-capsule" style={{background:color, animationDelay:(i*.08)+"s"}}>{["💌","🎟️","📸","🩵","🌷","✨","🎁"][i]}</span>)}
          </div>
          {current && <div className={"picked-capsule " + (phase === "grabbing" ? "is-grabbed" : phase === "bringing" ? "is-center" : phase === "opening" || phase === "revealed" ? "is-opened" : "")}>{current.icon}</div>}
          <div className="absolute bottom-2 left-2 rounded-full bg-white/80 px-2 py-1 text-[9px] font-black tracking-widest text-violet-600">ZONA DE CÁPSULAS</div>
        </div>

        <div className="mx-auto mt-3 h-3 max-w-[220px] rounded-full bg-violet-100 shadow-inner"><div className="h-full w-1/3 rounded-full bg-gradient-to-r from-pink-400 to-violet-400"/></div>
        <div className="mx-auto mt-3 flex max-w-[270px] items-center gap-3 rounded-2xl bg-violet-700 p-3 text-white shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15"><Gift size={25}/></div>
          <div className="min-w-0 flex-1 text-left"><p className="text-[10px] font-bold tracking-widest text-violet-200">SIGUIENTE PREMIO</p><p className="text-sm font-black">{phase === "idle" ? "¿Qué habrá dentro?" : phase === "revealed" ? "¡Sorpresa lista!" : "El gancho está trabajando…"}</p></div>
          <button type="button" onClick={pull} disabled={phase !== "idle" || allDone} className="rounded-xl bg-amber-300 px-4 py-3 text-xs font-black text-violet-950 shadow transition hover:scale-105 disabled:opacity-50">{allDone ? "FIN" : phase === "idle" ? "JUGAR" : "…"}</button>
        </div>
      </div>
    </div>

    <p className="mt-4 text-xs font-semibold text-slate-500">{opened.length} de {prizes.length} sorpresas descubiertas</p>
    {allDone && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">¡Has descubierto todas las sorpresas! 🩵</p>}

    {showPrize && current && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/75 p-4" role="dialog" aria-modal="true" aria-label="Sorpresa abierta">
      <div className="relative w-full max-w-sm animate-in fade-in zoom-in duration-500">
        <button type="button" onClick={reset} aria-label="Cerrar" className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 text-slate-600 shadow"><X size={20}/></button>
        <div className="capsule-paper rounded-3xl border-2 border-amber-200 bg-[#fffdf6] p-6 text-center shadow-2xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-4xl">{current.icon}</div>
          <p className="mt-4 text-[10px] font-black tracking-[.28em] text-rose-500">CÁPSULA DESBLOQUEADA · {current.kind.toUpperCase()}</p>
          <h4 className="mt-2 font-serif text-2xl font-bold text-slate-800">{current.name}</h4>
          {current.id === "photo" ? <div className="mt-4 overflow-hidden rounded-2xl border-4 border-white shadow-lg"><div className="grid aspect-[3/4] place-items-center bg-gradient-to-br from-pink-100 to-violet-100 p-5 text-5xl">📸<p className="mt-3 text-sm font-semibold text-slate-600">Aquí aparecerá la foto que has elegido.</p></div></div> : <p className="mt-4 whitespace-pre-line rounded-2xl bg-rose-50/70 p-5 text-base leading-relaxed text-slate-700">{current.detail}</p>}
          <div className="mt-5 flex items-center justify-center gap-2 text-rose-400"><Heart size={15} fill="currentColor"/><span className="text-xs font-bold tracking-widest">LUCÍA ♥ GONZALO</span><Heart size={15} fill="currentColor"/></div>
          <button type="button" onClick={reset} className="mt-5 w-full rounded-xl bg-violet-700 px-5 py-3 font-bold text-white shadow-lg hover:bg-violet-800">Volver a la máquina</button>
        </div>
      </div>
    </div>}
    <style>{`
      .claw-rail{position:absolute;top:13px;left:50%;width:78%;height:5px;transform:translateX(-50%);border-radius:99px;background:#8b5cf6;box-shadow:0 2px 4px #8b5cf655}
      .claw-arm{position:absolute;z-index:3;top:14px;left:50%;width:34px;height:88px;transform:translateX(-50%);display:flex;align-items:center;flex-direction:column;transition:left .75s cubic-bezier(.2,.8,.2,1)}
      .claw-arm.is-active{left:50%}
      .claw-wire{height:58px;width:3px;background:#7c3aed}
      .claw-hook{font-size:32px;line-height:25px;color:#6d28d9;font-weight:900}
      .machine-capsule{position:relative;z-index:1;display:grid;place-items:center;width:39px;height:49px;border:2px solid #ffffffaa;border-radius:50% 50% 45% 45%;box-shadow:inset -5px -5px 8px #00000012,0 3px 5px #00000012;font-size:19px}
      .picked-capsule{position:absolute;z-index:4;left:50%;bottom:62px;display:grid;place-items:center;width:48px;height:56px;border:3px solid white;border-radius:50%;background:#f9a8d4;font-size:25px;opacity:0;transform:translate(-50%,0) scale(.4);transition:all .65s cubic-bezier(.2,.8,.2,1);box-shadow:0 5px 15px #7c3aed44}
      .picked-capsule.is-grabbed{opacity:1;transform:translate(-50%,-8px) scale(1)}
      .picked-capsule.is-center{left:50%;bottom:48%;transform:translate(-50%,50%) scale(1.45)}
      .picked-capsule.is-opened{left:50%;bottom:48%;transform:translate(-50%,50%) scale(1.8) rotate(18deg);opacity:0}
      .capsule-paper{animation:paper-pop .55s cubic-bezier(.2,.8,.2,1) both}
      @keyframes paper-pop{from{opacity:0;transform:translateY(35px) scale(.82)}to{opacity:1;transform:translateY(0) scale(1)}}
      @media(prefers-reduced-motion:reduce){.claw-arm,.picked-capsule,.capsule-paper{transition:none;animation:none}}
    `}</style>
  </section>;
}
