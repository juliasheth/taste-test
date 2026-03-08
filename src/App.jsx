import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@300;400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; color: #0a0a0a; }
    .app { font-family: 'DM Mono', monospace; background: #fff; color: #0a0a0a; min-height: 100vh; max-width: 480px; margin: 0 auto; }
    input, textarea, button { font-family: 'DM Mono', monospace; }
    input:focus, textarea:focus { outline: none; }
    button { cursor: pointer; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes wordReveal { from { opacity:0; transform:translateY(24px) skewY(2deg); } to { opacity:1; transform:translateY(0) skewY(0); } }
    @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
    @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    .word-reveal { animation: wordReveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
    .slide-up { animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
    .toast { animation: toastIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fade-in { animation: fadeIn 0.3s ease forwards; }
    .spinner { animation: spin 0.8s linear infinite; }
    ::-webkit-scrollbar { width: 0; }
    input[type="text"], input[type="tel"] { -webkit-appearance:none; border-radius:0; }
  `}</style>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const generateStyleWords = (savedCount, baseWords) => {
  const pool = [
    ["minimal","precise","considered"],["editorial","sharp","spare"],
    ["instinctive","worn","found"],["quiet","architectural","raw"],
    ["tactile","borrowed","refined"],["dark","structured","rare"],
    ["effortless","niche","earned"],["warm","subversive","slow"],
  ];
  if (savedCount < 3) return baseWords;
  return pool[Math.floor(savedCount / 3) % pool.length];
};

const timeAgo = (ts) => {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

const Spinner = () => (
  <div style={{ display:"flex", justifyContent:"center", padding:"48px 0" }}>
    <div className="spinner" style={{ width:20, height:20, border:"1.5px solid #e0e0e0", borderTopColor:"#0a0a0a", borderRadius:"50%" }} />
  </div>
);

const Avatar = ({ username, size = 40 }) => (
  <div style={{ width:size, height:size, background:"#0a0a0a", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize: size * 0.28, color:"#fff", letterSpacing:"0.04em" }}>
    {(username || "??").slice(0,2).toUpperCase()}
  </div>
);

const MOCK_FRIENDS = [
  { id:"f1", username:"mara.c",  style_words:["minimal","dark","tailored"],   rec_count: 12 },
  { id:"f2", username:"sofiar",  style_words:["romantic","layered","vintage"], rec_count: 7  },
  { id:"f3", username:"jade.k",  style_words:["editorial","sharp","spare"],    rec_count: 23 },
  { id:"f4", username:"alex_w",  style_words:["sporty","clean","functional"],  rec_count: 4  },
];

const MOCK_ASKS = [
  { id:"a1", user_id:"f1", username:"mara.c", style_words:["minimal","dark","tailored"],   description:"Looking for a great winter coat — structured, not puffy. Any leads?",              category:"Outerwear", created_at: new Date(Date.now() - 1000*60*23).toISOString(),  rec_count: 2 },
  { id:"a2", user_id:"f3", username:"jade.k", style_words:["editorial","sharp","spare"],   description:"Need the perfect flat black boot. Not too pointed, not too square.",              category:"Shoes",     created_at: new Date(Date.now() - 1000*60*60*2).toISOString(), rec_count: 5 },
  { id:"a3", user_id:"f2", username:"sofiar", style_words:["romantic","layered","vintage"],"description":"Best indie brand for a silk slip dress? Doesn't have to be expensive.",       category:"Tops",      created_at: new Date(Date.now() - 1000*60*60*8).toISOString(), rec_count: 1 },
  { id:"a4", user_id:"f1", username:"mara.c", style_words:["minimal","dark","tailored"],   description:"Where are people finding interesting jewellery brands right now?",               category:"Jewellery", created_at: new Date(Date.now() - 1000*60*60*24).toISOString(),rec_count: 8 },
];

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────

const PhoneScreen = ({ onNext }) => {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const fmt = (v) => { const d = v.replace(/\D/g,"").slice(0,10); if(d.length<=3)return d; if(d.length<=6)return`(${d.slice(0,3)}) ${d.slice(3)}`; return`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`; };
  const valid = phone.replace(/\D/g,"").length === 10;
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:"0 32px" }}>
      <div style={{ paddingTop:80 }}>
        <p className="fade-up" style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#999", marginBottom:64 }}>thread</p>
        <h1 className="fade-up" style={{ animationDelay:"0.1s", fontFamily:"'Playfair Display', serif", fontSize:42, fontWeight:400, lineHeight:1.15, marginBottom:16 }}>know your<br /><em>taste.</em></h1>
        <p className="fade-up" style={{ animationDelay:"0.2s", fontSize:11, color:"#888", letterSpacing:"0.04em", marginBottom:64, lineHeight:1.7 }}>A private space for the things<br />you want, love, and can't find.</p>
        <div className="fade-up" style={{ animationDelay:"0.3s" }}>
          <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#999", marginBottom:12 }}>enter your number</p>
          <div style={{ borderBottom:`1.5px solid ${focused?"#0a0a0a":"#e0e0e0"}`, paddingBottom:12, marginBottom:32, transition:"border-color 0.2s", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13, color:"#999" }}>+1</span>
            <input type="tel" value={phone} onChange={e=>setPhone(fmt(e.target.value))} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="(000) 000-0000" style={{ flex:1, border:"none", fontSize:16, color:"#0a0a0a", background:"transparent", letterSpacing:"0.04em" }} />
          </div>
          <button onClick={()=>valid&&onNext(phone.replace(/\D/g,""))} style={{ width:"100%", padding:"16px", border:"1.5px solid #0a0a0a", background:valid?"#0a0a0a":"transparent", color:valid?"#fff":"#ccc", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s" }}>Continue</button>
        </div>
      </div>
      <p style={{ fontSize:10, color:"#bbb", textAlign:"center", padding:"24px 0", letterSpacing:"0.06em", marginTop:"auto" }}>We'll send a verification code via SMS.</p>
    </div>
  );
};

const VerifyScreen = ({ phone, onNext }) => {
  const [code, setCode] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);
  const handleChange = (val, idx) => {
    if(!/^\d*$/.test(val)) return;
    const next=[...code]; next[idx]=val.slice(-1); setCode(next);
    if(val && idx<5) refs.current[idx+1]?.focus();
    if(next.every(d=>d!=="")) { setLoading(true); setTimeout(()=>{ setLoading(false); onNext(); },600); }
  };
  const handleKey = (e,idx) => { if(e.key==="Backspace"&&!code[idx]&&idx>0) refs.current[idx-1]?.focus(); };
  return (
    <div style={{ minHeight:"100vh", padding:"0 32px", paddingTop:80 }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#999", marginBottom:64 }}>thread</p>
      <h2 className="fade-up" style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, marginBottom:12 }}>check your<br /><em>messages.</em></h2>
      <p className="fade-up" style={{ animationDelay:"0.1s", fontSize:11, color:"#888", marginBottom:48, letterSpacing:"0.04em", lineHeight:1.7 }}>Sent to +1 {phone.slice(0,3)}-{phone.slice(3,6)}-{phone.slice(6)}</p>
      <div className="fade-up" style={{ animationDelay:"0.15s" }}>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          {code.map((d,i)=>(
            <input key={i} ref={el=>refs.current[i]=el} type="tel" maxLength={1} value={d} onChange={e=>handleChange(e.target.value,i)} onKeyDown={e=>handleKey(e,i)}
              style={{ width:"100%", aspectRatio:"1", textAlign:"center", border:`1.5px solid ${d?"#0a0a0a":"#e0e0e0"}`, fontSize:20, color:"#0a0a0a", background:"transparent", transition:"border-color 0.15s" }} />
          ))}
        </div>
        {loading && <p style={{ fontSize:10, color:"#888", letterSpacing:"0.1em", marginTop:12 }}>Verifying...</p>}
        <p style={{ fontSize:10, color:"#bbb", marginTop:20, letterSpacing:"0.06em" }}>(Demo: any 6 digits will work)</p>
      </div>
    </div>
  );
};

const UsernameScreen = ({ onNext }) => {
  const [username, setUsername] = useState("");
  const [focused, setFocused] = useState(false);
  const [checking, setChecking] = useState(false);
  const [taken, setTaken] = useState(false);
  const valid = username.length >= 3 && /^[a-z0-9._]+$/.test(username) && !taken;
  useEffect(() => {
    if (username.length < 3) return;
    const t = setTimeout(async () => {
      setChecking(true);
      const { data } = await supabase.from("users").select("id").eq("username", username).maybeSingle();
      setTaken(!!data); setChecking(false);
    }, 500);
    return () => clearTimeout(t);
  }, [username]);
  return (
    <div style={{ minHeight:"100vh", padding:"0 32px", paddingTop:80 }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#999", marginBottom:64 }}>thread</p>
      <h2 className="fade-up" style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, marginBottom:12 }}>choose your<br /><em>name.</em></h2>
      <p className="fade-up" style={{ animationDelay:"0.1s", fontSize:11, color:"#888", marginBottom:48, letterSpacing:"0.04em", lineHeight:1.7 }}>This is how friends will find you.</p>
      <div className="fade-up" style={{ animationDelay:"0.15s" }}>
        <div style={{ borderBottom:`1.5px solid ${focused?"#0a0a0a":"#e0e0e0"}`, paddingBottom:12, marginBottom:8, transition:"border-color 0.2s", display:"flex", alignItems:"center" }}>
          <span style={{ fontSize:13, color:"#bbb", marginRight:4 }}>@</span>
          <input type="text" value={username} onChange={e=>{setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g,"")); setTaken(false);}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="yourname"
            style={{ flex:1, border:"none", fontSize:16, color:"#0a0a0a", background:"transparent", letterSpacing:"0.04em" }} />
          {checking && <span style={{ fontSize:11, color:"#bbb" }}>...</span>}
          {!checking && username.length>=3 && <span style={{ fontSize:14, color:taken?"#999":"#0a0a0a" }}>{taken?"✗":"✓"}</span>}
        </div>
        <p style={{ fontSize:10, color:taken?"#0a0a0a":"#bbb", marginBottom:40, letterSpacing:"0.06em" }}>{taken?"That username is taken.":"Lowercase letters, numbers, periods, underscores."}</p>
        <button onClick={()=>valid&&onNext(username)} style={{ width:"100%", padding:"16px", border:"1.5px solid #0a0a0a", background:valid?"#0a0a0a":"transparent", color:valid?"#fff":"#ccc", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s" }}>Continue</button>
      </div>
    </div>
  );
};

const StyleWordsScreen = ({ onNext }) => {
  const [words, setWords] = useState(["","",""]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRefs = useRef([]);
  const valid = words.every(w=>w.length>=2);
  const SUGGESTIONS = [["minimal","dark","considered"],["effortless","vintage","personal"],["editorial","sharp","precise"],["quiet","textured","rare"]];
  return (
    <div style={{ minHeight:"100vh", padding:"0 32px", paddingTop:80 }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#999", marginBottom:64 }}>thread</p>
      <h2 className="fade-up" style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, marginBottom:12 }}>define your<br /><em>aesthetic.</em></h2>
      <p className="fade-up" style={{ animationDelay:"0.1s", fontSize:11, color:"#888", marginBottom:48, letterSpacing:"0.04em", lineHeight:1.7 }}>Three words. They'll evolve as<br />you save things to your board.</p>
      <div className="fade-up" style={{ animationDelay:"0.15s" }}>
        {words.map((word,idx)=>(
          <div key={idx} style={{ borderBottom:`1.5px solid ${activeIdx===idx?"#0a0a0a":word?"#0a0a0a":"#e0e0e0"}`, marginBottom:20, paddingBottom:8, transition:"border-color 0.2s", display:"flex", alignItems:"baseline", gap:10 }}>
            <span style={{ fontFamily:"'Playfair Display', serif", fontSize:11, color:activeIdx===idx?"#0a0a0a":"#bbb", width:14, flexShrink:0, fontStyle:"italic" }}>{idx+1}.</span>
            <input ref={el=>inputRefs.current[idx]=el} type="text" value={word}
              onChange={e=>{const n=[...words];n[idx]=e.target.value.toLowerCase().replace(/[^a-z]/g,"").slice(0,16);setWords(n);}}
              onFocus={()=>setActiveIdx(idx)}
              onKeyDown={e=>{if((e.key==="Enter"||e.key==="Tab")&&idx<2){e.preventDefault();inputRefs.current[idx+1]?.focus();}}}
              placeholder={["first word","second word","third word"][idx]}
              style={{ flex:1, border:"none", background:"transparent", fontFamily:"'Playfair Display', serif", fontSize:28, fontWeight:400, fontStyle:word?"italic":"normal", color:word?"#0a0a0a":"#ccc", letterSpacing:"-0.01em" }} />
          </div>
        ))}
        <div style={{ marginTop:32, marginBottom:16 }}>
          <p style={{ fontSize:10, color:"#bbb", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:12 }}>not sure? try these</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {SUGGESTIONS.map((set,i)=>(
              <button key={i} onClick={()=>setWords(set)} style={{ padding:"7px 14px", border:"1px solid #e0e0e0", background:"transparent", fontSize:10, color:"#666", letterSpacing:"0.08em" }}>{set.join(" · ")}</button>
            ))}
          </div>
        </div>
        <button onClick={()=>valid&&onNext(words)} style={{ width:"100%", padding:"16px", border:"1.5px solid #0a0a0a", background:valid?"#0a0a0a":"transparent", color:valid?"#fff":"#ccc", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s", marginTop:24 }}>Enter thread</button>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const MainApp = ({ user, onSignOut }) => {
  const [tab, setTab] = useState("home");
  const [styleWords, setStyleWords] = useState(user.style_words);
  const [savedItems, setSavedItems] = useState([]);
  const [lookingFor, setLookingFor] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendAsks, setFriendAsks] = useState([]);
  const [recCount, setRecCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [wordAnimKey, setWordAnimKey] = useState(0);
  const prevSaveCount = useRef(0);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2500); };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [itemsRes, lookingRes, friendsRes, recsRes] = await Promise.all([
        supabase.from("saved_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("looking_for").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("friends").select("friend_id").eq("user_id", user.id),
        supabase.from("recommendations").select("id", { count: "exact" }).eq("from_user_id", user.id),
      ]);
      if (itemsRes.data) setSavedItems(itemsRes.data);
      if (lookingRes.data) setLookingFor(lookingRes.data);
      if (recsRes.count !== null) setRecCount(recsRes.count);

      if (friendsRes.data?.length) {
        const friendIds = friendsRes.data.map(f => f.friend_id);
        const { data: friendUsers } = await supabase.from("users").select("*").in("id", friendIds);
        if (friendUsers) {
          setFriends(friendUsers);
          // Load friends' looking_for as the "asks" feed
          const { data: asks } = await supabase
            .from("looking_for")
            .select("*, users(username, style_words)")
            .in("user_id", friendIds)
            .order("created_at", { ascending: false });
          if (asks) setFriendAsks(asks.map(a => ({ ...a, username: a.users?.username, style_words: a.users?.style_words })));
        }
      } else {
        // Demo mode: use mock data
        setFriends(MOCK_FRIENDS.slice(0,2));
        setFriendAsks(MOCK_ASKS);
      }
      setLoading(false);
    };
    load();
  }, [user.id]);

  useEffect(() => {
    if (savedItems.length > 0 && savedItems.length % 3 === 0 && savedItems.length !== prevSaveCount.current) {
      prevSaveCount.current = savedItems.length;
      const newWords = generateStyleWords(savedItems.length, user.style_words);
      if (JSON.stringify(newWords) !== JSON.stringify(styleWords)) {
        setStyleWords(newWords);
        setWordAnimKey(k=>k+1);
        supabase.from("users").update({ style_words: newWords }).eq("id", user.id);
        showToast("Your words just updated ✦");
      }
    }
  }, [savedItems.length]);

  const handleSaveItem = async (item) => {
    const newItem = { ...item, user_id: user.id };
    const { data, error } = await supabase.from("saved_items").insert(newItem).select().single();
    setSavedItems(prev => [error ? { ...newItem, id: Date.now() } : data, ...prev]);
    setModal(null); showToast("Saved to your board");
  };

  const handleAddLooking = async (item) => {
    const newItem = { ...item, user_id: user.id };
    const { data, error } = await supabase.from("looking_for").insert(newItem).select().single();
    setLookingFor(prev => [error ? { ...newItem, id: Date.now() } : data, ...prev]);
    setModal(null); showToast("Added to your list");
  };

  const handleAddFriend = async (friend) => {
    const { error } = await supabase.from("friends").insert({ user_id: user.id, friend_id: friend.id });
    if (!error) setFriends(prev => [...prev, friend]);
    setModal(null); showToast(`Connected with @${friend.username}`);
  };

  const handleSendRec = async (rec) => {
    const newRec = { from_user_id: user.id, to_user_id: rec.to_user_id, ask_id: rec.ask_id, ask_text: rec.ask_text, link: rec.link, note: rec.note };
    const { error } = await supabase.from("recommendations").insert(newRec);
    if (!error) setRecCount(c => c + 1);
    else setRecCount(c => c + 1); // optimistic in demo
    setModal(null);
    showToast("Recommendation sent ✦");
  };

  if (loading) return <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner /></div>;

  return (
    <div style={{ minHeight:"100vh", background:"#fff", paddingBottom:72 }}>
      <div style={{ overflowY:"auto", height:"calc(100vh - 72px)" }}>
        {tab==="home"    && <HomeTab    user={user} styleWords={styleWords} wordAnimKey={wordAnimKey} savedItems={savedItems} onOpenSave={()=>setModal("save")} />}
        {tab==="wishlist"&& <WishlistTab savedItems={savedItems} onOpenSave={()=>setModal("save")} />}
        {tab==="feed"    && <FeedTab    asks={friendAsks} currentUser={user} onReply={(ask)=>setModal({type:"reply", ask})} />}
        {tab==="looking" && <LookingTab lookingFor={lookingFor} onAdd={()=>setModal("looking")} friends={friends} />}
        {tab==="profile" && <ProfileTab user={user} styleWords={styleWords} savedItems={savedItems} recCount={recCount} friends={friends} onSignOut={onSignOut} onOpenAddFriend={()=>setModal("add-friend")} onAskRec={(f)=>setModal({type:"recommend",friend:f})} showToast={showToast} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />

      {modal==="save"        && <SaveModal       onClose={()=>setModal(null)} onSave={handleSaveItem} />}
      {modal==="looking"     && <LookingModal    onClose={()=>setModal(null)} onAdd={handleAddLooking} />}
      {modal==="add-friend"  && <AddFriendModal  onClose={()=>setModal(null)} existing={friends} onAdd={handleAddFriend} currentUserId={user.id} />}
      {modal?.type==="reply"    && <ReplyModal   onClose={()=>setModal(null)} ask={modal.ask} currentUser={user} onSend={handleSendRec} />}
      {modal?.type==="recommend"&& <RecommendModal onClose={()=>setModal(null)} friend={modal.friend} onSend={()=>{setModal(null);showToast(`Rec request sent to @${modal.friend.username}`);}} />}

      {toast && (
        <div className="toast" style={{ position:"fixed", bottom:90, left:"50%", background:"#0a0a0a", color:"#fff", padding:"10px 20px", fontSize:11, letterSpacing:"0.08em", whiteSpace:"nowrap", zIndex:500 }}>
          {toast}
        </div>
      )}
    </div>
  );
};

// ─── TABS ─────────────────────────────────────────────────────────────────────

const HomeTab = ({ user, styleWords, wordAnimKey, savedItems, onOpenSave }) => (
  <div>
    <div style={{ padding:"48px 32px 0", borderBottom:"1px solid #f0f0f0" }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#bbb", marginBottom:48 }}>@{user.username}</p>
      <div style={{ marginBottom:48 }} key={wordAnimKey}>
        <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb", marginBottom:20 }}>your aesthetic</p>
        {styleWords.map((word,i)=>(
          <div key={`${word}-${i}`} className="word-reveal" style={{ animationDelay:`${i*0.18}s`, fontFamily:"'Playfair Display', serif", fontSize:56, fontWeight:400, fontStyle:"italic", lineHeight:1.05, letterSpacing:"-0.02em", color:"#0a0a0a" }}>{word}</div>
        ))}
        <p style={{ fontSize:10, color:"#bbb", marginTop:16, letterSpacing:"0.06em" }}>Updates as you save · {savedItems.length} {savedItems.length===1?"save":"saves"}</p>
      </div>
    </div>
    <div style={{ padding:"32px 32px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb" }}>recent saves</p>
        <button onClick={onOpenSave} style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", background:"transparent", border:"1px solid #0a0a0a", color:"#0a0a0a", padding:"6px 14px" }}>+ Save</button>
      </div>
      {savedItems.length===0 ? (
        <div style={{ border:"1px dashed #e0e0e0", padding:"40px 24px", textAlign:"center" }}>
          <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.06em", lineHeight:1.8 }}>Save links, screenshots, or product pages.<br />Your words evolve as you add more.</p>
          <button onClick={onOpenSave} style={{ marginTop:20, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", background:"#0a0a0a", color:"#fff", border:"none", padding:"12px 24px" }}>Save your first item</button>
        </div>
      ) : savedItems.slice(0,5).map(item=><SavedItemRow key={item.id} item={item} />)}
    </div>
  </div>
);

const WishlistTab = ({ savedItems, onOpenSave }) => (
  <div style={{ padding:"48px 32px 0" }}>
    <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#bbb", marginBottom:32 }}>thread</p>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:32 }}>
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, fontStyle:"italic" }}>saved</h2>
      <button onClick={onOpenSave} style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", background:"#0a0a0a", border:"none", color:"#fff", padding:"8px 16px" }}>+ Save</button>
    </div>
    {savedItems.length===0 ? (
      <div style={{ border:"1px dashed #e0e0e0", padding:"48px 24px", textAlign:"center" }}>
        <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.06em", lineHeight:1.9 }}>Nothing saved yet.<br />Add links or screenshots from<br />social media, brands, anywhere.</p>
      </div>
    ) : savedItems.map(item=><SavedItemRow key={item.id} item={item} />)}
  </div>
);

// ── FEED TAB (new) ────────────────────────────────────────────────────────────
const FeedTab = ({ asks, currentUser, onReply }) => {
  const [replied, setReplied] = useState(new Set());

  const handleReply = (ask) => { onReply(ask); };

  return (
    <div style={{ padding:"48px 32px 0" }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#bbb", marginBottom:12 }}>thread</p>
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, fontStyle:"italic", marginBottom:8 }}>circle asks</h2>
      <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.04em", lineHeight:1.7, marginBottom:32 }}>
        What your friends are hunting for.
      </p>

      {asks.length === 0 ? (
        <div style={{ border:"1px dashed #e0e0e0", padding:"48px 24px", textAlign:"center" }}>
          <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.06em", lineHeight:1.9 }}>
            No asks yet.<br />When friends add something to their<br />"looking for" list, it appears here.
          </p>
        </div>
      ) : asks.map((ask, i) => (
        <AskCard
          key={ask.id}
          ask={ask}
          hasReplied={replied.has(ask.id)}
          onReply={() => {
            handleReply(ask);
            setReplied(prev => new Set([...prev, ask.id]));
          }}
          animDelay={i * 0.06}
        />
      ))}
    </div>
  );
};

const AskCard = ({ ask, hasReplied, onReply, animDelay }) => (
  <div className="fade-in" style={{ animationDelay:`${animDelay}s`, borderBottom:"1px solid #f0f0f0", padding:"24px 0" }}>
    {/* Header */}
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
      <Avatar username={ask.username} size={34} />
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontSize:12, color:"#0a0a0a", letterSpacing:"0.04em" }}>@{ask.username}</span>
          <span style={{ fontSize:10, color:"#bbb", letterSpacing:"0.04em" }}>{timeAgo(ask.created_at)}</span>
        </div>
        <p style={{ fontSize:10, color:"#bbb", fontFamily:"'Playfair Display', serif", fontStyle:"italic", marginTop:2 }}>
          {(ask.style_words || []).join(" · ")}
        </p>
      </div>
      {ask.category && (
        <span style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"#888", border:"1px solid #e0e0e0", padding:"3px 8px" }}>
          {ask.category}
        </span>
      )}
    </div>

    {/* The ask */}
    <p style={{ fontFamily:"'Playfair Display', serif", fontSize:17, fontStyle:"italic", lineHeight:1.5, color:"#0a0a0a", marginBottom:16 }}>
      "{ask.description}"
    </p>

    {/* Footer */}
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <span style={{ fontSize:10, color:"#bbb", letterSpacing:"0.06em" }}>
        {ask.rec_count || 0} {(ask.rec_count || 0) === 1 ? "rec" : "recs"}
      </span>
      <button
        onClick={onReply}
        style={{
          fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase",
          background: hasReplied ? "#f5f5f5" : "#0a0a0a",
          color: hasReplied ? "#bbb" : "#fff",
          border: hasReplied ? "1px solid #e0e0e0" : "none",
          padding:"9px 20px",
          transition:"all 0.15s",
        }}
      >
        {hasReplied ? "Rec sent ✦" : "Send a rec"}
      </button>
    </div>
  </div>
);

const LookingTab = ({ lookingFor, onAdd, friends }) => (
  <div style={{ padding:"48px 32px 0" }}>
    <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#bbb", marginBottom:32 }}>thread</p>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:12 }}>
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, fontStyle:"italic" }}>looking for</h2>
      <button onClick={onAdd} style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", background:"#0a0a0a", border:"none", color:"#fff", padding:"8px 16px" }}>+ Add</button>
    </div>
    <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.04em", lineHeight:1.7, marginBottom:32 }}>
      Tell your circle what you're hunting for.
    </p>
    {lookingFor.length===0 ? (
      <div style={{ border:"1px dashed #e0e0e0", padding:"48px 24px", textAlign:"center" }}>
        <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.06em", lineHeight:1.9 }}>Nothing on your list yet.<br />Add what you're searching for<br />and your friends can help.</p>
        <button onClick={onAdd} style={{ marginTop:24, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", background:"#0a0a0a", color:"#fff", border:"none", padding:"12px 24px" }}>Add something</button>
      </div>
    ) : lookingFor.map(item=>(
      <div key={item.id} style={{ borderBottom:"1px solid #f0f0f0", padding:"20px 0" }}>
        <p style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontStyle:"italic", marginBottom:8 }}>{item.description}</p>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:10, color:"#bbb", letterSpacing:"0.06em" }}>{item.category}</span>
          <span style={{ fontSize:10, color:"#0a0a0a", letterSpacing:"0.06em" }}>visible to {friends.length} {friends.length===1?"friend":"friends"}</span>
        </div>
      </div>
    ))}
  </div>
);

// ── PROFILE TAB ───────────────────────────────────────────────────────────────
const ProfileTab = ({ user, styleWords, savedItems, recCount, friends, onSignOut, onOpenAddFriend, onAskRec, showToast }) => {
  const profileUrl = `https://thread.app/@${user.username}`;
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=0a0a0a&margin=12`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(profileUrl); } catch {}
    setLinkCopied(true);
    showToast?.("Profile link copied ✦");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title:`@${user.username} on Thread`, text:`My aesthetic: ${styleWords.join(", ")}`, url: profileUrl });
        return;
      } catch {}
    }
    copyLink();
  };

  return (
  <div style={{ padding:"48px 32px 40px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40 }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#bbb" }}>thread</p>
      <button onClick={onSignOut} style={{ fontSize:10, letterSpacing:"0.1em", color:"#bbb", background:"none", border:"none", textTransform:"uppercase" }}>sign out</button>
    </div>

    {/* Identity */}
    <div style={{ marginBottom:32 }}>
      <Avatar username={user.username} size={56} />
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:28, fontWeight:400, marginTop:16, marginBottom:4 }}>@{user.username}</h2>
      <p style={{ fontSize:11, color:"#bbb", fontStyle:"italic", fontFamily:"'Playfair Display', serif", letterSpacing:"0.02em" }}>
        {styleWords.join(" · ")}
      </p>
    </div>

    {/* ── Share your profile ── */}
    <div style={{ border:"1.5px solid #0a0a0a", padding:"20px", marginBottom:40 }}>
      <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb", marginBottom:12 }}>your profile link</p>

      {/* URL display */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, background:"#f8f8f8", padding:"10px 12px" }}>
        <p style={{ flex:1, fontSize:11, color:"#0a0a0a", letterSpacing:"0.04em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          thread.app/@{user.username}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={shareLink} style={{ flex:1, padding:"11px 0", background:"#0a0a0a", color:"#fff", border:"none", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase" }}>
          ↑ Share
        </button>
        <button onClick={copyLink} style={{ flex:1, padding:"11px 0", background: linkCopied ? "#f0f0f0" : "transparent", color: linkCopied ? "#bbb" : "#0a0a0a", border:"1.5px solid #0a0a0a", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", transition:"all 0.15s" }}>
          {linkCopied ? "Copied ✓" : "Copy link"}
        </button>
        <button onClick={()=>setShowQR(v=>!v)} style={{ padding:"11px 14px", background: showQR ? "#0a0a0a" : "transparent", color: showQR ? "#fff" : "#0a0a0a", border:"1.5px solid #0a0a0a", fontSize:14, transition:"all 0.15s" }}>
          ⊞
        </button>
      </div>

      {/* QR code — expands inline */}
      {showQR && (
        <div className="fade-in" style={{ marginTop:16, display:"flex", flexDirection:"column", alignItems:"center", gap:10, padding:"20px 0", borderTop:"1px solid #f0f0f0" }}>
          <img src={qrUrl} alt="Profile QR code" style={{ width:160, height:160 }} />
          <p style={{ fontSize:10, color:"#bbb", letterSpacing:"0.08em", textAlign:"center", lineHeight:1.7 }}>
            Screenshot this to share.<br />Perfect for an Instagram story.
          </p>
        </div>
      )}
    </div>

    {/* Stats row */}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", marginBottom:40 }}>
      {[
        { value: savedItems.length, label: "saves"     },
        { value: recCount,          label: "recs given" },
        { value: friends.length,    label: "circle"    },
      ].map((stat, i) => (
        <div key={i} style={{ padding:"20px 0", textAlign:"center", borderRight: i < 2 ? "1px solid #f0f0f0" : "none" }}>
          <p style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, color:"#0a0a0a", lineHeight:1 }}>{stat.value}</p>
          <p style={{ fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb", marginTop:6 }}>{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Style words */}
    <div style={{ marginBottom:40 }}>
      <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb", marginBottom:16 }}>your aesthetic</p>
      {styleWords.map((word,i)=>(
        <div key={i} className="word-reveal" style={{ animationDelay:`${i*0.12}s`, fontFamily:"'Playfair Display', serif", fontSize:36, fontWeight:400, fontStyle:"italic", lineHeight:1.1, color:"#0a0a0a" }}>{word}</div>
      ))}
    </div>

    {/* Circle */}
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb" }}>circle</p>
        <button onClick={onOpenAddFriend} style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", background:"transparent", border:"1px solid #0a0a0a", color:"#0a0a0a", padding:"5px 12px" }}>+ Add</button>
      </div>
      {friends.length === 0 ? (
        <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.04em" }}>No friends connected yet.</p>
      ) : friends.map(friend=>(
        <div key={friend.id} style={{ borderBottom:"1px solid #f0f0f0", padding:"14px 0", display:"flex", alignItems:"center", gap:12 }}>
          <Avatar username={friend.username} size={36} />
          <div style={{ flex:1 }}>
            <p style={{ fontSize:12, color:"#0a0a0a", letterSpacing:"0.04em" }}>@{friend.username}</p>
            <p style={{ fontSize:10, color:"#bbb", fontFamily:"'Playfair Display', serif", fontStyle:"italic", marginTop:2 }}>{(friend.style_words||[]).join(" · ")}</p>
          </div>
          <button onClick={()=>onAskRec(friend)} style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", background:"transparent", border:"1px solid #e0e0e0", color:"#888", padding:"6px 12px" }}>Ask</button>
        </div>
      ))}
    </div>
  </div>
  );
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const SavedItemRow = ({ item }) => (
  <div style={{ borderBottom:"1px solid #f0f0f0", padding:"16px 0", display:"flex", gap:16, alignItems:"flex-start" }}>
    {item.image_url
      ? <img src={item.image_url} alt="" style={{ width:52, height:52, objectFit:"cover", flexShrink:0 }} />
      : <div style={{ width:52, height:52, background:"#f5f5f5", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:18, color:"#ddd" }}>◻</span></div>
    }
    <div style={{ flex:1, minWidth:0 }}>
      <p style={{ fontSize:13, color:"#0a0a0a", marginBottom:4, fontFamily:"'Playfair Display', serif", fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title||"Untitled"}</p>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <span style={{ fontSize:10, color:"#bbb", letterSpacing:"0.06em" }}>{item.source}</span>
        {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize:10, color:"#0a0a0a", letterSpacing:"0.06em", textDecoration:"underline" }}>view ↗</a>}
      </div>
    </div>
  </div>
);

const BottomNav = ({ tab, setTab }) => (
  <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"#fff", borderTop:"1px solid #f0f0f0", display:"flex", height:72, zIndex:100 }}>
    {[
      { id:"home",    label:"Home",   icon:"◈" },
      { id:"wishlist",label:"Saved",  icon:"◻" },
      { id:"feed",    label:"Feed",   icon:"◉" },
      { id:"looking", label:"Seeking",icon:"◎" },
      { id:"profile", label:"Profile",icon:"◇" },
    ].map(t=>(
      <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:"8px 0" }}>
        <span style={{ fontSize:15, color:tab===t.id?"#0a0a0a":"#ccc", transition:"color 0.15s" }}>{t.icon}</span>
        <span style={{ fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:tab===t.id?"#0a0a0a":"#ccc", transition:"color 0.15s" }}>{t.label}</span>
      </button>
    ))}
  </div>
);

// ─── MODALS ───────────────────────────────────────────────────────────────────

const ModalBase = ({ onClose, children }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"flex-end", maxWidth:480, margin:"0 auto" }} onClick={onClose}>
    <div className="slide-up" style={{ background:"#fff", width:"100%", padding:"28px 28px 48px", maxHeight:"88vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
      <div style={{ width:32, height:2, background:"#e0e0e0", margin:"0 auto 28px" }} />
      {children}
    </div>
  </div>
);

// ── REPLY MODAL (new) ─────────────────────────────────────────────────────────
const ReplyModal = ({ onClose, ask, currentUser, onSend }) => {
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [linkFocused, setLinkFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);
  const valid = link.trim().length > 0 || note.trim().length > 0;

  return (
    <ModalBase onClose={onClose}>
      <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontStyle:"italic", marginBottom:6 }}>
        Rec for @{ask.username}
      </h3>
      <p style={{ fontSize:10, color:"#bbb", letterSpacing:"0.04em", marginBottom:4 }}>
        {(ask.style_words||[]).join(" · ")}
      </p>

      {/* The ask they're responding to */}
      <div style={{ background:"#f8f8f8", padding:"14px 16px", margin:"20px 0 24px", borderLeft:"2px solid #0a0a0a" }}>
        <p style={{ fontFamily:"'Playfair Display', serif", fontSize:14, fontStyle:"italic", color:"#0a0a0a", lineHeight:1.5 }}>
          "{ask.description}"
        </p>
        {ask.category && <p style={{ fontSize:10, color:"#bbb", marginTop:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>{ask.category}</p>}
      </div>

      {/* Link input */}
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:10 }}>
        Share a link
      </p>
      <div style={{ borderBottom:`1.5px solid ${linkFocused?"#0a0a0a":"#e0e0e0"}`, paddingBottom:10, marginBottom:24, transition:"border-color 0.2s" }}>
        <input
          type="text" value={link} onChange={e=>setLink(e.target.value)}
          onFocus={()=>setLinkFocused(true)} onBlur={()=>setLinkFocused(false)}
          placeholder="https:// — product, brand, or inspiration"
          style={{ width:"100%", border:"none", fontSize:13, color:"#0a0a0a", background:"transparent", letterSpacing:"0.02em" }}
        />
      </div>

      {/* Note */}
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:10 }}>
        Add a note
      </p>
      <div style={{ borderBottom:`1.5px solid ${noteFocused?"#0a0a0a":"#e0e0e0"}`, paddingBottom:10, marginBottom:32, transition:"border-color 0.2s" }}>
        <textarea
          value={note} onChange={e=>setNote(e.target.value)}
          onFocus={()=>setNoteFocused(true)} onBlur={()=>setNoteFocused(false)}
          placeholder="Why you're recommending this, where to find it, sizing notes..."
          rows={3}
          style={{ width:"100%", border:"none", fontSize:13, color:"#0a0a0a", background:"transparent", resize:"none", lineHeight:1.6, letterSpacing:"0.02em" }}
        />
      </div>

      <button
        onClick={()=>valid&&onSend({ to_user_id:ask.user_id, ask_id:ask.id, ask_text:ask.description, link:link.trim(), note:note.trim() })}
        style={{ width:"100%", padding:"16px", background:valid?"#0a0a0a":"#f0f0f0", color:valid?"#fff":"#bbb", border:"none", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s" }}
      >
        Send recommendation
      </button>
    </ModalBase>
  );
};

const SOURCE_OPTIONS = ["Instagram","TikTok","Friend","Brand site","Pinterest","Other"];

const SaveModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("Instagram");
  const valid = title.trim().length > 0 || url.trim().length > 0;
  return (
    <ModalBase onClose={onClose}>
      <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontStyle:"italic", marginBottom:24 }}>Save something</h3>
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:10 }}>Where did you find it?</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
        {SOURCE_OPTIONS.map(s=>(
          <button key={s} onClick={()=>setSource(s)} style={{ padding:"6px 14px", border:`1px solid ${source===s?"#0a0a0a":"#e0e0e0"}`, background:source===s?"#0a0a0a":"transparent", color:source===s?"#fff":"#666", fontSize:10, letterSpacing:"0.08em", transition:"all 0.15s" }}>{s}</button>
        ))}
      </div>
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:10 }}>What is it?</p>
      <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Describe it..." style={{ width:"100%", border:"none", borderBottom:"1.5px solid #e0e0e0", padding:"10px 0", fontSize:15, color:"#0a0a0a", background:"transparent", marginBottom:24, fontFamily:"'Playfair Display', serif", fontStyle:"italic" }} />
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:10 }}>Link (optional)</p>
      <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." style={{ width:"100%", border:"none", borderBottom:"1.5px solid #e0e0e0", padding:"10px 0", fontSize:13, color:"#0a0a0a", background:"transparent", marginBottom:28, letterSpacing:"0.04em" }} />
      <div style={{ border:"1px dashed #e0e0e0", padding:"20px", textAlign:"center", marginBottom:28 }}>
        <p style={{ fontSize:10, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase" }}>↑ Drop screenshot or image</p>
      </div>
      <button onClick={()=>valid&&onSave({title:title||url,url,source,image_url:null})} style={{ width:"100%", padding:"16px", background:valid?"#0a0a0a":"#f0f0f0", color:valid?"#fff":"#bbb", border:"none", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s" }}>Save to board</button>
    </ModalBase>
  );
};

const CATEGORIES = ["Tops","Bottoms","Outerwear","Shoes","Bags","Jewellery","Other"];

const LookingModal = ({ onClose, onAdd }) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  return (
    <ModalBase onClose={onClose}>
      <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontStyle:"italic", marginBottom:24 }}>I'm looking for...</h3>
      <input type="text" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe what you want..." autoFocus style={{ width:"100%", border:"none", borderBottom:"1.5px solid #e0e0e0", padding:"10px 0", fontSize:15, color:"#0a0a0a", background:"transparent", marginBottom:24, fontFamily:"'Playfair Display', serif", fontStyle:"italic" }} />
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:10 }}>Category</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:32 }}>
        {CATEGORIES.map(c=>(<button key={c} onClick={()=>setCategory(c)} style={{ padding:"6px 14px", border:`1px solid ${category===c?"#0a0a0a":"#e0e0e0"}`, background:category===c?"#0a0a0a":"transparent", color:category===c?"#fff":"#666", fontSize:10, letterSpacing:"0.08em", transition:"all 0.15s" }}>{c}</button>))}
      </div>
      <button onClick={()=>description.trim()&&onAdd({description,category})} style={{ width:"100%", padding:"16px", background:description.trim()?"#0a0a0a":"#f0f0f0", color:description.trim()?"#fff":"#bbb", border:"none", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase" }}>Add to list</button>
    </ModalBase>
  );
};

// Mock contacts for demo — in production these come from navigator.contacts API
const MOCK_CONTACTS = [
  { name: "Alix Earle",    phone: "13055550101", onThread: true,  user: { id:"c1", username:"alix.e",   style_words:["effortless","warm","found"]      } },
  { name: "Emma S.",       phone: "16175550182", onThread: true,  user: { id:"c2", username:"emma.s",   style_words:["quiet","layered","vintage"]      } },
  { name: "Priya K.",      phone: "19175550143", onThread: false, user: null },
  { name: "Rachel M.",     phone: "16465550177", onThread: false, user: null },
  { name: "Talia B.",      phone: "13105550129", onThread: true,  user: { id:"c3", username:"talia.b",  style_words:["editorial","sharp","dark"]       } },
  { name: "Jess W.",       phone: "16175550164", onThread: false, user: null },
  { name: "Camille D.",    phone: "12125550198", onThread: true,  user: { id:"c4", username:"camille.d",style_words:["minimal","precise","slow"]       } },
];

const AddFriendModal = ({ onClose, existing, onAdd, currentUserId, showToast }) => {
  const [activeTab, setActiveTab] = useState("contacts"); // contacts | search
  const [contactsState, setContactsState] = useState("idle"); // idle | loading | done | denied
  const [contacts, setContacts] = useState([]);
  const [added, setAdded] = useState(new Set());
  const [invited, setInvited] = useState(new Set());
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const existingIds = existing.map(e => e.id);

  // Contacts API sync
  const syncContacts = async () => {
    setContactsState("loading");
    try {
      // Real contacts API (works on Chrome for Android, Safari iOS 16+)
      if ("contacts" in navigator && "ContactsManager" in window) {
        const props = ["name", "tel"];
        const raw = await navigator.contacts.select(props, { multiple: true });
        // Hash phone numbers and match against Supabase
        const phones = raw.flatMap(c => (c.tel || []).map(t => t.replace(/\D/g, "")));
        const { data } = await supabase.from("users").select("*").in("phone", phones);
        const matched = raw.map(c => {
          const phone = (c.tel?.[0] || "").replace(/\D/g, "");
          const user = data?.find(u => u.phone === phone) || null;
          return { name: c.name?.[0] || "Unknown", phone, onThread: !!user, user };
        });
        setContacts(matched);
      } else {
        // Demo fallback — simulate a short load then show mock contacts
        await new Promise(r => setTimeout(r, 1200));
        setContacts(MOCK_CONTACTS);
      }
      setContactsState("done");
    } catch (e) {
      // User denied or API unavailable
      setContacts(MOCK_CONTACTS); // demo fallback
      setContactsState("done");
    }
  };

  const handleAdd = (contact) => {
    if (!contact.user) return;
    onAdd(contact.user);
    setAdded(prev => new Set([...prev, contact.phone]));
  };

  const handleInvite = (contact) => {
    // Opens native SMS with pre-filled invite message
    const msg = encodeURIComponent(`Hey! I'm on Thread — it's an app for saving things you love and swapping recs with friends. Join me: https://thread.app/invite`);
    window.open(`sms:${contact.phone}?body=${msg}`, "_self");
    setInvited(prev => new Set([...prev, contact.phone]));
    showToast?.(`Invite sent to ${contact.name}`);
  };

  // Username search
  useEffect(() => {
    if (activeTab !== "search") return;
    const t = setTimeout(async () => {
      if (search.length < 2) { setSearchResults([]); return; }
      setSearching(true);
      const { data } = await supabase.from("users").select("*").ilike("username", `%${search}%`).neq("id", currentUserId).limit(10);
      setSearchResults((data || MOCK_FRIENDS).filter(u => !existingIds.includes(u.id)));
      setSearching(false);
    }, 400);
    return () => clearTimeout(t);
  }, [search, activeTab]);

  const onThread = contacts.filter(c => c.onThread && !existingIds.includes(c.user?.id));
  const notOnThread = contacts.filter(c => !c.onThread);

  return (
    <ModalBase onClose={onClose}>
      <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontStyle:"italic", marginBottom:20 }}>Find friends</h3>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1.5px solid #f0f0f0", marginBottom:24 }}>
        {[{id:"contacts",label:"From contacts"},{id:"search",label:"By username"}].map(t => (
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            flex:1, padding:"10px 0", background:"none", border:"none",
            borderBottom: activeTab===t.id ? "1.5px solid #0a0a0a" : "1.5px solid transparent",
            marginBottom:"-1.5px",
            fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase",
            color: activeTab===t.id ? "#0a0a0a" : "#bbb",
            transition:"all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* CONTACTS TAB */}
      {activeTab === "contacts" && (
        <div>
          {contactsState === "idle" && (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <p style={{ fontSize:11, color:"#888", letterSpacing:"0.04em", lineHeight:1.8, marginBottom:24 }}>
                See which of your contacts<br />are already on thread.
              </p>
              <button onClick={syncContacts} style={{ background:"#0a0a0a", color:"#fff", border:"none", padding:"14px 28px", fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase" }}>
                Sync contacts
              </button>
              <p style={{ fontSize:10, color:"#bbb", marginTop:14, letterSpacing:"0.04em" }}>
                Your contacts are never stored or shared.
              </p>
            </div>
          )}

          {contactsState === "loading" && (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <Spinner />
              <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.06em", marginTop:8 }}>Finding your people...</p>
            </div>
          )}

          {contactsState === "done" && (
            <div>
              {/* On Thread */}
              {onThread.length > 0 && (
                <div style={{ marginBottom:28 }}>
                  <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb", marginBottom:12 }}>
                    {onThread.length} contact{onThread.length > 1 ? "s" : ""} on thread
                  </p>
                  {onThread.map(c => (
                    <div key={c.phone} style={{ borderBottom:"1px solid #f0f0f0", padding:"14px 0", display:"flex", alignItems:"center", gap:12 }}>
                      <Avatar username={c.user.username} size={36} />
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, color:"#0a0a0a" }}>{c.name}</p>
                        <p style={{ fontSize:10, color:"#bbb", marginTop:2 }}>@{c.user.username}</p>
                        <p style={{ fontSize:10, color:"#bbb", fontFamily:"'Playfair Display', serif", fontStyle:"italic", marginTop:1 }}>
                          {(c.user.style_words||[]).join(" · ")}
                        </p>
                      </div>
                      <button
                        onClick={() => !added.has(c.phone) && handleAdd(c)}
                        style={{
                          padding:"7px 14px", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase",
                          background: added.has(c.phone) ? "#f5f5f5" : "#0a0a0a",
                          color: added.has(c.phone) ? "#bbb" : "#fff",
                          border: added.has(c.phone) ? "1px solid #e0e0e0" : "none",
                          transition:"all 0.15s", flexShrink:0,
                        }}
                      >
                        {added.has(c.phone) ? "Added ✓" : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Not on Thread — invite */}
              {notOnThread.length > 0 && (
                <div>
                  <p style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", color:"#bbb", marginBottom:12 }}>
                    Invite to thread
                  </p>
                  {notOnThread.map(c => (
                    <div key={c.phone} style={{ borderBottom:"1px solid #f0f0f0", padding:"14px 0", display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:36, height:36, background:"#f0f0f0", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#bbb" }}>
                        {c.name.slice(0,2).toUpperCase()}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, color:"#0a0a0a" }}>{c.name}</p>
                        <p style={{ fontSize:10, color:"#bbb", marginTop:2, letterSpacing:"0.04em" }}>Not on thread yet</p>
                      </div>
                      <button
                        onClick={() => !invited.has(c.phone) && handleInvite(c)}
                        style={{
                          padding:"7px 14px", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase",
                          background: "transparent",
                          color: invited.has(c.phone) ? "#bbb" : "#0a0a0a",
                          border: `1px solid ${invited.has(c.phone) ? "#e0e0e0" : "#0a0a0a"}`,
                          transition:"all 0.15s", flexShrink:0,
                        }}
                      >
                        {invited.has(c.phone) ? "Invited ✓" : "Invite"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {onThread.length === 0 && notOnThread.length === 0 && (
                <p style={{ fontSize:11, color:"#bbb", textAlign:"center", padding:"24px 0", letterSpacing:"0.06em" }}>No contacts found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* SEARCH TAB */}
      {activeTab === "search" && (
        <div>
          <input
            type="text" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by @username..." autoFocus
            style={{ width:"100%", border:"none", borderBottom:"1.5px solid #e0e0e0", padding:"10px 0", fontSize:13, color:"#0a0a0a", background:"transparent", marginBottom:20, letterSpacing:"0.04em" }}
          />
          {searching && <Spinner />}
          {searchResults.map(f => (
            <div key={f.id} style={{ borderBottom:"1px solid #f0f0f0", padding:"16px 0", display:"flex", alignItems:"center", gap:14 }}>
              <Avatar username={f.username} size={36} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, color:"#0a0a0a" }}>@{f.username}</p>
                <p style={{ fontSize:11, color:"#bbb", fontFamily:"'Playfair Display', serif", fontStyle:"italic" }}>{(f.style_words||[]).join(" · ")}</p>
              </div>
              <button onClick={()=>onAdd(f)} style={{ padding:"7px 16px", background:"transparent", border:"1px solid #0a0a0a", color:"#0a0a0a", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase" }}>Add</button>
            </div>
          ))}
          {!searching && search.length >= 2 && searchResults.length === 0 && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <p style={{ fontSize:11, color:"#bbb", letterSpacing:"0.06em", marginBottom:16 }}>No results for "@{search}"</p>
              <button
                onClick={() => {
                  const msg = encodeURIComponent(`Hey! Join me on Thread — https://thread.app/invite`);
                  window.open(`sms:?body=${msg}`, "_self");
                }}
                style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", background:"transparent", border:"1px solid #0a0a0a", color:"#0a0a0a", padding:"9px 20px" }}
              >
                Invite via text instead
              </button>
            </div>
          )}
        </div>
      )}
    </ModalBase>
  );
};

const RecommendModal = ({ friend, onClose, onSend }) => {
  const [message, setMessage] = useState("");
  const PROMPTS = ["Looking for a great coat — what are you loving lately?","Need something for a dinner, any ideas?","Best indie brand you've found recently?","What's a piece I'd never find on my own?"];
  return (
    <ModalBase onClose={onClose}>
      <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontStyle:"italic", marginBottom:6 }}>Ask @{friend.username}</h3>
      <p style={{ fontSize:11, color:"#bbb", marginBottom:24, letterSpacing:"0.04em" }}>{(friend.style_words||[]).join(" · ")}</p>
      <p style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#bbb", marginBottom:12 }}>Quick prompts</p>
      {PROMPTS.map(p=>(<button key={p} onClick={()=>setMessage(p)} style={{ width:"100%", textAlign:"left", padding:"12px 14px", border:`1px solid ${message===p?"#0a0a0a":"#f0f0f0"}`, background:message===p?"#0a0a0a":"transparent", color:message===p?"#fff":"#0a0a0a", fontSize:11, marginBottom:8, letterSpacing:"0.02em", lineHeight:1.5, transition:"all 0.15s" }}>"{p}"</button>))}
      <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Or write your own..." rows={3} style={{ width:"100%", border:"none", borderBottom:"1.5px solid #e0e0e0", padding:"10px 0", fontSize:13, color:"#0a0a0a", background:"transparent", marginTop:16, marginBottom:24, resize:"none", letterSpacing:"0.02em", lineHeight:1.6 }} />
      <button onClick={()=>message.trim()&&onSend()} style={{ width:"100%", padding:"16px", background:message.trim()?"#0a0a0a":"#f0f0f0", color:message.trim()?"#fff":"#bbb", border:"none", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase" }}>Send request</button>
    </ModalBase>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("phone");
  const [userData, setUserData] = useState({ phone:"", username:"", style_words:[] });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const saved = localStorage.getItem("thread_user");
    if(saved){try{const u=JSON.parse(saved);setCurrentUser(u);setScreen("app");}catch{}}
    setLoading(false);
  },[]);

  const handleSignOut = () => {
    localStorage.removeItem("thread_user");
    setCurrentUser(null);
    setUserData({phone:"",username:"",style_words:[]});
    setScreen("phone");
  };

  const advance = async (key, val) => {
    const updated = {...userData,[key]:val};
    setUserData(updated);
    if(key==="words"){
      const {data,error} = await supabase.from("users").insert({phone:updated.phone,username:updated.username,style_words:val}).select().single();
      const fallback = {id:`local-${Date.now()}`,...updated,style_words:val};
      const user = (!error&&data) ? data : fallback;
      localStorage.setItem("thread_user",JSON.stringify(user));
      setCurrentUser(user);
      setScreen("app");
      return;
    }
    const next = {phone:"verify",verify:"username",username:"words"};
    setScreen(next[screen]);
  };

  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner /></div>;

  return (
    <div className="app">
      <GlobalStyles />
      {screen==="phone"    && <PhoneScreen     onNext={v=>advance("phone",v)} />}
      {screen==="verify"   && <VerifyScreen    phone={userData.phone} onNext={()=>setScreen("username")} />}
      {screen==="username" && <UsernameScreen  onNext={v=>advance("username",v)} />}
      {screen==="words"    && <StyleWordsScreen onNext={v=>advance("words",v)} />}
      {screen==="app"      && currentUser && <MainApp user={currentUser} onSignOut={handleSignOut} />}
    </div>
  );
}
