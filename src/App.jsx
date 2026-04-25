import { useState, createContext, useContext } from "react";

const SERVICES = [
  { id: 1, name: "Эркектер чачын кыркуу",   price: 350,  duration: 45, icon: "✂️" },
  { id: 2, name: "Чач + сакал жасоо",        price: 550, duration: 60, icon: "🧔" },
  { id: 3, name: "Сакал жасоо",              price: 250,  duration: 30, icon: "🪒" },
  { id: 4, name: "Классикалык устара",        price: 450,  duration: 45, icon: "👑" },
  { id: 5, name: "Балдардын чачын кыркуу",   price: 250,  duration: 30, icon: "😊" },
  { id: 6, name: "Чач укалоо",               price: 180,  duration: 20, icon: "💨" },
];

const MASTERS = [
  { id: 1, name: "Азамат Токтосунов",  spec: "Жогорку категориялуу барбер",    avatar: "💈", exp: "8 жыл" },
  { id: 2, name: "Бакыт Жолдошев",    spec: "Классикалык чач чебери",         avatar: "✂️", exp: "5 жыл" },
  { id: 3, name: "Эрлан Мамытбеков",  spec: "Сакал боюнча адис",              avatar: "🪒", exp: "6 жыл" },
];

function genSlots() {
  const s = [];
  for (let h = 9; h < 20; h++) { s.push(`${String(h).padStart(2,"0")}:00`); s.push(`${String(h).padStart(2,"0")}:30`); }
  return s;
}
function minDate() { return new Date().toISOString().split("T")[0]; }
function maxDate() { const d = new Date(); d.setDate(d.getDate()+30); return d.toISOString().split("T")[0]; }
function fmtDate(iso) {
  return new Date(iso+"T00:00:00").toLocaleDateString("ky-KG",{day:"numeric",month:"long"});
}

class User {
  constructor(username, phone, password) {
    this.id = Math.random().toString(36).slice(2);
    this.username = username;
    this.phone = phone;
    this.password = password;
    this.role = "client";
    this.createdAt = new Date().toISOString();
  }
  checkPassword(p) { return this.password === p; }
}

class Appointment {
  constructor({ userId, userName, userPhone, service, master, date, time }) {
    this.id = Math.random().toString(36).slice(2);
    this.userId = userId; this.userName = userName; this.userPhone = userPhone;
    this.service = service; this.master = master; this.date = date; this.time = time;
    this.status = "pending";
    this.createdAt = new Date().toISOString();
  }
  get statusLabel() { return {pending:"Күтүүдө",confirmed:"Ырасталды",cancelled:"Жокко чыгарылды"}[this.status]; }
  get statusColor() { return {pending:"#f59e0b",confirmed:"#10b981",cancelled:"#ef4444"}[this.status]; }
  get statusBg()    { return {pending:"#fef3c7",confirmed:"#d1fae5",cancelled:"#fee2e2"}[this.status]; }
}

const ADMIN = new User("Администратор", "+996000000000", "admin123");
ADMIN.role = "admin";

const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

const GOLD = "#c8a96e";
const DARK = "#1a1a1a";

