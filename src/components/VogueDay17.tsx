// @ts-nocheck
import { useState } from "react";
import { photos } from "@/lib/media";

const pages = [
  { type: "cover", kicker: "EDICIÓN ESPECIAL · DICIEMBRE 2026", title: "THE LOVE ISSUE", subtitle: "UNA HISTORIA, DOS PROTAGONISTAS", image: photos.p04 },
  { type: "contents", kicker: "EN ESTE NÚMERO", title: "El índice", items: ["La historia que lo empezó todo", "Un diario en fotografías", "La entrevista exclusiva", "The Love Awards", "La última página"] },
  { type: "story", kicker: "THE COVER STORY", title: "Todo empezó un 13 de marzo", date: "13 MARZO 2026", text: "Hay fechas que se quedan guardadas para siempre. La vuestra empezó el 13 de marzo de 2026: el día en que empezasteis a salir. Una fecha que convirtió una historia en algo que seguir construyendo, recuerdo a recuerdo.", image: photos.p02, quote: "El comienzo de todos los capítulos que todavía quedan por escribir." },
  { type: "gallery", kicker: "PHOTO DIARY", title: "Instantes que lo dicen todo", images: [photos.p01, photos.p03, photos.p05, photos.p06, photos.p07, photos.p08, photos.p09, photos.p10] },
  { type: "interview", kicker: "THE EXCLUSIVE INTERVIEW", title: "Dos protagonistas, muchas versiones", questions: [
    ["¿Quién tarda más en arreglarse?", "Lucía. La redacción ha comprobado que no se le puede meter prisa."],
    ["¿Quién tiene siempre razón?", "Lucía. Al menos, eso dice ella."],
    ["¿Quién tiene más hambre?", "Gonzalo. La sección de gastronomía confirma que no hay debate."],
    ["¿Quién es más cabezota?", "Empate. No se ha podido demostrar quien lo es más."],
    ["¿Quién tiene más sueño?", "Empate. La entrevista se realizó después de una larga siesta."],
  ] },
  { type: "awards", kicker: "THE LOVE AWARDS", title: "Y los premios son para…", awards: [
    ["EL RELOJ DE LA PACIENCIA", "LUCÍA", "Por tomarse su tiempo antes de salir."],
    ["EL PREMIO GASTRONÓMICO", "GONZALO", "Por poder comerse lo de ambos."],
    ["EL PREMIO A LA CONSTANCIA", "AMBOS", "Por compartir el título de más cabezotas."],
    ["EL PREMIO AL VEREDICTO FINAL", "LUCÍA", "Porque aquí ya sabemos quién tiene razón."],
  ] },
  { type: "back", kicker: "FIN DEL NÚMERO · DICIEMBRE 2026", title: "La historia continúa", text: "Algunas historias no necesitan filtros. Solo necesitan seguir escribiéndose.", image: photos.p18 },
];

