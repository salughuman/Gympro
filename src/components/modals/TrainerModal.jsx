import { useState } from "react";
import { T } from "../../utils/constants";
import Inp from "../ui/Inp";
import Sel from "../ui/Sel";
import Btn from "../ui/Btn";

export default function TrainerModal({ initial, onSave, onClose }) {
    const [f, setF] = useState(initial || {});
    const set = (k, v) => setF(p => ({ ...p, [k]: v }));

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(16,24,40,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 20, width: "100%", maxWidth: 460, padding: 28, boxShadow: T.hoverShadow }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>{initial?.id ? "Edit Trainer" : "Add Trainer"}</div>
                    <Btn variant="ghost" small onClick={onClose}>✕</Btn>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Inp label="Full Name *" value={f.name} onChange={v => set("name", v)} />
                    <Inp label="Phone" value={f.phone} onChange={v => set("phone", v)} />
                    <Inp label="Specialty" value={f.specialty} onChange={v => set("specialty", v)} placeholder="e.g. Weight Loss" />
                    <Inp label="Experience (yrs)" type="number" value={f.experience} onChange={v => set("experience", v)} />
                    <Inp label="Monthly Salary (Rs)" type="number" value={f.salary} onChange={v => set("salary", v)} />
                    <Sel label="Status" value={f.status || "active"} onChange={v => set("status", v)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
                    <div style={{ gridColumn: "1/-1" }}><Inp label="Notes / Schedule" value={f.notes} onChange={v => set("notes", v)} /></div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                    <Btn variant="ghost" onClick={onClose} full>Cancel</Btn>
                    <Btn variant="primary" onClick={() => { if (!f.name?.trim()) { alert("Name required."); return; } onSave(f); }} full>{initial?.id ? "Save" : "Add Trainer"}</Btn>
                </div>
            </div>
        </div>
    );
}
