import { useState, useMemo, useEffect } from "react";

// ── 상수 ─────────────────────────────────────────────
const COLOR_OPTIONS=[
  "#FF6B6B","#F4A261","#FFD166","#52C47A","#4ECDC4",
  "#4A90D9","#9B8EC4","#FF8FAB","#C7B8EA","#A8E6CF","#FF9F80","#87CEEB",
];
const EMOJI_OPTIONS=["🧘","⛷️","🏂","🤸","🏄","🚣","🧗","🥊","⚽","🏀","🎾","🏸","🤽","🛶","🏇","🤼","🥋","🤺","🎿","🛹","🏌️","🎯","🎱","🎳","🧜","🏊","🚵","🤾","🏋️"];
const mkGrad=(c)=>`linear-gradient(135deg,${c},${c}CC)`;
const BASE_SPORTS={
  running:{label:"러닝",emoji:"🏃",color:"#FF6B6B"},
  swimming:{label:"수영",emoji:"🏊",color:"#4ECDC4"},
  crossfit:{label:"크로스핏",emoji:"🏋️",color:"#F4A261"},
  gym:{label:"헬스",emoji:"💪",color:"#52C47A"},
  cycling:{label:"자전거",emoji:"🚴",color:"#9B8EC4"},
};
const TRAIN_TYPES=["이지런","모임런","템포런","인터벌","롱런","휴식"];
const STROKE_TYPES=["자유형","배영","평영","접영","드릴","킥"];
const AIDS=["없음","킥판","풀부이","패들","핀","스노클"];
const GYM_PARTS={"가슴":["벤치프레스","인클라인프레스","덤벨플라이","딥스"],"등":["데드리프트","풀업","랫풀다운","바벨로우"],"하체":["스쿼트","레그프레스","레그컬","런지"],"어깨":["오버헤드프레스","사이드레이즈","프론트레이즈"],"팔":["바벨컬","해머컬","트라이셉스푸시다운"],"복근":["크런치","레그레이즈","플랭크"],"유산소":["트레드밀","사이클","로잉머신"]};
const PARTS=Object.keys(GYM_PARTS);
const SPLIT={월:"가슴",화:"등",수:"하체",목:"어깨",금:"팔",토:"복근",일:"휴식"};
const DAYS=["일","월","화","수","목","금","토"];
const WOD_TYPES=["AMRAP","For Time","EMOM","Tabata","RFT","기타"];

const INIT_DATA={
  "2026-04-01":[{sport:"running",done:true,plan:{type:"이지런"},rec:{distance:"6.2",pace_m:"6",pace_s:"05",avg_hr:"142",calories:"380"}}],
  "2026-04-03":[{sport:"gym",done:true,parts:["가슴"],calories:"320"}],
  "2026-04-05":[{sport:"running",done:true,rec:{distance:"8.4",pace_m:"5",pace_s:"48",avg_hr:"158",calories:"520"}},{sport:"swimming",done:true,rec:{distance:"1500",calories:"380"}}],
  "2026-04-07":[{sport:"crossfit",done:true,wodType:"For Time",wod:"21-15-9",score:{tm:"12",ts:"34"},rx:true,calories:"480"}],
  "2026-04-08":[{sport:"running",done:true,rec:{distance:"6.1",pace_m:"6",pace_s:"10",avg_hr:"138",calories:"360"}}],
  "2026-04-10":[{sport:"gym",done:true,parts:["등"],calories:"340"}],
  "2026-04-12":[{sport:"cycling",done:true,rtype:"실외",rec:{dist:"32.4",avg_sp:"24.2",avg_hr:"148",cal:"620"}}],
  "2026-04-14":[{sport:"running",done:true,rec:{distance:"15.2",pace_m:"5",pace_s:"55",avg_hr:"152",calories:"920"}}],
  "2026-04-15":[{sport:"gym",done:true,parts:["하체"],calories:"380"},{sport:"swimming",done:false,rec:{distance:"1000"}}],
  "2026-04-17":[{sport:"crossfit",done:true,wodType:"AMRAP",wod:"20min AMRAP",score:{rounds:"12",reps:"8"},rx:false,calories:"420"}],
  "2026-04-19":[{sport:"running",done:true,rec:{distance:"8.8",pace_m:"5",pace_s:"30",avg_hr:"172",calories:"580"}}],
  "2026-04-21":[{sport:"gym",done:true,parts:["어깨","팔"],calories:"310"}],
  "2026-04-22":[{sport:"cycling",done:true,rtype:"실내",rec:{dist:"25.0",avg_sp:"22.8",avg_hr:"145",cal:"480"}}],
  "2026-04-24":[{sport:"running",done:true,rec:{distance:"10.3",pace_m:"5",pace_s:"52",avg_hr:"155",calories:"640"}},{sport:"crossfit",done:false,wod:"",score:{},rx:true}],
  "2026-04-26":[{sport:"swimming",done:true,rec:{distance:"2000",calories:"520"}}],
  "2026-04-28":[{sport:"gym",done:true,parts:["가슴","복근"],calories:"360"}],
  "2026-04-29":[{sport:"running",done:true,rec:{distance:"8.1",pace_m:"5",pace_s:"44",avg_hr:"160",calories:"510"}}],
  "2026-04-30":[{sport:"crossfit",done:false,wod:"",score:{},rx:true}],
};

