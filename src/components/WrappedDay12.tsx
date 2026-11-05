import { useState } from "react";
// @ts-nocheck
import { photos, stickerPhotos } from "@/lib/media";

const slides = [
  { kicker: "TU HISTORIA EN DATOS", title: "LUCÍA & GONZALO", big: "WRAPPED", sub: "13 MAR 2026 — 05 NOV 2026", color: "from-[#ff4d8d] via-[#9b3cff] to-[#26145c]" },
  { kicker: "VUESTRO TIEMPO", title: "237 días", big: "JUNTOS", sub: "Y todavía quedan muchísimos recuerdos por crear.", color: "from-[#ff7b54] via-[#e83e8c] to-[#6e2cff]" },
  { kicker: "ESTADÍSTICAS DEL AÑO", title: "Esto es lo vuestro", stats: [["120","FOTOS JUNTOS"],["60","COMIDAS"],["1","VIAJE"],["20 + 1","PELÍCULAS + SERIE"],["480 h","DE LLAMADAS"]], color: "from-[#00b8a9] via-[#007bff] to-[#291b73]" },
  { kicker: "TOP MOMENTOS", title: "Momentos que se quedan", moments: ["El día que te pedí salir","El día de las flores","Nuestro viaje juntos","La sorpresa de mi cumpleaños en tu casa","El día que fuimos juntos a ver al Sevilla FC"], color: "from-[#ffb000] via-[#ff5b45] to-[#b51e70]" },
  { kicker: "EL PRIMER RECUERDO", title: "El día que te pedí salir", image: stickerPhotos[12], sub: "Un día que lo cambió todo.", color: "from-[#ff4d8d] to-[#5b1ca8]" },
  { kicker: "UN DETALLE ESPECIAL", title: "El día de las flores", image: stickerPhotos[2], sub: "Hay detalles que se quedan para siempre.", color: "from-[#ff8c42] to-[#a51d88]" },
  { kicker: "MÁS RECUERDOS", title: "Vuestra galería", gallery: [photos.p01, photos.p03, photos.p04, photos.p05], sub: "Pequeños momentos que también forman parte de vuestra historia.", color: "from-[#ff4d8d] via-[#9b3cff] to-[#26145c]" },
  { kicker: "LUGARES CON HISTORIA", title: "Vuestros sitios", places: ["Casa del padre de Lucía","McDonald’s","Casa de los abuelos de Lucía","Casa de Gonzalo","Nervión Plaza"], color: "from-[#00c2a8] to-[#1455b8]" },
  { kicker: "LA BANDA SONORA", title: "Una canción especial", big: "LUGAR SEGURO", sub: "Jay Wheeler · Vuestra canción más especial", songs: ["Buenas Noches — Quevedo","Respuesta Cero — Quevedo","Piel de Cordero — Quevedo, La Pantera","TUCHAT — Quevedo"], color: "from-[#24c6dc] via-[#514a9d] to-[#24145e]" },
  { kicker: "FRASES ICÓNICAS", title: "Las de siempre", phrases: ["te amo","te echo de menos","quiero verte","buenos días","tengo sueño"], color: "from-[#f857a6] to-[#6b1b9a]" },
  { kicker: "ESTADÍSTICAS NO OFICIALES", title: "La ciencia lo confirma", funny: [["MÁS SUEÑO","EMPATE"],["MÁS HAMBRE","GONZALO"],["TARDA MÁS EN ARREGLARSE","LUCÍA"],["MÁS CABEZOTA","EMPATE"],["QUIÉN TIENE SIEMPRE RAZÓN","LUCÍA, CLARO"]], color: "from-[#f7971e] to-[#e73827]" },
  { kicker: "VUESTRO INFINITO", title: "Hay cosas que no se cuentan", stats: [["∞","ABRAZOS"],["∞","BESOS"],["∞","TE AMO"]], color: "from-[#7928ca] via-[#ff0080] to-[#ff8c00]" },
  { kicker: "FIN DEL RESUMEN", title: "Y esto solo es el principio", big: "L + G", sub: "Gracias por cada recuerdo. Lo mejor todavía está por venir. 🩵", color: "from-[#00b09b] via-[#4e54c8] to-[#24145e]" },
];

