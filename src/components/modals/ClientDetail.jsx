import { T, DAYS_S } from "../../utils/constants";
import { fmtFull, getLastNDays } from "../../utils/helpers";
import Btn from "../ui/Btn";

export default function ClientDetail({ client, data, isAdmin, onClose, onEdit }) {
    const trainer = (data.trainers || []).find(t => t.id === client.trainerId);
    const attR = data.attendance.filter(a => a.clientId === client.id);
    const present = attR.filter(a => a.present === "true" || a.present === true).length;
    const rate = attR.length > 0 ? Math.round((present / attR.length) * 100) : 0;
    const rem = Math.max(0, (Number(client.monthlyFee) || 0) - (Number(client.totalPaid) || 0));
    const days = client.joinDate ? Math.floor((new Date() - new Date(client.joinDate)) / 86400000) : 0;
    const last30 = getLastNDays(30);
    const daySt = Array(7).fill(0);
    attR.filter(a => a.present === "true" || a.present === true).forEach(a => daySt[new Date(a.date).getDay()]++);
    const favDay = DAYS_S[daySt.indexOf(Math.max(...daySt))];

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(16,24,40,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .2s" }}>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: T.hoverShadow }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>{client.name?.[0]}</div>
                        <div>
                            <div style={{ fontSize: 19, fontWeight: 700, color: T.textPrimary }}>{client.name}</div>
                            <div style={{ color: T.textTertiary, fontSize: 13 }}>{client.phone} · Member {days} days</div>
                            {trainer && <div style={{ color: T.blue, fontSize: 12, marginTop: 2 }}>🏋 {trainer.name}</div>}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}><Btn variant="secondary" small onClick={onEdit}>✎ Edit</Btn><Btn variant="ghost" small onClick={onClose}>✕</Btn></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
                    {[["Present", present, T.green], ["Rate", `${rate}%`, T.blue], ["Fav Day", favDay, T.orange], ["Remaining", `Rs ${rem}`, rem > 0 ? T.red : T.green]].map(([l, v, c]) => (
                        <div key={l} style={{ background: T.appBg, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ color: c, fontSize: 16, fontWeight: 700 }}>{v}</div>
                            <div style={{ color: T.textTertiary, fontSize: 11, marginTop: 2 }}>{l}</div>
                        </div>
                    ))}
                </div>
                <div style={{ marginBottom: 18 }}>
                    <div style={{ color: T.textTertiary, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>LAST 30 DAYS</div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {last30.map(d => { const r = attR.find(a => a.date === d); const p = r?.present === "true" || r?.present === true; return <div key={d} title={d} style={{ width: 18, height: 18, borderRadius: 4, background: p ? T.greenSoft : T.appBg, border: `1px solid ${p ? T.green : T.divider}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{p && <span style={{ color: T.green, fontSize: 9, fontWeight: 700 }}>✓</span>}</div>; })}
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                    {[["Father", client.father], ["CNIC", client.cnic], ["Address", client.address], ["Shift", client.shift],
                    ...(isAdmin ? [["Monthly Fee", `Rs ${client.monthlyFee || "–"}`], ["Total Paid", `Rs ${client.totalPaid || 0}`], ["Remaining", `Rs ${rem}`]] : []),
                    ["Fee Due", fmtFull(client.feeDate)], ["Join Date", fmtFull(client.joinDate)], ["Status", client.status], ["Trainer", trainer?.name || "None"]
                    ].map(([l, v]) => (
                        <div key={l} style={{ background: T.appBg, borderRadius: 10, padding: "10px 14px" }}>
                            <div style={{ color: T.textTertiary, fontSize: 11, fontWeight: 500, marginBottom: 2 }}>{l}</div>
                            <div style={{ color: T.textPrimary, fontWeight: 500 }}>{v || "–"}</div>
                        </div>
                    ))}
                </div>
                {client.notes && <div style={{ background: T.appBg, borderRadius: 10, padding: "10px 14px", marginTop: 10 }}><div style={{ color: T.textTertiary, fontSize: 11, fontWeight: 500, marginBottom: 2 }}>NOTES</div><div style={{ color: T.textPrimary, fontSize: 13 }}>{client.notes}</div></div>}
            </div>
        </div>
    );
}
