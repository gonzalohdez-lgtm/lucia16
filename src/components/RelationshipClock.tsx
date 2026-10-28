import { useEffect, useState } from "react";

const START = new Date(2026, 2, 13, 21, 27, 0).getTime();
const HEARTBEATS_PER_MINUTE = 90;
const MEALS_TOGETHER = 150;

function getElapsed(now: number) {
  let remaining = Math.max(0, now - START);
  const totalSeconds = Math.floor(remaining / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const startDate = new Date(START);
  const endDate = new Date(now);
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += previousMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years, months, days,
    hours: Math.floor(remaining / 3_600_000) % 24,
    minutes: Math.floor(remaining / 60_000) % 60,
    seconds: totalSeconds % 60,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    heartbeats: Math.floor(totalMinutes * HEARTBEATS_PER_MINUTE),
  };
}

const units = [
  { key: "years", label: "AÑOS" },
  { key: "months", label: "MESES" },
  { key: "days", label: "DÍAS" },
  { key: "hours", label: "HORAS" },
  { key: "minutes", label: "MINUTOS" },
  { key: "seconds", label: "SEGUNDOS" },
] as const;

export function RelationshipClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const elapsed = getElapsed(now);
  const cards = [
    { label: "DÍAS JUNTOS", value: elapsed.totalDays.toLocaleString("es-ES"), icon: "🗓️" },
    { label: "HORAS VIVIDAS", value: elapsed.totalHours.toLocaleString("es-ES"), icon: "⏳" },
    { label: "MINUTOS JUNTOS", value: elapsed.totalMinutes.toLocaleString("es-ES"), icon: "⌛" },
    { label: "LATIDOS ESTIMADOS", value: elapsed.heartbeats.toLocaleString("es-ES"), icon: "💓" },
    { label: "COMIDAS JUNTOS", value: MEALS_TOGETHER.toLocaleString("es-ES") + "+", icon: "🍝" },
    { label: "SEGUNDOS JUNTOS", value: elapsed.totalSeconds.toLocaleString("es-ES"), icon: "✨" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950 p-5 text-white shadow-xl sm:p-7">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Lucía ♥ Gonzalo</p>
          <h3 className="mt-3 font-serif text-2xl sm:text-3xl">Nuestro tiempo juntos</h3>
          <p className="mt-2 text-sm text-slate-300">Desde el 13 de marzo de 2026 · 21:27</p>
          <div className="my-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {units.map(({ key, label }) => (
              <div key={key} className="rounded-xl border border-cyan-300/20 bg-white/5 px-2 py-3">
                <div className="font-mono text-2xl font-bold tabular-nums text-cyan-200 sm:text-3xl">{String(elapsed[key]).padStart(2, "0")}</div>
                <div className="mt-1 text-[9px] tracking-wider text-slate-300 sm:text-[10px]">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">El contador se actualiza cada segundo, en tiempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
            <div className="text-2xl">{card.icon}</div>
            <div className="mt-2 break-words text-xl font-bold tabular-nums sm:text-2xl">{card.value}</div>
            <div className="mt-1 text-[10px] font-semibold tracking-wider text-muted-foreground">{card.label}</div>
          </div>
        ))}
      </div>
      <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
        Los latidos son una estimación usando una media de 90 por minuto. Las comidas son una cifra aproximada que hemos puesto de recuerdo 🩵
      </p>
    </div>
  );
}