function Navbar() {
  const { page, setPage, currentUser, logout } = useApp();
  const nav = (p) => (
    <button onClick={() => setPage(p)}
      style={{ background:"none", border:"none", color: page===p ? GOLD : "#ccc",
        fontWeight: page===p ? 700 : 400, padding:"0 12px", cursor:"pointer", fontSize:14 }}>
      {p==="home"?"Башкы бет":p==="book"?"✂ Жазылуу":p==="my"?"📋 Жазылууларым":p==="admin"?"⚙ Башкаруу":p}
    </button>
  );
  return (
    <div style={{ background: DARK, padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 12px #0008" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => setPage("home")}>
        <span style={{ fontSize:22 }}>💈</span>
        <span style={{ fontFamily:"Georgia,serif", fontSize:20, color:"#fff", fontWeight:700 }}>BarberShop KG</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        {nav("home")}
        {currentUser && nav("book")}
        {currentUser && currentUser.role !== "admin" && nav("my")}
        {currentUser?.role === "admin" && nav("admin")}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {currentUser ? (
          <>
            <span style={{ color:"#aaa", fontSize:13 }}>👤 {currentUser.username}</span>
            <button onClick={logout} style={{ background:"transparent", border:"1px solid #555", color:"#ccc", borderRadius:8, padding:"4px 14px", cursor:"pointer", fontSize:13 }}>Чыгуу</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("login")}
              style={{ background:"transparent", border:"1px solid #555", color:"#ccc", borderRadius:8, padding:"4px 14px", cursor:"pointer", fontSize:13 }}>Кирүү</button>
            <button onClick={() => setPage("register")}
              style={{ background: GOLD, border:"none", color: DARK, borderRadius:8, padding:"4px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Катталуу</button>
          </>
        )}
      </div>
    </div>
  );
}

function HomePage() {
  const { setPage, currentUser } = useApp();
  return (
    <div>
      <div style={{ background:`linear-gradient(135deg, ${DARK} 0%, #2a2a2a 100%)`, minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", textAlign:"center", padding:"60px 24px" }}>
        <div style={{ fontSize:80, marginBottom:8 }}>💈</div>
        <p style={{ color: GOLD, letterSpacing:4, fontSize:12, textTransform:"uppercase", marginBottom:8 }}>Премиум барбершоп</p>
        <h1 style={{ fontFamily:"Georgia,serif", color:"#fff", fontSize:"clamp(32px,6vw,64px)", lineHeight:1.15, marginBottom:16 }}>
          Сенин стилиң —<br/><span style={{ color: GOLD }}>биздин чеберчилик</span>
        </h1>
        <p style={{ color:"#aaa", fontSize:17, marginBottom:32, maxWidth:480 }}>
          Тажрыйбалуу чеберлер, сапаттуу аспаптар жана чыныгы эркектер клубунун атмосферасы.
        </p>
        <button onClick={() => setPage(currentUser ? "book" : "register")}
          style={{ background: GOLD, color: DARK, border:"none", borderRadius:50, padding:"14px 40px", fontWeight:700, fontSize:17, cursor:"pointer", boxShadow:`0 8px 24px ${GOLD}44` }}>
          {currentUser ? "✂️ Жазылуу" : "Онлайн жазылуу"}
        </button>
      </div>
      <div style={{ background:"#f8f5f0", padding:"60px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <p style={{ color: GOLD, textAlign:"center", letterSpacing:3, fontSize:12, textTransform:"uppercase" }}>Эмне сунуштайбыз</p>
          <h2 style={{ fontFamily:"Georgia,serif", textAlign:"center", fontSize:36, marginBottom:36 }}>Биздин кызматтар</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 }}>
            {SERVICES.map(s => (
              <div key={s.id} style={{ background:"#fff", borderRadius:16, padding:24, borderLeft:`4px solid ${GOLD}`, boxShadow:"0 2px 12px #0001" }}>
                <div style={{ fontSize:36 }}>{s.icon}</div>
                <div style={{ fontFamily:"Georgia,serif", fontWeight:700, marginTop:12, fontSize:16 }}>{s.name}</div>
                <div style={{ color:"#888", fontSize:13, marginTop:4 }}>⏱ {s.duration} мин</div>
                <div style={{ color: GOLD, fontWeight:700, fontSize:22, marginTop:8 }}>{s.price} с.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: DARK, padding:"60px 24px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <p style={{ color: GOLD, textAlign:"center", letterSpacing:3, fontSize:12, textTransform:"uppercase" }}>Профессионалдар</p>
          <h2 style={{ fontFamily:"Georgia,serif", color:"#fff", textAlign:"center", fontSize:36, marginBottom:36 }}>Биздин чеберлер</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:20 }}>
            {MASTERS.map(m => (
              <div key={m.id} style={{ border:"1px solid #333", borderRadius:16, padding:28, textAlign:"center" }}>
                <div style={{ fontSize:56 }}>{m.avatar}</div>
                <div style={{ fontFamily:"Georgia,serif", color:"#fff", fontWeight:700, marginTop:12 }}>{m.name}</div>
                <div style={{ color: GOLD, fontSize:12, marginTop:4 }}>{m.spec}</div>
                <div style={{ color:"#666", fontSize:12, marginTop:6 }}>🏅 Тажрыйба: {m.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { setPage, users, setCurrentUser } = useApp();
  const [form, setForm] = useState({ phone:"", password:"" });
  const [err, setErr] = useState("");
  function submit(e) {
    e.preventDefault(); setErr("");
    const user = users.find(u => u.phone === form.phone);
    if (!user) return setErr("Бул телефон номери табылган жок");
    if (!user.checkPassword(form.password)) return setErr("Сырсөз туура эмес");
    setCurrentUser(user);
    setPage(user.role === "admin" ? "admin" : "book");
  }
  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8f5f0" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"40px 36px", width:380, boxShadow:"0 8px 40px #0002" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44 }}>💈</div>
          <h3 style={{ fontFamily:"Georgia,serif", margin:"8px 0 4px" }}>Аккаунтка кирүү</h3>
          <p style={{ color:"#999", fontSize:13 }}>BarberShop KG — онлайн жазылуу</p>
        </div>
        {err && <div style={{ background:"#fee2e2", color:"#dc2626", borderRadius:10, padding:"10px 14px", fontSize:13, marginBottom:16 }}>⚠️ {err}</div>}
        <form onSubmit={submit}>
          <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6 }}>Телефон</label>
          <input style={inp} placeholder="+996 700 123 456" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required />
          <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6, marginTop:16 }}>Сырсөз</label>
          <input type="password" style={inp} placeholder="••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <button type="submit" style={goldBtn}>→ Кирүү</button>
        </form>
        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#888" }}>
          Аккаунт жокпу? <button onClick={()=>setPage("register")} style={linkBtn}>Катталуу</button>
        </div>
        <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:"#bbb", background:"#f9f9f9", borderRadius:8, padding:"8px 12px" }}>
          Демо-админ: <code>+996000000000</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const { setPage, users, setUsers, setCurrentUser } = useApp();
  const [form, setForm] = useState({ username:"", phone:"", password:"", confirm:"" });
  const [err, setErr] = useState("");
  function submit(e) {
    e.preventDefault(); setErr("");
    if (form.username.trim().length < 2) return setErr("Аты — кеминде 2 белги");
    if (form.phone.trim().length < 10)   return setErr("Туура телефон номерин киргизиңиз");
    if (form.password.length < 4)        return setErr("Сырсөз — кеминде 4 белги");
    if (form.password !== form.confirm)  return setErr("Сырсөздөр дал келбейт");
    if (users.find(u => u.phone === form.phone.trim())) return setErr("Бул телефон мурунтан катталган");
    const user = new User(form.username.trim(), form.phone.trim(), form.password);
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setPage("book");
  }
  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8f5f0" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"40px 36px", width:400, boxShadow:"0 8px 40px #0002" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44 }}>✂️</div>
          <h3 style={{ fontFamily:"Georgia,serif", margin:"8px 0 4px" }}>Аккаунт түзүү</h3>
          <p style={{ color:"#999", fontSize:13 }}>Жазылуу үчүн катталыңыз</p>
        </div>
        {err && <div style={{ background:"#fee2e2", color:"#dc2626", borderRadius:10, padding:"10px 14px", fontSize:13, marginBottom:16 }}>⚠️ {err}</div>}
        <form onSubmit={submit}>
          {[["Атыңыз","text","Айбек Жакшылыков","username"],["Телефон","text","+996 700 123 456","phone"],
            ["Сырсөз","password","••••••","password"],["Сырсөздү кайталаңыз","password","••••••","confirm"]
          ].map(([label, type, ph, key]) => (
            <div key={key} style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontWeight:600, fontSize:13, marginBottom:6 }}>{label}</label>
              <input type={type} style={inp} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} required />
            </div>
          ))}
          <button type="submit" style={goldBtn}>✓ Катталуу</button>
        </form>
        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#888" }}>
          Аккаунт барбы? <button onClick={()=>setPage("login")} style={linkBtn}>Кирүү</button>
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Кызмат","Чебер","Күн жана убакыт","Ырастоо"];

function BookPage() {
  const { currentUser, appointments, setAppointments, setPage } = useApp();
  const [step, setStep]       = useState(0);
  const [service, setService] = useState(null);
  const [master, setMaster]   = useState(null);
  const [date, setDate]       = useState("");
  const [time, setTime]       = useState("");
  const [err, setErr]         = useState("");
  const [done, setDone]       = useState(false);

  const occupied = date && master
    ? appointments.filter(a => a.master.name===master.name && a.date===date && a.status!=="cancelled").map(a=>a.time)
    : [];

  function book() {
    setErr("");
    const conflict = appointments.find(a => a.master.name===master.name && a.date===date && a.time===time && a.status!=="cancelled");
    if (conflict) return setErr("Бул убакыт буга чейин ээленген!");
    const appt = new Appointment({ userId:currentUser.id, userName:currentUser.username, userPhone:currentUser.phone, service, master, date, time });
    setAppointments(prev => [...prev, appt]);
    setDone(true);
  }

  if (done) return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8f5f0" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"48px 40px", textAlign:"center", maxWidth:400, boxShadow:"0 8px 40px #0002" }}>
        <div style={{ fontSize:64 }}>🎉</div>
        <h3 style={{ fontFamily:"Georgia,serif", margin:"16px 0 8px" }}>Жазылуу ийгиликтүү!</h3>
        <p style={{ color:"#666", marginBottom:4 }}><b>{service.name}</b></p>
        <p style={{ color:"#666", marginBottom:4 }}>Чебер: <b>{master.name}</b></p>
        <p style={{ color:"#666", marginBottom:28 }}>{fmtDate(date)}, саат <b>{time}</b></p>
        <button style={goldBtn} onClick={()=>setPage("my")}>Жазылууларым</button>
        <button style={{...outlineBtn,marginTop:10}} onClick={()=>{setStep(0);setService(null);setMaster(null);setDate("");setTime("");setDone(false);}}>Дагы жазылуу</button>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#f8f5f0", minHeight:"80vh", padding:"40px 24px" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"Georgia,serif", textAlign:"center", marginBottom:8 }}>Онлайн жазылуу</h2>
        <p style={{ color:"#888", textAlign:"center", marginBottom:36 }}>Кызматты, чеберди жана ыңгайлуу убакытты тандаңыз</p>
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", marginBottom:40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ textAlign:"center", minWidth:80 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, marginBottom:4, background: i < step ? GOLD : i===step ? DARK : "#ddd", color: i<=step ? "#fff" : "#999" }}>{i < step ? "✓" : i+1}</div>
                <div style={{ fontSize:11, color: i===step ? DARK : "#aaa", display:"block" }}>{s}</div>
              </div>
              {i < STEPS.length-1 && <div style={{ width:28, height:2, background: i<step ? GOLD : "#ddd", margin:"0 4px 18px" }}/>}
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:20, padding:32, boxShadow:"0 4px 24px #0001" }}>
          {step===0 && <>
            <h5 style={{ fontFamily:"Georgia,serif", marginBottom:20 }}>Кызматты тандаңыз</h5>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {SERVICES.map(s => (
                <div key={s.id} onClick={()=>setService(s)} style={{ border:`2px solid ${service?.id===s.id ? GOLD : "#e5e5e5"}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", background: service?.id===s.id ? "#fff8ee" : "#fff" }}>
                  <div style={{ fontSize:28 }}>{s.icon}</div>
                  <div style={{ fontWeight:700, marginTop:8, fontSize:14 }}>{s.name}</div>
                  <div style={{ color:"#888", fontSize:12, marginTop:2 }}>⏱ {s.duration} мин</div>
                  <div style={{ color: GOLD, fontWeight:700, fontSize:18, marginTop:6 }}>{s.price} с.</div>
                </div>
              ))}
            </div>
            <button style={{ ...goldBtn, marginTop:24 }} disabled={!service} onClick={()=>setStep(1)}>Кийинки →</button>
          </>}
          {step===1 && <>
            <h5 style={{ fontFamily:"Georgia,serif", marginBottom:20 }}>Чеберди тандаңыз</h5>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              {MASTERS.map(m => (
                <div key={m.id} onClick={()=>setMaster(m)} style={{ border:`2px solid ${master?.id===m.id ? GOLD : "#e5e5e5"}`, borderRadius:14, padding:20, cursor:"pointer", textAlign:"center", background: master?.id===m.id ? "#fff8ee" : "#fff" }}>
                  <div style={{ fontSize:44 }}>{m.avatar}</div>
                  <div style={{ fontWeight:700, fontSize:13, marginTop:8 }}>{m.name}</div>
                  <div style={{ color:"#888", fontSize:11, marginTop:4 }}>{m.spec}</div>
                  <div style={{ fontSize:11, marginTop:6 }}>🏅 {m.exp}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button style={outlineBtn} onClick={()=>setStep(0)}>← Артка</button>
              <button style={goldBtn} disabled={!master} onClick={()=>setStep(2)}>Кийинки →</button>
            </div>
          </>}
          {step===2 && <>
            <h5 style={{ fontFamily:"Georgia,serif", marginBottom:20 }}>Күн жана убакыт</h5>
            <label style={{ fontWeight:600, fontSize:13, display:"block", marginBottom:8 }}>Күн</label>
            <input type="date" style={{ ...inp, maxWidth:220, marginBottom:24 }} min={minDate()} max={maxDate()} value={date} onChange={e=>{setDate(e.target.value);setTime("");}} />
            {date && <>
              <label style={{ fontWeight:600, fontSize:13, display:"block", marginBottom:10 }}>Убакыт</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {genSlots().map(slot => {
                  const busy = occupied.includes(slot);
                  return (
                    <button key={slot} disabled={busy} onClick={()=>setTime(slot)} style={{ border:`1px solid ${busy?"#e5e5e5":time===slot?GOLD:"#ddd"}`, borderRadius:8, padding:"7px 14px", fontSize:13, cursor:busy?"not-allowed":"pointer", background: busy?"#f5f5f5":time===slot?GOLD:"#fff", color: busy?"#bbb":time===slot?"#1a1a1a":"#333", textDecoration: busy?"line-through":"none", fontWeight: time===slot?700:400 }}>{slot}</button>
                  );
                })}
              </div>
            </>}
            <div style={{ display:"flex", gap:10, marginTop:28 }}>
              <button style={outlineBtn} onClick={()=>setStep(1)}>← Артка</button>
              <button style={goldBtn} disabled={!date||!time} onClick={()=>setStep(3)}>Кийинки →</button>
            </div>
          </>}
          {step===3 && <>
            <h5 style={{ fontFamily:"Georgia,serif", marginBottom:20 }}>Ырастоо</h5>
            {err && <div style={{ background:"#fee2e2", color:"#dc2626", borderRadius:10, padding:"10px 14px", fontSize:13, marginBottom:16 }}>⚠️ {err}</div>}
            <div style={{ background:"#f8f5f0", borderRadius:14, padding:24, marginBottom:24 }}>
              {[["Кызмат",service.name],["Баасы",service.price+" с."],["Чебер",master.avatar+" "+master.name],["Узактыгы",service.duration+" мин"],["Күн",fmtDate(date)],["Убакыт",time],["Кардар",currentUser.username+" · "+currentUser.phone]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px solid #eee", padding:"8px 0", fontSize:14 }}>
                  <span style={{ color:"#888" }}>{k}</span>
                  <span style={{ fontWeight:600, color: k==="Баасы"?GOLD:"inherit" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={outlineBtn} onClick={()=>setStep(2)}>← Артка</button>
              <button style={{ ...goldBtn, flex:1 }} onClick={book}>✓ Жазылуу</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

function MyPage() {
  const { currentUser, appointments, setAppointments, setPage } = useApp();
  const mine = appointments.filter(a => a.userId===currentUser.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  function cancel(id) { setAppointments(prev => prev.map(a => a.id===id ? {...a, status:"cancelled"} : a)); }
  if (mine.length===0) return (
    <div style={{ minHeight:"70vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#f8f5f0" }}>
      <div style={{ fontSize:72 }}>📅</div>
      <h5 style={{ fontFamily:"Georgia,serif", marginTop:16 }}>Жазылуулар азырынча жок</h5>
      <p style={{ color:"#888", marginBottom:20 }}>Азыр эле жазылыңыз</p>
      <button style={goldBtn} onClick={()=>setPage("book")}>Жазылуу</button>
    </div>
  );
  return (
    <div style={{ background:"#f8f5f0", minHeight:"80vh", padding:"40px 24px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div>
            <h2 style={{ fontFamily:"Georgia,serif", margin:0 }}>Жазылууларым</h2>
            <p style={{ color:"#888", margin:0, fontSize:14 }}>Сиздин бардык жазылуулар</p>
          </div>
          <button style={goldBtn} onClick={()=>setPage("book")}>+ Жазылуу</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {mine.map(apptRaw => {
            const a = Object.assign(new Appointment(apptRaw), apptRaw);
            return (
              <div key={a.id} style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px #0001" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <span style={{ background:a.statusBg, color:a.statusColor, borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700 }}>{a.statusLabel}</span>
                  <span style={{ color:"#ccc", fontSize:12 }}>{new Date(a.createdAt).toLocaleDateString("ky-KG")}</span>
                </div>
                <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:16, marginBottom:4 }}>{a.service.name}</div>
                <div style={{ color:"#888", fontSize:13, marginBottom:14 }}>{a.master.avatar} {a.master.name}</div>
                <div style={{ display:"flex", gap:20, marginBottom:14 }}>
                  <div><div style={{ color:"#aaa", fontSize:10, textTransform:"uppercase" }}>Күн</div><div style={{ fontWeight:600, fontSize:13 }}>{fmtDate(a.date)}</div></div>
                  <div><div style={{ color:"#aaa", fontSize:10, textTransform:"uppercase" }}>Убакыт</div><div style={{ fontWeight:600, fontSize:13 }}>{a.time}</div></div>
                  <div><div style={{ color:"#aaa", fontSize:10, textTransform:"uppercase" }}>Баасы</div><div style={{ fontWeight:700, fontSize:13, color:GOLD }}>{a.service.price} с.</div></div>
                </div>
                {a.status==="pending" && (
                  <button onClick={()=>cancel(a.id)} style={{ ...outlineBtn, borderColor:"#fca5a5", color:"#ef4444", width:"100%", fontSize:13 }}>✕ Жокко чыгаруу</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const { appointments, setAppointments, users } = useApp();
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? appointments : appointments.filter(a=>a.status===filter);
  function confirm(id) { setAppointments(prev=>prev.map(a=>a.id===id?{...a,status:"confirmed"}:a)); }
  function cancel(id)  { setAppointments(prev=>prev.map(a=>a.id===id?{...a,status:"cancelled"}:a)); }
  const total    = appointments.length;
  const pending  = appointments.filter(a=>a.status==="pending").length;
  const confirmed= appointments.filter(a=>a.status==="confirmed").length;
  const revenue  = appointments.filter(a=>a.status!=="cancelled").reduce((s,a)=>s+a.service.price,0);
  return (
    <div style={{ background:"#f8f5f0", minHeight:"80vh", padding:"40px 24px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"Georgia,serif", marginBottom:4 }}>Башкаруу панели</h2>
        <p style={{ color:"#888", marginBottom:32 }}>Жазылууларды жана кардарларды башкаруу</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
          {[["📅","Бардык жазылуулар",total,"#3b82f6"],["⏳","Күтүүдө",pending,"#f59e0b"],["✅","Ырасталды",confirmed,"#10b981"],["👥","Кардарлар",users.length,"#8b5cf6"]].map(([ic,label,val,color])=>(
            <div key={label} style={{ background:"#fff", borderRadius:14, padding:20, textAlign:"center", boxShadow:"0 2px 12px #0001" }}>
              <div style={{ fontSize:28 }}>{ic}</div>
              <div style={{ fontSize:28, fontWeight:700, color }}>{val}</div>
              <div style={{ color:"#888", fontSize:12 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff8ee", borderRadius:14, padding:"16px 24px", marginBottom:28, display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:32 }}>💰</span>
          <div>
            <div style={{ fontWeight:700, fontSize:22, color:GOLD }}>{revenue.toLocaleString("ky-KG")} с.</div>
            <div style={{ color:"#888", fontSize:13 }}>Күтүлгөн киреше (жокко чыгарылгандарсыз)</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[["all","Баары"],["pending","Күтүүдө"],["confirmed","Ырасталган"],["cancelled","Жокко чыгарылган"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{ border:"none", borderRadius:8, padding:"6px 16px", fontSize:13, cursor:"pointer", background: filter===v ? DARK : "#fff", color: filter===v ? "#fff" : "#555", fontWeight: filter===v ? 700 : 400, boxShadow:"0 1px 4px #0001" }}>{l}</button>
          ))}
        </div>
        {filtered.length===0
          ? <div style={{ textAlign:"center", color:"#aaa", padding:60 }}>Жазылуулар жок</div>
          : <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 16px #0001" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f8f5f0" }}>
                    {["Кардар","Кызмат","Чебер","Күн / Убакыт","Баасы","Статус","Аракет"].map(h=>(
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, color:"#888", fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apptRaw,i)=>{
                    const a = Object.assign(new Appointment(apptRaw), apptRaw);
                    return (
                      <tr key={a.id} style={{ borderTop:"1px solid #f0f0f0", background: i%2===0?"#fff":"#fafafa" }}>
                        <td style={{ padding:"14px 16px" }}><div style={{ fontWeight:600, fontSize:14 }}>{a.userName}</div><div style={{ color:"#aaa", fontSize:12 }}>{a.userPhone}</div></td>
                        <td style={{ padding:"14px 16px", fontSize:13 }}><div style={{ fontWeight:600 }}>{a.service.name}</div><div style={{ color:"#aaa", fontSize:11 }}>{a.service.duration} мин</div></td>
                        <td style={{ padding:"14px 16px", fontSize:13 }}>{a.master.avatar} {a.master.name}</td>
                        <td style={{ padding:"14px 16px" }}><div style={{ fontWeight:600, fontSize:13 }}>{fmtDate(a.date)}</div><div style={{ color:"#aaa", fontSize:12 }}>{a.time}</div></td>
                        <td style={{ padding:"14px 16px", fontWeight:700, color:GOLD }}>{a.service.price} с.</td>
                        <td style={{ padding:"14px 16px" }}><span style={{ background:a.statusBg, color:a.statusColor, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{a.statusLabel}</span></td>
                        <td style={{ padding:"14px 16px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            {a.status==="pending" && <button onClick={()=>confirm(a.id)} style={{ background:"#d1fae5", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✓</button>}
                            {a.status!=="cancelled" && <button onClick={()=>cancel(a.id)} style={{ background:"#fee2e2", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

const inp = { width:"100%", border:"1px solid #e5e5e5", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const goldBtn = { background:GOLD, border:"none", color:DARK, borderRadius:10, padding:"11px 28px", fontWeight:700, fontSize:14, cursor:"pointer", width:"100%", display:"block" };
const outlineBtn = { background:"transparent", border:"1px solid #ddd", color:"#555", borderRadius:10, padding:"10px 24px", fontWeight:600, fontSize:14, cursor:"pointer", display:"block" };
const linkBtn = { background:"none", border:"none", color:GOLD, cursor:"pointer", fontWeight:600, fontSize:13, padding:0 };

export default function App() {
  const [page, setPage]               = useState("home");
  const [users, setUsers]             = useState([ADMIN]);
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  function logout() { setCurrentUser(null); setPage("home"); }
  const ctx = { page, setPage, users, setUsers, currentUser, setCurrentUser, logout, appointments, setAppointments };
  const PAGES = { home:<HomePage/>, login:<LoginPage/>, register:<RegisterPage/>, book:<BookPage/>, my:<MyPage/>, admin:<AdminPage/> };
  return (
    <AppCtx.Provider value={ctx}>
      <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif", minHeight:"100vh" }}>
        <Navbar/>
        {PAGES[page] || <HomePage/>}
      </div>
    </AppCtx.Provider>
  );
}