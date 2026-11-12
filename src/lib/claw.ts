import { photos } from "./media";

export type ClawPrize = { id: string; kind: "Carta" | "Foto" | "Vale"; name: string; detail?: string; photo?: string; x: number };
export const clawPrizes: ClawPrize[] = [
  { id: "letter1", kind: "Carta", name: "Para cuando necesites recordar lo especial que eres", detail: "Lucía, a veces puede que no te des cuenta de lo muchísimo que vales. Quiero que recuerdes que eres una persona increíble, que tienes una forma de hacer especiales hasta los momentos más normales y que tu presencia puede cambiarme un día entero. Nunca dudes de lo importante que eres.", x: 14 },
  { id: "photo1", kind: "Foto", name: "Cerquita", photo: photos.p01, x: 26 },
  { id: "letter7", kind: "Carta", name: "Gracias por ser tú", detail: "Gracias por tu manera de ser, por tus detalles, por las veces que me has escuchado y por todos esos gestos que quizá para ti son pequeños, pero que yo valoro muchísimo. No quiero que cambies para encajar en nada. Me encanta poder conocerte tal y como eres.", x: 38 },
  { id: "photo2", kind: "Foto", name: "Nosotros", photo: photos.p03, x: 50 },
  { id: "wish", kind: "Vale", name: "Un deseo a elegir", detail: "¡Tienes un deseo a elegir! Puedes pedirme un plan, una actividad o algo especial que te apetezca. La elección es tuya. 🩵", x: 62 },
  { id: "letter9", kind: "Carta", name: "Si hoy ha sido un día difícil", detail: "Si has tenido un día complicado, quiero que esta carta te recuerde que no tienes que poder con todo siempre. Puedes tener días malos, equivocarte, cansarte y necesitar desconectar. No tienes que demostrar nada. Mereces tranquilidad, cariño y muchos días bonitos.", x: 74 },
  { id: "photo3", kind: "Foto", name: "Así somos", photo: photos.p16, x: 86 },
];
export function nearestPrize(x: number, opened: string[]): ClawPrize | undefined {
  return clawPrizes.filter(p => !opened.includes(p.id)).sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
}