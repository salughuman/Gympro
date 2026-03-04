import { T } from "../utils/constants";

export default function Sidebar({ tab, setTab, tabs, dueClients, dataPath, user, onLogout }) {
    return (
        <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: T.sidebar, borderRight: `1px solid ${T.divider}`, padding: "20px 12px", display: "flex", flexDirection: "column", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "0 8px" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: T.btnShadow }}>💪</div>
                <div><div style={{ fontWeight: 700, fontSize: 15, color: T.textPrimary }}>GymPro</div><div style={{ fontSize: 11, color: T.textTertiary }}>Management System</div></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className="nav-item" style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                        background: tab === t.id ? T.blueSoft : "transparent", color: tab === t.id ? T.blue : T.textSecondary,
                        fontWeight: tab === t.id ? 600 : 500, fontSize: 14, textAlign: "left", transition: "all 150ms", position: "relative"
                    }}>
                        {tab === t.id && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: 99, background: T.blue }} />}
                        <span>{t.icon}</span>{t.id}
                        {t.id === "Clients" && dueClients.length > 0 && <span style={{ marginLeft: "auto", background: T.orange, color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{dueClients.length}</span>}
                    </button>
                ))}
            </div>
            <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 12 }}>
                {dataPath && <div style={{ padding: "6px 12px", fontSize: 10, color: T.textTertiary, marginBottom: 6, wordBreak: "break-all" }}>📁 {dataPath}</div>}
                <div style={{ padding: "8px 12px", borderRadius: 10, background: T.appBg, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}>{user.label}</div>
                    <div style={{ fontSize: 11, color: T.textTertiary }}>{user.username}</div>
                </div>
                <button onClick={onLogout} style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: `1px solid ${T.divider}`, background: "transparent", color: T.textTertiary, fontSize: 13, cursor: "pointer", textAlign: "left" }}>← Sign Out</button>
            </div>
        </div>
    );
}
