import { useState } from "react";
import { T, MONTHS, DAYS_MIN } from "../utils/constants";
import { fmtFull } from "../utils/helpers";

export default function Calendar({ value, onChange }) {
    const now = new Date();
    const [view, setView] = useState({
        y: value ? new Date(value).getFullYear() : now.getFullYear(),
        m: value ? new Date(value).getMonth() : now.getMonth(),
    });
    const firstDay = new Date(view.y, view.m, 1).getDay();
    const daysInM = new Date(view.y, view.m + 1, 0).getDate();
    const todayD = now.toISOString().split("T")[0];

    const prev = () => { let m = view.m - 1, y = view.y; if (m < 0) { m = 11; y--; } setView({ y, m }); };
    const next = () => { let m = view.m + 1, y = view.y; if (m > 11) { m = 0; y++; } setView({ y, m }); };

    const cells = Array(firstDay).fill(null).concat(
        Array.from({ length: daysInM }, (_, i) => new Date(view.y, view.m, i + 1).toISOString().split("T")[0])
    );
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 14, overflow: "hidden", boxShadow: T.hoverShadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${T.divider}` }}>
                <button onClick={prev} style={{ background: "none", border: "none", color: T.textTertiary, cursor: "pointer", fontSize: 18, padding: "0 6px" }}>‹</button>
                <div style={{ color: T.textPrimary, fontWeight: 600, fontSize: 14 }}>{MONTHS[view.m]} {view.y}</div>
                <button onClick={next} style={{ background: "none", border: "none", color: T.textTertiary, cursor: "pointer", fontSize: 18, padding: "0 6px" }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, padding: "10px 10px 12px" }}>
                {DAYS_MIN.map((d, i) => <div key={i} style={{ textAlign: "center", color: T.textTertiary, fontSize: 11, fontWeight: 600, padding: "4px 0" }}>{d}</div>)}
                {cells.map((d, i) => {
                    const isT = d === todayD, isSel = d === value;
                    return (
                        <div key={i} onClick={() => d && onChange(d)} style={{
                            textAlign: "center", padding: "6px 2px", borderRadius: 8, fontSize: 13,
                            fontWeight: isSel || isT ? 600 : 400, cursor: d ? "pointer" : "default",
                            background: isSel ? T.blue : isT ? T.blueSoft : "transparent",
                            color: isSel ? "#fff" : isT ? T.blue : d ? T.textPrimary : "transparent",
                            border: isT && !isSel ? `1px solid ${T.blue}` : "1px solid transparent",
                            transition: "all 150ms"
                        }}>
                            {d ? new Date(d).getDate() : ""}
                        </div>
                    );
                })}
            </div>
            {value && (
                <div style={{ borderTop: `1px solid ${T.divider}`, padding: "8px 16px", color: T.textTertiary, fontSize: 12, textAlign: "center" }}>
                    Selected: <span style={{ color: T.blue, fontWeight: 600 }}>{fmtFull(value)}</span>
                </div>
            )}
        </div>
    );
}
