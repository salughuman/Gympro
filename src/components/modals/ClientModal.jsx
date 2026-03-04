import { useState } from "react";
import { T } from "../../utils/constants";
import { fmtFull } from "../../utils/helpers";
import Inp from "../ui/Inp";
import Sel from "../ui/Sel";
import Btn from "../ui/Btn";
import Calendar from "../Calendar";
import TrainerDropdown from "../TrainerDropdown";

export default function ClientModal({ initial, trainers, onSave, onClose }) {
    const [f, setF] = useState(initial || {});
    const [showCal, setShowCal] = useState(false);
    const set = (k, v) => setF(p => ({ ...p, [k]: v }));

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(16,24,40,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .2s" }}>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: T.hoverShadow }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>{initial?.id ? "Edit Client" : "Add New Client"}</div>
                    <Btn variant="ghost" small onClick={onClose}>✕</Btn>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Inp label="Full Name *" value={f.name} onChange={v => set("name", v)} />
                    <Inp label="Father's Name" value={f.father} onChange={v => set("father", v)} />
                    <Inp label="Phone Number" value={f.phone} onChange={v => set("phone", v)} />
                    <Inp label="CNIC / ID" value={f.cnic} onChange={v => set("cnic", v)} />
                    <div style={{ gridColumn: "1/-1" }}><Inp label="Address" value={f.address} onChange={v => set("address", v)} /></div>
                    <Inp label="Monthly Fee (Rs)" type="number" value={f.monthlyFee} onChange={v => set("monthlyFee", v)} />
                    <Inp label="Amount Paid (Rs)" type="number" value={f.totalPaid} onChange={v => set("totalPaid", v)} />
                    <Sel label="Shift" value={f.shift} onChange={v => set("shift", v)} options={[{ value: "", label: "Select shift" }, { value: "Morning (6am–9am)", label: "Morning (6am–9am)" }, { value: "Afternoon (12pm–3pm)", label: "Afternoon (12pm–3pm)" }, { value: "Evening (5pm–8pm)", label: "Evening (5pm–8pm)" }, { value: "Night (8pm–11pm)", label: "Night (8pm–11pm)" }, { value: "Flexible", label: "Flexible" }]} />
                    <Sel label="Status" value={f.status || "active"} onChange={v => set("status", v)} options={[{ value: "active", label: "Active" }, { value: "paused", label: "Paused" }, { value: "inactive", label: "Inactive" }]} />
                    <div style={{ gridColumn: "1/-1" }}><TrainerDropdown value={f.trainerId || ""} onChange={v => set("trainerId", v)} trainers={trainers} /></div>
                    <div style={{ gridColumn: "1/-1" }}>
                        <label style={{ color: T.textSecondary, fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Fee Due Date</label>
                        <div onClick={() => setShowCal(o => !o)} style={{ background: T.card, border: `1px solid ${showCal ? T.blue : "#D0D5DD"}`, borderRadius: 10, padding: "9px 13px", color: f.feeDate ? T.textPrimary : T.textTertiary, fontSize: 14, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                            <span>{f.feeDate ? fmtFull(f.feeDate) : "Auto-set to 1 month from join date"}</span><span>📅</span>
                        </div>
                        {showCal && <div style={{ marginTop: 8 }}><Calendar value={f.feeDate} onChange={v => { set("feeDate", v); setShowCal(false); }} /></div>}
                    </div>
                    <div style={{ gridColumn: "1/-1" }}><Inp label="Notes" value={f.notes} onChange={v => set("notes", v)} /></div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                    <Btn variant="ghost" onClick={onClose} full>Cancel</Btn>
                    <Btn variant="primary" onClick={() => { if (!f.name?.trim()) { alert("Name is required."); return; } onSave(f); }} full>{initial?.id ? "Save Changes" : "Add Client"}</Btn>
                </div>
            </div>
        </div>
    );
}
