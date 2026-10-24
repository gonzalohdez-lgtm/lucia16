import { describe, expect, it } from "vitest";
import { days, dayIcons } from "./days";

describe("día 4", () => {
  it("abre el juego solicitado con el emoji de carreras", () => {
    expect(days[3]).toMatchObject({ type: "racing", url: "https://luygof1.lovable.app" });
    expect(dayIcons.racing).toBe("🏎️");
  });
});