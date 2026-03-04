import { T } from "../../utils/constants";

export default function Pill({ children, color = "blue" }) {
    const m = {
        blue: { bg: T.blueSoft, c: T.blue },
        green: { bg: T.greenSoft, c: "#16A34A" },
        red: { bg: T.redSoft, c: "#DC2626" },
        yellow: { bg: T.yellowSoft, c: "#D97706" },
        orange: { bg: T.orangeSoft, c: T.orange },
        gray: { bg: T.hover, c: T.textTertiary },
    };
    const s = m[color] || m.gray;
    return (
        <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
            {children}
        </span>
    );
}