// ── 공통 UI ──────────────────────────────────────────
const Inp=({value,onChange,placeholder=""})=>(
  <input value={value} onChange={onChange} placeholder={placeholder}
    style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#1A1A2E",background:"#F8F8F8",boxSizing:"border-box",outline:"none"}}
    onFocus={e=>e.target.style.borderColor="#6C63FF"}
    onBlur={e=>e.target.style.borderColor="#EFEFEF"}/>
);
const Card=({title,tag,tc="#6C63FF",children})=>(
  <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
    {title&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:700,color:"#888"}}>{title}</div>
      {tag&&<span style={{fontSize:11,background:tc+"18",color:tc,borderRadius:6,padding:"2px 8px",fontWeight:600}}>{tag}</span>}
    </div>}
    {children}
  </div>
);
const Tog=({value,onChange,color="#6C63FF"})=>(
  <div onClick={onChange} style={{width:46,height:26,borderRadius:13,background:value?color:"#E0E0E0",cursor:"pointer",position:"relative",transition:"background 0.25s",flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:value?23:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
  </div>
);
const Btn=({onClick,color="#6C63FF",children,saved})=>(
  <button onClick={onClick} style={{width:"100%",background:saved?"#52C47A":color,color:"#fff",border:"none",borderRadius:14,padding:"14px 0",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.25s",boxShadow:saved?"none":`0 4px 14px ${color}44`}}>
    {saved?"저장됨 ✓":children}
  </button>
);
const BarChart=({data,vk,lk,color})=>{
  const max=Math.max(...data.map(d=>d[vk]),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:11,color:"#888",fontWeight:700}}>{d[vk]}</div>
          <div style={{width:"100%",background:"#F0F0F0",borderRadius:6,flex:1,display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
            <div style={{width:"100%",background:color,borderRadius:6,height:`${(d[vk]/max)*100}%`}}/>
          </div>
          <div style={{fontSize:10,color:"#BBB",fontWeight:600}}>{d[lk]}</div>
        </div>
      ))}
    </div>
  );
};
const LineChart=({data,vk,lk,color})=>{
  const vals=data.map(d=>d[vk]);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const pts=data.map((d,i)=>{
    const x=i/(data.length-1)*100;
    const y=((1-(d[vk]-mn)/rng)*70)+15;
    return `${x},${y}`;
  }).join(" ");
  return(
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%",height:80,display:"block"}}>
        <polyline points={`0,100 ${pts} 100,100`} fill={color+"22"} stroke="none"/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((d,i)=>{
          const x=i/(data.length-1)*100;
          const y=((1-(d[vk]-mn)/rng)*70)+15;
          return <circle key={i} cx={x} cy={y} r="3.5" fill={color} stroke="#fff" strokeWidth="2"/>;
        })}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        {data.map((d,i)=>(
          <div key={i} style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#CCC"}}>{d[lk]}</div>
            <div style={{fontSize:11,color:"#888",fontWeight:700,marginTop:1}}>{d[vk]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
const ColorPalette=({currentColor,onSelect})=>(
  <div style={{background:"#fff",borderRadius:14,padding:14,marginTop:6,border:"1.5px solid #F0F0F0",boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
    <div style={{fontSize:11,color:"#AAA",fontWeight:700,marginBottom:10}}>컬러 선택</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {COLOR_OPTIONS.map(c=>(
        <div key={c} onClick={()=>onSelect(c)} style={{width:32,height:32,borderRadius:10,background:c,cursor:"pointer",border:currentColor===c?"3px solid #1A1A2E":"3px solid transparent",boxShadow:"0 2px 6px rgba(0,0,0,0.15)",transition:"all 0.15s"}}/>
      ))}
    </div>
  </div>
);
const RecHeader=({sportKey,sel,setScr,allSports,sportColors})=>{
  const sp=allSports[sportKey]||{emoji:"🏃",label:"운동"};
  const col=sportColors[sportKey]||sp.color||"#6C63FF";
  return(
    <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <div>
          <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{sp.emoji} {sp.label} 기록</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div>
        </div>
      </div>
    </div>
  );
};

// ── 워치 가져오기 공통 컴포넌트 ──────────────────────
function WatchImport({col,watchType,setWatchType}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",gap:8}}>
        {[["garmin","⌚ 가민"],["apple","🍎 애플워치"]].map(([k,l])=>(
          <button key={k} onClick={()=>setWatchType(k)} style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:watchType===k?col:"#F5F5F5",color:watchType===k?"#fff":"#AAA",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>
      <div style={{background:col+"11",borderRadius:16,padding:14,border:`1.5px dashed ${col}88`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:col+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{watchType==="garmin"?"⌚":"🍎"}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{watchType==="garmin"?"가민 커넥트에서 가져오기":"애플 건강 앱에서 가져오기"}</div>
          <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{watchType==="garmin"?"활동 선택 → CSV 내보내기":"건강 앱 → 데이터 내보내기 → XML"}</div>
        </div>
        <button style={{background:col,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:`0 3px 8px ${col}44`}}>{watchType==="garmin"?"CSV":"XML"}</button>
      </div>
    </div>
  );
}
function AddCustomSportModal({onAdd,onClose}){
  const [label,setLabel]=useState("");
  const [emoji,setEmoji]=useState("🧘");
  const [color,setColor]=useState("#4A90D9");
  const [showEmoji,setShowEmoji]=useState(false);
  const [showColor,setShowColor]=useState(false);
  const canSave=label.trim().length>0;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:"#F5F5F7",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{width:36,height:4,background:"#E0E0E0",borderRadius:2,margin:"12px auto 0"}}/>
        <div style={{padding:"16px 20px 32px"}}>
          <div style={{fontSize:17,fontWeight:800,color:"#1A1A2E",marginBottom:4}}>새 종목 추가</div>
          <div style={{fontSize:12,color:"#AAA",marginBottom:20}}>나만의 운동 종목을 만들어보세요</div>
          {/* 미리보기 */}
          <div style={{background:mkGrad(color),borderRadius:18,padding:18,marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{emoji}</div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{label||"종목 이름"}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:3}}>거리 · 시간 · 심박 · 칼로리</div>
            </div>
          </div>
          {/* 종목 이름 */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:700}}>종목 이름</div>
            <Inp value={label} onChange={e=>setLabel(e.target.value)} placeholder="예) 필라테스, 클라이밍, 배드민턴"/>
          </div>
          {/* 이모지 */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:700}}>아이콘</div>
            <button onClick={()=>{setShowEmoji(p=>!p);setShowColor(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid #EFEFEF",background:"#fff",cursor:"pointer",textAlign:"left",boxSizing:"border-box"}}>
              <span style={{fontSize:24}}>{emoji}</span>
              <span style={{fontSize:13,fontWeight:600,color:"#888",flex:1}}>이모지 선택</span>
              <span style={{fontSize:12,color:"#CCC"}}>{showEmoji?"▴":"▾"}</span>
            </button>
            {showEmoji&&(
              <div style={{background:"#fff",borderRadius:14,padding:14,marginTop:6,border:"1.5px solid #F0F0F0",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {EMOJI_OPTIONS.map(e=>(
                    <button key={e} onClick={()=>{setEmoji(e);setShowEmoji(false);}} style={{width:40,height:40,borderRadius:10,border:`2px solid ${emoji===e?"#6C63FF":"transparent"}`,background:emoji===e?"#F0F0FF":"#F8F8F8",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 컬러 */}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:700}}>컬러</div>
            <button onClick={()=>{setShowColor(p=>!p);setShowEmoji(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid #EFEFEF",background:"#fff",cursor:"pointer",textAlign:"left",boxSizing:"border-box"}}>
              <div style={{width:28,height:28,borderRadius:8,background:color,boxShadow:`0 2px 6px ${color}66`}}/>
              <span style={{fontSize:13,fontWeight:600,color:"#888",flex:1}}>컬러 선택</span>
              <span style={{fontSize:12,color:"#CCC"}}>{showColor?"▴":"▾"}</span>
            </button>
            {showColor&&<ColorPalette currentColor={color} onSelect={c=>{setColor(c);setShowColor(false);}}/>}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{flex:1,padding:"13px 0",borderRadius:14,border:"2px solid #E8E8E8",background:"#fff",fontSize:14,fontWeight:700,color:"#AAA",cursor:"pointer"}}>취소</button>
            <button onClick={()=>{if(canSave){onAdd({id:`custom_${Date.now()}`,label:label.trim(),emoji,color});onClose();}}} style={{flex:2,padding:"13px 0",borderRadius:14,border:"none",background:canSave?color:"#E0E0E0",fontSize:14,fontWeight:700,color:"#fff",cursor:canSave?"pointer":"default",boxShadow:canSave?`0 4px 14px ${color}44`:"none",transition:"all 0.2s"}}>
              {emoji} {label||"종목"} 추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 운동 추가 모달 ────────────────────────────────────
function AddModal({date,onAdd,onClose,sportColors,setSportColors,customSports,onAddCustom}){
  const [picked,setPicked]=useState([]);
  const [colorTarget,setColorTarget]=useState(null);
  const [showAddCustom,setShowAddCustom]=useState(false);
  const togPick=(k)=>setPicked(p=>p.includes(k)?p.filter(x=>x!==k):[...p,k]);
  const allSports=[
    ...Object.entries(BASE_SPORTS).map(([k,v])=>({id:k,...v})),
    ...customSports,
  ];
  const getCol=(k)=>sportColors[k]||BASE_SPORTS[k]?.color||customSports.find(s=>s.id===k)?.color||"#6C63FF";
  if(showAddCustom) return(
    <AddCustomSportModal
      onAdd={sp=>{onAddCustom(sp);setShowAddCustom(false);}}
      onClose={()=>setShowAddCustom(false)}/>
  );
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#F5F5F7",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{width:36,height:4,background:"#E0E0E0",borderRadius:2,margin:"12px auto 0"}}/>
        <div style={{padding:"16px 20px 30px"}}>
          <div style={{fontSize:17,fontWeight:800,color:"#1A1A2E",marginBottom:4}}>{date.replace(/-/g,".")} 운동 추가</div>
          <div style={{fontSize:12,color:"#AAA",marginBottom:16}}>🎨 버튼으로 종목 컬러를 바꿀 수 있어요</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
            {allSports.map(sp=>{
              const k=sp.id;
              const col=getCol(k);
              const isSel=picked.includes(k);
              const isOpen=colorTarget===k;
              return(
                <div key={k}>
                  <div onClick={()=>togPick(k)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,border:`2px solid ${isSel?col:"#E8E8E8"}`,background:isSel?col+"11":"#fff",cursor:"pointer",transition:"all 0.2s"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:isSel?mkGrad(col):"#F0F0F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{sp.emoji}</div>
                    <span style={{flex:1,fontSize:14,fontWeight:700,color:"#1A1A2E"}}>{sp.label}</span>
                    <div onClick={e=>{e.stopPropagation();setColorTarget(isOpen?null:k);}} style={{width:30,height:30,borderRadius:8,background:col,cursor:"pointer",border:"2px solid #fff",boxShadow:"0 2px 6px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🎨</div>
                    {isSel&&<div style={{width:22,height:22,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:13,fontWeight:800}}>✓</span></div>}
                  </div>
                  {isOpen&&<ColorPalette currentColor={col} onSelect={v=>{setSportColors(p=>({...p,[k]:v}));setColorTarget(null);}}/>}
                </div>
              );
            })}
          </div>
          {/* 새 종목 추가 */}
          <button onClick={()=>setShowAddCustom(true)} style={{width:"100%",padding:"13px 0",borderRadius:14,border:"2px dashed #D0D0D0",background:"#fff",fontSize:14,fontWeight:700,color:"#888",cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxSizing:"border-box"}}>
            <span style={{fontSize:20}}>＋</span> 새 종목 추가
          </button>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{flex:1,padding:"13px 0",borderRadius:14,border:"2px solid #E8E8E8",background:"#fff",fontSize:14,fontWeight:700,color:"#AAA",cursor:"pointer"}}>취소</button>
            <button onClick={()=>{if(picked.length){onAdd(picked);onClose();}}} style={{flex:2,padding:"13px 0",borderRadius:14,border:"none",background:picked.length?"#6C63FF":"#E0E0E0",fontSize:14,fontWeight:700,color:"#fff",cursor:picked.length?"pointer":"default",boxShadow:picked.length?"0 4px 14px #6C63FF44":"none",transition:"all 0.2s"}}>
              추가하기{picked.length>0?` (${picked.length})`:""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 달력 ─────────────────────────────────────────────
function CalendarScreen({sel,setSel,setScr,cur,setCur,data,onAdd,sportColors,setSportColors,customSports,onAddCustom}){
  const [showAdd,setShowAdd]=useState(false);
  const y=cur.getFullYear(),mo=cur.getMonth();
  const fd=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate(),off=(fd+6)%7;
  const toKey=(d)=>`${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const ss=data[sel]||[];
  const mk=`${y}-${String(mo+1).padStart(2,"0")}`;
  const mE=Object.entries(data).filter(([k])=>k.startsWith(mk));
  const wDays=mE.filter(([,v])=>v.length>0).length;
  const tot=mE.reduce((s,[,v])=>s+v.length,0);
  const don=mE.reduce((s,[,v])=>s+v.filter(e=>e.done).length,0);
  const cr=tot?Math.round(don/tot*100):0;
  const sc={};mE.forEach(([,v])=>v.forEach(e=>{sc[e.sport]=(sc[e.sport]||0)+1;}));
  const allSportsMap={...BASE_SPORTS,...Object.fromEntries(customSports.map(s=>[s.id,s]))};
  const getCol=(k)=>sportColors[k]||allSportsMap[k]?.color||"#6C63FF";
  return(
    <div style={{padding:"16px 20px",maxWidth:480,margin:"0 auto",paddingBottom:100}}>
      {showAdd&&<AddModal date={sel} onAdd={s=>onAdd(sel,s)} onClose={()=>setShowAdd(false)} sportColors={sportColors} setSportColors={setSportColors} customSports={customSports} onAddCustom={onAddCustom}/>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <button onClick={()=>setCur(new Date(y,mo-1,1))} style={{width:36,height:36,borderRadius:10,background:"#F5F5F5",border:"none",fontSize:18,cursor:"pointer",color:"#555",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#1A1A2E"}}>{mo+1}월</div><div style={{fontSize:12,color:"#AAA",fontWeight:600}}>{y}</div></div>
        <button onClick={()=>setCur(new Date(y,mo+1,1))} style={{width:36,height:36,borderRadius:10,background:"#F5F5F5",border:"none",fontSize:18,cursor:"pointer",color:"#555",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>
      <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
          {["월","화","수","목","금","토","일"].map((d,i)=>(
            <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:i===5?"#4ECDC4":i===6?"#FF6B6B":"#CCC",padding:"4px 0"}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {Array.from({length:off},(_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:dim},(_,i)=>{
            const d=i+1,k=toKey(d),sp=(data[k]||[]).map(e=>e.sport);
            const isSel=k===sel,isToday=k==="2026-04-30",dow=(off+i)%7;
            return(
              <div key={d} onClick={()=>setSel(k)} style={{borderRadius:12,padding:"8px 2px 6px",cursor:"pointer",textAlign:"center",background:isSel?"#6C63FF":isToday?"#EEF0FF":"transparent"}}>
                <div style={{fontSize:12,fontWeight:isSel||isToday?700:500,color:isSel?"#fff":isToday?"#6C63FF":dow===5?"#4ECDC4":dow===6?"#FF6B6B":"#444",marginBottom:4}}>{d}</div>
                <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:2}}>
                  {sp.slice(0,3).map((s,si)=><div key={si} style={{width:5,height:5,borderRadius:"50%",background:isSel?"rgba(255,255,255,0.7)":getCol(s)}}/>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><span style={{fontSize:15,fontWeight:800,color:"#1A1A2E"}}>{sel.replace(/-/g,".")} </span><span style={{fontSize:12,color:"#AAA"}}>{["일","월","화","수","목","금","토"][new Date(sel).getDay()]}요일</span></div>
        <button onClick={()=>setShowAdd(true)} style={{display:"flex",alignItems:"center",gap:5,background:"#6C63FF",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 10px #6C63FF44"}}>
          <span style={{fontSize:14}}>+</span> 추가
        </button>
      </div>
      {ss.length===0
        ?<div style={{background:"#fff",borderRadius:18,padding:"28px 0",textAlign:"center",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:8}}>🏖️</div>
          <div style={{fontSize:13,color:"#CCC",fontWeight:600}}>휴식일이에요</div>
        </div>
        :<div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {ss.map((entry,i)=>{
            const col=getCol(entry.sport);
            const sp=allSportsMap[entry.sport]||{emoji:"🏃",label:entry.sport};
            const subtitle=entry.done
              ?entry.rec?.distance?`${entry.rec.distance}km · ${entry.rec?.pace_m||"—"}'${entry.rec?.pace_s||"—"}"/km`
              :entry.rec?.dist?`${entry.rec.dist}km`
              :entry.parts?`${entry.parts.join("·")} · ${entry.calories||"—"}kcal`
              :"완료"
              :"기록 입력하기 →";
            return(
              <div key={i} onClick={()=>setScr(entry.sport)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:18,background:"#fff",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",cursor:"pointer",border:`1.5px solid ${entry.done?col+"44":"#F5F5F5"}`}}>
                <div style={{width:46,height:46,borderRadius:14,background:mkGrad(col),display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{sp.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#1A1A2E"}}>{sp.label}</div>
                  <div style={{fontSize:11,color:"#AAA",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subtitle}</div>
                </div>
                {entry.done
                  ?<div style={{width:24,height:24,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:13,fontWeight:800}}>✓</span></div>
                  :<div style={{color:"#CCC",fontSize:20}}>›</div>
                }
              </div>
            );
          })}
        </div>
      }
      <div style={{fontSize:14,fontWeight:800,color:"#1A1A2E",marginBottom:12}}>{mo+1}월 요약</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[{l:"운동일",v:`${wDays}일`,ic:"📅",c:"#6C63FF"},{l:"총 운동",v:`${tot}회`,ic:"🔥",c:"#FF6B6B"},{l:"완료율",v:`${cr}%`,ic:"✅",c:"#52C47A"}].map(it=>(
          <div key={it.l} style={{background:"#fff",borderRadius:16,padding:"14px 10px",textAlign:"center",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:22,marginBottom:5}}>{it.ic}</div>
            <div style={{fontSize:18,fontWeight:900,color:it.c}}>{it.v}</div>
            <div style={{fontSize:10,color:"#AAA",marginTop:3,fontWeight:600}}>{it.l}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {Object.entries({...BASE_SPORTS,...Object.fromEntries(customSports.map(s=>[s.id,s]))}).map(([k,sp])=>{
            const col=getCol(k),cnt=sc[k]||0,pct=tot?Math.round((cnt/tot)*100):0;
            return(
              <div key={k} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:28,height:28,borderRadius:8,background:mkGrad(col),display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{sp.emoji}</div>
                <span style={{fontSize:12,fontWeight:700,color:"#555",width:54,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sp.label}</span>
                <div style={{flex:1,height:7,background:"#F5F5F5",borderRadius:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:4}}/></div>
                <span style={{fontSize:11,color:"#AAA",width:24,textAlign:"right",fontWeight:600}}>{cnt}회</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── 커스텀 종목 기록 ──────────────────────────────────
function CustomSportScreen({sel,setScr,data,onSave,sportColors,allSports,sportKey}){
  const entry=data[sel]?.find(e=>e.sport===sportKey)||{};
  const sp=allSports[sportKey]||{emoji:"🏃",label:"운동"};
  const col=sportColors[sportKey]||sp.color||"#6C63FF";
  const [watchType,setWatchType]=useState("garmin");
  const [rec,setRec]=useState(entry.rec||{distance:"",time_h:"",time_m:"",time_s:"",avg_hr:"",max_hr:"",calories:"",note:""});
  const [done,setDone]=useState(entry.done||false);
  const [saved,setSaved]=useState(false);
  const upR=(k,v)=>setRec(p=>({...p,[k]:v}));
  const save=()=>{onSave(sel,sportKey,{rec,done,sport:sportKey});setSaved(true);setTimeout(()=>setScr("calendar"),700);};
  return(
    <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{sp.emoji} {sp.label} 기록</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div></div>
        </div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        {/* 워치 선택 */}
        <div style={{display:"flex",gap:8}}>
          {[["garmin","⌚ 가민"],["apple","🍎 애플워치"]].map(([k,l])=>(
            <button key={k} onClick={()=>setWatchType(k)} style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:watchType===k?col:"#F5F5F5",color:watchType===k?"#fff":"#AAA",transition:"all 0.2s"}}>{l}</button>
          ))}
        </div>
        {/* 워치 데이터 가져오기 */}
        <div style={{background:col+"11",borderRadius:16,padding:14,border:`1.5px dashed ${col}88`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,background:col+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{watchType==="garmin"?"⌚":"🍎"}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{watchType==="garmin"?"가민 커넥트에서 가져오기":"애플 건강 앱에서 가져오기"}</div>
            <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{watchType==="garmin"?"활동 선택 → CSV 내보내기":"건강 앱 → 데이터 내보내기 → XML"}</div>
          </div>
          <button style={{background:col,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:`0 3px 8px ${col}44`}}>{watchType==="garmin"?"CSV":"XML"}</button>
        </div>
        {/* 기본 기록 */}
        <Card title="기본 기록" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[["distance","거리 (km)"],["calories","칼로리 (kcal)"]].map(([k,l])=>(
              <div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>
            ))}
          </div>
          <div style={{fontSize:11,color:"#AAA",marginBottom:6,fontWeight:600}}>운동 시간</div>
          <div style={{display:"flex",gap:6}}>
            {[["time_h","시"],["time_m","분"],["time_s","초"]].map(([k,u])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:4,flex:1}}>
                <input value={rec[k]||""} onChange={e=>upR(k,e.target.value)} placeholder="0" style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:10,padding:"10px 6px",fontSize:15,fontWeight:700,textAlign:"center",background:"#F8F8F8",outline:"none"}}/>
                <span style={{fontSize:12,color:"#BBB",fontWeight:600}}>{u}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* 심박수 */}
        <Card title="심박수 (bpm)" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["avg_hr","평균 심박"],["max_hr","최고 심박"]].map(([k,l])=>(
              <div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>
            ))}
          </div>
        </Card>
        {/* 메모 */}
        <Card title="메모 / 컨디션">
          <textarea value={rec.note||""} onChange={e=>upR("note",e.target.value)} placeholder="오늘 운동 느낌, 컨디션 등" style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#1A1A2E",background:"#F8F8F8",boxSizing:"border-box",resize:"none",height:68,outline:"none"}}/>
        </Card>
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>운동 완료</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>오늘 운동을 완료했나요?</div></div>
          <Tog value={done} onChange={()=>setDone(p=>!p)} color={col}/>
        </div>
        <Btn onClick={save} color={col} saved={saved}>기록 저장</Btn>
      </div>
    </div>
  );
}

// ── 러닝 ─────────────────────────────────────────────
function RunningScreen({sel,setScr,data,onSave,sportColors}){
  const existing=data[sel]?.find(e=>e.sport==="running")||{};
  const [tab,setTab]=useState("plan");
  const [plan,setPlan]=useState(existing.plan||{type:"이지런",warmup:"",main:"",cooldown:""});
  const [rec,setRec]=useState(existing.rec||{distance:"",pace_m:"",pace_s:"",avg_hr:"",max_hr:"",cadence:"",power:"",stride:"",vert_ratio:"",vert_osc:"",contact:"",calories:""});
  const [done,setDone]=useState(existing.done||false);
  const [saved,setSaved]=useState(false);
  const col=sportColors?.running||"#FF6B6B";
  const [watchType,setWatchType]=useState("garmin");
  const upR=(k,v)=>setRec(p=>({...p,[k]:v}));
  const save=()=>{onSave(sel,"running",{plan,rec,done,sport:"running"});setSaved(true);setTimeout(()=>setScr("calendar"),700);};
  return(
    <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🏃 러닝 기록</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div></div>
        </div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",background:"#F0F0F0",borderRadius:12,padding:3}}>
          {["plan","record"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:tab===t?"#fff":"transparent",color:tab===t?col:"#AAA",transition:"all 0.2s"}}>{t==="plan"?"훈련 계획":"실제 기록"}</button>
          ))}
        </div>
        {tab==="plan"?(
          <>
            <Card title="훈련 종류"><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{TRAIN_TYPES.map(t=><button key={t} onClick={()=>setPlan(p=>({...p,type:t}))} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:plan.type===t?col:"#F5F5F5",color:plan.type===t?"#fff":"#888",transition:"all 0.2s"}}>{t}</button>)}</div></Card>
            <Card title="훈련 구성">
              {[["warmup","워밍업(km)"],["main","본 훈련 내용"],["cooldown","쿨다운(km)"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:12,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div>
                  {k==="main"?<textarea value={plan.main||""} onChange={e=>setPlan(p=>({...p,main:e.target.value}))} placeholder="예) 400m×4 (5'40~6'00/km)" style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#1A1A2E",background:"#F8F8F8",boxSizing:"border-box",resize:"none",height:68,outline:"none"}}/>:<Inp value={plan[k]||""} onChange={e=>setPlan(p=>({...p,[k]:e.target.value}))}/>}
                </div>
              ))}
            </Card>
            <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>훈련 완료</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>오늘 훈련을 완료했나요?</div></div>
              <Tog value={done} onChange={()=>setDone(p=>!p)} color={col}/>
            </div>
            <Btn onClick={save} color={col} saved={saved}>계획 저장</Btn>
          </>
        ):(
          <>
            <WatchImport col={col} watchType={watchType} setWatchType={setWatchType}/>
            <Card title="기본 기록" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>{[["distance","거리(km)"],["calories","칼로리"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>)}</div>
              <div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>페이스(분:초/km)</div>
              <div style={{display:"flex",gap:8}}>{[["pace_m","분"],["pace_s","초"]].map(([k,u])=><div key={k} style={{display:"flex",alignItems:"center",gap:4,flex:1}}><input value={rec[k]||""} onChange={e=>upR(k,e.target.value)} placeholder="0" style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:10,padding:"10px 8px",fontSize:16,fontWeight:700,textAlign:"center",background:"#F8F8F8",outline:"none"}}/><span style={{fontSize:12,color:"#BBB",fontWeight:600}}>{u}</span></div>)}</div>
            </Card>
            <Card title="심박수" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["avg_hr","평균(bpm)"],["max_hr","최고(bpm)"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>)}</div></Card>
            <Card title="가민 고급 지표" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["cadence","케이던스"],["power","파워(W)"],["stride","보폭(m)"],["vert_ratio","수직비율(%)"],["vert_osc","수직진폭(cm)"],["contact","지면접촉(ms)"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>)}</div></Card>
            <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>운동 완료</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>오늘 러닝을 완료했나요?</div></div>
              <Tog value={done} onChange={()=>setDone(p=>!p)} color={col}/>
            </div>
            <Btn onClick={save} color={col} saved={saved}>기록 저장</Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ── 수영 ─────────────────────────────────────────────
function SwimmingScreen({sel,setScr,data,onSave,sportColors}){
  const existing=data[sel]?.find(e=>e.sport==="swimming")||{};
  const [garmin,setGarmin]=useState(true);
  const [rec,setRec]=useState(existing.rec||{distance:"",calories:"",avg_hr:"",swolf:""});
  const [laps,setLaps]=useState([{id:1,stroke:"자유형",tm:"",ts:"",dist:50,aid:"없음"}]);
  const [done,setDone]=useState(existing.done||false);
  const [saved,setSaved]=useState(false);
  const col=sportColors?.swimming||"#4ECDC4";
  const [watchType,setWatchType]=useState("garmin");
  const addLap=()=>setLaps(p=>[...p,{id:Date.now(),stroke:"자유형",tm:"",ts:"",dist:50,aid:"없음"}]);
  const upL=(id,k,v)=>setLaps(p=>p.map(l=>l.id===id?{...l,[k]:v}:l));
  const save=()=>{onSave(sel,"swimming",{rec,laps,done,sport:"swimming"});setSaved(true);setTimeout(()=>setScr("calendar"),700);};
  return(
    <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🏊 수영 기록</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div></div>
        </div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:12,background:col+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⌚</div><div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>가민 착용 여부</div><div style={{fontSize:11,color:"#AAA"}}>{garmin?"상세 입력":"간단 입력"}</div></div></div>
          <Tog value={garmin} onChange={()=>setGarmin(p=>!p)} color={col}/>
        </div>
        <WatchImport col={col} watchType={watchType} setWatchType={setWatchType}/>
        <Card title="기본 기록" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["distance","거리(m)"],["calories","칼로리"],...(garmin?[["avg_hr","평균심박"],["swolf","SWOLF"]]:[] )].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>setRec(p=>({...p,[k]:e.target.value}))}/></div>)}</div>
        </Card>
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:"#888"}}>랩 기록</div><button onClick={addLap} style={{background:col,color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ 추가</button></div>
          <div style={{display:"grid",gridTemplateColumns:"20px 1fr 1fr 58px 44px 20px",gap:4,marginBottom:8}}>{["#","영법","보조","타임","거리",""].map((h,i)=><div key={i} style={{fontSize:10,color:"#CCC",fontWeight:700,textAlign:"center"}}>{h}</div>)}</div>
          {laps.map((l,idx)=>(
            <div key={l.id} style={{display:"grid",gridTemplateColumns:"20px 1fr 1fr 58px 44px 20px",gap:4,alignItems:"center",marginBottom:8,padding:"6px 0"}}>
              <div style={{fontSize:12,fontWeight:800,color:col,textAlign:"center"}}>{idx+1}</div>
              <select value={l.stroke} onChange={e=>upL(l.id,"stroke",e.target.value)} style={{border:"1.5px solid #EFEFEF",borderRadius:8,padding:"6px 3px",fontSize:11,background:"#F8F8F8",outline:"none"}}>{STROKE_TYPES.map(s=><option key={s}>{s}</option>)}</select>
              <select value={l.aid} onChange={e=>upL(l.id,"aid",e.target.value)} style={{border:"1.5px solid #EFEFEF",borderRadius:8,padding:"6px 3px",fontSize:11,color:l.aid==="없음"?"#CCC":col,background:"#F8F8F8",outline:"none"}}>{AIDS.map(a=><option key={a}>{a}</option>)}</select>
              <div style={{display:"flex",gap:2,alignItems:"center"}}><input value={l.tm} onChange={e=>upL(l.id,"tm",e.target.value)} placeholder="0" style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:6,padding:"6px 3px",fontSize:11,textAlign:"center",background:"#F8F8F8",outline:"none"}}/><span style={{fontSize:9,color:"#CCC"}}>:</span><input value={l.ts} onChange={e=>upL(l.id,"ts",e.target.value)} placeholder="00" style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:6,padding:"6px 3px",fontSize:11,textAlign:"center",background:"#F8F8F8",outline:"none"}}/></div>
              <select value={l.dist} onChange={e=>upL(l.id,"dist",Number(e.target.value))} style={{border:"1.5px solid #EFEFEF",borderRadius:8,padding:"6px 2px",fontSize:10,background:"#F8F8F8",outline:"none"}}>{[15,25,50,100,200].map(d=><option key={d} value={d}>{d}m</option>)}</select>
              <button onClick={()=>setLaps(p=>p.filter(x=>x.id!==l.id))} style={{background:"none",border:"none",color:"#DDD",fontSize:14,cursor:"pointer",padding:0}}>×</button>
            </div>
          ))}
          {laps.length>0&&<div style={{paddingTop:10,borderTop:"1px solid #F0F0F0",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#AAA",fontWeight:600}}>{laps.length}랩</span><span style={{fontSize:14,fontWeight:800,color:col}}>{laps.reduce((s,l)=>s+Number(l.dist),0)}m</span></div>}
        </div>
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>운동 완료</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>오늘 수영을 완료했나요?</div></div>
          <Tog value={done} onChange={()=>setDone(p=>!p)} color={col}/>
        </div>
        <Btn onClick={save} color={col} saved={saved}>기록 저장</Btn>
      </div>
    </div>
  );
}

// ── 헬스 ─────────────────────────────────────────────
function GymScreen({sel,setScr,data,onSave,sportColors}){
  const existing=data[sel]?.find(e=>e.sport==="gym")||{};
  const d=new Date(sel),dk=DAYS[d.getDay()],dp=SPLIT[dk]||"가슴";
  const [parts,setParts]=useState(existing.parts||[dp]);
  const mkEx=(pts)=>pts.flatMap(pt=>(GYM_PARTS[pt]||[]).slice(0,3).map((nm,i)=>({id:`${pt}-${i}`,nm,pt,done:false,sets:[{id:1,pw:"",pr:"",aw:"",ar:""}]})));
  const [exs,setExs]=useState(mkEx(existing.parts||[dp]));
  const [calories,setCalories]=useState(existing.calories||"");
  const [saved,setSaved]=useState(false);
  const col=sportColors?.gym||"#52C47A";
  const [watchType,setWatchType]=useState("garmin");
  const togPart=(p)=>{setParts(prev=>{const nx=prev.includes(p)?prev.filter(x=>x!==p):[...prev,p];if(!nx.length)return prev;setExs(mkEx(nx));return nx;});};
  const togDone=(id)=>setExs(p=>p.map(e=>e.id===id?{...e,done:!e.done}:e));
  const upSet=(eid,sid,k,v)=>setExs(p=>p.map(e=>e.id===eid?{...e,sets:e.sets.map(s=>s.id===sid?{...s,[k]:v}:s)}:e));
  const addSet=(eid)=>setExs(p=>p.map(e=>e.id===eid?{...e,sets:[...e.sets,{id:Date.now(),pw:"",pr:"",aw:"",ar:""}]}:e));
  const dc=exs.filter(e=>e.done).length;
  const save=()=>{onSave(sel,"gym",{parts,exs,calories,done:dc===exs.length,sport:"gym"});setSaved(true);setTimeout(()=>setScr("calendar"),700);};
  return(
    <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>💪 헬스 기록</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div></div>
        </div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        <Card title="오늘 부위" tag={`${dk}요일 기본: ${SPLIT[dk]}`} tc={col}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{PARTS.map(p=><button key={p} onClick={()=>togPart(p)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:parts.includes(p)?col:"#F5F5F5",color:parts.includes(p)?"#fff":"#888",transition:"all 0.2s"}}>{p}</button>)}</div>
        </Card>
        <WatchImport col={col} watchType={watchType} setWatchType={setWatchType}/>
        <div style={{background:"#fff",borderRadius:18,padding:"12px 16px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:8,background:"#F0F0F0",borderRadius:4,overflow:"hidden"}}><div style={{width:`${exs.length?Math.round(dc/exs.length*100):0}%`,height:"100%",background:col,borderRadius:4}}/></div><span style={{fontSize:13,fontWeight:800,color:col}}>{dc}/{exs.length} 완료</span></div>
        </div>
        {exs.map(ex=>(
          <div key={ex.id} style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",border:ex.done?`2px solid ${col}44`:"2px solid transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{background:ex.done?col:"#F0F0F0",borderRadius:8,padding:"3px 8px"}}><span style={{fontSize:11,fontWeight:700,color:ex.done?"#fff":"#AAA"}}>{ex.pt}</span></div>
              <div style={{flex:1,fontSize:14,fontWeight:800,color:ex.done?col:"#1A1A2E"}}>{ex.nm}</div>
              <Tog value={ex.done} onChange={()=>togDone(ex.id)} color={col}/>
            </div>
            <div style={{background:"#F8F8F8",borderRadius:10,padding:"8px 8px",marginBottom:8}}>
              <div style={{display:"grid",gridTemplateColumns:"18px 1fr 1fr",gap:4,marginBottom:6}}>
                <div style={{fontSize:10,color:"#CCC",fontWeight:700,textAlign:"center"}}>SET</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,textAlign:"center"}}><span style={{fontSize:9,color:"#CCC",fontWeight:700}}>계획kg</span><span style={{fontSize:9,color:"#CCC",fontWeight:700}}>계획회</span></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,textAlign:"center"}}><span style={{fontSize:9,color:ex.done?col:"#CCC",fontWeight:700}}>실제kg</span><span style={{fontSize:9,color:ex.done?col:"#CCC",fontWeight:700}}>실제회</span></div>
              </div>
              {ex.sets.map((s,si)=>(
                <div key={s.id} style={{display:"grid",gridTemplateColumns:"18px 1fr 1fr",gap:4,alignItems:"center",marginBottom:5}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:col+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:800,color:col}}>{si+1}</span></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>{[["pw","kg"],["pr","회"]].map(([k,ph])=><input key={k} value={s[k]} onChange={e=>upSet(ex.id,s.id,k,e.target.value)} placeholder={ph} style={{border:"1.5px solid #E8E8E8",borderRadius:7,padding:"6px 2px",fontSize:11,textAlign:"center",background:"#fff",outline:"none",boxSizing:"border-box",width:"100%"}}/>)}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>{[["aw","kg"],["ar","회"]].map(([k,ph])=><input key={k} value={s[k]} onChange={e=>upSet(ex.id,s.id,k,e.target.value)} placeholder={ph} style={{border:`1.5px solid ${ex.done?col+"44":"#E8E8E8"}`,borderRadius:7,padding:"6px 2px",fontSize:11,textAlign:"center",background:ex.done?col+"11":"#fff",outline:"none",boxSizing:"border-box",width:"100%"}}/>)}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>addSet(ex.id)} style={{width:"100%",background:col+"11",color:col,border:`1.5px dashed ${col}66`,borderRadius:10,padding:"8px 0",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ 세트 추가</button>
          </div>
        ))}
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}><div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:600}}>칼로리(kcal)</div><Inp value={calories} onChange={e=>setCalories(e.target.value)} placeholder="예) 350"/></div>
        <Btn onClick={save} color={col} saved={saved}>기록 저장</Btn>
      </div>
    </div>
  );
}

// ── 크로스핏 ─────────────────────────────────────────
function CrossfitScreen({sel,setScr,data,onSave,sportColors}){
  const existing=data[sel]?.find(e=>e.sport==="crossfit")||{};
  const [wtype,setWtype]=useState(existing.wodType||"For Time");
  const [wod,setWod]=useState(existing.wod||"");
  const [done,setDone]=useState(existing.done||false);
  const [sc,setSc]=useState(existing.score||{rounds:"",reps:"",tm:"",ts:"",free:""});
  const [rx,setRx]=useState(existing.rx!==undefined?existing.rx:true);
  const [cal,setCal]=useState(existing.calories||"");
  const [saved,setSaved]=useState(false);
  const col=sportColors?.crossfit||"#F4A261";
  const [watchType,setWatchType]=useState("garmin");
  const up=(k,v)=>setSc(p=>({...p,[k]:v}));
  const save=()=>{onSave(sel,"crossfit",{wodType:wtype,wod,done,score:sc,rx,calories:cal,sport:"crossfit"});setSaved(true);setTimeout(()=>setScr("calendar"),700);};
  return(
    <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🏋️ 크로스핏 기록</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div></div>
        </div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        <WatchImport col={col} watchType={watchType} setWatchType={setWatchType}/>
        <Card title="WOD 타입"><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{WOD_TYPES.map(t=><button key={t} onClick={()=>setWtype(t)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:wtype===t?col:"#F5F5F5",color:wtype===t?"#fff":"#888",transition:"all 0.2s"}}>{t}</button>)}</div></Card>
        <Card title="WOD 내용"><textarea value={wod} onChange={e=>setWod(e.target.value)} placeholder={"오늘의 WOD\n예) 21-15-9\nThrusters / Pull-ups"} style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:12,padding:"12px",fontSize:13,color:"#1A1A2E",background:"#F8F8F8",boxSizing:"border-box",resize:"none",height:90,outline:"none",lineHeight:1.6}}/></Card>
        <Card title="내 기록">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,fontWeight:700,color:"#888"}}>Rx 수행</span>{!rx&&<span style={{fontSize:11,background:col+"22",color:col,borderRadius:6,padding:"2px 8px",fontWeight:700}}>Scaled</span>}</div><Tog value={rx} onChange={()=>setRx(p=>!p)} color={col}/></div>
          {(wtype==="For Time"||wtype==="RFT")&&<div style={{display:"flex",gap:10}}>{[["tm","분"],["ts","초"]].map(([k,u])=><div key={k} style={{flex:1,background:col+"11",borderRadius:14,padding:"12px",textAlign:"center",border:`1.5px solid ${col}33`}}><div style={{fontSize:11,color:col,fontWeight:700,marginBottom:6}}>{u}</div><input value={sc[k]||""} onChange={e=>up(k,e.target.value)} placeholder="0" style={{width:"100%",background:"transparent",border:"none",fontSize:28,fontWeight:900,textAlign:"center",outline:"none",color:col}}/></div>)}</div>}
          {wtype==="AMRAP"&&<div style={{display:"flex",gap:10}}>{[["rounds","라운드"],["reps","렙"]].map(([k,l])=><div key={k} style={{flex:1,background:col+"11",borderRadius:14,padding:"12px",textAlign:"center",border:`1.5px solid ${col}33`}}><div style={{fontSize:11,color:col,fontWeight:700,marginBottom:6}}>{l}</div><input value={sc[k]||""} onChange={e=>up(k,e.target.value)} placeholder="0" style={{width:"100%",background:"transparent",border:"none",fontSize:28,fontWeight:900,textAlign:"center",outline:"none",color:col,boxSizing:"border-box"}}/></div>)}</div>}
          {!["For Time","RFT","AMRAP"].includes(wtype)&&<Inp value={sc.free||""} onChange={e=>up("free",e.target.value)} placeholder="기록 입력"/>}
        </Card>
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>WOD 완료</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>오늘 WOD를 완료했나요?</div></div><Tog value={done} onChange={()=>setDone(p=>!p)} color={col}/></div>
          <div style={{fontSize:12,color:"#AAA",marginBottom:4,fontWeight:600}}>칼로리(kcal)</div>
          <Inp value={cal} onChange={e=>setCal(e.target.value)} placeholder="예) 420"/>
        </div>
        <Btn onClick={save} color={col} saved={saved}>기록 저장</Btn>
      </div>
    </div>
  );
}

// ── 자전거 ────────────────────────────────────────────
function CyclingScreen({sel,setScr,data,onSave,sportColors}){
  const existing=data[sel]?.find(e=>e.sport==="cycling")||{};
  const [rtype,setRtype]=useState(existing.rtype||"실외");
  const [rec,setRec]=useState(existing.rec||{dist:"",avg_sp:"",max_sp:"",avg_hr:"",max_hr:"",elev_up:"",elev_dn:"",cal:"",course:""});
  const [done,setDone]=useState(existing.done||false);
  const [saved,setSaved]=useState(false);
  const col=sportColors?.cycling||"#9B8EC4";
  const [watchType,setWatchType]=useState("garmin");
  const upR=(k,v)=>setRec(p=>({...p,[k]:v}));
  const save=()=>{onSave(sel,"cycling",{rtype,rec,done,sport:"cycling"});setSaved(true);setTimeout(()=>setScr("calendar"),700);};
  return(
    <div style={{maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:mkGrad(col),padding:"20px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setScr("calendar")} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🚴 자전거 기록</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{sel.replace(/-/g,".")}</div></div>
        </div>
      </div>
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",gap:8}}>{["실외","실내"].map(t=><button key={t} onClick={()=>setRtype(t)} style={{flex:1,padding:"12px 0",borderRadius:14,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,background:rtype===t?col:"#F5F5F5",color:rtype===t?"#fff":"#AAA",transition:"all 0.2s"}}>{t==="실외"?"🌤 실외":"🏠 실내"}</button>)}</div>
        <WatchImport col={col} watchType={watchType} setWatchType={setWatchType}/>
        <Card title="기본 기록" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["dist","거리(km)"],["avg_sp","평균속도"],["max_sp","최고속도"],["cal","칼로리"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>)}</div></Card>
        <Card title="심박수" tag={watchType==="garmin"?"가민 연동":"애플워치 연동"} tc={col}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["avg_hr","평균 심박"],["max_hr","최고 심박"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>)}</div></Card>
        {rtype==="실외"&&<Card title="고도 & 코스" tc={col}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>{[["elev_up","고도 상승(m)"],["elev_dn","고도 하강(m)"]].map(([k,l])=><div key={k}><div style={{fontSize:11,color:"#AAA",marginBottom:4,fontWeight:600}}>{l}</div><Inp value={rec[k]||""} onChange={e=>upR(k,e.target.value)}/></div>)}</div><Inp value={rec.course||""} onChange={e=>upR("course",e.target.value)} placeholder="코스 메모"/></Card>}
        <div style={{background:"#fff",borderRadius:18,padding:16,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>운동 완료</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>오늘 라이딩을 완료했나요?</div></div>
          <Tog value={done} onChange={()=>setDone(p=>!p)} color={col}/>
        </div>
        <Btn onClick={save} color={col} saved={saved}>기록 저장</Btn>
      </div>
    </div>
  );
}

// ── 통계 ─────────────────────────────────────────────
function StatsScreen({data,sportColors,customSports}){
  const [sport,setSport]=useState("overall");
  const [liftKey,setLiftKey]=useState("벤치프레스");
  const allSportsMap={...BASE_SPORTS,...Object.fromEntries(customSports.map(s=>[s.id,s]))};
  const baseTabs=[{k:"overall",l:"전체",e:"🏅"},{k:"running",l:"러닝",e:"🏃"},{k:"gym",l:"헬스",e:"💪"},{k:"swimming",l:"수영",e:"🏊"},{k:"cycling",l:"자전거",e:"🚴"},{k:"crossfit",l:"크로스핏",e:"🏋️"}];
  const customTabs=customSports.map(s=>({k:s.id,l:s.label,e:s.emoji}));
  const [tabs,setTabs]=useState([...baseTabs,...customTabs]);
  const [editOrder,setEditOrder]=useState(false);
  const getCol=(k)=>sportColors?.[k]||allSportsMap[k]?.color||"#6C63FF";
  const moveTab=(idx,dir)=>{const nx=[...tabs];const t=idx+dir;if(t<0||t>=nx.length)return;[nx[idx],nx[t]]=[nx[t],nx[idx]];setTabs(nx);};
  const allE=useMemo(()=>Object.entries(data).flatMap(([date,arr])=>arr.map(e=>({...e,date}))),[data]);
  const runE=allE.filter(e=>e.sport==="running"&&e.done&&e.rec?.distance);
  const totRun=runE.reduce((s,e)=>s+parseFloat(e.rec.distance||0),0);
  const sc={};allE.filter(e=>e.done).forEach(e=>{sc[e.sport]=(sc[e.sport]||0)+1;});
  const totDone=Object.values(sc).reduce((s,v)=>s+v,0);
  const wDays=new Set(allE.filter(e=>e.done).map(e=>e.date)).size;
  const LIFTS={벤치프레스:[{m:"1월",v:75},{m:"2월",v:77.5},{m:"3월",v:80},{m:"4월",v:82.5}],스쿼트:[{m:"1월",v:90},{m:"2월",v:95},{m:"3월",v:97.5},{m:"4월",v:100}],데드리프트:[{m:"1월",v:110},{m:"2월",v:115},{m:"3월",v:120},{m:"4월",v:122.5}]};
  const RUN_M=[{m:"1월",d:48.2,hr:148},{m:"2월",d:52.1,hr:146},{m:"3월",d:58.4,hr:144},{m:"4월",d:Math.round(totRun*10)/10,hr:152}];
  const HEATMAP=Array.from({length:26},()=>Array.from({length:7},()=>({c:Math.random()<0.55?Math.floor(Math.random()*3)+1:0})));
  const StatCard=({ic,v,l,color})=>(
    <div style={{background:"#fff",borderRadius:16,padding:"14px 12px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
      <div style={{fontSize:22,marginBottom:6}}>{ic}</div>
      <div style={{fontSize:20,fontWeight:900,color:color||"#1A1A2E"}}>{v}</div>
      <div style={{fontSize:10,color:"#AAA",marginTop:3,fontWeight:600}}>{l}</div>
    </div>
  );
  return(
    <div style={{padding:"16px 20px",maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontSize:18,fontWeight:800,color:"#1A1A2E"}}>📊 통계</div>
        <button onClick={()=>setEditOrder(p=>!p)} style={{fontSize:12,fontWeight:700,background:editOrder?"#6C63FF":"#F0F0FF",color:editOrder?"#fff":"#6C63FF",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer"}}>{editOrder?"완료":"순서 편집"}</button>
      </div>
      {editOrder?(
        <div style={{background:"#fff",borderRadius:18,padding:14,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:14}}>
          {tabs.map((t,i)=>(
            <div key={t.k} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<tabs.length-1?"1px solid #F5F5F5":"none"}}>
              <span style={{fontSize:20}}>{t.e}</span><span style={{flex:1,fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{t.l}</span>
              <div style={{display:"flex",gap:4}}>
                {[[-1,"↑"],[1,"↓"]].map(([dir,lbl])=>(
                  <button key={dir} onClick={()=>moveTab(i,dir)} disabled={dir===-1?i===0:i===tabs.length-1} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #EFEFEF",background:(dir===-1?i===0:i===tabs.length-1)?"#FAFAFA":"#fff",color:(dir===-1?i===0:i===tabs.length-1)?"#DDD":"#555",fontSize:14,cursor:(dir===-1?i===0:i===tabs.length-1)?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{lbl}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ):(
        <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {tabs.map(s=><button key={s.k} onClick={()=>setSport(s.k)} style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",background:sport===s.k?(s.k==="overall"?"#6C63FF":getCol(s.k)):"#F0F0F0",color:sport===s.k?"#fff":"#888",boxShadow:sport===s.k?"0 3px 10px rgba(0,0,0,0.15)":"none",transition:"all 0.2s"}}>{s.e} {s.l}</button>)}
        </div>
      )}
      {sport==="overall"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <StatCard ic="📅" v={`${wDays}일`} l="총 운동일" color="#6C63FF"/>
            <StatCard ic="🔥" v={`${totDone}회`} l="총 세션" color="#FF6B6B"/>
            <StatCard ic="🏃" v={`${totRun.toFixed(1)}km`} l="러닝 누적" color={getCol("running")}/>
            <StatCard ic="🏅" v={`${Object.keys(sc).length}개`} l="활성 종목" color="#F4A261"/>
          </div>
          <Card title="종목별 비율">
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.entries(allSportsMap).filter(([k])=>sc[k]>0).map(([k,sp])=>{
                const col=getCol(k),cnt=sc[k]||0,pct=totDone?Math.round((cnt/totDone)*100):0;
                return(<div key={k} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:30,height:30,borderRadius:8,background:mkGrad(col),display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{sp.emoji}</div>
                  <span style={{fontSize:12,fontWeight:700,color:"#555",width:54,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sp.label}</span>
                  <div style={{flex:1,height:8,background:"#F5F5F5",borderRadius:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:4}}/></div>
                  <span style={{fontSize:11,color:"#AAA",width:28,textAlign:"right",fontWeight:700}}>{cnt}회</span>
                </div>);
              })}
            </div>
          </Card>
          <Card title="연간 히트맵 2026">
            <div style={{overflowX:"auto"}}><div style={{display:"flex",gap:2,minWidth:320}}>{HEATMAP.map((wk,wi)=><div key={wi} style={{display:"flex",flexDirection:"column",gap:2}}>{wk.map((day,di)=><div key={di} style={{width:9,height:9,borderRadius:2,background:day.c===0?"#F0F0F0":day.c===1?"#C7F2A4":day.c===2?"#6CC644":"#2DA44E"}}/>)}</div>)}</div></div>
          </Card>
        </div>
      )}
      {sport==="running"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <StatCard ic="📍" v={`${totRun.toFixed(1)}km`} l="누적 거리" color={getCol("running")}/>
            <StatCard ic="🏃" v={`${runE.length}회`} l="총 세션" color={getCol("running")}/>
            <StatCard ic="🏅" v={`${Math.max(...runE.map(e=>parseFloat(e.rec.distance||0)),0).toFixed(1)}km`} l="최장 거리" color={getCol("running")}/>
            <StatCard ic="📊" v={runE.length?`${(totRun/runE.length).toFixed(1)}km`:"—"} l="평균 거리" color={getCol("running")}/>
          </div>
          <Card title="월간 누적 거리"><BarChart data={RUN_M} vk="d" lk="m" color={getCol("running")}/></Card>
          <Card title="심박 변화" tag="안정화 ↓" tc={getCol("running")}><LineChart data={RUN_M} vk="hr" lk="m" color={getCol("running")}/></Card>
        </div>
      )}
      {sport==="gym"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <StatCard ic="💪" v={`${sc.gym||0}회`} l="총 세션" color={getCol("gym")}/>
            <StatCard ic="📅" v={`${allE.filter(e=>e.sport==="gym"&&e.done&&e.date.startsWith("2026-04")).length}회`} l="이번 달" color={getCol("gym")}/>
          </div>
          <Card title="주요 종목 1RM 추이">
            <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>{Object.keys(LIFTS).map(k=><button key={k} onClick={()=>setLiftKey(k)} style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:liftKey===k?getCol("gym"):"#F5F5F5",color:liftKey===k?"#fff":"#888"}}>{k}</button>)}</div>
            <LineChart data={LIFTS[liftKey]} vk="v" lk="m" color={getCol("gym")}/>
            <div style={{marginTop:10,padding:"10px 12px",background:getCol("gym")+"11",borderRadius:10,fontSize:12,color:getCol("gym"),fontWeight:700}}>💪 {LIFTS[liftKey][0].v}kg → {LIFTS[liftKey][3].v}kg (+{LIFTS[liftKey][3].v-LIFTS[liftKey][0].v}kg)</div>
          </Card>
        </div>
      )}
      {["swimming","cycling","crossfit"].includes(sport)&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <StatCard ic={allSportsMap[sport]?.emoji||"🏃"} v={`${sc[sport]||0}회`} l="총 세션" color={getCol(sport)}/>
          <StatCard ic="📅" v={`${allE.filter(e=>e.sport===sport&&e.done&&e.date.startsWith("2026-04")).length}회`} l="이번 달" color={getCol(sport)}/>
        </div>
      )}
      {customSports.map(cs=>cs.id).includes(sport)&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <StatCard ic={allSportsMap[sport]?.emoji||"🏃"} v={`${sc[sport]||0}회`} l="총 세션" color={getCol(sport)}/>
          <StatCard ic="📅" v={`${allE.filter(e=>e.sport===sport&&e.done&&e.date.startsWith("2026-04")).length}회`} l="이번 달" color={getCol(sport)}/>
        </div>
      )}
    </div>
  );
}

// ── 목표 ─────────────────────────────────────────────
function GoalScreen({data,sportColors,customSports}){
  const [period,setPeriod]=useState("month");
  const allSportsMap={...BASE_SPORTS,...Object.fromEntries(customSports.map(s=>[s.id,s]))};
  const getCol=(k)=>sportColors?.[k]||allSportsMap[k]?.color||"#6C63FF";
  const allE=useMemo(()=>Object.entries(data).flatMap(([date,arr])=>arr.map(e=>({...e,date}))),[data]);
  const mE=allE.filter(e=>e.date.startsWith("2026-04"));
  const calc={
    runDist:Math.round(mE.filter(e=>e.sport==="running"&&e.done&&e.rec?.distance).reduce((s,e)=>s+parseFloat(e.rec.distance||0),0)*10)/10,
    gymCnt:mE.filter(e=>e.sport==="gym"&&e.done).length,
    swimCnt:mE.filter(e=>e.sport==="swimming"&&e.done).length,
    cycleDist:Math.round(mE.filter(e=>e.sport==="cycling"&&e.done&&e.rec?.dist).reduce((s,e)=>s+parseFloat(e.rec.dist||0),0)*10)/10,
    cfCnt:mE.filter(e=>e.sport==="crossfit"&&e.done).length,
    yRunDist:Math.round(allE.filter(e=>e.sport==="running"&&e.done&&e.rec?.distance).reduce((s,e)=>s+parseFloat(e.rec.distance||0),0)*10)/10,
  };
  const MG=[
    {id:1,sport:"running",label:"월 러닝 거리",target:100,current:calc.runDist,unit:"km"},
    {id:2,sport:"gym",label:"월 헬스 횟수",target:16,current:calc.gymCnt,unit:"회"},
    {id:3,sport:"swimming",label:"월 수영 횟수",target:12,current:calc.swimCnt,unit:"회"},
    {id:4,sport:"cycling",label:"월 자전거 거리",target:120,current:calc.cycleDist,unit:"km"},
    {id:5,sport:"crossfit",label:"월 크로스핏 출석",target:8,current:calc.cfCnt,unit:"회"},
  ];
  const YG=[
    {id:10,sport:"running",label:"연 러닝 거리",target:1200,current:calc.yRunDist,unit:"km"},
    {id:11,sport:"gym",label:"연 헬스 횟수",target:180,current:allE.filter(e=>e.sport==="gym"&&e.done).length,unit:"회"},
    {id:12,sport:"swimming",label:"연 수영 횟수",target:100,current:allE.filter(e=>e.sport==="swimming"&&e.done).length,unit:"회"},
    {id:13,sport:"cycling",label:"연 자전거 거리",target:1500,current:Math.round(allE.filter(e=>e.sport==="cycling"&&e.done&&e.rec?.dist).reduce((s,e)=>s+parseFloat(e.rec.dist||0),0)*10)/10,unit:"km"},
    {id:14,sport:"crossfit",label:"연 크로스핏 출석",target:96,current:allE.filter(e=>e.sport==="crossfit"&&e.done).length,unit:"회"},
  ];
  const [mGoals,setMGoals]=useState(MG);
  const [yGoals,setYGoals]=useState(YG);
  const goals=period==="month"?mGoals:yGoals;
  const setGoals=period==="month"?setMGoals:setYGoals;
  const [editOrder,setEditOrder]=useState(false);
  const [editing,setEditing]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [ng,setNg]=useState({sport:"running",label:"",target:"",unit:"km"});
  const moveGoal=(idx,dir)=>{const nx=[...goals];const t=idx+dir;if(t<0||t>=nx.length)return;[nx[idx],nx[t]]=[nx[t],nx[idx]];setGoals(nx);};
  const delGoal=(id)=>setGoals(p=>p.filter(g=>g.id!==id));
  const upGoal=(id,k,v)=>setGoals(p=>p.map(g=>g.id===id?{...g,[k]:v}:g));
  const addGoal=()=>{if(!ng.label||!ng.target)return;setGoals(p=>[...p,{id:Date.now(),sport:ng.sport,label:ng.label,target:Number(ng.target),current:0,unit:ng.unit}]);setNg({sport:"running",label:"",target:"",unit:"km"});setShowAdd(false);};
  const achieved=goals.filter(g=>g.current>=g.target).length;
  const totalPct=goals.length?Math.round(goals.reduce((s,g)=>s+Math.min(g.current/g.target,1),0)/goals.length*100):0;
  return(
    <div style={{padding:"16px 20px",maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontSize:18,fontWeight:800,color:"#1A1A2E"}}>🎯 목표</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{setEditOrder(p=>!p);setShowAdd(false);}} style={{fontSize:12,fontWeight:700,background:editOrder?"#6C63FF":"#F0F0FF",color:editOrder?"#fff":"#6C63FF",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer"}}>{editOrder?"완료":"순서 편집"}</button>
          {!editOrder&&<button onClick={()=>setShowAdd(p=>!p)} style={{fontSize:12,fontWeight:700,background:showAdd?"#6C63FF":"#F0F0FF",color:showAdd?"#fff":"#6C63FF",border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer"}}>{showAdd?"취소":"+ 추가"}</button>}
        </div>
      </div>
      <div style={{display:"flex",background:"#F0F0F0",borderRadius:12,padding:3,marginBottom:16}}>
        {[["month","이번 달"],["year","올해"]].map(([k,l])=><button key={k} onClick={()=>setPeriod(k)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:period===k?"#fff":"transparent",color:period===k?"#6C63FF":"#AAA"}}>{l}</button>)}
      </div>
      <div style={{background:"linear-gradient(135deg,#6C63FF,#A78BFA)",borderRadius:20,padding:22,marginBottom:16,color:"#fff",boxShadow:"0 8px 24px #6C63FF44"}}>
        <div style={{fontSize:12,fontWeight:700,opacity:0.8,marginBottom:4}}>전체 목표 달성률</div>
        <div style={{fontSize:40,fontWeight:900,marginBottom:12}}>{totalPct}<span style={{fontSize:24}}>%</span></div>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:10,height:10,overflow:"hidden",marginBottom:10}}><div style={{width:`${totalPct}%`,height:"100%",background:"rgba(255,255,255,0.9)",borderRadius:10}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.75,fontWeight:600}}><span>달성 {achieved}/{goals.length}개</span><span>실제 기록 연동</span></div>
      </div>
      {editOrder&&(
        <div style={{background:"#fff",borderRadius:18,padding:14,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:16}}>
          {goals.map((g,i)=>{
            const col=getCol(g.sport),sp=allSportsMap[g.sport]||{emoji:"🏃"};
            return(<div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<goals.length-1?"1px solid #F5F5F5":"none"}}>
              <div style={{width:32,height:32,borderRadius:10,background:mkGrad(col),display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{sp.emoji}</div>
              <span style={{flex:1,fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{g.label}</span>
              <div style={{display:"flex",gap:4}}>{[[-1,"↑"],[1,"↓"]].map(([dir,lbl])=><button key={dir} onClick={()=>moveGoal(i,dir)} disabled={dir===-1?i===0:i===goals.length-1} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #EFEFEF",background:(dir===-1?i===0:i===goals.length-1)?"#FAFAFA":"#fff",color:(dir===-1?i===0:i===goals.length-1)?"#DDD":"#555",fontSize:14,cursor:(dir===-1?i===0:i===goals.length-1)?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{lbl}</button>)}</div>
            </div>);
          })}
        </div>
      )}
      {showAdd&&(
        <div style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:16,border:"2px solid #6C63FF22"}}>
          <div style={{fontSize:14,fontWeight:800,color:"#1A1A2E",marginBottom:14}}>새 목표 추가</div>
          <div style={{marginBottom:12}}><div style={{fontSize:12,color:"#AAA",marginBottom:8,fontWeight:600}}>종목</div><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{Object.entries(allSportsMap).map(([k,sp])=>{const col=getCol(k);return<button key={k} onClick={()=>setNg(p=>({...p,sport:k}))} style={{padding:"7px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:ng.sport===k?col:"#F5F5F5",color:ng.sport===k?"#fff":"#888"}}>{sp.emoji} {sp.label}</button>;})}</div></div>
          <div style={{marginBottom:12}}><div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:600}}>목표 이름</div><Inp value={ng.label} onChange={e=>setNg(p=>({...p,label:e.target.value}))} placeholder="예) 월 러닝 100km"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:600}}>목표 수치</div><Inp value={ng.target} onChange={e=>setNg(p=>({...p,target:e.target.value}))} placeholder="100"/></div>
            <div><div style={{fontSize:12,color:"#AAA",marginBottom:6,fontWeight:600}}>단위</div><select value={ng.unit} onChange={e=>setNg(p=>({...p,unit:e.target.value}))} style={{width:"100%",border:"1.5px solid #EFEFEF",borderRadius:10,padding:"10px 12px",fontSize:13,background:"#F8F8F8",outline:"none"}}>{["km","m","회","분","kcal"].map(u=><option key={u}>{u}</option>)}</select></div>
          </div>
          <Btn onClick={addGoal} color="#6C63FF">목표 저장</Btn>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {goals.map(g=>{
          const col=getCol(g.sport),sp=allSportsMap[g.sport]||{emoji:"🏃",label:"운동"};
          const pct=Math.min(Math.round((g.current/g.target)*100),100),done=g.current>=g.target,isEdit=editing===g.id;
          return(
            <div key={g.id} style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",border:done?`2px solid ${col}44`:"2px solid transparent"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:14,background:mkGrad(col),display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{sp.emoji}</div>
                <div style={{flex:1}}>
                  {isEdit?<input value={g.label} onChange={e=>upGoal(g.id,"label",e.target.value)} style={{width:"100%",border:`2px solid ${col}`,borderRadius:8,padding:"5px 8px",fontSize:13,fontWeight:700,color:"#1A1A2E",outline:"none",boxSizing:"border-box"}}/>:<div style={{fontSize:14,fontWeight:800,color:"#1A1A2E"}}>{g.label}</div>}
                  <div style={{fontSize:11,color:"#AAA",marginTop:3,fontWeight:600}}>{sp.label}</div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {done&&<span style={{fontSize:11,background:col+"22",color:col,borderRadius:8,padding:"3px 8px",fontWeight:800}}>달성 🎉</span>}
                  <button onClick={()=>setEditing(isEdit?null:g.id)} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #EFEFEF",background:isEdit?col:"#fff",color:isEdit?"#fff":"#AAA",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
                  <button onClick={()=>delGoal(g.id)} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #EFEFEF",background:"#fff",color:"#FFB3B3",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8}}>
                <span style={{fontWeight:800,color:col,fontSize:16}}>{g.current}<span style={{fontSize:12}}>{g.unit}</span></span>
                <span style={{color:"#AAA",fontWeight:600}}>목표 {g.target}{g.unit}</span>
              </div>
              <div style={{height:10,background:"#F5F5F5",borderRadius:5,overflow:"hidden",marginBottom:6}}><div style={{width:`${pct}%`,height:"100%",background:done?"#52C47A":col,borderRadius:5}}/></div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#AAA",fontWeight:600}}>{!done?`앞으로 ${(g.target-g.current).toFixed(1)}${g.unit} 남았어요`:""}</span>
                <span style={{fontSize:12,fontWeight:800,color:done?"#52C47A":col}}>{pct}%</span>
              </div>
              {isEdit&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F5F5F5"}}><div style={{fontSize:11,color:"#AAA",marginBottom:6,fontWeight:600}}>목표 수치 수정</div><input type="number" value={g.target} onChange={e=>upGoal(g.id,"target",Number(e.target.value))} style={{width:"100%",border:`2px solid ${col}`,borderRadius:10,padding:"10px",fontSize:14,fontWeight:700,textAlign:"center",background:col+"11",outline:"none",boxSizing:"border-box",color:col}}/></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 설정 ─────────────────────────────────────────────
function SettingScreen({profile,setProfile,sportColors,setSportColors,customSports,setCustomSports,hiddenSports,setHiddenSports}){  const [units,setUnits]=useState({distance:"km",weight:"kg",pace:"min/km"});
  const [noti,setNoti]=useState({workout:true,goal:true,rest:false,weekly:true});
  const [section,setSection]=useState("profile");
  const [saved,setSaved]=useState(false);
  const [colorTarget,setColorTarget]=useState(null);
  const allSportsMap={...BASE_SPORTS,...Object.fromEntries(customSports.map(s=>[s.id,s]))};
  const menuItems=[{k:"profile",ic:"👤",l:"프로필",sub:"이름, 나이, 체중"},{k:"colors",ic:"🎨",l:"종목 컬러",sub:"종목별 컬러 커스텀"},{k:"units",ic:"📐",l:"단위 설정",sub:"거리, 무게, 페이스"},{k:"noti",ic:"🔔",l:"알림 설정",sub:"운동 알림, 리포트"},{k:"data",ic:"💾",l:"데이터 관리",sub:"내보내기, 초기화"}];
  return(
    <div style={{padding:"16px 20px",maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <div style={{fontSize:18,fontWeight:800,color:"#1A1A2E",marginBottom:16}}>⚙️ 설정</div>
      <div style={{background:"linear-gradient(135deg,#1A1A2E,#3D3A6B)",borderRadius:20,padding:22,marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:60,height:60,borderRadius:18,background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>🏃</div>
        <div>
          <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{profile.name||"이름 없음"}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:4}}>{profile.age||"—"}세 · {profile.height||"—"}cm · {profile.weight||"—"}kg</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
            {Object.entries(allSportsMap).map(([k,sp])=>(
              <span key={k} style={{fontSize:10,background:(sportColors[k]||sp.color)+"33",color:sportColors[k]||sp.color,borderRadius:6,padding:"2px 7px",fontWeight:700}}>{sp.emoji} {sp.label}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:16,overflow:"hidden"}}>
        {menuItems.map((m,i)=>(
          <div key={m.k} onClick={()=>setSection(m.k)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:"pointer",background:section===m.k?"#F5F3FF":"#fff",borderBottom:i<menuItems.length-1?"1px solid #F8F8F8":"none"}}>
            <div style={{width:38,height:38,borderRadius:12,background:section===m.k?"#6C63FF22":"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{m.ic}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>{m.l}</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>{m.sub}</div></div>
            <span style={{fontSize:18,color:section===m.k?"#6C63FF":"#DDD",fontWeight:700}}>{section===m.k?"▾":"›"}</span>
          </div>
        ))}
      </div>
      {section==="profile"&&(
        <div style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:16}}>프로필 정보</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["name","이름"],["age","나이"],["height","키(cm)"],["weight","체중(kg)"]].map(([k,l])=>(
              <div key={k}><div style={{fontSize:12,color:"#AAA",marginBottom:5,fontWeight:700}}>{l}</div><Inp value={profile[k]||""} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}/></div>
            ))}
            <div><div style={{fontSize:12,color:"#AAA",marginBottom:8,fontWeight:700}}>성별</div>
              <div style={{display:"flex",gap:10}}>{[["male","👨 남성"],["female","👩 여성"]].map(([v,l])=><button key={v} onClick={()=>setProfile(p=>({...p,gender:v}))} style={{flex:1,padding:"11px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:profile.gender===v?"#6C63FF":"#F5F5F5",color:profile.gender===v?"#fff":"#888"}}>{l}</button>)}</div>
            </div>
          </div>
          <div style={{marginTop:18}}><Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} color="#6C63FF" saved={saved}>저장</Btn></div>
        </div>
      )}
      {section==="colors"&&(
        <div style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:16}}>종목별 컬러 선택</div>
          {Object.entries(allSportsMap).filter(([k])=>!hiddenSports.includes(k)).map(([k,sp],i,arr)=>{
            const col=sportColors[k]||sp.color;
            const isOpen=colorTarget===k;
            return(
              <div key={k}>
                <div style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:i<arr.length-1&&!isOpen?"1px solid #F8F8F8":"none"}}>
                  <div style={{width:44,height:44,borderRadius:14,background:mkGrad(col),display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{sp.emoji}</div>
                  <span style={{flex:1,fontSize:14,fontWeight:700,color:"#1A1A2E"}}>{sp.label}</span>
                  <div onClick={()=>setColorTarget(isOpen?null:k)} style={{width:36,height:36,borderRadius:10,background:col,cursor:"pointer",border:"3px solid #fff",boxShadow:`0 2px 8px ${col}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎨</div>
                  <button onClick={()=>{if(customSports.some(s=>s.id===k)){setCustomSports(p=>p.filter(s=>s.id!==k));}else{setHiddenSports(p=>[...p,k]);}}} style={{width:30,height:30,borderRadius:8,border:"1.5px solid #EFEFEF",background:"#fff",color:"#FFB3B3",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
                </div>
                {isOpen&&<div style={{marginBottom:8}}><ColorPalette currentColor={col} onSelect={v=>{setSportColors(p=>({...p,[k]:v}));setColorTarget(null);}}/></div>}
              </div>
            );
          })}
          <div style={{marginTop:12,padding:"12px 14px",background:"#F5F3FF",borderRadius:12,fontSize:12,color:"#6C63FF",fontWeight:600}}>💡 × 버튼으로 커스텀 종목을 삭제할 수 있어요</div>
        </div>
      )}
      {section==="units"&&(
        <div style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:16}}>단위 설정</div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[["거리 단위","distance",["km","mi"]],["무게 단위","weight",["kg","lbs"]],["페이스 단위","pace",["min/km","min/mi"]]].map(([l,k,opts])=>(
              <div key={k}><div style={{fontSize:12,color:"#AAA",marginBottom:8,fontWeight:700}}>{l}</div>
                <div style={{display:"flex",gap:8}}>{opts.map(u=><button key={u} onClick={()=>setUnits(p=>({...p,[k]:u}))} style={{flex:1,padding:"11px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:units[k]===u?"#6C63FF":"#F5F5F5",color:units[k]===u?"#fff":"#888"}}>{u}</button>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {section==="noti"&&(
        <div style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:14}}>알림 설정</div>
          {[{k:"workout",ic:"🏃",l:"운동 기록 알림",sub:"운동 후 기록 입력 알림"},{k:"goal",ic:"🎯",l:"목표 달성 알림",sub:"목표 달성 시 알림"},{k:"rest",ic:"😴",l:"휴식 권장 알림",sub:"연속 운동 시 휴식 알림"},{k:"weekly",ic:"📊",l:"주간 리포트",sub:"매주 월요일 주간 요약"}].map((it,i,arr)=>(
            <div key={it.k} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:i<arr.length-1?"1px solid #F8F8F8":"none"}}>
              <div style={{width:38,height:38,borderRadius:12,background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{it.ic}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{it.l}</div><div style={{fontSize:11,color:"#AAA",marginTop:2}}>{it.sub}</div></div>
              <Tog value={noti[it.k]} onChange={()=>setNoti(p=>({...p,[it.k]:!p[it.k]}))} color="#6C63FF"/>
            </div>
          ))}
        </div>
      )}
      {section==="data"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#fff",borderRadius:18,padding:18,boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
            {[["버전","v1.0.0 Beta"],["개발","FitLog Team"],["문의","fitlog@email.com"]].map(([l,v],i,arr)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<arr.length-1?"1px solid #F8F8F8":"none"}}><span style={{fontSize:13,color:"#AAA",fontWeight:600}}>{l}</span><span style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{v}</span></div>
            ))}
          </div>
          <button style={{width:"100%",background:"#FFF0F0",color:"#FF6B6B",border:"2px solid #FFD0D0",borderRadius:14,padding:"13px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>⚠️ 전체 데이터 초기화</button>
        </div>
      )}
    </div>
  );
}

// ── 앱 루트 ──────────────────────────────────────────
export default function App(){
  const [scr,setScr]=useState("calendar");
  const [sel,setSel]=useState("2026-04-30");
  const [cur,setCur]=useState(new Date(2026,3,1));
 const [wData,setWData]=useState(()=>JSON.parse(localStorage.getItem('wData'))||INIT_DATA);
const [profile,setProfile]=useState(()=>JSON.parse(localStorage.getItem('profile'))||{name:"김민준",age:"32",height:"178",weight:"72",gender:"male"});
const [sportColors,setSportColors]=useState(()=>JSON.parse(localStorage.getItem('sportColors'))||{running:"#FF6B6B",swimming:"#4ECDC4",crossfit:"#F4A261",gym:"#52C47A",cycling:"#9B8EC4"});
const [customSports,setCustomSports]=useState(()=>JSON.parse(localStorage.getItem('customSports'))||[]);
const [hiddenSports,setHiddenSports]=useState(()=>JSON.parse(localStorage.getItem('hiddenSports'))||[]);
  const NAV=[{ic:"📅",l:"달력",k:"calendar"},{ic:"📊",l:"통계",k:"stats"},{ic:"🎯",l:"목표",k:"goal"},{ic:"⚙️",l:"설정",k:"setting"}];
  const allSportsMap={...BASE_SPORTS,...Object.fromEntries(customSports.map(s=>[s.id,s]))};
  const isCustomSport=(k)=>customSports.some(s=>s.id===k);
  const handleAdd=(date,sports)=>{
    setWData(prev=>{const ex=prev[date]||[];const exS=ex.map(e=>e.sport);const newE=sports.filter(s=>!exS.includes(s)).map(s=>({sport:s,done:false}));return{...prev,[date]:[...ex,...newE]};});
  };
  const handleSave=(date,sport,entry)=>{
    setWData(prev=>{const ex=prev[date]||[];const idx=ex.findIndex(e=>e.sport===sport);if(idx>=0){const nx=[...ex];nx[idx]={...ex[idx],...entry};return{...prev,[date]:nx};}return{...prev,[date]:[...ex,entry]};});
  };
  const handleAddCustom=(sp)=>{
    setCustomSports(p=>[...p,sp]);
    setSportColors(p=>({...p,[sp.id]:sp.color}));
  };
  // 현재 화면에서 어떤 커스텀 종목인지
  const currentCustomKey=isCustomSport(scr)?scr:null;
  useEffect(()=>{localStorage.setItem('wData',JSON.stringify(wData));},[wData]);
useEffect(()=>{localStorage.setItem('profile',JSON.stringify(profile));},[profile]);
useEffect(()=>{localStorage.setItem('sportColors',JSON.stringify(sportColors));},[sportColors]);
useEffect(()=>{localStorage.setItem('customSports',JSON.stringify(customSports));},[customSports]);
useEffect(()=>{localStorage.setItem('hiddenSports',JSON.stringify(hiddenSports));},[hiddenSports]);
  return(
    <div style={{fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif",background:"#F5F5F7",minHeight:"100vh"}}>
      <div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.06)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#6C63FF,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 3px 10px #6C63FF44"}}>🏋️</div>
          <div><span style={{fontSize:18,fontWeight:900,color:"#1A1A2E"}}>FitLog</span><span style={{fontSize:10,background:"#F0F0FF",color:"#6C63FF",borderRadius:5,padding:"1px 6px",fontWeight:700,marginLeft:6}}>Beta</span></div>
        </div>
        <div style={{fontSize:12,color:"#AAA",fontWeight:600}}>{profile.name}</div>
      </div>
      {scr==="calendar"&&<CalendarScreen sel={sel} setSel={setSel} setScr={setScr} cur={cur} setCur={setCur} data={wData} onAdd={handleAdd} sportColors={sportColors} setSportColors={setSportColors} customSports={customSports} onAddCustom={handleAddCustom}/>}
      {scr==="running"&&<RunningScreen sel={sel} setScr={setScr} data={wData} onSave={handleSave} sportColors={sportColors}/>}
      {scr==="swimming"&&<SwimmingScreen sel={sel} setScr={setScr} data={wData} onSave={handleSave} sportColors={sportColors}/>}
      {scr==="gym"&&<GymScreen sel={sel} setScr={setScr} data={wData} onSave={handleSave} sportColors={sportColors}/>}
      {scr==="crossfit"&&<CrossfitScreen sel={sel} setScr={setScr} data={wData} onSave={handleSave} sportColors={sportColors}/>}
      {scr==="cycling"&&<CyclingScreen sel={sel} setScr={setScr} data={wData} onSave={handleSave} sportColors={sportColors}/>}
      {currentCustomKey&&<CustomSportScreen sel={sel} setScr={setScr} data={wData} onSave={handleSave} sportColors={sportColors} allSports={allSportsMap} sportKey={currentCustomKey}/>}
      {scr==="stats"&&<StatsScreen data={wData} sportColors={sportColors} customSports={customSports}/>}
      {scr==="goal"&&<GoalScreen data={wData} sportColors={sportColors} customSports={customSports}/>}
      {scr==="setting"&&<SettingScreen profile={profile} setProfile={setProfile} sportColors={sportColors} setSportColors={setSportColors} customSports={customSports} setCustomSports={setCustomSports} hiddenSports={hiddenSports} setHiddenSports={setHiddenSports}/>}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(0,0,0,0.06)",padding:"10px 20px 14px",display:"flex",justifyContent:"space-around",zIndex:10}}>
        {NAV.map(it=>(
          <div key={it.k} onClick={()=>setScr(it.k)} style={{textAlign:"center",cursor:"pointer",padding:"4px 16px",borderRadius:12,background:scr===it.k?"#F0F0FF":"transparent",transition:"background 0.2s"}}>
            <div style={{fontSize:22}}>{it.ic}</div>
            <div style={{fontSize:10,fontWeight:700,color:scr===it.k?"#6C63FF":"#CCC",marginTop:2}}>{it.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}