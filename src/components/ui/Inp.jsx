import { T } from "../../utils/constants";

export default function Inp({ label, type = "text", value, onChange, placeholder, style: sx = {} }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {label && <label style={{ color: T.textSecondary, fontSize: 13, fontWeight: 500 }}>{label}</label>}
            <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                style={{ background: T.card, border: `1px solid #D0D5DD`, borderRadius: 10, padding: "9px 13px", color: T.textPrimary, fontSize: 14, outline: "none", width: "100%", transition: "border 150ms", ...sx }}
                onFocus={e => e.target.style.borderColor = T.blue} onBlur={e => e.target.style.borderColor = "#D0D5DD"} />
        </div>
    );
}
