import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { T, DAYS_S, globalCSS } from "./utils/constants";
import { IS_ELECTRON, lsLoad, lsSave, uid, todayStr, addMonths } from "./utils/helpers";

// Components
import Toast from "./components/ui/Toast";
import Btn from "./components/ui/Btn";
import Sidebar from "./components/Sidebar";
import AttSheet from "./components/AttSheet";

// Modals
import LoginScreen from "./components/modals/LoginScreen";
import ClientModal from "./components/modals/ClientModal";
import TrainerModal from "./components/modals/TrainerModal";
import ClientDetail from "./components/modals/ClientDetail";

// Pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Attendance from "./pages/Attendance";
import Trainers from "./pages/Trainers";
import Analytics from "./pages/Analytics";
import Sync from "./pages/Sync";

export default function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ clients: [], attendance: [], trainers: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Dashboard");
  const [modal, setModal] = useState(null);
  const [selClient, setSelClient] = useState(null);
  const [selTrainer, setSelTrainer] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [attSearch, setAttSearch] = useState("");
  const [attDate, setAttDate] = useState(todayStr());
  const [attShiftFilter, setAttShiftFilter] = useState("all");
  const [attStatusFilter, setAttStatusFilter] = useState("all");
  const [attTrainerFilter, setAttTrainerFilter] = useState("all");
  const [attSort, setAttSort] = useState("name");
  const [showAttCal, setShowAttCal] = useState(false);
  const [gsUrl, setGsUrl] = useState(() => localStorage.getItem("gs_url") || "");
  const [gsSyncing, setGsSyncing] = useState(false);
  const [gsMsg, setGsMsg] = useState("");
  const [dataPath, setDataPath] = useState("");
  const fileRef = useRef();
  const saveTimer = useRef(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const isAdmin = user?.role === "admin";

  // ── Load on mount ───────────────────────────────────────────
  useEffect(() => {
    const doLoad = async () => {
      if (IS_ELECTRON) {
        const d = await window.gymAPI.load();
        d.attendance = d.attendance.map(a => ({ ...a, present: a.present === "true" || a.present === true }));
        setData(d);
        const p = await window.gymAPI.dataPath();
        setDataPath(p);
      } else {
        setData(lsLoad());
      }
      setLoading(false);
    };
    doLoad();
  }, []);

  // ── Debounced save ──────────────────────────────────────────
  const persistData = useCallback((d) => {
    if (IS_ELECTRON) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => window.gymAPI.save(d), 800);
    } else { lsSave(d); }
  }, []);

  const updateData = useCallback(updater => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistData(next);
      return next;
    });
  }, [persistData]);

  // ── Client CRUD ─────────────────────────────────────────────
  const addClient = f => {
    const joined = todayStr();
    const c = { ...f, id: uid(), joinDate: joined, feeDate: f.feeDate || addMonths(joined, 1), status: f.status || "active", totalPaid: Number(f.totalPaid) || 0, monthlyFee: Number(f.monthlyFee) || 0 };
    updateData(d => ({ ...d, clients: [...d.clients, c] }));
    showToast("Client added!"); setModal(null);
  };
  const updateClient = f => {
    updateData(d => ({ ...d, clients: d.clients.map(c => c.id === f.id ? { ...f, totalPaid: Number(f.totalPaid) || 0, monthlyFee: Number(f.monthlyFee) || 0 } : c) }));
    showToast("Client updated!"); setModal(null); setSelClient(f);
  };
  const deleteClient = id => {
    if (!confirm("Delete this client?")) return;
    updateData(d => ({ ...d, clients: d.clients.filter(c => c.id !== id), attendance: d.attendance.filter(a => a.clientId !== id) }));
    showToast("Deleted.", "error"); setModal(null); setSelClient(null);
  };
  const bulkDelete = () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} selected client(s)?`)) return;
    updateData(d => ({ ...d, clients: d.clients.filter(c => !selectedIds.includes(c.id)), attendance: d.attendance.filter(a => !selectedIds.includes(a.clientId)) }));
    showToast(`${selectedIds.length} clients deleted.`, "error"); setSelectedIds([]);
  };
  const toggleStatus = c => {
    const next = c.status === "active" ? "paused" : "active";
    updateData(d => ({ ...d, clients: d.clients.map(x => x.id === c.id ? { ...x, status: next } : x) }));
    showToast(`${c.name} → ${next}`, "warn");
  };

  // ── Trainer CRUD ────────────────────────────────────────────
  const addTrainer = f => { updateData(d => ({ ...d, trainers: [...(d.trainers || []), { ...f, id: uid(), joinDate: todayStr(), status: f.status || "active" }] })); showToast("Trainer added!"); setModal(null); };
  const updateTrainer = f => { updateData(d => ({ ...d, trainers: (d.trainers || []).map(t => t.id === f.id ? f : t) })); showToast("Trainer updated!"); setModal(null); setSelTrainer(null); };
  const deleteTrainer = id => { if (!confirm("Delete trainer?")) return; updateData(d => ({ ...d, trainers: (d.trainers || []).filter(t => t.id !== id), clients: d.clients.map(c => c.trainerId === id ? { ...c, trainerId: "" } : c) })); showToast("Trainer removed.", "error"); };

  // ── Attendance ──────────────────────────────────────────────
  const markAtt = (clientId, present) => {
    const ex = data.attendance.find(a => a.clientId === clientId && a.date === attDate);
    if (ex) updateData(d => ({ ...d, attendance: d.attendance.map(a => a.clientId === clientId && a.date === attDate ? { ...a, present } : a) }));
    else updateData(d => ({ ...d, attendance: [...d.attendance, { clientId, date: attDate, present, hour: new Date().getHours() }] }));
  };

  // ── CSV import/export ───────────────────────────────────────
  const handleCSV = async () => {
    let raw = null;
    if (IS_ELECTRON) { raw = await window.gymAPI.importCSV(); }
    else { fileRef.current.click(); return; }
    if (!raw) return;
    processCSV(raw);
  };
  const processCSV = raw => {
    const lines = raw.split("\n").map(l => l.split(",").map(s => s.trim().replace(/^"|"$/g, "")));
    if (lines.length < 2) { showToast("Empty CSV", "error"); return; }
    const h = lines[0].map(x => x.toLowerCase());
    const gi = k => h.findIndex(x => k.some(kk => x.includes(kk)));
    const ni = gi(["name"]), fi = gi(["father"]), pi = gi(["phone", "mobile"]), fei = gi(["fee", "monthly"]), si = gi(["shift", "time"]);
    let added = 0; const nc = [];
    lines.slice(1).forEach(row => { const name = ni >= 0 ? row[ni] : row[0]; if (!name) return; const j = todayStr(); nc.push({ id: uid(), name, father: fi >= 0 ? row[fi] : "", phone: pi >= 0 ? row[pi] : "", monthlyFee: Number(fei >= 0 ? row[fei] : 0) || 0, shift: si >= 0 ? row[si] : "", joinDate: j, feeDate: addMonths(j, 1), status: "active", totalPaid: 0 }); added++; });
    updateData(d => ({ ...d, clients: [...d.clients, ...nc] }));
    showToast(`${added} clients imported!`);
  };
  const exportCSV = type => {
    let rows, name;
    if (type === "clients") { rows = [["Name", "Father", "Phone", "CNIC", "Address", "Shift", "Monthly Fee", "Paid", "Remaining", "Join", "Fee Due", "Status", "Trainer"]]; data.clients.forEach(c => { const tr = (data.trainers || []).find(x => x.id === c.trainerId); rows.push([c.name, c.father, c.phone, c.cnic, c.address, c.shift, c.monthlyFee, c.totalPaid, Math.max(0, (c.monthlyFee || 0) - (c.totalPaid || 0)), c.joinDate, c.feeDate, c.status, tr?.name || ""]); }); name = "clients_export.csv"; }
    else { rows = [["Client", "Date", "Present"]]; data.attendance.forEach(a => { const c = data.clients.find(x => x.id === a.clientId); rows.push([c?.name || a.clientId, a.date, (a.present === "true" || a.present === true) ? "Yes" : "No"]); }); name = "attendance_export.csv"; }
    const csv = rows.map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = name; a.click();
  };

  // ── Google Sheets sync ──────────────────────────────────────
  const syncGS = async () => {
    if (!gsUrl) { setGsMsg("Enter URL first."); return; }
    setGsSyncing(true); setGsMsg("");
    try { await fetch(gsUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clients: data.clients, attendance: data.attendance, trainers: data.trainers, summary: { totalClients: data.clients.length, exportedAt: new Date().toISOString() } }) }); setGsMsg("✅ Synced!"); }
    catch { setGsMsg("❌ Failed. Check URL."); }
    setGsSyncing(false);
  };

  // ── Computed values ─────────────────────────────────────────
  const trainers = data.trainers || [];
  const activeClients = data.clients.filter(c => c.status === "active");
  const todayAtt = data.attendance.filter(a => a.date === attDate);
  const presentToday = todayAtt.filter(a => a.present === true || a.present === "true").length;
  const totalRev = data.clients.reduce((s, c) => s + (Number(c.totalPaid) || 0), 0);
  const totalRem = activeClients.reduce((s, c) => s + Math.max(0, (Number(c.monthlyFee) || 0) - (Number(c.totalPaid) || 0)), 0);
  const dueClients = data.clients.filter(c => { if (!c.feeDate || c.status !== "active") return false; const rem = Math.max(0, (Number(c.monthlyFee) || 0) - (Number(c.totalPaid) || 0)); if (rem <= 0) return false; return (new Date(c.feeDate) - new Date()) / 86400000 <= 7; });
  const dayStats = useMemo(() => { const ct = Array(7).fill(0); data.attendance.filter(a => a.present === true || a.present === "true").forEach(a => ct[new Date(a.date).getDay()]++); return ct; }, [data.attendance]);
  const peakDay = DAYS_S[dayStats.indexOf(Math.max(...dayStats))];
  const getAtt = id => data.attendance.filter(a => a.clientId === id && (a.present === true || a.present === "true")).length;
  const getAttS = id => { const r = todayAtt.find(a => a.clientId === id); return r ? (r.present === true || r.present === "true" ? "present" : "absent") : "none"; };
  const filteredClients = data.clients.filter(c => { const q = search.toLowerCase(); const m = (c.name || "").toLowerCase().includes(q) || (c.phone || "").includes(q); if (statusFilter === "active") return m && c.status === "active"; if (statusFilter === "paused") return m && c.status === "paused"; if (statusFilter === "inactive") return m && c.status === "inactive"; return m; });
  const shifts = [...new Set(data.clients.map(c => c.shift).filter(Boolean))];
  const attClients = useMemo(() => {
    let list = activeClients.filter(c => {
      const q = attSearch.toLowerCase(); const mQ = (c.name || "").toLowerCase().includes(q) || (c.phone || "").includes(q);
      const mShift = attShiftFilter === "all" || c.shift === attShiftFilter;
      const mTrainer = attTrainerFilter === "all" || c.trainerId === attTrainerFilter;
      const s = getAttS(c.id);
      const mStatus = attStatusFilter === "all" || (attStatusFilter === "present" && s === "present") || (attStatusFilter === "absent" && s === "absent") || (attStatusFilter === "unmarked" && s === "none");
      return mQ && mShift && mTrainer && mStatus;
    });
    if (attSort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (attSort === "days") list.sort((a, b) => getAtt(b.id) - getAtt(a.id));
    else if (attSort === "shift") list.sort((a, b) => (a.shift || "").localeCompare(b.shift || ""));
    return list;
  }, [activeClients, attSearch, attDate, attShiftFilter, attStatusFilter, attTrainerFilter, attSort, data.attendance]);

  const TABS = [{ id: "Dashboard", icon: "⊡" }, { id: "Clients", icon: "◻" }, { id: "Attendance", icon: "◎" }, { id: "Sheet", icon: "⊞" }, { id: "Trainers", icon: "⊕" }, { id: "Analytics", icon: "◈" }, ...(isAdmin ? [{ id: "Sync", icon: "↑" }] : [])];

  // ── Render ──────────────────────────────────────────────────
  if (loading) return <div style={{ minHeight: "100vh", background: T.appBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: T.textTertiary }}>Loading data…</div>;
  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: T.appBg, color: T.textPrimary, fontFamily: "Inter,system-ui,sans-serif", display: "flex" }}>
      <style>{globalCSS}</style>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <Sidebar tab={tab} setTab={setTab} tabs={TABS} dueClients={dueClients} dataPath={dataPath} user={user} onLogout={() => setUser(null)} />

      {/* Main content */}
      <div style={{ marginLeft: 220, padding: "28px 32px", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, lineHeight: "120%" }}>{tab}</div>
            <div style={{ fontSize: 13, color: T.textTertiary, marginTop: 2 }}>{new Date().toDateString()}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {tab === "Clients" && <>
              <input type="file" accept=".csv" ref={fileRef} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => processCSV(ev.target.result); r.readAsText(f); e.target.value = ""; }} style={{ display: "none" }} />
              <Btn variant="secondary" onClick={handleCSV}>↑ Import CSV</Btn>
              <Btn variant="primary" onClick={() => { setSelClient(null); setModal("addClient"); }}>+ Add Client</Btn>
            </>}
            {tab === "Trainers" && isAdmin && <Btn variant="primary" onClick={() => { setSelTrainer(null); setModal("addTrainer"); }}>+ Add Trainer</Btn>}
          </div>
        </div>

        {tab === "Dashboard" && <Dashboard data={data} trainers={trainers} activeClients={activeClients} dueClients={dueClients} presentToday={presentToday} totalRev={totalRev} totalRem={totalRem} dayStats={dayStats} peakDay={peakDay} isAdmin={isAdmin} onViewClient={c => { setSelClient(c); setModal("detail"); }} />}
        {tab === "Clients" && <Clients filteredClients={filteredClients} trainers={trainers} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} selectedIds={selectedIds} setSelectedIds={setSelectedIds} isAdmin={isAdmin} getAtt={getAtt} onViewClient={c => { setSelClient(c); setModal("detail"); }} onEditClient={c => { setSelClient(c); setModal("editClient"); }} onDeleteClient={deleteClient} onToggleStatus={toggleStatus} onBulkDelete={bulkDelete} />}
        {tab === "Attendance" && <Attendance attClients={attClients} activeClients={activeClients} trainers={trainers} todayAtt={todayAtt} attDate={attDate} setAttDate={setAttDate} attSearch={attSearch} setAttSearch={setAttSearch} attShiftFilter={attShiftFilter} setAttShiftFilter={setAttShiftFilter} attStatusFilter={attStatusFilter} setAttStatusFilter={setAttStatusFilter} attTrainerFilter={attTrainerFilter} setAttTrainerFilter={setAttTrainerFilter} attSort={attSort} setAttSort={setAttSort} showAttCal={showAttCal} setShowAttCal={setShowAttCal} shifts={shifts} getAttS={getAttS} getAtt={getAtt} markAtt={markAtt} />}
        {tab === "Sheet" && <AttSheet data={data} setData={updateData} />}
        {tab === "Trainers" && <Trainers trainers={trainers} data={data} isAdmin={isAdmin} onAddTrainer={() => { setSelTrainer(null); setModal("addTrainer"); }} onEditTrainer={t => { setSelTrainer(t); setModal("editTrainer"); }} onDeleteTrainer={deleteTrainer} onViewClient={c => { setSelClient(c); setModal("detail"); }} />}
        {tab === "Analytics" && <Analytics data={data} trainers={trainers} activeClients={activeClients} totalRev={totalRev} totalRem={totalRem} dayStats={dayStats} peakDay={peakDay} isAdmin={isAdmin} getAtt={getAtt} />}
        {tab === "Sync" && isAdmin && <Sync dataPath={dataPath} gsUrl={gsUrl} setGsUrl={setGsUrl} gsSyncing={gsSyncing} gsMsg={gsMsg} onSync={syncGS} onExportCSV={exportCSV} onClearAll={() => { if (confirm("Delete ALL data permanently?")) { updateData({ clients: [], attendance: [], trainers: [] }); showToast("All data cleared.", "error"); } }} />}
      </div>

      {modal === "addClient" && <ClientModal trainers={trainers} onSave={addClient} onClose={() => setModal(null)} />}
      {modal === "editClient" && selClient && <ClientModal initial={selClient} trainers={trainers} onSave={updateClient} onClose={() => setModal(null)} />}
      {modal === "detail" && selClient && <ClientDetail client={data.clients.find(c => c.id === selClient.id) || selClient} data={data} isAdmin={isAdmin} onClose={() => { setModal(null); setSelClient(null); }} onEdit={() => setModal("editClient")} />}
      {modal === "addTrainer" && <TrainerModal onSave={addTrainer} onClose={() => setModal(null)} />}
      {modal === "editTrainer" && selTrainer && <TrainerModal initial={selTrainer} onSave={updateTrainer} onClose={() => setModal(null)} />}
    </div>
  );
}