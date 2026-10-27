import { useState } from "react";

export function SecretSafe({ code, message }: { code: string; message: string }) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);
  const add = (v: string) => { if (v === "C") { setInput(""); setWrong(false); } else if (v === "⌫") { setInput(s => s.slice(0, -1)); setWrong(false); } else if (input.length < 4) { setInput(s => s + v); setWrong(false); } };
  const open = () => { if (input === code) { setUnlocked(true); setWrong(false); } else setWrong(true); };
  if (unlocked) return <div className="rounded-3xl border-2 border-green-500 bg-green-500/10 p-5 animate-in fade-in text-center"><div className="text-6xl">🔓💚</div><p className="mt-3 font-bold text-green-700">¡Caja fuerte abierta!</p><p className="mt-5 whitespace-pre-line text-left text-lg leading-relaxed">{message}</p><p className="mt-4 text-2xl">🩵</p></div>;
  return <div className="mx-auto max-w-sm rounded-3xl border border-border bg-secondary/40 p-5 text-center">
    <div className="text-6xl">🔐</div><p className="mt-3 font-serif text-xl">Introduce el código secreto</p><p className="mt-1 text-sm text-muted-foreground">Son cuatro cifras 😉</p>
    <div className={`mx-auto mt-5 flex h-14 max-w-[230px] items-center justify-center rounded-xl border-2 bg-background text-2xl font-bold tracking-[0.5em] ${wrong ? "border-red-500 text-red-600" : input.length === 4 ? "border-green-500 text-green-600" : "border-border"}`}>{Array.from({length:4},(_,i)=><span key={i}>{input[i] ? "●" : "○"}</span>)}</div>
    {wrong && <p className="mt-2 text-sm font-semibold text-red-600">Código incorrecto. ¡Prueba otra vez! 🔴</p>}
    <div className="mx-auto mt-5 grid max-w-[260px] grid-cols-3 gap-2">{["1","2","3","4","5","6","7","8","9","⌫","0","C"].map(k=><button key={k} type="button" onClick={()=>add(k)} className="grid h-12 place-items-center rounded-xl border border-border bg-background text-lg font-semibold hover:bg-secondary active:scale-95">{k}</button>)}</div>
    <button type="button" onClick={open} disabled={input.length!==4} className="mt-4 rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-40">Abrir caja fuerte</button>
  </div>;
}
