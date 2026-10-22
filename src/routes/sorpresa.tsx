import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { photos, allPhotos } from "@/lib/media";
import { isUnlocked } from "@/lib/secret";

export const Route = createFileRoute("/sorpresa")({
  head: () => ({
    meta: [
      { title: "Para Lucía — 16 🩵" },
      { name: "description", content: "Un rincón para Lucía, sus dieciséis y todos los recuerdos junto a Gonzalo." },
      { property: "og:title", content: "Para Lucía — 16 🩵" },
      { property: "og:description", content: "Un rincón para Lucía, sus dieciséis y todos los recuerdos junto a Gonzalo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Surprise,
});

const moments = [
  { number: "01 — CERQUITA", title: "Mi lugar favorito.", text: "No hace falta que pase nada increíble. A veces basta con estar juntos para que el día ya sea mejor.", image: photos.p01 },
  { number: "02 — DETALLES", title: "Flores para mi niña.", text: "Porque verte sonreír siempre merece la pena. Y porque sí, también quería que este recuerdo estuviera aquí.", image: photos.p12 },
  { number: "03 — PLANES", title: "Tú, yo y cualquier sitio.", text: "Da un poco igual dónde. Lo importante es con quién.", image: photos.p17 },
  { number: "04 — TONTERÍAS", title: "Así somos.", text: "Y espero que nunca nos falten las fotos raras, las bromas y las risas por absolutamente nada.", image: photos.p16 },
];

function Surprise() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (isUnlocked()) setAllowed(true);
    else navigate({ to: "/", replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!opened) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [opened]);

  if (!allowed) return <main className="min-h-screen bg-background" />;

  return (
    <main>
      <div className={opened ? "opening opening-hidden" : "opening"} aria-hidden={opened}>
        <div className="opening-inner">
          <p className="eyebrow opening-date">21 · 12 · 2026</p>
          <h1>Para Lucía.</h1>
          <p>Hay algo que Gonzalo ha preparado para ti.</p>
          <button className="pill-button pill-light" onClick={() => setOpened(true)}>Abrir mi sorpresa 🩵</button>
        </div>
      </div>

      <header className="hero">
        <img src={photos.p18} alt="Lucía y Gonzalo" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Dieciséis vueltas al sol</p>
          <h1>Felices 16,<br /><em>Lucía.</em></h1>
          <p>Un pequeño lugar para guardar algunos de nuestros momentos favoritos. Porque los días normales contigo terminan siendo los que más quiero recordar.</p>
          <a className="start-link" href="#historia">Empieza aquí <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <section className="intro-section" id="historia">
        <div className="intro-copy reveal" data-reveal>
          <p className="eyebrow">Nosotros</p>
          <h2>Un montón de recuerdos.<br /><em>Y los que faltan.</em></h2>
          <p className="lead">Risas, tonterías, flores, viajes, selfies imposibles y esos momentos que parecen pequeños, pero contigo son muy especiales.</p>
        </div>
      </section>

      <section className="story-section" aria-label="Nuestros recuerdos">
        {moments.map((m, i) => (
          <article key={m.number} className="moment reveal" data-reveal>
            <div className="moment-image-wrap"><img src={m.image} alt={`Recuerdo de Lucía y Gonzalo: ${m.title}`} loading={i > 0 ? "lazy" : "eager"} /></div>
            <div className="moment-copy"><span>{m.number}</span><h3>{m.title}</h3><p>{m.text}</p></div>
          </article>
        ))}
      </section>

      <div className="memory-tape" aria-hidden="true">
        <div className="tape-track">
          {[...allPhotos, ...allPhotos].map((src, i) => <img key={`${src}-${i}`} src={src} alt="" loading="lazy" />)}
        </div>
      </div>

      <section className="letter-section">
        <article className="letter reveal" data-reveal>
          <p className="eyebrow">Una carta para ti</p>
          <h2>Lucía,</h2>
          <p>Hoy cumples 16 años y quería hacerte algo diferente, algo que pudieras guardar y volver a ver siempre que quisieras. No sé si existen palabras suficientes para explicarte todo lo que significas para mí, pero sí sé que desde que estás en mi vida haces que mis días se vean más felices.</p>
          <p>Me encanta compartir contigo las risas, nuestras tonterías, los momentos bonitos y hasta esos pequeños momentos que parecen insignificantes, pero que contigo son muy especiales.</p>
          <p>Espero que tus 16 estén llenos de momentos increíbles, de muchísimas risas (conmigo) y de sueños que se vayan cumpliendo poco a poco. Y sobre todo, espero poder estar a tu lado <strong>SIEMPRE</strong> para vivir muchos de ellos contigo.</p>
          <p>Feliz cumpleaños peque.<br />Te quiero muchísimo. 🩵</p>
          <p className="signature">— Gonzalo</p>
        </article>
      </section>

      <section className="gallery-section">
        <div className="gallery-heading reveal" data-reveal>
          <p className="eyebrow">16 PEDACITOS DE NOSOTROS</p>
          <h2>Para volver aquí <em>siempre.</em></h2>
        </div>
        <div className="masonry">
          {allPhotos.map((src, i) => <img key={src} src={src} alt={`Recuerdo ${i + 1} de Lucía y Gonzalo`} loading="lazy" />)}
        </div>
      </section>

      <section className="final-section">
        <div className="final-copy reveal" data-reveal>
          <p className="eyebrow">21 de diciembre</p>
          <h2>Por muchos<br /><em>recuerdos más.</em></h2>
          <p>Feliz cumpleaños, peque. 🩵</p>
        </div>
      </section>
    </main>
  );
}
