import { T, DAYS_S } from "../utils/constants";
import StatCard from "../components/ui/StatCard";

export default function Analytics({ data, trainers, activeClients, totalRev, totalRem, dayStats, peakDay, isAdmin, getAtt }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                <StatCard label="Avg Daily Attendance" value={(() => { const u = [...new Set(data.attendance.map(a => a.date))].length; return u ? Math.round(data.attendance.filter(a => a.present === true || a.present === "true").length / u) : 0; })()} icon="📈" color={T.blue} />
                <StatCard label="Peak Day" value={peakDay} icon="🏆" color={T.orange} />
                {isAdmin && <StatCard label="Revenue" value={`Rs ${totalRev.toLocaleString()}`} sub={`Rs ${totalRem.toLocaleString()} pending`} icon="💰" color={T.green} />}
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 16 }}>Client Attendance Ranking</div>
                {[...data.clients].sort((a, b) => getAtt(b.id) - getAtt(a.id)).slice(0, 12).map((c, i) => {
                    const att = getAtt(c.id);
                    const tot = data.attendance.filter(a => a.clientId === c.id).length;
                    const rate = tot > 0 ? Math.round((att / tot) * 100) : 0;
                    const rem = Math.max(0, (Number(c.monthlyFee) || 0) - (Number(c.totalPaid) || 0));
                    const trainer = trainers.find(t => t.id === c.trainerId);
                    return (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.divider}` }}>
                            <div style={{ width: 22, color: i < 3 ? [T.yellow, T.textTertiary, T.orange][i] : T.textTertiary, fontWeight: 700, fontSize: 13, textAlign: "center" }}>#{i + 1}</div>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 }}>{c.name?.[0]}</div>
                            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 14, color: T.textPrimary }}>{c.name}{trainer ? <span style={{ color: T.textTertiary, fontSize: 12 }}> · 🏋 {trainer.name}</span> : ""}</div><div style={{ height: 4, background: T.divider, borderRadius: 99, marginTop: 4 }}><div style={{ height: 4, background: T.blue, borderRadius: 99, width: `${rate}%`, transition: "width 500ms" }} /></div></div>
                            <div style={{ textAlign: "right", fontSize: 13 }}><div style={{ fontWeight: 600, color: T.textPrimary }}>{att} days · {rate}%</div>{isAdmin && <div style={{ color: rem > 0 ? T.red : T.green, fontSize: 12 }}>Rs {rem} {rem > 0 ? "due" : "clear"}</div>}</div>
                        </div>
                    );
                })}
            </div>
            {isAdmin && <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 16 }}>Revenue Breakdown</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                    {[["Collected", `Rs ${totalRev.toLocaleString()}`, T.green], ["Pending", `Rs ${totalRem.toLocaleString()}`, T.red], ["Expected/mo", `Rs ${activeClients.reduce((s, c) => s + (Number(c.monthlyFee) || 0), 0).toLocaleString()}`, T.blue]].map(([l, v, c]) => <div key={l} style={{ background: T.appBg, borderRadius: 12, padding: "16px 18px", textAlign: "center", border: `1px solid ${T.divider}` }}><div style={{ color: c, fontSize: 20, fontWeight: 700 }}>{v}</div><div style={{ color: T.textTertiary, fontSize: 12, marginTop: 4 }}>{l}</div></div>)}
                </div>
            </div>}
        </div>
    );
}
