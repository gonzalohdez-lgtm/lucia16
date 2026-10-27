import { useState } from "react";

export function FortuneCookie({ message }: { message: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-3 text-center">
      <p className="text-sm text-muted-foreground">
        Una pequeña fortuna tiene algo que decirte… 💗
      </p>
      <button
        type="button"
        onClick={() => setOpened(true)}
        disabled={opened}
        aria-label={opened ? "Galleta de la fortuna abierta" : "Romper la galleta de la fortuna"}
        className={`relative flex min-h-40 w-full items-center justify-center rounded-3xl border border-border bg-secondary/50 p-5 transition-all duration-500 ${opened ? "scale-[1.02]" : "hover:scale-[1.03] active:scale-95"}`}
      >
        {!opened ? (
          <span className="flex flex-col items-center gap-3">
            <span className="text-8xl drop-shadow-sm transition-transform duration-500">🥠</span>
            <span className="text-sm font-medium">Toca la galleta para romperla</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
            <span className="text-5xl">✨💗✨</span>
            <span className="font-serif text-2xl leading-relaxed md:text-3xl">“{message}”</span>
            <span className="text-3xl">🩵</span>
          </span>
        )}
      </button>
      {opened && (
        <p className="animate-in fade-in text-sm text-muted-foreground">
          Y esta es una fortuna que sé que siempre será verdad. 🥹
        </p>
      )}
    </div>
  );
}
