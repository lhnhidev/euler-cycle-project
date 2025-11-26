import { contextBridge, ipcRenderer } from "electron";

// Khai báo kiểu cho các hàm mới
export interface FileSystemApi {
  createFolder: (fullPath: string) => Promise<never>;
  createFile: (fullPath: string, content: string) => Promise<never>;
}

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => ipcRenderer.invoke("ping"),
  send: <T>(channel: "window-control", data: T) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },
  createFolder: (fullPath: string) =>
    ipcRenderer.invoke("fs:createFolder", fullPath),
  createFile: (fullPath: string, content: string) =>
    ipcRenderer.invoke("fs:createFile", fullPath, content),
  readDirectory: (dirPath: string) =>
    ipcRenderer.invoke("fs:readDirectory", dirPath),
  readFile: (fullPath: string) => ipcRenderer.invoke("fs:readFile", fullPath),
  deleteItem: (fullPath: string) =>
    ipcRenderer.invoke("fs:deleteItem", fullPath),
  selectFolder: () => ipcRenderer.invoke("fs:selectFolder"),
});
