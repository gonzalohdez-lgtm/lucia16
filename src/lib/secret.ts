// Contraseña que pide el corazón del río para abrir la sorpresa.
export const SECRET_PASSWORD = "lucia16";
const KEY = "lucia-sorpresa-abierta";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").trim();

export function checkPassword(input: string) {
  return normalize(input) === normalize(SECRET_PASSWORD);
}
export function markUnlocked() {
  localStorage.setItem(KEY, "1");
}
export function isUnlocked() {
  return typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
}

// "password": cada día pide la misma contraseña (modo actual).
// "date": cada día se abre solo en su fecha.
export const DAY_UNLOCK_MODE: "password" | "date" = "password";
const DAYS_KEY = "lucia-dias-abiertos";
export function markDaysUnlocked() {
  localStorage.setItem(DAYS_KEY, "1");
}
export function areDaysUnlocked() {
  return typeof window !== "undefined" && localStorage.getItem(DAYS_KEY) === "1";
}

/** Día del calendario disponible: 1–21 de diciembre de 2026 (hora de Madrid). */
export function isDayOpen(day: number, now = new Date()) {
  const madrid = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
  const y = madrid.getFullYear();
  const m = madrid.getMonth();
  const d = madrid.getDate();
  if (y > 2026) return true;
  if (y < 2026 || m < 11) return false;
  return d >= day;
}
