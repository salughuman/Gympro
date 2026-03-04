import { useState, useEffect, useRef } from "react";
import { T } from "../utils/constants";

export default function TrainerDropdown({ value, onChange, trainers }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const ref = useRef();

    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const selected = trainers.find(t => t.id === value);
    const filtered = trainers.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <label style={{ color: T.textSecondary, fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Personal Trainer</label>
            <div onClick={() => setOpen(o => !o)} style={{ background: T.card, border: `1px solid ${open ? T.blue : "#D0D5DD"}`, borderRadius: 10, padding: "9px 13px", color: selected ? T.textPrimary : T.textTertiary, fontSize: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{selected ? `${selected.name} — ${selected.specialty || "Trainer"}` : "No trainer assigned"}</span>
                <span style={{ color: T.textTertiary, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
            </div>
            {open && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: T.card, border: `1px solid ${T.divider}`, borderRadius: 12, zIndex: 100, overflow: "hidden", boxShadow: T.hoverShadow }}>
                    <div style={{ padding: "8px 10px", borderBottom: `1px solid ${T.divider}` }}>
                        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search trainer..." style={{ background: T.appBg, border: `1px solid ${T.divider}`, borderRadius: 8, padding: "7px 11px", color: T.textPrimary, fontSize: 13, outline: "none", width: "100%" }} />
                    </div>
                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                        <div onClick={() => { onChange(""); setOpen(false); setQ(""); }} className="row-hover" style={{ padding: "10px 14px", color: T.textTertiary, fontSize: 13, cursor: "pointer", borderBottom: `1px solid ${T.divider}` }}>— No trainer</div>
                        {filtered.length === 0 && <div style={{ padding: "12px 14px", color: T.textTertiary, fontSize: 13 }}>No trainers found</div>}
                        {filtered.map(t => (
                            <div key={t.id} onClick={() => { onChange(t.id); setOpen(false); setQ(""); }} className="row-hover" style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", color: value === t.id ? T.blue : T.textPrimary, background: value === t.id ? T.blueSoft : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: 500 }}>{t.name}</span>
                                <span style={{ color: T.textTertiary, fontSize: 12 }}>{t.specialty || "General"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
