import { useEffect, useRef, useState } from "react";

type Destination = { lat: number; lon: number };
const KEY = "lucia-compass-destination-v1";

function bearingBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = (n: number) => n * Math.PI / 180;
  const a = rad(lat1), b = rad(lat2), d = rad(lon2 - lon1);
  const y = Math.sin(d) * Math.cos(b);
  const x = Math.cos(a) * Math.sin(b) - Math.sin(a) * Math.cos(b) * Math.cos(d);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function distanceKm(a: number, b: number, c: number, d: number) {
  const rad = (n: number) => n * Math.PI / 180;
  const x = rad(c-a), y = rad(d-b);
  const v = Math.sin(x/2)**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(y/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1-v));
}

export function LoveCompass() {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [position, setPosition] = useState<Destination | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState("Guarda el destino y activa la brújula.");
  const [active, setActive] = useState(false);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Number.isFinite(parsed.lat) && Number.isFinite(parsed.lon)) {
          setDestination(parsed); setLatInput(String(parsed.lat)); setLonInput(String(parsed.lon));
        }
      }
    } catch {}
    return () => { if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current); };
  }, []);

  const save = () => {
    const lat = Number(latInput), lon = Number(lonInput);
    if (!latInput.trim() || !lonInput.trim() || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat)>90 || Math.abs(lon)>180) {
      setStatus("Introduce coordenadas válidas."); return;
    }
    const next = { lat, lon };
    setDestination(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setStatus("Destino guardado en este navegador. Ahora activa la brújula.");
  };

  const start = async () => {
    if (!destination) { setStatus("Primero guarda las coordenadas del destino."); return; }
    if (!navigator.geolocation) { setStatus("Este navegador no permite consultar la ubicación."); return; }
    const orientation = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (orientation.requestPermission) {
      try {
        if (await orientation.requestPermission() !== "granted") { setStatus("Permite el acceso a la orientación del iPhone."); return; }
      } catch { setStatus("No se pudo activar la brújula. Comprueba los permisos de Safari."); return; }
    }
    const handleOrientation = (event: Event) => {
      const e = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      const value = typeof e.webkitCompassHeading === "number" ? e.webkitCompassHeading :
        typeof e.alpha === "number" && e.absolute ? (360-e.alpha)%360 : null;
      if (value !== null && Number.isFinite(value)) setHeading(value);
    };
    window.addEventListener("deviceorientation", handleOrientation, true);
    setStatus("Solicitando tu ubicación…");
    watchId.current = navigator.geolocation.watchPosition(p => {
      setPosition({ lat: p.coords.latitude, lon: p.coords.longitude });
      setActive(true); setStatus("Brújula activa. La flecha apunta hacia Gonzalo.");
    }, e => {
      setActive(false);
      setStatus(e.code === 1 ? "Permite la ubicación en los ajustes del navegador." : "No se pudo obtener la ubicación. Comprueba el GPS e inténtalo otra vez.");
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
  };

  const stop = () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null; setActive(false);
    setStatus("Brújula pausada. Ya no se consulta tu ubicación.");
  };
  const bearing = position && destination ? bearingBetween(position.lat, position.lon, destination.lat, destination.lon) : null;
  const distance = position && destination ? distanceKm(position.lat, position.lon, destination.lat, destination.lon) : null;
  const rotation = bearing !== null && heading !== null ? bearing-heading : bearing ?? 0;

  return <div className="mx-auto max-w-md space-y-5">
    <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 text-center text-white shadow-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">LOVE COMPASS</p>
      <h3 className="mt-3 font-serif text-2xl">La brújula está apuntando a mí 🩵</h3>
      <p className="mt-2 text-sm text-slate-300">Gira tu móvil y encuentra el camino hacia mí.</p>
      <div className="relative mx-auto my-6 flex aspect-square w-64 max-w-full items-center justify-center rounded-full border border-cyan-300/40 bg-slate-900 shadow-[0_0_45px_rgba(34,211,238,0.15)]">
        <div className="absolute inset-3 rounded-full border border-white/10"/><div className="absolute inset-8 rounded-full border border-white/10"/>
        <span className="absolute top-5 text-xs font-bold text-cyan-200">N</span><span className="absolute right-5 text-xs font-bold text-slate-400">E</span><span className="absolute bottom-5 text-xs font-bold text-slate-400">S</span><span className="absolute left-5 text-xs font-bold text-slate-400">O</span>
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-cyan-200/20">
          <div className="absolute h-32 w-1 rounded-full bg-cyan-300/20"/>
          <div className="absolute h-32 w-1 origin-center" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[12px] border-b-[35px] border-x-transparent border-b-cyan-200 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]"/>
            <div className="absolute top-8 left-1/2 h-16 w-[3px] -translate-x-1/2 rounded-full bg-white/30"/>
          </div><span className="z-10 text-3xl">🩵</span>
        </div>
      </div>
      <p className="text-sm text-cyan-100">{bearing === null ? "Esperando ubicación…" : `Dirección: ${Math.round(bearing)}°`}</p>
      <p className="mt-1 text-sm text-slate-300">{distance === null ? "" : `A ${distance < 1 ? Math.round(distance*1000)+" metros" : distance.toFixed(1)+" km"} de mí`}</p>
      {heading === null && active && <p className="mt-2 text-xs text-amber-200">Si la flecha no gira, el navegador puede no ofrecer orientación de brújula.</p>}
    </div>
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <p className="font-semibold">Destino de la brújula</p>
      <p className="text-sm text-muted-foreground">Introduce las coordenadas de la casa de Gonzalo. Se guardan solo en este navegador, no en el código de la web.</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">Latitud<input value={latInput} onChange={e=>setLatInput(e.target.value)} inputMode="decimal" placeholder="37.000000" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"/></label>
        <label className="text-sm">Longitud<input value={lonInput} onChange={e=>setLonInput(e.target.value)} inputMode="decimal" placeholder="-6.000000" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"/></label>
      </div>
      <button type="button" onClick={save} className="pill-button pill-dark w-full">Guardar destino</button>
      <button type="button" onClick={start} className="pill-button w-full">Activar brújula 🧭</button>
      {active && <button type="button" onClick={stop} className="w-full rounded-full border border-border px-4 py-2 text-sm">Pausar ubicación</button>}
      <p aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
      <p className="text-xs text-muted-foreground">La ubicación se usa en este dispositivo mientras la brújula está activa. Puedes pausarla cuando quieras. No funciona de forma fiable con la pantalla bloqueada o la web cerrada.</p>
    </div>
  </div>;
}
