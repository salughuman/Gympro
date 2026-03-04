import { T } from "../../utils/constants";

export default function StatCard({ label, value, sub, icon, color = T.blue }) {
    return (
        <div className="card-hover" style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.textTertiary, letterSpacing: .5, textTransform: "uppercase" }}>{label}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: T.textTertiary, marginTop: 6 }}>{sub}</div>}
        </div>
    );
}