export function VogueDay17() {
  const [page, setPage] = useState(0);
  const current = pages[page];
  const go = (next: number) => setPage(Math.max(0, Math.min(pages.length - 1, next)));
  return (
    <section className="w-full overflow-hidden bg-[#eee9df] text-[#171717] shadow-2xl">
      <div className="flex items-center justify-between border-b border-black/15 px-4 py-3 text-[9px] font-semibold tracking-[.22em] sm:px-7">
        <span>VOGUE · L&G</span><span>DICIEMBRE 2026</span><span>{String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</span>
      </div>
      <div className="min-h-[620px] sm:min-h-[690px]">
        {current.type === "cover" && <div className="relative min-h-[620px] overflow-hidden bg-[#d8d1c5] sm:min-h-[690px]">
          <img src={current.image} alt="Fotografía de portada del álbum" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60" />
          <div className="relative flex min-h-[620px] flex-col items-center px-4 pb-8 pt-5 text-center text-white sm:min-h-[690px] sm:pt-7">
            <h3 className="font-serif text-[clamp(4.5rem,17vw,9.5rem)] font-black leading-[.78] tracking-[-.09em] drop-shadow-lg">VOGUE</h3>
            <p className="mt-5 text-[10px] font-semibold tracking-[.38em] sm:text-xs">{current.kicker}</p>
            <div className="mt-auto w-full pb-8">
              <p className="font-serif text-4xl italic sm:text-6xl">{current.title}</p>
              <p className="mt-4 text-[10px] font-bold tracking-[.3em] sm:text-xs">{current.subtitle}</p>
              <div className="mt-7 flex justify-center gap-3 text-[9px] font-semibold tracking-[.2em]"><span>GONZALO & LUCÍA</span><span>✦</span><span>13.03.2026</span></div>
            </div>
          </div>
        </div>}
        {current.type === "contents" && <div className="p-7 sm:p-12">
          <p className="text-[10px] font-bold tracking-[.3em]">{current.kicker}</p><h3 className="mt-5 font-serif text-6xl italic sm:text-7xl">{current.title}</h3>
          <div className="mt-12 border-t border-black/30">{current.items.map((item, i) => <button key={item} onClick={() => go(i + 2)} className="flex w-full items-baseline gap-4 border-b border-black/20 py-5 text-left transition hover:px-2"><span className="font-serif text-2xl italic text-[#9b2828]">0{i + 1}</span><span className="flex-1 font-serif text-xl sm:text-2xl">{item}</span><span className="text-xs tracking-widest">→</span></button>)}</div>
          <p className="mt-10 max-w-md font-serif text-lg italic text-black/60">Una edición para guardar, releer y recordar.</p>
        </div>}
        {current.type === "story" && <div className="grid min-h-[620px] md:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-12"><p className="text-[10px] font-bold tracking-[.3em]">{current.kicker}</p><h3 className="mt-6 font-serif text-5xl leading-[.98] sm:text-6xl">{current.title}</h3><p className="mt-5 text-[10px] font-bold tracking-[.25em] text-[#9b2828]">{current.date}</p><p className="mt-7 font-serif text-lg leading-relaxed text-black/75">{current.text}</p><p className="mt-8 border-l-2 border-[#9b2828] pl-4 font-serif text-2xl italic">{current.quote}</p></div>
          <img src={current.image} alt="Recuerdo del álbum" className="h-full min-h-[300px] max-h-[620px] w-full object-cover" />
        </div>}
        {current.type === "gallery" && <div className="p-5 sm:p-9"><p className="text-[10px] font-bold tracking-[.3em]">{current.kicker}</p><h3 className="mt-4 font-serif text-5xl italic sm:text-6xl">{current.title}</h3><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{current.images.map((src, i) => <figure key={i} className={i === 0 || i === 5 ? "col-span-2" : ""}><img src={src} alt={`Fotografía del álbum ${i + 1}`} className={`w-full object-cover ${i === 0 || i === 5 ? "h-64 sm:h-72" : "h-40 sm:h-52"}`} /><figcaption className="pt-2 text-[9px] tracking-[.18em] text-black/55">{["FIG. 01 · NUESTROS PRIMEROS DÍAS", "FIG. 02 · EL DÍA MÁS IMPORTANTE", "FIG. 03 · DE LAS MÁS BONITAS", "FIG. 04 · FERIAAA", "FIG. 05 · FOTÓN", "FIG. 06 · FOTÓN X2", "FIG. 07 · QUE BONITOS SON", "FIG. 08 · DE COMPRAS"][i]}</figcaption></figure>)}</div></div>}
        {current.type === "interview" && <div className="p-7 sm:p-12"><p className="text-[10px] font-bold tracking-[.3em]">{current.kicker}</p><h3 className="mt-5 max-w-2xl font-serif text-5xl leading-none sm:text-6xl">{current.title}</h3><p className="mt-4 font-serif text-lg italic text-black/60">La redacción pregunta. Las estadísticas de la pareja responden.</p><div className="mt-8 space-y-0 border-t border-black/25">{current.questions.map(([q, a], i) => <div key={q} className="grid gap-2 border-b border-black/20 py-5 sm:grid-cols-[1fr_1.2fr] sm:gap-8"><p className="font-serif text-xl italic"><span className="mr-2 text-sm text-[#9b2828]">0{i + 1}</span>{q}</p><p className="text-sm leading-relaxed text-black/70">{a}</p></div>)}</div></div>}
        {current.type === "awards" && <div className="p-7 sm:p-12"><p className="text-[10px] font-bold tracking-[.3em]">{current.kicker}</p><h3 className="mt-5 font-serif text-5xl italic sm:text-6xl">{current.title}</h3><div className="mt-8 grid gap-4 sm:grid-cols-2">{current.awards.map(([name, winner, detail], i) => <div key={name} className="border border-black/20 bg-white/35 p-5 text-center"><p className="font-serif text-3xl text-[#9b2828]">✦</p><p className="mt-3 text-[9px] font-bold tracking-[.22em]">{name}</p><p className="mt-3 font-serif text-3xl">{winner}</p><p className="mt-2 text-xs leading-relaxed text-black/60">{detail}</p><p className="mt-4 text-[8px] tracking-[.2em]">VOGUE AWARDS · 2026</p></div>)}</div></div>}
        {current.type === "back" && <div className="relative flex min-h-[620px] items-end overflow-hidden sm:min-h-[690px]"><img src={current.image} alt="Fotografía de contraportada" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><div className="relative w-full p-8 text-center text-white sm:p-14"><p className="text-[9px] font-bold tracking-[.3em]">{current.kicker}</p><h3 className="mt-5 font-serif text-5xl italic sm:text-7xl">{current.title}</h3><p className="mx-auto mt-5 max-w-lg font-serif text-xl leading-relaxed sm:text-2xl">«{current.text}»</p><p className="mt-9 text-[9px] font-bold tracking-[.35em]">GONZALO & LUCÍA · 2026</p></div></div>}
      </div>
      <footer className="flex items-center justify-between border-t border-black/15 bg-[#e4ded3] px-4 py-4 sm:px-7">
        <button onClick={() => go(page - 1)} disabled={page === 0} className="px-3 py-2 text-[10px] font-bold tracking-[.2em] disabled:opacity-25">← ANTERIOR</button>
        <div className="flex gap-1.5">{pages.map((_, i) => <button key={i} onClick={() => go(i)} aria-label={`Ir a la página ${i + 1}`} className={`h-1.5 w-1.5 rounded-full ${page === i ? "bg-[#9b2828]" : "bg-black/20"}`} />)}</div>
        <button onClick={() => go(page + 1)} disabled={page === pages.length - 1} className="px-3 py-2 text-[10px] font-bold tracking-[.2em] disabled:opacity-25">SIGUIENTE →</button>
      </footer>
    </section>
  );
}
