import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createFight, otherFighter, type Fighter, type FightState } from "./fight";
import type { Json, Tables } from "@/integrations/supabase/types";
async function hash(token: string) { return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)))).map(b=>b.toString(16).padStart(2,"0")).join(""); }
export async function createRoom(character: Fighter, state: FightState) {
  const token=crypto.randomUUID(), tokenHash=await hash(token);
  const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for(let i=0;i<4;i++) {
    const code=Array.from(crypto.getRandomValues(new Uint8Array(8))).map(n=>alphabet[n%alphabet.length]).join("");
    const { error }=await supabaseAdmin.from("arcade_fight_rooms").insert({code,host_character:character,host_token_hash:tokenHash,state:state as unknown as Json});
    if(!error) return {code,token,character,state};
    if(error.code!=="23505") throw new Error("No se pudo crear la sala.");
  }
  throw new Error("No se pudo crear la sala. Inténtalo de nuevo.");
}
export async function joinRoom(code:string) {
  const token=crypto.randomUUID();
  const {data,error}=await supabaseAdmin.from("arcade_fight_rooms").select("host_character,version").eq("code",code).is("guest_token_hash",null).gt("expires_at",new Date().toISOString()).maybeSingle();
  if(error||!data) throw new Error("Código incorrecto, sala llena o caducada.");
  const state=createFight(Date.now());
  const {data:updated,error:writeError}=await supabaseAdmin.from("arcade_fight_rooms").update({guest_token_hash:await hash(token),state:state as unknown as Json,version:data.version+1}).eq("code",code).eq("version",data.version).is("guest_token_hash",null).select("code").maybeSingle();
  if(writeError||!updated) throw new Error("La sala ya está ocupada.");
  return {code,token,character:otherFighter(data.host_character as Fighter),state};
}
export async function readRoom(code:string,token:string) {
  const h=await hash(token);
  const {data,error}=await supabaseAdmin.from("arcade_fight_rooms").select("*").eq("code",code).gt("expires_at",new Date().toISOString()).or(`host_token_hash.eq.${h},guest_token_hash.eq.${h}`).maybeSingle();
  if(error||!data) throw new Error("Sala caducada o conexión no autorizada.");
  return {...data,isHost:data.host_token_hash===h};
}
export async function saveRoom(room:Tables<"arcade_fight_rooms">,state:FightState) {
  const {data,error}=await supabaseAdmin.from("arcade_fight_rooms").update({state:state as unknown as Json,version:room.version+1}).eq("code",room.code).eq("version",room.version).select("code").maybeSingle();
  if(error) throw new Error("No se pudo actualizar la partida.");
  return !!data;
}