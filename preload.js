const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gymAPI", {
    load: () => ipcRenderer.invoke("db-load"),
    save: (data) => ipcRenderer.invoke("db-save", data),
    dataPath: () => ipcRenderer.invoke("db-path"),
    importCSV: () => ipcRenderer.invoke("import-csv"),
});