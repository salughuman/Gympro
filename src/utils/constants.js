// ── Day / Month labels ────────────────────────────────────────
export const DAYS_S = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAYS_MIN = ["S", "M", "T", "W", "T", "F", "S"];
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Accounts ──────────────────────────────────────────────────
export const ACCOUNTS = {
    admin: { password: "admin123", role: "admin", label: "Admin" },
    staff: { password: "staff123", role: "staff", label: "Staff" },
};

// ── Design tokens ─────────────────────────────────────────────
export const T = {
    appBg: "#F6F7F9", sidebar: "#FFFFFF", card: "#FFFFFF",
    hover: "#F1F3F6", divider: "#E6E8EC",
    textPrimary: "#101828", textSecondary: "#344054", textTertiary: "#667085", textInverse: "#FFFFFF",
    blue: "#2563EB", blueHover: "#1E4FD8", blueSoft: "#EAF1FF",
    orange: "#F97316", orangeSoft: "#FFF1E6",
    green: "#22C55E", greenSoft: "#ECFDF5",
    red: "#EF4444", redSoft: "#FEF2F2",
    yellow: "#F59E0B", yellowSoft: "#FFFBEB",
    cardShadow: "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)",
    hoverShadow: "0 6px 20px rgba(16,24,40,0.08)",
    btnShadow: "0 2px 6px rgba(37,99,235,0.25)",
};

// ── Global CSS ────────────────────────────────────────────────
export const globalCSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',system-ui,sans-serif;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:${T.divider};border-radius:99px;}
  input[type=date]::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.5;}
  select option{background:#fff;color:${T.textPrimary};}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  .card-hover:hover{box-shadow:${T.hoverShadow}!important;transform:scale(1.005);transition:all 250ms cubic-bezier(.4,0,.2,1);}
  .row-hover:hover{background:${T.hover}!important;}
  .btn-primary:hover{background:${T.blueHover}!important;}
  .btn-secondary:hover{background:${T.hover}!important;}
  .nav-item:hover{background:${T.hover};}
  .cell-hover:hover{background:${T.blueSoft}!important;cursor:pointer;}
`;
