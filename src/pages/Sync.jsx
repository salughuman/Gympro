import { T } from "../utils/constants";
import Inp from "../components/ui/Inp";
import Btn from "../components/ui/Btn";

export default function Sync({ dataPath, gsUrl, setGsUrl, gsSyncing, gsMsg, onSync, onExportCSV, onClearAll }) {
    return (
        <div style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 6 }}>Data Location</div>
                <div style={{ background: T.appBg, borderRadius: 10, padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: T.textSecondary, marginBottom: 16, border: `1px solid ${T.divider}` }}>{dataPath || "Running in browser — data in localStorage"}</div>
                <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 14 }}>📊 Google Sheets Sync</div>
                <div style={{ background: T.appBg, borderRadius: 12, padding: 14, fontFamily: "monospace", fontSize: 11, color: "#16A34A", marginBottom: 16, overflowX: "auto", border: `1px solid ${T.divider}`, maxHeight: 160, overflowY: "auto" }}>
                    {`function doPost(e) {
  var d=JSON.parse(e.postData.contents),ss=SpreadsheetApp.getActiveSpreadsheet();
  var cs=ss.getSheetByName("Clients")||ss.insertSheet("Clients");
  cs.clearContents();
  cs.appendRow(["Name","Phone","Shift","Fee","Paid","Remaining","Status","Trainer","Join","Due"]);
  d.clients.forEach(c=>{var t=(d.trainers||[]).find(x=>x.id===c.trainerId);
  cs.appendRow([c.name,c.phone,c.shift,c.monthlyFee,c.totalPaid,
  Math.max(0,(c.monthlyFee||0)-(c.totalPaid||0)),c.status,t?.name||"",c.joinDate,c.feeDate]);});
  var as=ss.getSheetByName("Attendance")||ss.insertSheet("Attendance");
  as.clearContents();as.appendRow(["Client","Date","Present"]);
  d.attendance.forEach(a=>{var c=d.clients.find(x=>x.id===a.clientId);
  as.appendRow([c?.name,a.date,a.present?"Yes":"No"]);});
  return ContentService.createTextOutput("OK");
}`}
                </div>
                <Inp label="Apps Script Web App URL" value={gsUrl} onChange={v => { setGsUrl(v); localStorage.setItem("gs_url", v); }} placeholder="https://script.google.com/macros/s/..." />
                <div style={{ marginTop: 12 }}><Btn variant="primary" onClick={onSync} disabled={gsSyncing} full>{gsSyncing ? "⏳ Syncing..." : "📤 Sync to Google Sheets"}</Btn></div>
                {gsMsg && <div style={{ marginTop: 10, color: gsMsg.startsWith("✅") ? T.green : T.red, fontSize: 13, textAlign: "center" }}>{gsMsg}</div>}
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                <div style={{ fontWeight: 600, color: T.textPrimary, fontSize: 16, marginBottom: 14 }}>📥 Export CSV</div>
                <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="primary" onClick={() => onExportCSV("clients")} full>⬇ Clients CSV</Btn>
                    <Btn variant="secondary" onClick={() => onExportCSV("attendance")} full>⬇ Attendance CSV</Btn>
                </div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.divider}`, borderRadius: 16, padding: 24, boxShadow: T.cardShadow }}>
                <div style={{ fontWeight: 600, color: T.red, fontSize: 16, marginBottom: 12 }}>⚠️ Danger Zone</div>
                <Btn variant="danger" onClick={onClearAll}>🗑 Clear All Data</Btn>
            </div>
        </div>
    );
}
