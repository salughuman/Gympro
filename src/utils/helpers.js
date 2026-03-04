// ── Detect if running inside Electron ────────────────────────
export const IS_ELECTRON = typeof window !== "undefined" && !!window.gymAPI;

// ── Fallback localStorage (for browser dev) ──────────────────
const LSK = "gympro_v5";
export const lsLoad = () => {
    try {
        const s = localStorage.getItem(LSK);
        return s ? JSON.parse(s) : { clients: [], attendance: [], trainers: [] };
    } catch {
        return { clients: [], attendance: [], trainers: [] };
    }
};
export const lsSave = (d) => {
    try { localStorage.setItem(LSK, JSON.stringify(d)); } catch { }
};

// ── Helpers ───────────────────────────────────────────────────
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
export const todayStr = () => new Date().toISOString().split("T")[0];
export const addMonths = (d, n) => {
    const dt = new Date(d);
    dt.setMonth(dt.getMonth() + n);
    return dt.toISOString().split("T")[0];
};

export const fmtFull = (d) => {
    if (!d) return "–";
    const dt = new Date(d);
    const MONTHS_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dt.getDate()} ${MONTHS_S[dt.getMonth()]} ${dt.getFullYear()}`;
};

export const getDaysInMonth = (y, m) => {
    const days = [];
    const d = new Date(y, m, 1);
    while (d.getMonth() === m) {
        days.push(d.toISOString().split("T")[0]);
        d.setDate(d.getDate() + 1);
    }
    return days;
};

export const getLastNDays = (n) =>
    Array.from({ length: n }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (n - 1 - i));
        return d.toISOString().split("T")[0];
    });
