import { T } from "../utils/constants";
import Btn from "../components/ui/Btn";
import Pill from "../components/ui/Pill";

export default function Clients({ filteredClients, trainers, search, setSearch, statusFilter, setStatusFilter, selectedIds, setSelectedIds, isAdmin, getAtt, onViewClient, onEditClient, onDeleteClient, onToggleStatus, onBulkDelete }) {
    return (
        <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textTertiary, fontSize: 16 }}>⌕</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 10, padding: "9px 13px 9px 34px", color: T.textPrimary, fontSize: 14, outline: "none", width: "100%", boxShadow: T.cardShadow }} />
                </div>
                {["all", "active", "paused", "inactive"].map(s => <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${statusFilter === s ? T.blue : T.divider}`, background: statusFilter === s ? T.blueSoft : T.card, color: statusFilter === s ? T.blue : T.textSecondary, fontSize: 13, fontWeight: statusFilter === s ? 600 : 400, cursor: "pointer", textTransform: "capitalize", transition: "all 150ms" }}>{s}</button>)}
                {selectedIds.length > 0 && <Btn variant="danger" onClick={onBulkDelete}>🗑 Delete {selectedIds.length} Selected</Btn>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredClients.length === 0 && <div style={{ color: T.textTertiary, textAlign: "center", padding: 60 }}>No clients found.</div>}
                {filteredClients.map(c => {
                    const rem = Math.max(0, (Number(c.monthlyFee) || 0) - (Number(c.totalPaid) || 0));
                    const trainer = trainers.find(t => t.id === c.trainerId);
                    const isSel = selectedIds.includes(c.id);
                    return (
                        <div key={c.id} style={{ background: T.card, border: `1px solid ${isSel ? T.blue : T.divider}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: T.cardShadow, transition: "all 150ms" }}>
                            <input type="checkbox" checked={isSel} onChange={e => { e.stopPropagation(); setSelectedIds(ids => isSel ? ids.filter(i => i !== c.id) : [...ids, c.id]); }} style={{ width: 16, height: 16, cursor: "pointer", accentColor: T.blue, flexShrink: 0 }} />
                            <div onClick={() => onViewClient(c)} style={{ display: "flex", flex: 1, alignItems: "center", gap: 12, cursor: "pointer", minWidth: 0 }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>{c.name?.[0]}</div>
                                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 14 }}>{c.name}</div><div style={{ color: T.textTertiary, fontSize: 12 }}>{c.phone} · {c.shift || "–"}{trainer ? ` · 🏋 ${trainer.name}` : ""}</div></div>
                                <div style={{ display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
                                    <div style={{ textAlign: "center" }}><div style={{ color: T.textPrimary, fontWeight: 700, fontSize: 15 }}>{getAtt(c.id)}</div><div style={{ color: T.textTertiary, fontSize: 10 }}>Days</div></div>
                                    {isAdmin && <><div style={{ textAlign: "center" }}><div style={{ color: T.green, fontWeight: 700, fontSize: 14 }}>Rs {c.monthlyFee || 0}</div><div style={{ color: T.textTertiary, fontSize: 10 }}>Monthly</div></div><div style={{ textAlign: "center" }}><div style={{ color: rem > 0 ? T.red : T.green, fontWeight: 700, fontSize: 14 }}>Rs {rem}</div><div style={{ color: T.textTertiary, fontSize: 10 }}>Remaining</div></div></>}
                                    <Pill color={c.status === "active" ? "green" : c.status === "paused" ? "yellow" : "red"}>{c.status}</Pill>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                                <Btn variant="ghost" small onClick={() => onToggleStatus(c)}>{c.status === "active" ? "⏸" : "▶"}</Btn>
                                <Btn variant="secondary" small onClick={() => onEditClient(c)}>✎</Btn>
                                <Btn variant="danger" small onClick={() => onDeleteClient(c.id)}>⊗</Btn>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
