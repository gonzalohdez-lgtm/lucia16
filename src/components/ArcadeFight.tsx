import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { X, Swords, Shield, Zap, Trophy, Users, Copy, RotateCcw, Flame } from "lucide-react";
import arena from "@/assets/fight-arena.jpg";
import luciaPortrait from "@/assets/lucia-fighter.jpg.asset.json";
import gonzaloPortrait from "@/assets/gonzalo-fighter.jpg.asset.json";
import { createFight, applyFightAction, advanceFight, fighterNames, specialNames, otherFighter, type Fighter, type FightAction, type FightState } from "@/lib/fight";
import { createFightRoom, joinFightRoom, updateFightRoom } from "@/lib/fight.functions";
const portraits = { lucia: luciaPortrait.url, gonzalo: gonzaloPortrait.url };
type Session = { code: string; token: string; character: Fighter };
const actions: { action: FightAction; title: string; icon: typeof Zap }[] = [
  { action: "quick", title: "Atacar", icon: Swords }, { action: "heavy", title: "Ataque fuerte", icon: Flame },
  { action: "block", title: "Bloquear", icon: Shield }, { action: "special", title: "Especial", icon: Zap },
];
export function ArcadeFight() {
  const [open, setOpen] = useState(false);
  return <><Button className="af-launch" onClick={()=>setOpen(true)}><Swords /> ENTRAR AL ARCADE</Button>{open && <FightScreen onClose={()=>setOpen(false)} />}</>;
}
function FightScreen({onClose}:{onClose:()=>void}) {
  const [screen,setScreen]=useState<"loading"|"select"|"play">("loading");
  const [character,setCharacter]=useState<Fighter>("lucia");
  const [mode,setMode]=useState<"solo"|"online">("solo");
  const [state,setState]=useState<FightState>(()=>createFight(0));
  const [session,setSession]=useState<Session|null>(null);
  const [code,setCode]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [clock,setClock]=useState(0);
  const [effect,setEffect]=useState<FightState["event"]>(null);
  const [copied,setCopied]=useState(false);
  const lock=useRef(false), lastEvent=useRef("");
  const createRoom=useServerFn(createFightRoom), joinRoom=useServerFn(joinFightRoom), updateRoom=useServerFn(updateFightRoom);
  useEffect(()=>{ const previous=document.body.style.overflow; document.body.style.overflow="hidden"; const t=setTimeout(()=>setScreen("select"),1400); const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();}; document.addEventListener("keydown",key); return()=>{clearTimeout(t);document.body.style.overflow=previous;document.removeEventListener("keydown",key);}; },[onClose]);
  useEffect(()=>{ const t=setInterval(()=>setClock(Date.now()),100); return()=>clearInterval(t); },[]);
  useEffect(()=>{
    if(screen!=="play"||session) return;
    const t=setInterval(()=>setState(s=>advanceFight(s,Date.now())),200);return()=>clearInterval(t);
  },[screen,session]);
  useEffect(()=>{
    if(screen!=="play"||session||state.phase!=="fight")return;
    const t=setInterval(()=>setState(s=>{
      const opponent=otherFighter(character), f=s.fighters[opponent];
      const r=Math.random(); const action:FightAction=f.energy>=100 ? "special" : r<.2 ? "block" : r<.6 ? "quick" : "heavy";
      return applyFightAction(s,opponent,action,Date.now());
    }),1600); return()=>clearInterval(t);
  },[screen,session,character,state.phase]);
  useEffect(()=>{
    if(!session||screen!=="play"||state.phase==="finished")return;
    let cancelled=false;
    const poll=async()=>{ if(lock.current)return; lock.current=true;try{const r=await updateRoom({data:{code:session.code,token:session.token}});if(!cancelled){setState(r.state);setError("");}}catch(e){if(!cancelled)setError(e instanceof Error?e.message:"Conexión interrumpida.");}finally{lock.current=false;} };
    const t=setInterval(poll,600);void poll();return()=>{cancelled=true;clearInterval(t);};
  },[session,screen,state.phase,updateRoom]);
  useEffect(()=>{
    const ev=state.event; if(!ev)return;const key=`${state.round}:${ev.id}`;if(key===lastEvent.current)return;lastEvent.current=key;setEffect(ev);const t=setTimeout(()=>setEffect(null),850);return()=>clearTimeout(t);
  },[state.event,state.round]);
  const startSolo=()=>{setState(createFight(Date.now()));setScreen("play");setSession(null);lastEvent.current="";};
  const connect=async(join:boolean)=>{
    setBusy(true);setError("");try{
      if(join&&!/^[A-Z2-9]{8}$/.test(code))throw new Error("Introduce el código de 8 letras y números.");
      const r=join?await joinRoom({data:{code}}):await createRoom({data:{character}});
      setSession({code:r.code,token:r.token,character:r.character});setCharacter(r.character);setState(r.state);setScreen("play");
    }catch(e){setError(e instanceof Error?e.message:"No se pudo conectar.");}finally{setBusy(false);}
  };
  const act=async(action:FightAction)=>{
    if(!session){setState(s=>applyFightAction(s,character,action,Date.now()));return;}
    if(lock.current)return;lock.current=true;setBusy(true);
    try{const r=await updateRoom({data:{code:session.code,token:session.token,action}});setState(r.state);setError("");}catch(e){setError(e instanceof Error?e.message:"No se pudo enviar el ataque.");}finally{lock.current=false;setBusy(false);}
  };
  const me=state.fighters[character];
  const seconds=Math.max(0,Math.min(99,Math.ceil((state.deadline-clock)/1000)));
  const winner=state.winner;
  return <section className="af-screen" role="dialog" aria-modal="true" aria-label="Lucía vs. Gonzalo arcade">
    <header className="af-top"><span>DAY 13 / ARCADE</span><Button variant="ghost" size="icon" aria-label="Cerrar arcade" onClick={onClose}><X /></Button></header>
    {screen==="loading" ? <div className="af-loading"><Swords size={64}/><h1>LUCÍA VS. GONZALO</h1><p>CARGANDO COMBATE…</p><div className="af-load-track"><span/></div></div> : screen==="select" ? <div className="af-select">
      <p className="af-kicker">THE ULTIMATE SHOWDOWN</p><h1>LUCÍA <i>VS.</i> GONZALO</h1><h2>ELIGE PERSONAJE</h2>
      <div className="af-characters">{(["lucia","gonzalo"] as Fighter[]).map(f=><Button key={f} variant="outline" aria-pressed={character===f} className={`af-character ${character===f?"is-picked":""}`} onClick={()=>setCharacter(f)}><img src={portraits[f]} alt={fighterNames[f]} width={400} height={400}/><strong>{fighterNames[f]}</strong><span>{specialNames[f]}</span><small>{character===f?"PLAYER 1 · SELECCIONADO":"100 HP · COMBATIENTE"}</small></Button>)}</div>
      <div className="af-modes"><Button variant="ghost" aria-pressed={mode==="solo"} onClick={()=>setMode("solo")}><Swords/>Contra la máquina</Button><Button variant="ghost" aria-pressed={mode==="online"} onClick={()=>setMode("online")}><Users/>Multijugador</Button></div>
      {mode==="solo"?<Button className="af-primary" onClick={startSolo}>FIGHT! <Swords/></Button>:<div className="af-online"><Button className="af-primary" disabled={busy} onClick={()=>void connect(false)}><Users/>Crear sala</Button><span>O</span><form onSubmit={e=>{e.preventDefault();void connect(true);}}><input aria-label="Código de sala" placeholder="CÓDIGO DE SALA" maxLength={8} value={code} onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g,""))}/><Button type="submit" disabled={busy||code.length!==8}>Unirme</Button></form></div>}
      {error&&<p className="af-error" role="alert">{error}</p>}
    </div> : <div className="af-game">
      <div className="af-hud">{(["lucia","gonzalo"] as Fighter[]).map((f,i)=><div className={`af-health af-health-${i}`} key={f}><div className="af-health-name"><img src={portraits[f]} alt="" width={48} height={48}/><b>{fighterNames[f]}</b><span>{state.fighters[f].hp} HP</span></div><progress aria-label={`Vida de ${fighterNames[f]}`} max={100} value={state.fighters[f].hp}/><div className="af-round-pips">{[1,2].map(n=><span key={n} className={state.fighters[f].wins>=n?"won":""}>◆</span>)}<small>{f===character?"TÚ":session?"PLAYER 2":"CPU"}</small></div></div>)}<div className="af-timer"><b>{String(seconds).padStart(2,"0")}</b><span>ROUND {state.round} / 3</span></div></div>
      <div className={`af-arena ${effect&&effect.action!=="block"?"is-shaking":""}`}>
        <img className="af-scenery" src={arena} alt="Escenario arcade junto al Guadalquivir" width={1536} height={1024}/>
        {(["lucia","gonzalo"] as Fighter[]).map(f=><div key={f} className={`af-fighter af-${f} ${effect?.actor===f?`move-${effect.action}`:""} ${state.fighters[f].blocking?"is-blocking":""} ${clock<state.fighters[f].stunnedUntil?"is-stunned":""} ${state.phase==="finished"&&winner===f?"is-winner":""}`}><div className="af-avatar"><img src={portraits[f]} alt={fighterNames[f]} width={400} height={400}/></div><div className="af-body"><span className="af-arm arm-left"/><span className="af-arm arm-right"/><span className="af-leg leg-left"/><span className="af-leg leg-right"/></div><b>{fighterNames[f]}</b>{clock<state.fighters[f].stunnedUntil&&<span className="af-stars">★ ★ ★</span>}</div>)}
        {effect&&<div key={`${state.round}:${effect.id}`} className={`af-bubble ${effect.action==="special"?"is-special":""}`} role="status">{effect.text}</div>}
        {state.phase==="waiting"&&<div className="af-overlay"><Users size={40}/><h2>ESPERANDO RIVAL</h2><p>CÓDIGO DE SALA</p><strong className="af-room-code">{session?.code}</strong><Button onClick={()=>{void navigator.clipboard.writeText(session?.code??"").then(()=>setCopied(true)).catch(()=>setError("No se pudo copiar el código."));}}><Copy/>{copied?"Copiado":"Copiar código"}</Button></div>}
        {state.phase==="roundover"&&<div className="af-overlay"><strong className="af-ko">K.O.</strong><h2>{state.roundWinner==="draw"?"EMPATE":state.roundWinner?`${fighterNames[state.roundWinner]} WIN`:""}</h2><p>SIGUIENTE RONDA…</p></div>}
        {state.phase==="finished"&&<div className="af-overlay af-results"><strong className="af-ko">K.O.</strong><h2>{winner==="draw"?"EMPATE":winner?`${fighterNames[winner]} WIN`:""}</h2><Trophy className="af-trophy" size={64}/><p>{state.fighters.lucia.wins} – {state.fighters.gonzalo.wins} · {state.round} RONDAS</p><div className="af-stats">{(["lucia","gonzalo"] as Fighter[]).map(f=><div key={f}><b>{fighterNames[f]}</b><span>Daño: {state.fighters[f].damage}</span><span>Golpes: {state.fighters[f].hits}</span><span>Bloqueos: {state.fighters[f].blocks}</span><span>Especiales: {state.fighters[f].specials}</span><span>Críticos: {state.fighters[f].criticals}</span></div>)}</div><Button className="af-primary" onClick={()=>{setSession(null);setScreen("select");setEffect(null);setError("");lastEvent.current="";}}><RotateCcw/>{session?"Nueva partida":"Revancha"}</Button></div>}
      </div>
      <div className="af-controls"><div className="af-energy"><b>{fighterNames[character]} · SUPER</b><progress aria-label="Energía especial" value={me.energy} max={100}/><span>{me.energy}%</span></div><div className="af-actions">{actions.map(({action,title,icon:Icon})=><Button key={action} className={`af-action ${action==="special"?"af-super":""}`} disabled={busy||state.phase!=="fight"||clock<me.readyAt||clock<me.stunnedUntil||(action==="special"&&me.energy<100)} onClick={()=>void act(action)}><Icon/><b>{title}</b><small>{action==="quick"?"Robar patata frita":action==="heavy"?"Siesta fulminante":action==="block"?"No meter prisa":specialNames[character]}</small></Button>)}</div>{session&&state.phase!=="waiting"&&<p className="af-session-code">SALA {session.code}</p>}{error&&<p className="af-error" role="alert">{error}</p>}</div>
    </div>}
  </section>;
}