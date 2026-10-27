import { useEffect, useState } from "react";

const questions = [
  "¿Cómo nos ves a nosotros en 10 años?",
  "¿A qué país te apetece más viajar conmigo?",
  "¿Crees realmente que duraremos para siempre?",
  "¿Quieres casarte? Si es así, ¿cómo te gustaría que fuera tu boda?",
  "¿A qué edad te gustaría tener tu primer hijo o hija?",
];
const myAnswers = [
  "Nos veo viviendo juntos, muy enamorados y muy felices, al poder vernos todos los días, no como hoy en día.",
  "Me encantaría viajar contigo a París porque, aparte de que es la ciudad del amor, es la ilusión que te haría viajar conmigo a París para ir, por ejemplo, a la Torre Eiffel o a Disney.",
  "Si digo la verdad, sí. Es decir, tiene que ser de verdad una relación estable que se base en la confianza. Es verdad que puede haber altos y bajos, pero si los dos quieren, los dos están muy enamorados y ponen de su parte para ello, sí, creo que se puede lograr.",
  "Sí, sí me quiero casar contigo, y me gustaría que sea una boda temática: que haya cosas que nos gusten a los dos y que no sea el estilo tradicional de una boda, que sea algo innovador. Por ejemplo, que entremos los dos juntos al altar, algo que no se suele hacer, o ir vestidos como nos dé la gana, o que el catering sea la comida que a nosotros nos guste, como por ejemplo el McDonald's.",
  "A mí me gustaría tener mi primer hijo sobre los 27-28 años. Creo que es una buena edad para criar a un hijo y darle unos buenos valores, eso sí, si la economía lo permite.",
];

export function CoupleQuestions() {
  const key = "lucia-day8-couple-answers";
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5 && parsed.every((v) => typeof v === "string")) {
          setAnswers(parsed);
          const empty = parsed.findIndex((v) => !v.trim());
          if (empty === -1) setFinished(true);
          else setStep(empty);
        }
      }
    } catch {}
  }, []);

  function update(value: string) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }

  function next() {
    if (!answers[step].trim()) return;
    if (step === 4) {
      try { localStorage.setItem(key, JSON.stringify(answers)); } catch {}
      setFinished(true);
    } else setStep(step + 1);
  }

  function reset() {
    const empty = ["", "", "", "", ""];
    setAnswers(empty); setStep(0); setFinished(false);
    try { localStorage.removeItem(key); } catch {}
  }

  const button = "rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40";
  if (finished) return <div className="space-y-5">
    <div className="text-center"><div className="text-4xl">💗💌💗</div><h3 className="mt-2 font-serif text-2xl">Nuestras respuestas</h3><p className="mt-2 text-sm text-muted-foreground">¡Ahora comparemos lo que pensamos! 🩵</p></div>
    {questions.map((q, i) => <section key={q} className="rounded-2xl border border-border p-4">
      <h4 className="mb-3 font-serif text-lg">{i + 1}. {q}</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-secondary/70 p-3"><p className="mb-2 text-xs font-bold uppercase text-muted-foreground">💗 Lucía</p><p className="whitespace-pre-line text-sm leading-relaxed">{answers[i]}</p></div>
        <div className="rounded-xl border border-primary/30 p-3"><p className="mb-2 text-xs font-bold uppercase text-muted-foreground">🩵 Gonzalo</p><p className="whitespace-pre-line text-sm leading-relaxed">{myAnswers[i]}</p></div>
      </div>
    </section>)}
    <p className="text-center text-sm text-muted-foreground">Gracias por responder con el corazón 🩵</p>
    <div className="text-center"><button className={button} onClick={reset}>Volver a responder</button></div>
  </div>;

  return <div className="space-y-4">
    <p className="text-center text-sm text-muted-foreground">Cinco preguntas sobre nosotros y nuestro futuro. Contesta con sinceridad 💗</p>
    <div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: ((step + 1) / 5 * 100) + "%" }} /></div>
    <p className="text-xs uppercase tracking-widest text-muted-foreground">Pregunta {step + 1} de 5</p>
    <div className="rounded-3xl border border-border bg-gradient-to-b from-secondary/60 to-background p-5">
      <h3 className="font-serif text-xl leading-snug">{questions[step]}</h3>
      <textarea value={answers[step]} onChange={(e) => update(e.target.value)} placeholder="Escribe aquí lo que piensas…" rows={5} className="mt-4 w-full resize-y rounded-2xl border border-border bg-background p-4 text-base outline-none focus:ring-2 focus:ring-ring" />
      <div className="mt-4 flex items-center justify-between gap-3">
        <button className={button} disabled={step === 0} onClick={() => setStep(step - 1)}>← Anterior</button>
        <button className={button} disabled={!answers[step].trim()} onClick={next}>{step === 4 ? "Ver nuestras respuestas 💗" : "Siguiente →"}</button>
      </div>
    </div>
    <p className="text-center text-xs text-muted-foreground">Las respuestas se guardan en este dispositivo. Las de Gonzalo no aparecerán hasta que termines las cinco.</p>
  </div>;
}
