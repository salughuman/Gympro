import { T } from "../../utils/constants";

export default function Btn({ children, onClick, variant = "primary", small, disabled, full, style: sx = {} }) {
    const v = {
        primary: { background: T.blue, color: T.textInverse, border: "none", boxShadow: T.btnShadow, cls: "btn-primary" },
        secondary: { background: T.card, color: T.textSecondary, border: `1px solid #D0D5DD`, boxShadow: "none", cls: "btn-secondary" },
        ghost: { background: "transparent", color: T.textTertiary, border: `1px solid ${T.divider}`, boxShadow: "none", cls: "btn-secondary" },
        danger: { background: T.redSoft, color: "#DC2626", border: "1px solid #FECACA", boxShadow: "none", cls: "" },
        success: { background: T.greenSoft, color: "#16A34A", border: "1px solid #BBF7D0", boxShadow: "none", cls: "" },
        warn: { background: T.yellowSoft, color: "#D97706", border: "1px solid #FDE68A", boxShadow: "none", cls: "" },
    };
    const s = v[variant] || v.primary;
    return (
        <button onClick={onClick} disabled={disabled} className={s.cls}
            style={{
                background: s.background, color: s.color, border: s.border, boxShadow: s.boxShadow,
                borderRadius: 12, padding: small ? "5px 12px" : "0 18px", height: small ? 30 : 40,
                fontSize: small ? 12 : 14, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? .5 : 1, transition: "all 150ms", whiteSpace: "nowrap",
                width: full ? "100%" : "auto", display: "inline-flex", alignItems: "center",
                justifyContent: "center", gap: 6, ...sx
            }}>
            {children}
        </button>
    );
}
