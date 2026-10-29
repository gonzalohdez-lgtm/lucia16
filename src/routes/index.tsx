import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { days, dayIcons } from "@/lib/days";
import { isDayOpen, DAY_UNLOCK_MODE, areDaysUnlocked, markDaysUnlocked, checkPassword } from "@/lib/secret";
import { DayContent } from "@/components/DayContent";
import { RiverScene } from "@/components/RiverScene";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calendario de adviento para Lucía 🩵" },
      { name: "description", content: "Una casilla cada día hasta el 21 de diciembre, el cumpleaños de Lucía." },
      { property: "og:title", content: "Calendario de adviento para Lucía 🩵" },
      { property: "og:description", content: "Una casilla cada día hasta el 21 de diciembre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Advent,
});

function Advent() {
  const [selected, setSelected] = useState<number | null>(null);
  const [river, setRiver] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [askFor, setAskFor] = useState<number | null>(null);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [locked, setLocked] = useState<number | null>(null);

  useEffect(() => {
    setNow(new Date());
    setPreview(areDaysUnlocked());
  }, []);

  const closeRiver = useCallback(() => setRiver(false), []);
  const isAvailable = (i: number) =>
    DAY_UNLOCK_MODE === "password" ? preview : !!(now && isDayOpen(i + 1, now));
  const open = (i: number) => {
    if (isAvailable(i)) setSelected(i);
    else if (DAY_UNLOCK_MODE === "password") { setPass(""); setPassError(false); setAskFor(i); }
    else setLocked(i);
  };
  const submitPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(pass)) {
      markDaysUnlocked(); setPreview(true); setSelected(askFor); setAskFor(null);
    } else setPassError(true);
  };

  return (
    <main className="relative min-h-screen bg-background px-5 py-14 text-foreground">
      <button type="button" onClick={() => setNoteOpen(v => !v)} aria-expanded={noteOpen} className="fixed right-4 top-4 z-40 rounded-bl-2xl rounded-br-2xl rounded-tl-2xl border border-pink-200 bg-pink-100 px-4 py-3 text-sm font-medium text-rose-700 shadow-md transition hover:-translate-y-0.5 hover:bg-pink-200 sm:right-6 sm:top-6">💌 Nota secreta</button>
      {noteOpen && <div role="status" className="fixed right-4 top-16 z-40 w-[min(300px,calc(100vw-2rem))] rounded-2xl border border-pink-200 bg-white p-5 text-center text-rose-700 shadow-xl sm:right-6 sm:top-20"><button type="button" aria-label="Cerrar nota" onClick={() => setNoteOpen(false)} className="absolute right-3 top-2 text-lg text-rose-400 hover:text-rose-700">×</button><p className="pt-2 font-serif text-xl">pd: te quiero muchisimo 🩵</p></div>}
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-muted-foreground">21 · 12 · 2026</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">Tienes que entrar aquí 1 vez al día hasta el día 21 de diciembre</h1>
        <p className="mt-4 text-muted-foreground">Para Lucía. Cada día se abre una casilla nueva 🩵</p>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7">
          {days.map((d, i) => {
            const available = isAvailable(i);
            return (
              <button key={i} onClick={() => open(i)}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-border font-serif text-3xl shadow-sm transition hover:-translate-y-1 ${i === 20 ? "bg-accent" : "bg-card"} ${available ? "hover:bg-secondary" : "opacity-60"}`}>
                {i + 1}
                <span className="text-base">{available ? dayIcons[d.type] : "🔒"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {locked !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setLocked(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-5xl">🔒</p>
            <p className="mt-4 text-lg">Esta casilla se abre el {locked + 1} de diciembre.</p>
            <p className="mt-1 text-sm text-muted-foreground">Un poquito de paciencia 🩵</p>
            <button onClick={() => setLocked(null)} className="pill-button mt-6 border border-border">Vale</button>
          </div>
        </div>
      )}

      {askFor !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setAskFor(null)}>
          <form onSubmit={submitPass} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-5xl">🔒</p>
            <p className="text-lg">Día {askFor + 1}: hace falta la contraseña.</p>
            <input autoFocus type="password" value={pass} onChange={(e) => { setPass(e.target.value); setPassError(false); }} placeholder="Contraseña" className="w-full rounded-full border border-border bg-background px-5 py-3 outline-none focus:ring-2 focus:ring-ring" />
            {passError && <p className="text-sm text-destructive">Esa no es… prueba otra vez 🩵</p>}
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => setAskFor(null)} className="pill-button border border-border">Cancelar</button>
              <button type="submit" className="pill-button pill-dark">Entrar</button>
            </div>
          </form>
        </div>
      )}

      {selected !== null && days[selected]?.type === "racing" && (
        <section role="dialog" aria-modal="true" aria-label="Día 4: Lucía ♥ Gonzalo Racing" className="fixed inset-0 z-50 flex flex-col bg-background">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-2">
            <p className="text-sm font-medium">Día 4 · 🏎️ Lucía ♥ Gonzalo</p>
            <Button variant="outline" size="icon" aria-label="Cerrar juego" title="Cerrar juego" onClick={() => setSelected(null)}><X /></Button>
          </header>
          <iframe src={days[selected].type === "racing" ? days[selected].url : undefined} title="Lucía ♥ Gonzalo Racing" allow="autoplay; fullscreen; gamepad" allowFullScreen className="min-h-0 w-full flex-1 border-0" />
        </section>
      )}

      {selected !== null && days[selected]?.type !== "racing" && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4" onClick={() => setSelected(null)}>
          <div className="my-6 w-full max-w-md rounded-3xl bg-card p-6 shadow-xl md:p-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Día {selected + 1}</p>
            <div className="mt-3">
              {days[selected] && <DayContent key={selected} day={days[selected]} onLastSurprise={() => { setSelected(null); setRiver(true); }} />}
            </div>
            <button onClick={() => setSelected(null)} className="pill-button mt-6 border border-border">Cerrar</button>
          </div>
        </div>
      )}

      <RiverScene open={river} onClose={closeRiver} />
    </main>
  );
}
