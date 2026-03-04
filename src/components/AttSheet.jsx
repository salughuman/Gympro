import { useState } from "react";
import { T, DAYS_S, MONTHS } from "../utils/constants";
import { todayStr, getDaysInMonth } from "../utils/helpers";
import Btn from "./ui/Btn";

export default function AttSheet({ data, setData }) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const days = getDaysInMonth(year, month);
    const active = data.clients.filter(c => c.status === "active");

    const isPresent = (cid, d) => {
        const r = data.attendance.find(a => a.clientId === cid && a.date === d);
        return r && (r.present === "true" || r.present === true);
    };

    const toggle = (clientId, date) => {
        const ex = data.attendance.find(a => a.clientId === clientId && a.date === date);
        if (ex) setData(d => ({ ...d, attendance: d.attendance.map(a => a.clientId === clientId && a.date === date ? { ...a, present: !(a.present === "true" || a.present === true) } : a) }));
        else setData(d => ({ ...d, attendance: [...d.attendance, { clientId, date, present: true, hour: new Date().getHours() }] }));
    };

    const mTotal = cid => days.filter(d => isPresent(cid, d)).length;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <Btn variant="secondary" small onClick={() => { let m = month - 1, y = year; if (m < 0) { m = 11; y--; } setMonth(m); setYear(y); }}>← Prev</Btn>
                <div style={{ color: T.textPrimary, fontWeight: 700, fontSize: 18 }}>{MONTHS[month]} {year}</div>
                <Btn variant="secondary" small onClick={() => { let m = month + 1, y = year; if (m > 11) { m = 0; y++; } setMonth(m); setYear(y); }}>Next →</Btn>
                <div style={{ marginLeft: "auto", fontSize: 12, color: T.textTertiary }}>Click any cell to toggle</div>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${T.divider}`, boxShadow: T.cardShadow }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800, background: T.card }}>
                    <thead>
                        <tr style={{ background: T.appBg }}>
                            <th style={{ position: "sticky", left: 0, background: T.appBg, zIndex: 2, padding: "10px 16px", color: T.textTertiary, fontSize: 11, fontWeight: 600, textAlign: "left", borderBottom: `1px solid ${T.divider}`, borderRight: `1px solid ${T.divider}`, minWidth: 160 }}>CLIENT</th>
                            {days.map(d => { const dt = new Date(d); const isT = d === todayStr(); const isW = dt.getDay() === 0 || dt.getDay() === 6; return <th key={d} style={{ padding: "6px 3px", color: isT ? T.blue : isW ? T.orange : T.textTertiary, fontSize: 10, fontWeight: 600, borderBottom: `1px solid ${T.divider}`, minWidth: 30, textAlign: "center", background: isT ? T.blueSoft : "transparent" }}><div style={{ fontSize: 9 }}>{DAYS_S[dt.getDay()].slice(0, 1)}</div><div style={{ fontSize: 12, color: isT ? T.blue : T.textPrimary }}>{dt.getDate()}</div></th>; })}
                            <th style={{ padding: "10px 12px", color: T.textTertiary, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${T.divider}`, textAlign: "center", borderLeft: `1px solid ${T.divider}`, minWidth: 50 }}>DAYS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {active.length === 0 && <tr><td colSpan={days.length + 2} style={{ padding: 40, textAlign: "center", color: T.textTertiary }}>No active clients</td></tr>}
                        {active.map((c, ci) => (
                            <tr key={c.id} style={{ background: ci % 2 === 0 ? T.card : T.appBg }}>
                                <td style={{ position: "sticky", left: 0, background: ci % 2 === 0 ? T.card : T.appBg, zIndex: 1, padding: "8px 16px", borderBottom: `1px solid ${T.divider}`, borderRight: `1px solid ${T.divider}` }}>
                                    <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 13 }}>{c.name}</div>
                                    <div style={{ color: T.textTertiary, fontSize: 11 }}>{c.shift || "–"}</div>
                                </td>
                                {days.map(d => {
                                    const p = isPresent(c.id, d); const isT = d === todayStr(); const isFut = d > todayStr();
                                    return (
                                        <td key={d} onClick={() => !isFut && toggle(c.id, d)} className={isFut ? "" : "cell-hover"} style={{ textAlign: "center", padding: "4px 2px", borderBottom: `1px solid ${T.divider}`, cursor: isFut ? "default" : "pointer", background: isT ? T.blueSoft : "transparent" }}>
                                            {p ? <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.greenSoft, border: `1.5px solid ${T.green}`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: T.green, fontSize: 10, fontWeight: 700 }}>✓</span></div> : isFut ? <div style={{ width: 20, height: 20, margin: "0 auto" }} /> : <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1px solid ${T.divider}`, margin: "0 auto", opacity: .5 }} />}
                                        </td>
                                    );
                                })}
                                <td style={{ textAlign: "center", borderBottom: `1px solid ${T.divider}`, borderLeft: `1px solid ${T.divider}`, fontWeight: 700, fontSize: 14, color: T.blue }}>{mTotal(c.id)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
