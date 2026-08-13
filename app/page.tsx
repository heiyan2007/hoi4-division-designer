"use client";

import { useMemo, useState } from "react";
import data from "./battalions.json";

type Unit = (typeof data)[number];
type Stat = "width"|"org"|"hp"|"speed"|"manpower"|"soft"|"hard"|"piercing"|"defense"|"breakthrough"|"armor"|"hardness"|"cost"|"fuel"|"supply";
type Totals = Record<Stat, number>;
const statRows:[Stat,string,string][] = [
  ["width","鎴樻枟瀹藉害",""],["org","缁勭粐搴?,""],["hp","鐢熷懡鍊?,""],["speed","閫熷害"," km/h"],["manpower","浜哄姏闇€姹?,""],
  ["soft","杞敾鍑?,""],["hard","纭敾鍑?,""],["piercing","绌跨敳",""],["defense","闃插尽",""],["breakthrough","绐佺牬",""],["armor","瑁呯敳",""],["hardness","鎶楁€?,"%"],
  ["cost","宸ヤ笟鎴愭湰"," IC"],["fuel","娌规枡娑堣€?,""],["supply","琛ョ粰娑堣€?,""]
];
const empty:Totals={width:0,org:0,hp:0,speed:0,manpower:0,soft:0,hard:0,piercing:0,defense:0,breakthrough:0,armor:0,hardness:0,cost:0,fuel:0,supply:0};
const presets:Record<string,string[]>={
  "寰峰浗 42瀹芥鍏靛笀":[...Array(9).fill("inf"),...Array(6).fill("art"),"eng","rec","log"],
  "鑻忚仈杩戝崼鍧﹀厠甯?:[...Array(6).fill("med"),...Array(4).fill("mot"),"eng","rec","maint","log"],
  "缇庡浗娴峰啗闄嗘垬甯?:[...Array(9).fill("marine"),...Array(3).fill("art"),"eng","art_sup","log","hospital"],
  "鏃ユ湰姝ュ叺甯?:[...Array(9).fill("inf"),...Array(3).fill("art"),"eng","rec","art_sup"]
};

function calc(ids:string[]):Totals{
  const units=ids.map(id=>data.find(x=>x.id===id)).filter(Boolean) as Unit[];
  const combat=units.filter(x=>x.category!=="鏀彺杩?);
  const sum=(k:Stat)=>units.reduce((n,x)=>n+(Number(x[k as keyof Unit])||0),0);
  const weighted=(k:Stat)=>combat.length?combat.reduce((n,x)=>n+(Number(x[k as keyof Unit])||0),0)/combat.length:0;
  return {...empty,width:sum("width"),org:weighted("org"),hp:sum("hp"),speed:combat.length?Math.min(...combat.map(x=>x.speed)):0,manpower:sum("manpower"),soft:sum("soft"),hard:sum("hard"),piercing:Math.max(0,...units.map(x=>x.piercing)),defense:sum("defense"),breakthrough:sum("breakthrough"),armor:weighted("armor"),hardness:weighted("hardness"),cost:sum("cost"),fuel:sum("fuel"),supply:sum("supply")};
}

export default function Home(){
  const [view,setView]=useState<"home"|"designer"|"compare">("home");
  const [ids,setIds]=useState<string[]>(presets["寰峰浗 42瀹芥鍏靛笀"]);
  const [filter,setFilter]=useState("鍏ㄩ儴");
  const [saved,setSaved]=useState<Record<string,string[]>>({});
  const totals=useMemo(()=>calc(ids),[ids]);
  const combat=ids.filter(id=>data.find(x=>x.id===id)?.category!=="鏀彺杩?);
  const support=ids.filter(id=>data.find(x=>x.id===id)?.category==="鏀彺杩?);
  const groups=["鍏ㄩ儴","姝ュ叺","鏈哄姩","鐐叺","鍧﹀厠","鏀彺杩?];
  const visible=data.filter(x=>filter==="鍏ㄩ儴"||x.group===filter||x.category===filter);
  const add=(id:string)=>{const u=data.find(x=>x.id===id)!; if(u.category==="鏀彺杩?&&support.length>=5)return; if(u.category!=="鏀彺杩?&&combat.length>=25)return; setIds(v=>[...v,id])};
  const load=(name:string)=>{setIds(presets[name]);setView("designer")};
  const save=(slot:"A"|"B")=>{setSaved(s=>({...s,[slot]:[...ids]}));localStorage.setItem(`hoi4-${slot}`,JSON.stringify(ids))};
  const planA=saved.A||(()=>{try{return JSON.parse(localStorage.getItem("hoi4-A")||"[]")}catch{return []}})();
  const planB=saved.B||(()=>{try{return JSON.parse(localStorage.getItem("hoi4-B")||"[]")}catch{return []}})();
  const a=calc(planA),b=calc(planB);
  return <main>
    <header><button className="brand" onClick={()=>setView("home")}><span>鈪?/span> 甯堢紪鍙镐护閮?/button><nav><button onClick={()=>setView("designer")} className={view==="designer"?"active":""}>甯堢紪璁捐鍣?/button><button onClick={()=>setView("compare")} className={view==="compare"?"active":""}>鏂规姣旇緝</button></nav><div className="version">鍩虹瑙勫垯 路 1.0</div></header>
    {view==="home"&&<>
      <section className="hero"><div className="eyebrow">DIVISION COMMANDER'S WORKBENCH</div><h1>HOI4 <em>甯堢紪璁＄畻鍣?/em></h1><p>妯℃嫙涓嶅悓钀ョ骇缁勫悎锛屽揩閫熻绠楀笀灞炴€т笌浣滄垬鑳藉姏</p><div className="hero-actions"><button className="primary" onClick={()=>setView("designer")}>锛?鍒涘缓鏂板笀</button><button onClick={()=>document.querySelector("#popular")?.scrollIntoView()}>鏌ョ湅鐑棬妯℃澘 鈫?/button><button onClick={()=>setView("compare")}>瀵规瘮涓や釜鏂规</button></div><div className="intel"><span>瀹炴椂婕旂畻</span><span>16 绉嶈惀绾у崟浣?/span><span>鏃犻渶鐧诲綍</span><span>鏈湴淇濆瓨</span></div></section>
      <section className="popular" id="popular"><div className="section-title"><div><small>FIELD MANUAL / 01</small><h2>鐑棬甯堢紪妯℃澘</h2></div><p>涔呯粡鎴樺満妫€楠岀殑缁忓吀缂栧埗锛岄€夋嫨鍚庡彲缁х画璋冩暣銆?/p></div><div className="cards">{Object.entries(presets).map(([n,p],i)=><button className="template" key={n} onClick={()=>load(n)}><div className={`flag f${i}`}>{["DE","SU","US","JP"][i]}</div><small>{i===0?"瑗跨嚎涓诲姏":i===1?"涓滅嚎绐佸嚮":i===2?"涓ゆ爾浣滄垬":"浜氭床鎴樺満"}</small><h3>{n}</h3><p>{p.filter(x=>data.find(u=>u.id===x)?.category!=="鏀彺杩?).length} 浣滄垬钀?路 {p.filter(x=>data.find(u=>u.id===x)?.category==="鏀彺杩?).length} 鏀彺杩?/p><div><b>瀹藉害 {calc(p).width}</b><b>缁勭粐搴?{calc(p).org.toFixed(0)}</b></div><span className="open">杞藉叆璁捐鍣?鈫?/span></button>)}</div></section>
      <section className="workflow"><small>浠庢瀯鎯冲埌鎴樺満</small><h2>涓夋瀹屾垚浣犵殑甯堢紪</h2><div><p><b>01</b><strong>閫夋嫨钀ョ骇鍗曚綅</strong><span>浠庢鍏点€佺偖鍏点€佽鐢插叺涓庢敮鎻磋繛涓寫閫夈€?/span></p><p><b>02</b><strong>缁勫悎甯堢骇缂栧埗</strong><span>鐩磋鎺掑垪鍚勫洟涓庤惀锛岄殢鏃跺鍒犺皟鏁淬€?/span></p><p><b>03</b><strong>鍒嗘瀽浣滄垬鑳藉姏</strong><span>瀹炴椂鏌ョ湅鎴樻枟涓庡悗鍕ゆ暟鎹紝淇濆瓨骞舵瘮杈冦€?/span></p></div></section>
    </>}
    {view==="designer"&&<section className="designer">
      <div className="designer-head"><div><small>DIVISION DESIGNER</small><h1>甯堢紪璁捐鍣?/h1></div><div><button onClick={()=>setIds([])}>娓呯┖缂栧埗</button><button onClick={()=>save("A")}>淇濆瓨涓?A</button><button onClick={()=>save("B")}>淇濆瓨涓?B</button><button className="primary" onClick={()=>setView("compare")}>姣旇緝鏂规</button></div></div>
      <div className="workbench"><aside className="library"><h2>钀ヤ笌鏀彺杩?/h2><div className="filters">{groups.map(g=><button className={filter===g?"active":""} onClick={()=>setFilter(g)} key={g}>{g}</button>)}</div><div className="unit-list">{visible.map(u=><button key={u.id} onClick={()=>add(u.id)}><i className={`unit-icon ${u.group}`}>{u.icon}</i><span><b>{u.name}</b><small>{u.category} 路 瀹藉害 {u.width||"鈥?}</small></span><strong>锛?/strong></button>)}</div></aside>
      <section className="board"><div className="board-top"><div><small>褰撳墠缂栧埗</small><h2>绗?1 瀹為獙甯?/h2></div><span>{combat.length}/25 浣滄垬钀?/span></div><p className="hint">鐐瑰嚮鍗曚綅鍗＄墖娣诲姞锛涚偣鍑荤紪鍒朵腑鐨勮惀鍗冲彲鍒犻櫎</p><div className="grid">{Array.from({length:25},(_,i)=>{const id=combat[i],u=data.find(x=>x.id===id);return <button key={i} className={u?"filled":""} onClick={()=>u&&setIds(v=>{const target=v.indexOf(id);return v.filter((_,j)=>j!==target)})}>{u?<><i className={`unit-icon ${u.group}`}>{u.icon}</i><span>{u.short}</span></>:<span>锛?/span>}</button>})}</div><div className="support"><h3>鏀彺杩?<span>{support.length}/5</span></h3><div>{Array.from({length:5},(_,i)=>{const id=support[i],u=data.find(x=>x.id===id);return <button key={i} className={u?"filled":""} onClick={()=>u&&setIds(v=>{const target=v.lastIndexOf(id);return v.filter((_,j)=>j!==target)})}>{u?<><i className="unit-icon 鏀彺杩?>{u.icon}</i><span>{u.short}</span></>:"锛?}</button>})}</div></div><div className="quick"><span>蹇€熻浇鍏ワ細</span>{Object.keys(presets).map(n=><button key={n} onClick={()=>load(n)}>{n.replace(/甯?/,"")}</button>)}</div></section>
      <aside className="stats"><div className="stats-title"><h2>甯堢骇灞炴€?/h2><span className={totals.width===20||totals.width===30||totals.width===35?"good":"warn"}>瀹藉害璇勪及</span></div>{[["鍩虹灞炴€?,statRows.slice(0,5)],["浣滄垬灞炴€?,statRows.slice(5,12)],["鍚庡嫟灞炴€?,statRows.slice(12)]].map(([title,rows])=><div className="stat-group" key={title as string}><h3>{title as string}</h3>{(rows as [Stat,string,string][]).map(([k,l,s])=><div key={k}><span>{l}</span><b>{Number.isInteger(totals[k])?totals[k]:totals[k].toFixed(1)}{s}</b></div>)}</div>)}<div className="equipment"><h3>瑁呭闇€姹傛瑙?/h3>{Object.entries(ids.reduce((o,id)=>{const u=data.find(x=>x.id===id)!;o[u.equipment]=(o[u.equipment]||0)+1;return o},{} as Record<string,number>)).map(([k,v])=><p key={k}><span>{k}</span><b>脳 {v}</b></p>)}</div></aside></div>
    </section>}
    {view==="compare"&&<section className="compare"><div className="compare-head"><small>AFTER ACTION REPORT</small><h1>甯堢紪鏂规姣旇緝</h1><p>淇濆瓨涓や釜鏂规锛岀郴缁熷皢鑷姩鏍囪姣忛」鏁版嵁鐨勪紭鍔挎柟銆?/p></div><div className="compare-grid"><div className="plan"><span>鏂规 A</span><h2>{planA.length?`${planA.length} 涓崟浣嶇殑缂栧埗`:"灏氭湭淇濆瓨鏂规"}</h2><button onClick={()=>{setView("designer");save("A")}}>鐢ㄥ綋鍓嶇紪鍒惰鐩?/button></div><div className="versus">VS</div><div className="plan"><span>鏂规 B</span><h2>{planB.length?`${planB.length} 涓崟浣嶇殑缂栧埗`:"灏氭湭淇濆瓨鏂规"}</h2><button onClick={()=>{setView("designer");save("B")}}>鐢ㄥ綋鍓嶇紪鍒惰鐩?/button></div></div><div className="comparison"><div className="compare-row header"><b>灞炴€?/b><b>鏂规 A</b><b>鏂规 B</b><b>宸€?/b></div>{statRows.filter(([k])=>["org","soft","hard","breakthrough","defense","width","cost"].includes(k)).map(([k,l,s])=>{const lower=k==="width"||k==="cost";const awin=lower?a[k]<b[k]:a[k]>b[k],bwin=lower?b[k]<a[k]:b[k]>a[k];return <div className="compare-row" key={k}><span>{l}</span><b className={awin?"winner":""}>{a[k].toFixed(k==="org"?1:0)}{s}</b><b className={bwin?"winner":""}>{b[k].toFixed(k==="org"?1:0)}{s}</b><i>{(a[k]-b[k])>0?"+":""}{(a[k]-b[k]).toFixed(1)}</i></div>})}</div><button className="primary back" onClick={()=>setView("designer")}>鈫?杩斿洖璁捐鍣ㄧ户缁皟鏁?/button></section>}
    <footer><b>HOI4 甯堢紪璁＄畻鍣?/b><span>鍩轰簬鍩虹瑙勫垯鐨勯潪瀹樻柟宸ュ叿 路 娓告垙鏁版嵁浠呬緵绛栫暐鍙傝€?/span></footer>
  </main>
}

