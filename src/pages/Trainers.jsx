import { T } from "../utils/constants";
import StatCard from "../components/ui/StatCard";
import Pill from "../components/ui/Pill";
import Btn from "../components/ui/Btn";

export default function Trainers({ trainers, data, isAdmin, onAddTrainer, onEditTrainer, onDeleteTrainer, onViewClient }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 4 }}>
                <StatCard label="Total Trainers" value={trainers.length} icon="🏋" color={T.blue} />
                <StatCard label="Active" value={trainers.filter(t => t.status === "active").length} icon="✅" color={T.green} />
                {isAdmin && <StatCard label="Monthly Salaries" value={`Rs ${trainers.reduce((s, t) => s + (Number(t.salary) || 0), 0).toLocaleString()}`} icon="💰" color={T.orange} />}
            </div>
            {trainers.length === 0 && <div style={{ color: T.textTertiary, textAlign: "center", padding: 60 }}>No trainers yet.</div>}
            {trainers.map(t => {
                const tClients = data.clients.filter(c => c.trainerId === t.id && c.status === "active");
                return (
                    <div key={t.id} style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 22, boxShadow: T.cardShadow }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, justifyContent: "space-between", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "#fff", flexShrink: 0 }}>{t.name?.[0]}</div>
                                <div><div style={{ fontWeight: 700, color: T.textPrimary, fontSize: 16 }}>{t.name}</div><div style={{ color: T.textTertiary, fontSize: 13 }}>{t.phone} · {t.specialty || "General Trainer"}</div>{t.experience && <div style={{ color: T.textTertiary, fontSize: 12 }}>{t.experience} yrs exp</div>}</div>
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                <Pill color={t.status === "active" ? "green" : "red"}>{t.status}</Pill>
                                {isAdmin && <div style={{ color: T.orange, fontWeight: 600, fontSize: 14 }}>Rs {Number(t.salary || 0).toLocaleString()}/mo</div>}
                                {isAdmin && <><Btn variant="secondary" small onClick={() => onEditTrainer(t)}>✎ Edit</Btn><Btn variant="danger" small onClick={() => onDeleteTrainer(t.id)}>⊗</Btn></>}
                            </div>
                        </div>
                        {tClients.length > 0 && <div style={{ marginTop: 16, borderTop: `1px solid ${T.divider}`, paddingTop: 14 }}><div style={{ color: T.textTertiary, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>ASSIGNED CLIENTS ({tClients.length})</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{tClients.map(c => <div key={c.id} onClick={() => onViewClient(c)} style={{ background: T.blueSoft, borderRadius: 8, padding: "5px 12px", fontSize: 13, color: T.blue, fontWeight: 500, cursor: "pointer" }}>{c.name}</div>)}</div></div>}
                        {t.notes && <div style={{ marginTop: 12, color: T.textTertiary, fontSize: 13, fontStyle: "italic" }}>{t.notes}</div>}
                    </div>
                );
            })}
        </div>
    );
}
