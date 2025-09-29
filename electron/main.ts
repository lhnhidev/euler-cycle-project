import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
} from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  Menu.setApplicationMenu(null);

  if (process.env.NODE_ENV === "development") {
    // Vite dev server chạy ở 5173
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // Sau khi build Vite sẽ nằm trong dist
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("Control+Shift+I", () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });

  globalShortcut.register("CommandOrControl+R", () => {
    mainWindow?.reload();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

ipcMain.on("window-control", (_event, action: string) => {
  if (!mainWindow) return;
  switch (action) {
    case "minimize":
      mainWindow.minimize();
      break;
    case "maximize":
      mainWindow.maximize();
      break;
    case "unmaximize":
      mainWindow.unmaximize();
      break;
    case "close":
      mainWindow.close();
      break;
  }
});
