import { T } from "../../utils/constants";

export default function Toast({ msg, type }) {
    return (
        <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            background: type === "error" ? T.red : type === "warn" ? T.yellow : T.green,
            color: type === "warn" ? "#000" : "#fff",
            padding: "12px 22px", borderRadius: 12, fontWeight: 600, fontSize: 14,
            boxShadow: T.hoverShadow, animation: "fadeUp .2s"
        }}>
            {msg}
        </div>
    );
}
