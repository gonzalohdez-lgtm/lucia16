import { puzzleDay2Image } from "@/lib/media";

export type Day =
  | { type: "message"; title: string; text: string }
  | { type: "quiz"; title: string; questions: { q: string; options: string[]; answer: number }[]; reward: string }
  | { type: "scratch"; title: string; prize: string }
  | { type: "memory"; title: string; emojis: string[]; reward: string }
  | { type: "photomemory"; title: string; reward: string }
  | { type: "photodates"; title: string }
  | { type: "surprisechoice"; title: string }
  | { type: "roulette"; title: string }
  | { type: "couplequestions"; title: string }
  | { type: "gift"; title: string; inside: string }
  | { type: "racing"; title: string; url: string }
  | { type: "puzzle"; title: string; image: string; reward: string }
  | { type: "riddle"; title: string; riddle: string; answer: string; reward: string }
  | { type: "reasons"; title: string; reasons: string[] }
  | { type: "coupon"; title: string; coupon: string; detail: string }
  | { type: "letter"; title: string }
  | { type: "journey"; title: string }
  | { type: "wordsearch"; title: string }
  | { type: "fortunecookie"; title: string; message: string }
  | { type: "safe"; title: string; code: string; message: string }
  | { type: "relationshipclock"; title: string }
  | { type: "lovecompass"; title: string }
  | { type: "cipher"; title: string };

export const dayIcons: Record<Day["type"], string> = {
  message: "💌", quiz: "❓", scratch: "🎟️", memory: "🧠", photomemory: "📸", photodates: "🗓️", surprisechoice: "❓", roulette: "🎡", couplequestions: "💭", gift: "🎁",
  riddle: "🔍", reasons: "🩵", coupon: "✂️", letter: "✉️", racing: "🏎️", puzzle: "🧩", journey: "💍", wordsearch: "🔠", fortunecookie: "🥠", safe: "🔐", relationshipclock: "⏱️", lovecompass: "🧭", cipher: "📡",
};

// Días 1–20: contenido provisional (se sustituye por el de la web original).
export const days: Day[] = [
  { type: "message", title: "Para ti, mi amor", text: "Bueno amor, esto creo que no te lo esperabas, es una sorpresa que me ha costado hacer pero que te mereces desde el primer hasta el ultimo dia. Eres más especial para mí de lo que nunca podrás entender, mi amor. a veces trato de encontrar las palabras perfectas para explicar lo que significas para mí, pero de alguna manera cada palabra todavía se siente demasiado pequeña. Te has convertido en una parte tan hermosa e importante de mi vida que, honestamente, no puedo imaginar que mis días sientan lo mismo sin ti. No eres solo alguien que está en mi vida, te has convertido en alguien que está profundamente conectado con mi corazón.\n\nAntes de ti, nunca imaginé que una persona pudiera volverse tan importante para mí. De alguna manera, poco a poco te convertiste en parte de todo. Eres la primera persona a la que quiero decirle cuando algo me hace feliz, la persona en la que pienso cuando tengo un día difícil y la persona que mi corazón busca naturalmente sin que yo me dé cuenta. Espero que siempre recuerdes lo mucho que me importas, tanto en los días en que no te sientes bien, como en los días que eres la chica mas feliz del mundo.\n\nAmo tu corazón, tu personalidad, tu amabilidad, tu forma de pensar y todos esos pequeños detalles que te hacen ser quien eres. Incluso las cosas que puedes ver como defectos son cosas que nunca querría cambiar de ti. Tu felicidad siempre significará mi felicidad. Me encuentro pensando en si estás bien, si has comido, si estás cansado o si algo te molesta. No porque esté obligado a preocuparme, sino porque preocuparse por ti se ha convertido en algo natural para mí, cuando alguien se vuelve tan importante para tu corazón  empiezas a preocuparte por las cosas más pequeñas sin siquiera pensarlo.\n\nGracias por cada momento que me has compartido con cada sonrisa, cada risa, cada conversación y cada recuerdo que hicimos juntos. Te des cuenta o no, has traído tanta felicidad a mi vida y me has cambiado de formas por las que siempre estaré agradecido.\n\nTe amo 🩵" },
  { type: "puzzle", title: "Un puzle de nosotros", image: puzzleDay2Image, reward: "¡Puzle completado! Qué bien salimos 🩵" },
  { type: "quiz", title: "¿Cuánto me conoces?", questions: [
    { q: "¿Qué día nos conocimos?", options: ["30 enero", "6 febrero", "14 febrero", "13 marzo"], answer: 1 },
    { q: "¿Cuál es mi comida favorita?", options: ["Arroz con tomate", "Hamburguesa", "Aceitunas", "Pizza"], answer: 0 },
    { q: "¿Qué día empezamos a salir?", options: ["7 febrero", "14 marzo", "13 marzo", "14 febrero"], answer: 2 },
    { q: "¿Qué es lo que más nos gusta hacer?", options: ["Ir al cine", "Comer", "Dormir", "Jugar"], answer: 2 },
    { q: "¿Algo que no soportas que haga?", options: ["Que no te escuche", "Silbar", "Que te haga cosquillas", "Que te bese"], answer: 0 },
  ], reward: "¡Perfecta! Me conoces mejor que nadie 🩵" },
  { type: "racing", title: "Lucía ♥ Gonzalo Racing", url: "https://luygof1.lovable.app" },
  { type: "wordsearch", title: "Sopa de letras 🩵" },
  { type: "photodates", title: "Une nuestros recuerdos con sus fechas 📸" },
  { type: "surprisechoice", title: "Elige tu sorpresa 🎁" },
  { type: "couplequestions", title: "Hablemos de nuestro futuro 💗" },
  { type: "relationshipclock", title: "Calculadora del tiempo juntos ⏱️" },
  { type: "journey", title: "El camino de Lucía y Gonzalo 🩵" },
  { type: "lovecompass", title: "La brújula está apuntando a mí 🧭🩵" },
  { type: "message", title: "Ya queda menos", text: "Faltan 9 días.\nY yo cada día más ganas de verte sonreír." },
  { type: "coupon", title: "Cupón de mimos", coupon: "Vale por una tarde de mimos", detail: "Canjeable sin fecha de caducidad." },
  { type: "photomemory", title: "Encuentra las parejas de nuestras fotos 🩵", reward: "¡Has encontrado todos nuestros recuerdos! 🩵" },
  { type: "riddle", title: "Otra adivinanza", riddle: "Lo tienes cada vez que me miras y yo cada vez que te veo. Empieza por S.", answer: "sonrisa", reward: "Exacto 😊" },
  { type: "roulette", title: "La ruleta de nuestras sorpresas 🎡🩵" },
  { type: "quiz", title: "Test exprés", questions: [
    { q: "¿Cuántos años vas a cumplir?", options: ["15", "16", "17"], answer: 1 },
  ], reward: "¡16! Ya casi está 🎂" },
  { type: "fortunecookie", title: "Galleta de la fortuna 🥠", message: "Eres lo mejor que me ha pasado" },
  { type: "safe", title: "Caja fuerte secreta 🔐", code: "1303", message: "Si hoy no tienes un buen dia, quiero que recuerdes que no tienes que poder con todo siempre. Puedes estar cansada, triste o de mal humor, que no pasa absolutamente nada. Si quieres hablar, te escucho; si necesitas distraerte, intentaré hacerte reír; y si necesitas un abrazo, te lo doy. No tengo una solución mágica para todo, pero sí muchas ganas de estar a tu lado." },
  { type: "cipher", title: "Archivo 020: La última transmisión 🔐" },
  { type: "letter", title: "Feliz cumpleaños, Lucía" },
];
