import { useMemo, useState } from "react";

const COLS = 5;
const ROWS = 5;
const N = COLS * ROWS;

function shuffled(): number[] {
  const a = Array.from({ length: N }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  // Evita que salga ya resuelto
  if (a.every((v, i) => v === i)) [a[0], a[1]] = [a[1]!, a[0]!];
  return a;
}

export function JigsawPuzzle({ image, reward }: { image: string; reward: string }) {
  const [order, setOrder] = useState<number[]>(shuffled);
  const [picked, setPicked] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const solved = useMemo(() => order.every((v, i) => v === i), [order]);

  const tap = (slot: number) => {
    if (solved) return;
    if (picked === null) { setPicked(slot); return; }
    if (picked === slot) { setPicked(null); return; }
    setOrder((o) => {
      const n = [...o];
      [n[picked], n[slot]] = [n[slot]!, n[picked]!];
      return n;
    });
    setMoves((m) => m + 1);
    setPicked(null);
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Toca dos piezas para intercambiarlas y reconstruir la foto.
      </p>
      <div
        className="mt-3 grid gap-1 rounded-2xl border border-border bg-secondary p-1"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {order.map((piece, slot) => {
          const col = piece % COLS;
          const row = Math.floor(piece / COLS);
          return (
            <button
              key={slot}
              onClick={() => tap(slot)}
              aria-label={`Pieza ${slot + 1}`}
              className={`aspect-square rounded-md transition ${picked === slot ? "ring-2 ring-ring ring-offset-2 ring-offset-card scale-95" : ""} ${solved ? "cursor-default" : "active:scale-95"}`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
              }}
            />
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Movimientos: {moves}</p>
      {solved && (
        <p className="mt-5 rounded-2xl bg-secondary p-4 text-center text-lg animate-in fade-in zoom-in">
          {reward}
        </p>
      )}
    </div>
  );
}
