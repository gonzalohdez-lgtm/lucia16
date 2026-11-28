import { favoritePhoto, photos } from "./media";

export type ClawPrize = { id: string; kind: "Carta" | "Foto" | "Vale"; name: string; detail?: string; photo?: string; x: number; question: number };
/** Bola 1..7 = orden en la lista. `question` es el índice de la pregunta propia de esa bola. */
export const clawPrizes: ClawPrize[] = [
  { id: "letter1", kind: "Carta", name: "Para cuando necesites recordar lo especial que eres", detail: "Lucía, a veces puede que no te des cuenta de lo muchísimo que vales. Quiero que recuerdes que eres una persona increíble, que tienes una forma de hacer especiales hasta los momentos más normales y que tu presencia puede cambiarme un día entero. Nunca dudes de lo importante que eres.", x: 14, question: 0 },
  { id: "photo1", kind: "Foto", name: "TE AMO", photo: photos.p01, x: 26, question: 1 },
  { id: "letter7", kind: "Carta", name: "Gracias por ser tú", detail: "Gracias por tu manera de ser, por tus detalles, por las veces que me has escuchado y por todos esos gestos que quizá para ti son pequeños, pero que yo valoro muchísimo. No quiero que cambies para encajar en nada. Me encanta poder conocerte tal y como eres.", x: 38, question: 2 },
  { id: "photo2", kind: "Foto", name: "Mi foto favorita", photo: favoritePhoto, detail: "Mi amor,\n\nMe emociona muchísimo pensar en el futuro, en imaginar todo lo que nos queda por compartir, las conversaciones pendientes, los planes juntos o simplemente el dia a dia. Siento una paz enorme al saber que, pase lo que pase, vamos a estar siempre juntos y nos vamos a tener el uno al otro.\n\nQuiero estar ahí para celebrar tus pequeños y grandes triunfos, para abrazarte fuerte cuando el mundo pese un poco más y para seguir mi vida a tu lado. Gracias por alegrar mis días.\n\nTe quiero con todo mi corazón.", x: 50, question: 8 },
  { id: "wish", kind: "Vale", name: "Vale por un regalo que te tengo que dar", detail: "Lo canjeas cuando tú digas. Todavía no te voy a decir qué es… 🩵", x: 62, question: 6 },
  { id: "letter9", kind: "Carta", name: "Si hoy ha sido un día difícil", detail: "Si has tenido un día complicado, quiero que esta carta te recuerde que no tienes que poder con todo siempre. Puedes tener días malos, equivocarte, cansarte y necesitar desconectar. No tienes que demostrar nada. Mereces tranquilidad, cariño y muchos días bonitos.", x: 74, question: 5 },
  { id: "photo3", kind: "Foto", name: "Así somos", photo: photos.p16, x: 86, question: 4 },
];
/** Número fijo de la bola, independiente de las que ya se hayan recogido. */
export function ballNumber(id: string): number {
  return clawPrizes.findIndex(p => p.id === id) + 1;
}
export function nearestPrize(x: number, opened: string[]): ClawPrize | undefined {
  return clawPrizes.filter(p => !opened.includes(p.id)).sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
}
export type ClawQuestion = { q: string; options: string[]; answer: number };
export const clawQuestions: ClawQuestion[] = [
  { q: "¿Qué día nos conocimos?", options: ["30 enero", "6 febrero", "14 febrero", "13 marzo"], answer: 1 },
  { q: "¿Qué día empezamos a salir?", options: ["7 febrero", "14 marzo", "13 marzo", "14 febrero"], answer: 2 },
  { q: "¿Cuál es la comida favorita de Lucía?", options: ["Hamburguesa", "Aceitunas", "Gonzalo", "McDonald's"], answer: 2 },
  { q: "¿Qué es lo que más nos gusta hacer?", options: ["Ir al cine", "Comer", "Dormir", "Jugar"], answer: 2 },
  { q: "¿Qué no soporta Lucía que haga Gonzalo?", options: ["Que no la escuche", "Silbar", "Hacerle cosquillas", "Besarla"], answer: 0 },
  { q: "¿Qué día fue nuestro primer beso?", options: ["21 de febrero", "13 de marzo", "22 de febrero", "13 de febrero"], answer: 0 },
  { q: "¿A qué ciudad quiere viajar Gonzalo con Lucía?", options: ["Roma", "Londres", "París", "Nueva York"], answer: 0 },
  { q: "¿Qué catering quiere Gonzalo en la boda?", options: ["Sushi", "McDonald's", "Paella", "Pizza"], answer: 1 },
  { q: "¿Cuántos días exactos han pasado desde el día en que supimos de la existencia del otro?", options: ["308", "295", "317", "328"], answer: 2 },
];
/** Pregunta propia de una bola: cada bola lleva escrita la suya. */
export function questionForBall(id: string): ClawQuestion | undefined {
  const prize = clawPrizes.find(p => p.id === id);
  return prize ? clawQuestions[prize.question] : undefined;
}
/** Bola disponible (ni abierta ni rota) más cercana al gancho. */
export function availablePrize(x: number, opened: string[], broken: string[]) {
  return nearestPrize(x, [...opened, ...broken]);
}
