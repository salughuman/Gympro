const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

// ── Data folder: next to the exe ──────────────────────────────
const dataDir = path.join(app.getPath("userData"), "gympro-data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const FILES = {
    clients: path.join(dataDir, "clients.csv"),
    attendance: path.join(dataDir, "attendance.csv"),
    trainers: path.join(dataDir, "trainers.csv"),
    settings: path.join(dataDir, "settings.json"),
};

// ── CSV helpers ───────────────────────────────────────────────
const escapeCSV = v => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"` : s;
};

const rowToCSV = row => row.map(escapeCSV).join(",");

const parseCSV = raw => {
    const lines = raw.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map(line => {
        const vals = [];
        let cur = "", inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQ = !inQ; }
            else if (ch === "," && !inQ) { vals.push(cur); cur = ""; }
            else { cur += ch; }
        }
        vals.push(cur);
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (vals[i] || "").replace(/^"|"$/g, ""); });
        return obj;
    });
};

// ── Client CSV schema ─────────────────────────────────────────
const CLIENT_HEADERS = [
    "id", "name", "father", "phone", "cnic", "address", "shift",
    "monthlyFee", "totalPaid", "joinDate", "feeDate", "status", "trainerId", "notes"
];
const ATT_HEADERS = ["clientId", "date", "present", "hour"];
const TRAINER_HEADERS = ["id", "name", "phone", "specialty", "experience", "salary", "status", "joinDate", "notes"];

const readCSV = (file, headers) => {
    if (!fs.existsSync(file)) return [];
    try {
        const raw = fs.readFileSync(file, "utf8");
        return parseCSV(raw);
    } catch { return []; }
};

const writeCSV = (file, headers, rows) => {
    const lines = [headers.join(",")];
    rows.forEach(r => lines.push(rowToCSV(headers.map(h => r[h]))));
    fs.writeFileSync(file, lines.join("\n"), "utf8");
};

// ── IPC handlers ──────────────────────────────────────────────
ipcMain.handle("db-load", () => {
    return {
        clients: readCSV(FILES.clients, CLIENT_HEADERS),
        attendance: readCSV(FILES.attendance, ATT_HEADERS),
        trainers: readCSV(FILES.trainers, TRAINER_HEADERS),
    };
});

ipcMain.handle("db-save", (_, { clients, attendance, trainers }) => {
    writeCSV(FILES.clients, CLIENT_HEADERS, clients || []);
    writeCSV(FILES.attendance, ATT_HEADERS, attendance || []);
    writeCSV(FILES.trainers, TRAINER_HEADERS, trainers || []);
    return true;
});

ipcMain.handle("db-path", () => dataDir);

ipcMain.handle("import-csv", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Select CSV file",
        filters: [{ name: "CSV", extensions: ["csv"] }],
        properties: ["openFile"],
    });
    if (canceled || !filePaths.length) return null;
    try {
        return fs.readFileSync(filePaths[0], "utf8");
    } catch { return null; }
});

// ── Window ────────────────────────────────────────────────────
function createWindow() {
    const win = new BrowserWindow({
        width: 1350,
        height: 850,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: path.join(__dirname, "assets", "icon.png"),
        title: "GymPro",
        backgroundColor: "#F6F7F9",
    });

    if (process.env.NODE_ENV === "development") {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, "dist", "index.html"));
    }
}

app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });