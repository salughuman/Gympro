import { T } from "../utils/constants";
import { fmtFull } from "../utils/helpers";
import Btn from "../components/ui/Btn";
import Calendar from "../components/Calendar";

export default function Attendance({
    attClients, activeClients, trainers, todayAtt,
    attDate, setAttDate, attSearch, setAttSearch,
    attShiftFilter, setAttShiftFilter, attStatusFilter, setAttStatusFilter,
    attTrainerFilter, setAttTrainerFilter, attSort, setAttSort,
    showAttCal, setShowAttCal, shifts,
    getAttS, getAtt, markAtt
}) {
    return (
        <div>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 14, padding: "16px 18px", marginBottom: 16, boxShadow: T.cardShadow }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div style={{ position: "relative" }}>
                        <label style={{ color: T.textSecondary, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>DATE</label>
                        <div onClick={() => setShowAttCal(o => !o)} style={{ background: T.appBg, border: `1px solid ${showAttCal ? T.blue : T.divider}`, borderRadius: 10, padding: "9px 14px", color: T.textPrimary, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: 170 }}>
                            <span>📅</span><span style={{ fontWeight: 500 }}>{fmtFull(attDate)}</span>
                        </div>
                        {showAttCal && <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 30, width: 260 }}><Calendar value={attDate} onChange={v => { setAttDate(v); setShowAttCal(false); }} /></div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 140 }}>
                        <label style={{ color: T.textSecondary, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>SEARCH</label>
                        <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textTertiary }}>⌕</span><input value={attSearch} onChange={e => setAttSearch(e.target.value)} placeholder="Name or phone..." style={{ background: T.appBg, border: `1px solid ${T.divider}`, borderRadius: 10, padding: "9px 12px 9px 28px", color: T.textPrimary, fontSize: 13, outline: "none", width: "100%" }} /></div>
                    </div>
                    {[["SHIFT", attShiftFilter, setAttShiftFilter, [{ value: "all", label: "All Shifts" }, ...shifts.map(s => ({ value: s, label: s }))]], ["STATUS", attStatusFilter, setAttStatusFilter, [{ value: "all", label: "All" }, { value: "present", label: "Present" }, { value: "absent", label: "Absent" }, { value: "unmarked", label: "Not Marked" }]], ["SORT BY", attSort, setAttSort, [{ value: "name", label: "Name A–Z" }, { value: "days", label: "Most Days" }, { value: "shift", label: "Shift" }]]].map(([lbl, val, setter, opts]) => (
                        <div key={lbl}><label style={{ color: T.textSecondary, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>{lbl}</label><select value={val} onChange={e => setter(e.target.value)} style={{ background: T.appBg, border: `1px solid ${T.divider}`, borderRadius: 10, padding: "9px 12px", color: T.textPrimary, fontSize: 13, outline: "none" }}>{opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                    ))}
                    {trainers.length > 0 && <div><label style={{ color: T.textSecondary, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>TRAINER</label><select value={attTrainerFilter} onChange={e => setAttTrainerFilter(e.target.value)} style={{ background: T.appBg, border: `1px solid ${T.divider}`, borderRadius: 10, padding: "9px 12px", color: T.textPrimary, fontSize: 13, outline: "none" }}><option value="all">All</option><option value="">No Trainer</option>{trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>}
                    <Btn variant="ghost" small onClick={() => { setAttSearch(""); setAttShiftFilter("all"); setAttStatusFilter("all"); setAttTrainerFilter("all"); setAttSort("name"); }}>Reset</Btn>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                    {[["Present", todayAtt.filter(a => a.present === true || a.present === "true").length, T.green], ["Absent", todayAtt.filter(a => !(a.present === true || a.present === "true")).length, T.red], ["Unmarked", activeClients.length - todayAtt.length, T.textTertiary], ["Showing", attClients.length, T.blue]].map(([l, v, c]) => <div key={l} style={{ background: T.appBg, borderRadius: 8, padding: "4px 14px", fontSize: 13, color: c, fontWeight: 600 }}>{l}: {v}</div>)}
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <Btn variant="success" small onClick={() => attClients.forEach(c => markAtt(c.id, true))}>✓ Mark All Present</Btn>
                <Btn variant="danger" small onClick={() => attClients.forEach(c => markAtt(c.id, false))}>✕ Mark All Absent</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {attClients.length === 0 && <div style={{ color: T.textTertiary, textAlign: "center", padding: 50 }}>No clients match filters.</div>}
                {attClients.map(c => {
                    const s = getAttS(c.id); const trainer = trainers.find(t => t.id === c.trainerId);
                    return (
                        <div key={c.id} style={{ background: T.card, border: `1px solid ${s === "present" ? "#BBF7D0" : s === "absent" ? "#FECACA" : T.divider}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: T.cardShadow }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 9, height: 9, borderRadius: "50%", background: s === "present" ? T.green : s === "absent" ? T.red : T.divider, flexShrink: 0 }} /><div><div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 14 }}>{c.name}</div><div style={{ color: T.textTertiary, fontSize: 12 }}>{c.shift || "–"}{trainer ? ` · 🏋 ${trainer.name}` : ""} · {getAtt(c.id)} days</div></div></div>
                            <div style={{ display: "flex", gap: 8 }}><Btn variant={s === "present" ? "success" : "ghost"} small onClick={() => markAtt(c.id, true)}>✓ Present</Btn><Btn variant={s === "absent" ? "danger" : "ghost"} small onClick={() => markAtt(c.id, false)}>✕ Absent</Btn></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
