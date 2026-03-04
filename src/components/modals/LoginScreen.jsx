import { useState } from "react";
import { T, ACCOUNTS } from "../../utils/constants";
import Inp from "../ui/Inp";
import Btn from "../ui/Btn";

export default function LoginScreen({ onLogin }) {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const [err, setErr] = useState("");

    const handle = () => {
        const acc = ACCOUNTS[u.toLowerCase()];
        if (acc && acc.password === p) {
            onLogin({ username: u.toLowerCase(), role: acc.role, label: acc.label });
        } else {
            setErr("Invalid username or password.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: T.appBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 20, padding: 40, width: 380, boxShadow: T.hoverShadow, animation: "fadeUp .3s" }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px", boxShadow: T.btnShadow }}>💪</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: T.textPrimary }}>GymPro</div>
                    <div style={{ fontSize: 14, color: T.textTertiary, marginTop: 4 }}>Sign in to continue</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <Inp label="Username" value={u} onChange={setU} placeholder="admin or staff" />
                    <Inp label="Password" type="password" value={p} onChange={setP} placeholder="••••••••" />
                    {err && <div style={{ background: T.redSoft, color: "#DC2626", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>{err}</div>}
                    <Btn variant="primary" full onClick={handle} style={{ marginTop: 4 }}>Sign In</Btn>
                </div>
                <div style={{ marginTop: 20, padding: 14, background: T.appBg, borderRadius: 10, fontSize: 12, color: T.textTertiary, lineHeight: 1.8 }}>
                    <div><strong>Admin:</strong> admin / admin123</div>
                    <div><strong>Staff:</strong> staff / staff123</div>
                </div>
            </div>
        </div>
    );
}
