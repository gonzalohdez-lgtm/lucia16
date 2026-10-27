import { useMemo, useState } from "react";
import { photos } from "@/lib/media";

const pairs = [
  { id: "foto1", src: photos.p01, date: "27 de febrero" },
  { id: "foto2", src: photos.p03, date: "14 de marzo" },
  { id: "foto3", src: photos.p05, date: "4 de abril" },
  { id: "foto4", src: photos.p07, date: "4 de junio" },
];

export function PhotoDates() {
  const dates = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), []);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, "correct" | "wrong">>({});
  const [wrongDate, setWrongDate] = useState<string | null>(null);
  const won = pairs.every((p) => results[p.id] === "correct");

  const choosePhoto = (id: string) => {
    if (results[id] === "correct") return;
    setSelectedPhoto(id);
    setWrongDate(null);
  };

  const chooseDate = (date: string) => {
    if (!selectedPhoto || results[selectedPhoto] === "correct") return;
    const pair = pairs.find((p) => p.id === selectedPhoto);
    if (!pair) return;
    if (pair.date === date) {
      setResults((prev) => ({ ...prev, [selectedPhoto]: "correct" }));
      setSelectedPhoto(null);
      setWrongDate(null);
    } else {
      setResults((prev) => ({ ...prev, [selectedPhoto]: "wrong" }));
      setWrongDate(date);
      window.setTimeout(() => {
        setResults((prev) => {
          const next = { ...prev };
          if (next[selectedPhoto] === "wrong") delete next[selectedPhoto];
          return next;
        });
        setWrongDate(null);
        setSelectedPhoto(null);
      }, 850);
    }
    setSelectedDate(date);
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">Elige una foto y después la fecha que le corresponde 🩵</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pairs.map((p, i) => {
          const state = results[p.id];
          return <button key={p.id} type="button" onClick={() => choosePhoto(p.id)} disabled={state === "correct" || won}
            className={`overflow-hidden rounded-2xl border-2 text-left transition ${state === "correct" ? "border-emerald-500 bg-emerald-500/15" : state === "wrong" ? "border-red-500 bg-red-500/15" : selectedPhoto === p.id ? "border-primary ring-2 ring-primary/30" : "border-border bg-card"}`}>
            <img src={p.src} alt={`Foto ${i + 1}`} className="aspect-square w-full object-cover" />
            <span className="block p-2 text-center text-sm font-medium">{state === "correct" ? "¡Correcta! ✓" : `Foto ${i + 1}`}</span>
          </button>;
        })}
      </div>
      <p className="text-center text-sm font-medium">Ahora elige una fecha:</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {dates.map((d) => {
          const matched = pairs.find((p) => p.date === d.date);
          const done = matched && results[matched.id] === "correct";
          const wrong = selectedDate === d.date && wrongDate === d.date;
          return <button key={d.date} type="button" onClick={() => chooseDate(d.date)} disabled={!selectedPhoto || !!done || won}
            className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition ${done ? "border-emerald-500 bg-emerald-500/15 text-emerald-700" : wrong ? "border-red-500 bg-red-500/15 text-red-700" : "border-border bg-card hover:bg-secondary"}`}>
            {d.date}{done ? " ✓" : ""}
          </button>;
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground">Parejas acertadas: {Object.values(results).filter((v) => v === "correct").length}/4</p>
      {won && <div className="animate-in zoom-in rounded-2xl border border-emerald-500 bg-emerald-500/10 p-5 text-center text-xl font-semibold text-emerald-700">Enhorabuena, has ganado.</div>}
    </div>
  );
}
