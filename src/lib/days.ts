export type Day =
  | { type: "message"; title: string; text: string }
  | { type: "quiz"; title: string; questions: { q: string; options: string[]; answer: number }[]; reward: string }
  | { type: "scratch"; title: string; prize: string }
  | { type: "memory"; title: string; emojis: string[]; reward: string }
  | { type: "gift"; title: string; inside: string }
  | { type: "riddle"; title: string; riddle: string; answer: string; reward: string }
  | { type: "reasons"; title: string; reasons: string[] }
  | { type: "coupon"; title: string; coupon: string; detail: string }
  | { type: "letter"; title: string };

export const dayIcons: Record<Day["type"], string> = {
  message: "💌", quiz: "❓", scratch: "🎟️", memory: "🧠", gift: "🎁",
  riddle: "🔍", reasons: "🩵", coupon: "✂️", letter: "✉️",
};

// Días 1–20: contenido provisional (se sustituye por el de la web original).
export const days: Day[] = [
  { type: "message", title: "Empieza la cuenta atrás", text: "Faltan 21 días para tu cumple.\nCada día aquí habrá algo pequeñito para ti 🩵" },
  { type: "scratch", title: "Rasca y gana", prize: "Un abrazo de los largos 🤍" },
  { type: "quiz", title: "¿Cuánto me conoces?", questions: [
    { q: "¿Cuál es mi lugar favorito?", options: ["La playa", "Contigo", "Mi cama"], answer: 1 },
    { q: "¿Quién se ríe más de las tonterías?", options: ["Tú", "Yo", "Los dos"], answer: 2 },
  ], reward: "¡Perfecta! Me conoces mejor que nadie 🩵" },
  { type: "gift", title: "Un regalito", inside: "Un beso guardado para cuando nos veamos 💋" },
  { type: "memory", title: "Parejas", emojis: ["🩵", "🌸", "🌙", "✨"], reward: "¡Lo has conseguido! 🌸" },
  { type: "coupon", title: "Un cupón", coupon: "Vale por un plan sorpresa", detail: "Tú eliges el día, yo me encargo del resto." },
  { type: "riddle", title: "Adivinanza", riddle: "Pasa por Sevilla y nos ha visto pasear de noche. ¿Qué es?", answer: "guadalquivir", reward: "¡Eso es! Nuestro río 🌙" },
  { type: "reasons", title: "Razones", reasons: ["Tu risa", "Tus abrazos", "Cómo me miras", "Tus tonterías", "Que eres tú", "Todo"] },
  { type: "message", title: "Un recuerdo", text: "¿Te acuerdas de la primera vez que nos hicimos una foto juntos? Yo sí. 🩵" },
  { type: "scratch", title: "Rasca otra vez", prize: "Vale por una peli elegida por ti 🍿" },
  { type: "gift", title: "Otro regalito", inside: "Una canción dedicada: la que suena en el día 21 🎶" },
  { type: "message", title: "Ya queda menos", text: "Faltan 9 días.\nY yo cada día más ganas de verte sonreír." },
  { type: "coupon", title: "Cupón de mimos", coupon: "Vale por una tarde de mimos", detail: "Canjeable sin fecha de caducidad." },
  { type: "memory", title: "Más parejas", emojis: ["🎁", "🌹", "🍫", "🎶", "📸", "🌊"], reward: "¡Memoria de campeona! 🏆" },
  { type: "riddle", title: "Otra adivinanza", riddle: "Lo tienes cada vez que me miras y yo cada vez que te veo. Empieza por S.", answer: "sonrisa", reward: "Exacto 😊" },
  { type: "message", title: "Un secreto", text: "No te lo he dicho nunca, pero cuando estoy contigo se me pasa el tiempo volando." },
  { type: "quiz", title: "Test exprés", questions: [
    { q: "¿Cuántos años vas a cumplir?", options: ["15", "16", "17"], answer: 1 },
  ], reward: "¡16! Ya casi está 🎂" },
  { type: "gift", title: "Casi casi", inside: "Faltan 3 días… y lo mejor está por llegar ✨" },
  { type: "reasons", title: "Más razones", reasons: ["Tu pelo", "Tu voz", "Tus planes", "Tu paciencia conmigo"] },
  { type: "message", title: "Mañana es el día", text: "Mañana cumples 16.\nDuerme bien, que mañana hay sorpresa 🩵" },
  { type: "letter", title: "Feliz cumpleaños, Lucía" },
];
