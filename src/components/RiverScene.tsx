import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Volume2, VolumeX, X, Eye, EyeOff } from "lucide-react";
import { riverImage, riverSong } from "@/lib/media";
import { checkPassword, markUnlocked } from "@/lib/secret";

const fireflies = [
  { left: "12%", top: "56%", delay: "0s" },
  { left: "24%", top: "68%", delay: "-1.4s" },
  { left: "33%", top: "48%", delay: "-2.6s" },
  { left: "82%", top: "52%", delay: "-0.8s" },
  { left: "91%", top: "64%", delay: "-3.2s" },
  { left: "76%", top: "44%", delay: "-2s" },
];

export function RiverScene({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [night, setNight] = useState(0);
  const [muted, setMuted] = useState(false);
  const [askPass, setAskPass] = useState(false);
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setNight(0);
    setAskPass(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    audioRef.current?.play().catch(() => setMuted(true));
    const t = window.setInterval(() => setNight((n) => Math.min(1, Number((n + 0.2).toFixed(2)))), 10000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggleSound = () => {
    const a = audioRef.current;
    if (!a) return;
    if (muted || a.paused) {
      a.muted = false;
      setMuted(false);
      a.play().catch(() => { a.muted = true; setMuted(true); });
    } else {
      a.muted = true;
      setMuted(true);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(pass)) {
      markUnlocked();
      navigate({ to: "/sorpresa" });
    } else {
      setError("Esa no es… prueba otra vez 🩵");
    }
  };

  return (
    <div className="river-surprise" role="dialog" aria-modal="true" aria-label="Una noche junto al Guadalquivir" style={{ "--night": night } as React.CSSProperties}>
      <button ref={closeRef} className="scene-close" onClick={onClose} aria-label="Cerrar la sorpresa"><X aria-hidden="true" /></button>
      <button className="scene-sound" onClick={toggleSound} aria-label={muted ? "Encender la música" : "Apagar la música"}>
        {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
      </button>
      <audio ref={audioRef} src={riverSong} loop muted={muted} preload="auto" aria-hidden="true" />
      <div className="photo-scene" aria-hidden="true">
        <img className="photo-scene-base" src={riverImage} alt="" width={1920} height={1088} />
        <div className="photo-scene-ripple"><img src={riverImage} alt="" width={1920} height={1088} /></div>
        <div className="photo-scene-ripple is-slow"><img src={riverImage} alt="" width={1920} height={1088} /></div>
        <div className="photo-scene-water" />
        <div className="photo-scene-shimmer" />
        <div className="photo-scene-lights" />
        <div className="photo-scene-dusk" />
        <div className="photo-scene-night" />
        <div className="photo-scene-grain" />
        {fireflies.map((f) => (
          <span key={f.left + f.top} className="photo-firefly" style={{ left: f.left, top: f.top, animationDelay: f.delay }} />
        ))}
      </div>
      <button className="scene-heart" aria-label="Un secreto" onClick={() => setAskPass(true)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
      <div className="scene-vignette" aria-hidden="true" />

      {askPass && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-foreground/50 p-4" onClick={() => setAskPass(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-6 text-card-foreground shadow-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Lo has encontrado</p>
            <h2 className="font-serif text-2xl">Para entrar hace falta la contraseña secreta.</h2>
            <div className="relative">
              <input autoFocus type={show ? "text" : "password"} value={pass} onChange={(e) => { setPass(e.target.value); setError(null); }} placeholder="Contraseña" className="w-full rounded-full border border-border bg-background py-3 pl-5 pr-12 outline-none focus:ring-2 focus:ring-ring" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" className="pill-button pill-dark">Entrar</button>
          </form>
        </div>
      )}

      <svg className="scene-filters" aria-hidden="true" focusable="false">
        <filter id="river-ripple" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.05" numOctaves={2} seed={7} result="noise">
            <animate attributeName="baseFrequency" dur="16s" values="0.008 0.05;0.013 0.075;0.008 0.05" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={16} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="river-ripple-slow" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves={1} seed={21} result="noise2">
            <animate attributeName="baseFrequency" dur="24s" values="0.006 0.03;0.009 0.045;0.006 0.03" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise2" scale={26} xChannelSelector="G" yChannelSelector="R" />
        </filter>
      </svg>
    </div>
  );
}
