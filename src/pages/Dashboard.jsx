import { T, DAYS_S } from "../utils/constants";
import { fmtFull, todayStr } from "../utils/helpers";
import StatCard from "../components/ui/StatCard";
import Pill from "../components/ui/Pill";

export default function Dashboard({ data, trainers, activeClients, dueClients, presentToday, totalRev, totalRem, dayStats, peakDay, isAdmin, onViewClient }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                <StatCard label="Total Clients" value={data.clients.length} sub={`${data.clients.filter(c => c.status === "paused").length} paused`} icon="👥" color={T.blue} />
                <StatCard label="Active Members" value={activeClients.length} icon="✅" color={T.green} />
                {isAdmin && <StatCard label="Revenue Collected" value={`Rs ${totalRev.toLocaleString()}`} sub={`Rs ${totalRem.toLocaleString()} pending`} icon="💰" color={T.orange} />}
                <StatCard label="Present Today" value={presentToday} sub={todayStr()} icon="🏃" color={T.blue} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
                <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                    <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 16 }}>⚠️ Fee Due Within 7 Days</div>
                    {dueClients.length === 0 ? <div style={{ color: T.textTertiary, fontSize: 14, padding: "20px 0", textAlign: "center" }}>All fees are clear 🎉</div> : dueClients.map(c => {
                        const rem = Math.max(0, (Number(c.monthlyFee) || 0) - (Number(c.totalPaid) || 0));
                        return (
                            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${T.divider}` }}>
                                <div><div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 14 }}>{c.name}</div><div style={{ color: T.textTertiary, fontSize: 12 }}>{c.phone}</div></div>
                                <div style={{ textAlign: "right" }}>{isAdmin && <div style={{ color: T.red, fontWeight: 600, fontSize: 13 }}>Rs {rem} pending</div>}<div style={{ color: T.textTertiary, fontSize: 12 }}>Due: {fmtFull(c.feeDate)}</div></div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                    <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 16 }}>Weekly Pattern</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
                        {dayStats.map((v, i) => { const max = Math.max(...dayStats) || 1; return <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ fontSize: 10, color: T.textTertiary }}>{v || ""}</div><div style={{ width: "100%", borderRadius: 6, background: DAYS_S[i] === peakDay ? T.blue : T.blueSoft, height: `${(v / max) * 60}px`, minHeight: v > 0 ? 4 : 0, transition: "height 300ms" }} /><div style={{ fontSize: 10, color: DAYS_S[i] === peakDay ? T.blue : T.textTertiary, fontWeight: DAYS_S[i] === peakDay ? 700 : 400 }}>{DAYS_S[i].slice(0, 2)}</div></div>; })}
                    </div>
                </div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 16 }}>Recent Clients</div>
                {[...data.clients].reverse().slice(0, 5).map(c => {
                    const rem = Math.max(0, (Number(c.monthlyFee) || 0) - (Number(c.totalPaid) || 0));
                    const trainer = trainers.find(t => t.id === c.trainerId);
                    return (
                        <div key={c.id} onClick={() => onViewClient(c)} className="row-hover" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderBottom: `1px solid ${T.divider}`, cursor: "pointer", borderRadius: 8, transition: "background 150ms" }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14, flexShrink: 0 }}>{c.name?.[0]}</div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 14 }}>{c.name}</div><div style={{ color: T.textTertiary, fontSize: 12 }}>{c.shift || "–"}{trainer ? ` · 🏋 ${trainer.name}` : ""}</div></div>
                            <div style={{ textAlign: "right" }}>{isAdmin && <div style={{ color: rem > 0 ? T.red : T.green, fontWeight: 600, fontSize: 13 }}>{rem > 0 ? `Rs ${rem} due` : "Paid ✓"}</div>}<Pill color={c.status === "active" ? "green" : c.status === "paused" ? "yellow" : "red"}>{c.status}</Pill></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
