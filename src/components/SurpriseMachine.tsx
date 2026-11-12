import { useState } from "react";
import { Gift, Sparkles, X } from "lucide-react";

const prizes = [
  { name: "SORPRESA 01", icon: "💌", detail: "Aquí aparecerá tu primera sorpresa." },
  { name: "SORPRESA 02", icon: "🎟️", detail: "Aquí aparecerá tu segunda sorpresa." },
  { name: "SORPRESA 03", icon: "📸", detail: "Aquí aparecerá tu tercera sorpresa." },
  { name: "SORPRESA 04", icon: "🎁", detail: "Aquí aparecerá tu cuarta sorpresa." },
  { name: "SORPRESA 05", icon: "🍿", detail: "Aquí aparecerá tu quinta sorpresa." },
  { name: "SORPRESA 06", icon: "🩵", detail: "Aquí aparecerá tu sexta sorpresa." },
];

export function SurpriseMachine() {
  const [prize, setPrize] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [opened, setOpened] = useState<number[]>([]);
  const pull = () => {
    if (spinning || prize !== null) return;
    setSpinning(true);
    window.setTimeout(() => {
      const remaining = prizes.map((_, i) => i).filter(i => !opened.includes(i));
      if (!remaining.length) { setOpened([]); setPrize(null); setSpinning(false); return; }
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      setPrize(next);
      setSpinning(false);
    }, 1500);
  };
  const reveal = () => {
    if (prize === null) return;
    setOpened(current => [...current, prize]);
  };
  const close = () => setPrize(null);
  const allDone = opened.length === prizes.length;
  return <section className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-pink-200 bg-gradient-to-b from-rose-50 via-white to-violet-50 p-4 text-center shadow-xl sm:p-7">
    <p className="text-xs font-black tracking-[.3em] text-rose-500">L&G · EDICIÓN ESPECIAL</p>
    <h3 className="mt-2 font-serif text-3xl font-bold text-slate-800">La máquina de las sorpresas</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">Nunca sabes qué va a salir… ¡dale al botón y descúbrelo!</p>
    <div className="relative mx-auto mt-7 max-w-sm rounded-[2rem] border-[7px] border-violet-300 bg-gradient-to-b from-violet-200 to-fuchsia-100 p-4 shadow-[inset_0_5px_15px_rgba(255,255,255,.8),0_12px_25px_rgba(139,92,246,.18)]">
      <div className="rounded-2xl border-4 border-white/80 bg-white/80 p-4">
        <div className="flex items-center justify-center gap-2 text-xs font-black tracking-[.25em] text-violet-600"><Sparkles size={15}/> MAGIC SURPRISES <Sparkles size={15}/></div>
        <div className="relative mx-auto mt-4 grid h-44 w-44 place-items-center overflow-hidden rounded-full border-[9px] border-violet-200 bg-gradient-to-br from-pink-100 via-purple-100 to-amber-100 shadow-inner">
          <div className={spinning ? "animate-spin text-7xl" : "text-7xl"}>{spinning ? "✨" : prize === null ? "🎁" : prizes[prize].icon}</div>
          <span className="absolute bottom-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-black tracking-widest text-violet-600">{spinning ? "PREPARANDO…" : prize === null ? "¿QUÉ HABRÁ?" : "¡TU PREMIO!"}</span>
        </div>
        <div className="mx-auto mt-4 h-3 max-w-[220px] rounded-full bg-violet-100 shadow-inner"><div className="h-full w-1/3 rounded-full bg-gradient-to-r from-pink-400 to-violet-400"/></div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_10px_#fb7185]"/>
          <span className="h-3 w-3 rounded-full bg-amber-300"/>
          <span className="h-3 w-3 rounded-full bg-emerald-300"/>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-[270px] items-center gap-3 rounded-2xl bg-violet-700 p-3 text-white shadow-lg">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15"><Gift size={25}/></div>
        <div className="min-w-0 flex-1 text-left"><p className="text-[10px] font-bold tracking-widest text-violet-200">INTÉNTALO</p><p className="text-sm font-black">Tu próxima sorpresa</p></div>
        <button type="button" onClick={pull} disabled={spinning || prize !== null} className="rounded-xl bg-amber-300 px-4 py-3 text-xs font-black text-violet-950 shadow transition hover:scale-105 disabled:opacity-50">{spinning ? "…" : "PULSAR"}</button>
      </div>
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-500">{opened.length} de {prizes.length} sorpresas descubiertas</p>
    {prize !== null && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" aria-label="Sorpresa desbloqueada">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
        <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button>
        <div className="text-6xl">{prizes[prize].icon}</div>
        <p className="mt-4 text-xs font-black tracking-[.25em] text-violet-500">¡SORPRESA DESBLOQUEADA!</p>
        <h4 className="mt-2 font-serif text-2xl font-bold text-slate-800">{prizes[prize].name}</h4>
        <p className="mt-3 text-slate-600">{prizes[prize].detail}</p>
        {!opened.includes(prize) ? <button type="button" onClick={reveal} className="mt-6 w-full rounded-xl bg-violet-700 px-5 py-3 font-bold text-white shadow-lg hover:bg-violet-800">Abrir sorpresa</button> : <p className="mt-6 text-sm font-bold text-emerald-600">Ya has descubierto esta sorpresa.</p>}
        <button type="button" onClick={close} className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">Volver a la máquina</button>
      </div>
    </div>}
    {allDone && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">¡Has descubierto todas las sorpresas! 🩵</p>}
  </section>;
}
