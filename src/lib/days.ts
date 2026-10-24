export type Day =
  | { type: "message"; title: string; text: string }
  | { type: "quiz"; title: string; questions: { q: string; options: string[]; answer: number }[]; reward: string }
  | { type: "scratch"; title: string; prize: string }
  | { type: "memory"; title: string; emojis: string[]; reward: string }
  | { type: "gift"; title: string; inside: string }
  | { type: "racing"; title: string; url: string }
  | { type: "puzzle"; title: string; image: string; reward: string }
  | { type: "riddle"; title: string; riddle: string; answer: string; reward: string }
  | { type: "reasons"; title: string; reasons: string[] }
  | { type: "coupon"; title: string; coupon: string; detail: string }
  | { type: "letter"; title: string };

export const dayIcons: Record<Day["type"], string> = {
  message: "💌", quiz: "❓", scratch: "🎟️", memory: "🧠", gift: "🎁",
  riddle: "🔍", reasons: "🩵", coupon: "✂️", letter: "✉️", racing: "🏎️", puzzle: "🧩",
};

// Días 1–20: contenido provisional (se sustituye por el de la web original).
export const days: Day[] = [
  { type: "message", title: "Para ti, mi amor", text: "Bueno amor, esto creo que no te lo esperabas, es una sorpresa que me ha costado hacer pero que te mereces desde el primer hasta el ultimo dia. Eres más especial para mí de lo que nunca podrás entender, mi amor. a veces trato de encontrar las palabras perfectas para explicar lo que significas para mí, pero de alguna manera cada palabra todavía se siente demasiado pequeña. Te has convertido en una parte tan hermosa e importante de mi vida que, honestamente, no puedo imaginar que mis días sientan lo mismo sin ti. No eres solo alguien que está en mi vida, te has convertido en alguien que está profundamente conectado con mi corazón.\n\nAntes de ti, nunca imaginé que una persona pudiera volverse tan importante para mí. De alguna manera, poco a poco te convertiste en parte de todo. Eres la primera persona a la que quiero decirle cuando algo me hace feliz, la persona en la que pienso cuando tengo un día difícil y la persona que mi corazón busca naturalmente sin que yo me dé cuenta. Espero que siempre recuerdes lo mucho que me importas, tanto en los días en que no te sientes bien, como en los días que eres la chica mas feliz del mundo.\n\nAmo tu corazón, tu personalidad, tu amabilidad, tu forma de pensar y todos esos pequeños detalles que te hacen ser quien eres. Incluso las cosas que puedes ver como defectos son cosas que nunca querría cambiar de ti. Tu felicidad siempre significará mi felicidad. Me encuentro pensando en si estás bien, si has comido, si estás cansado o si algo te molesta. No porque esté obligado a preocuparme, sino porque preocuparse por ti se ha convertido en algo natural para mí, cuando alguien se vuelve tan importante para tu corazón  empiezas a preocuparte por las cosas más pequeñas sin siquiera pensarlo.\n\nGracias por cada momento que me has compartido con cada sonrisa, cada risa, cada conversación y cada recuerdo que hicimos juntos. Te des cuenta o no, has traído tanta felicidad a mi vida y me has cambiado de formas por las que siempre estaré agradecido.\n\nTe amo 🩵" },
  { type: "scratch", title: "Rasca y gana", prize: "Un abrazo de los largos 🤍" },
  { type: "quiz", title: "¿Cuánto me conoces?", questions: [
    { q: "¿Cuál es mi lugar favorito?", options: ["La playa", "Contigo", "Mi cama"], answer: 1 },
    { q: "¿Quién se ríe más de las tonterías?", options: ["Tú", "Yo", "Los dos"], answer: 2 },
  ], reward: "¡Perfecta! Me conoces mejor que nadie 🩵" },
  { type: "racing", title: "Lucía ♥ Gonzalo Racing", url: "https://luygof1.lovable.app" },
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
