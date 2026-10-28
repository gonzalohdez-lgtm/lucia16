import { useEffect, useRef, useState } from "react";

type Destination = { lat: number; lon: number };
type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
const DESTINATION: Destination = { lat: 37.567933, lon: -6.101235 };

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
  const destination = DESTINATION;
  const [position, setPosition] = useState<Destination | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState("Pulsa activar para encontrar el camino hacia mí 🩵.");
  const [active, setActive] = useState(false);
  const watchId = useRef<number | null>(null);
  const orientationHandler = useRef<((event: Event) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
      if (orientationHandler.current) {
        window.removeEventListener("deviceorientation", orientationHandler.current, true);
        window.removeEventListener("deviceorientationabsolute", orientationHandler.current, true);
      }
    };
  }, []);

  const start = async () => {
    if (!navigator.geolocation) { setStatus("Este navegador no permite consultar la ubicación."); return; }

    const Orientation = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    if (typeof Orientation.requestPermission === "function") {
      try {
        const permission = await Orientation.requestPermission();
        if (permission !== "granted") {
          setStatus("Hace falta permitir el acceso a la orientación del iPhone. Revisa los permisos de Safari e inténtalo de nuevo.");
          return;
        }
      } catch {
        setStatus("No se pudo activar la brújula. Prueba a abrir la web directamente en Safari y permitir el movimiento/orientación.");
        return;
      }
    }

    if (orientationHandler.current) {
      window.removeEventListener("deviceorientation", orientationHandler.current, true);
      window.removeEventListener("deviceorientationabsolute", orientationHandler.current, true);
    }
    const handleOrientation = (event: Event) => {
      const e = event as CompassEvent;
      // iOS Safari supplies a compass heading directly.
      if (typeof e.webkitCompassHeading === "number" && Number.isFinite(e.webkitCompassHeading)) {
        setHeading((e.webkitCompassHeading + 360) % 360);
        return;
      }
      // Android and browsers that expose absolute device orientation.
      if (typeof e.alpha === "number" && Number.isFinite(e.alpha)) {
        const isAbsolute = "absolute" in e ? e.absolute : event.type === "deviceorientationabsolute";
        if (isAbsolute) setHeading((360 - e.alpha + 360) % 360);
      }
    };
    orientationHandler.current = handleOrientation;
    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);

    setStatus("Solicitando tu ubicación y la orientación del móvil…");
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = navigator.geolocation.watchPosition(p => {
      setPosition({ lat: p.coords.latitude, lon: p.coords.longitude });
      setActive(true);
      setStatus("Ubicación activa. Mueve el móvil para comprobar la brújula.");
    }, e => {
      setActive(false);
      setStatus(e.code === 1 ? "Permite la ubicación en los ajustes del navegador." : "No se pudo obtener la ubicación. Comprueba el GPS e inténtalo otra vez.");
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
  };

  const stop = () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    if (orientationHandler.current) {
      window.removeEventListener("deviceorientation", orientationHandler.current, true);
      window.removeEventListener("deviceorientationabsolute", orientationHandler.current, true);
      orientationHandler.current = null;
    }
    setActive(false);
    setStatus("Brújula pausada. Ya no se consulta tu ubicación.");
  };
  const bearing = position && destination ? bearingBetween(position.lat, position.lon, destination.lat, destination.lon) : null;
  const distance = position && destination ? distanceKm(position.lat, position.lon, destination.lat, destination.lon) : null;
  const rotation = bearing !== null && heading !== null ? bearing - heading : bearing ?? 0;

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
          <div className="absolute h-32 w-1 origin-center transition-transform duration-150" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[12px] border-b-[35px] border-x-transparent border-b-cyan-200 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]"/>
            <div className="absolute top-8 left-1/2 h-16 w-[3px] -translate-x-1/2 rounded-full bg-white/30"/>
          </div><span className="z-10 text-3xl">🩵</span>
        </div>
      </div>
      <p className="text-sm text-cyan-100">{bearing === null ? "Activa la brújula para encontrarme…" : `Dirección hacia mí: ${Math.round(bearing)}°`}</p>
      <p className="mt-1 text-sm text-slate-300">{distance === null ? "" : `A ${distance < 1 ? Math.round(distance*1000)+" metros" : distance.toFixed(1)+" km"} de mí`}</p>
      {active && heading === null && <p className="mt-2 text-xs text-amber-200">La ubicación funciona, pero este navegador no está enviando la orientación. Abre la web en el navegador del móvil y permite el acceso a movimiento/orientación.</p>}
    </div>
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <p className="font-semibold">Encuentra el camino hacia mí 🩵</p>
      <p className="text-sm text-muted-foreground">Tu destino ya está preparado. Solo tienes que activar la brújula y permitir el acceso a tu ubicación y a la orientación del móvil.</p>
      <button type="button" onClick={start} className="pill-button w-full">Activar brújula 🧭</button>
      {active && <button type="button" onClick={stop} className="w-full rounded-full border border-border px-4 py-2 text-sm">Pausar ubicación</button>}
      <p aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
      <p className="text-xs text-muted-foreground">La ubicación se usa en este dispositivo mientras la brújula está activa. Puedes pausarla cuando quieras. No funciona de forma fiable con la pantalla bloqueada o la web cerrada.</p>
    </div>
  </div>;
}
