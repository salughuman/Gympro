import { T } from "../../utils/constants";

export default function Sel({ label, value, onChange, options }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {label && <label style={{ color: T.textSecondary, fontSize: 13, fontWeight: 500 }}>{label}</label>}
            <select value={value || ""} onChange={e => onChange(e.target.value)}
                style={{ background: T.card, border: `1px solid #D0D5DD`, borderRadius: 10, padding: "9px 13px", color: T.textPrimary, fontSize: 14, outline: "none" }}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}