export function WrappedDay12() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const next = () => setIndex(v => Math.min(slides.length - 1, v + 1));
  const prev = () => setIndex(v => Math.max(0, v - 1));
  return <section className="w-full overflow-hidden rounded-[2rem] bg-[#09090f] text-white shadow-2xl">
    <div className="flex gap-1 px-4 pt-4" aria-label="Progreso">
      {slides.map((_, i) => <button key={i} onClick={() => setIndex(i)} aria-label={`Ir a la pantalla ${i+1}`} className={`h-1.5 flex-1 rounded-full transition ${i <= index ? "bg-white" : "bg-white/25"}`} />)}
    </div>
    <div className={`relative flex min-h-[590px] flex-col justify-between overflow-hidden bg-gradient-to-br ${slide.color} p-6 sm:min-h-[650px] sm:p-9`}>
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full border-[36px] border-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full border-[42px] border-white/10" />
      <header className="relative flex items-center justify-between text-[10px] font-black tracking-[.25em]"><span>L&G · 2026</span><span>{String(index+1).padStart(2,"0")} / {slides.length}</span></header>
      <div className="relative z-10 py-8">
        <p className="mb-4 text-xs font-black tracking-[.25em] opacity-80">{slide.kicker}</p>
        <h3 className="text-4xl font-black leading-[.95] tracking-tight sm:text-6xl">{slide.title}</h3>
        {slide.big && <p className="mt-5 break-words text-5xl font-black leading-none tracking-tight sm:text-7xl">{slide.big}</p>}
        {slide.sub && <p className="mt-5 max-w-sm text-lg font-semibold leading-snug opacity-90">{slide.sub}</p>}
        {slide.image && <img src={slide.image} alt="Recuerdo de vuestro álbum" className="mt-7 max-h-72 w-full rounded-3xl border-4 border-white/30 object-cover shadow-2xl" />}
        {slide.stats && <div className="mt-7 grid grid-cols-2 gap-3">{slide.stats.map(([n,l])=><div key={l} className="rounded-2xl bg-black/20 p-4 backdrop-blur-sm"><p className="text-4xl font-black">{n}</p><p className="mt-1 text-[10px] font-black tracking-widest">{l}</p></div>)}</div>}
        {slide.moments && <ol className="mt-7 space-y-3">{slide.moments.map((v,i)=><li key={v} className="flex items-start gap-3 rounded-2xl bg-black/20 p-3"><b className="text-2xl">{i+1}</b><span className="pt-1 text-sm font-bold">{v}</span></li>)}</ol>}
        {slide.gallery && <div className="mt-7 grid grid-cols-2 gap-3">{slide.gallery.map((src,i)=><img key={i} src={src} alt="Foto de vuestro álbum" className="h-40 w-full rounded-2xl border-2 border-white/30 object-cover shadow-xl" />)}</div>}
        {slide.places && <div className="mt-7 space-y-3">{slide.places.map((v,i)=><p key={v} className="rounded-2xl bg-black/20 p-4 text-lg font-bold">{String(i+1).padStart(2,"0")}　{v}</p>)}</div>}
        {slide.songs && <div className="mt-6 space-y-2">{slide.songs.map(v=><p key={v} className="rounded-xl bg-black/20 px-4 py-3 text-sm font-bold">{v}</p>)}</div>}
        {slide.phrases && <div className="mt-7 flex flex-wrap gap-2">{slide.phrases.map(v=><span key={v} className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#6b1b9a]">“{v}”</span>)}</div>}
        {slide.funny && <div className="mt-7 space-y-3">{slide.funny.map(([a,b])=><div key={a} className="rounded-2xl bg-black/20 p-4"><p className="text-[10px] font-black tracking-widest opacity-75">{a}</p><p className="mt-1 text-xl font-black">{b}</p></div>)}</div>}
      </div>
      <footer className="relative flex items-center justify-between gap-3">
        <button onClick={prev} disabled={index===0} className="rounded-full border border-white/50 px-5 py-3 text-sm font-black disabled:opacity-30">← ATRÁS</button>
        <span className="text-[10px] font-black tracking-widest">DESLIZA / TOCA</span>
        <button onClick={next} disabled={index===slides.length-1} className="rounded-full bg-white px-5 py-3 text-sm font-black text-black disabled:opacity-30">SIGUIENTE →</button>
      </footer>
    </div>
  </section>;
}
