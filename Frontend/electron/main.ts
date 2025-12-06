import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
} from "electron";
import * as path from "path";
import * as fs from "fs";

let mainWindow: BrowserWindow | null = null;

interface NodeItem {
  id: string;
  name: string;
  children?: NodeItem[];
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "../dist/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("Control+Shift+I", () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });

  globalShortcut.register("CommandOrControl+Shift+R", () => {
    mainWindow?.reload();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

function readDirRecursive(dirPath: string): NodeItem[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const children: NodeItem[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;

      const fullPath = path.join(dirPath, entry.name);

      const node: NodeItem = {
        id: fullPath,
        name: entry.name,
      };

      if (entry.isDirectory()) {
        node.children = readDirRecursive(fullPath);
      }

      children.push(node);
    }

    return children;
  } catch (e) {
    console.error(`Không thể đọc thư mục ${dirPath}:`, e);
    return [];
  }
}

ipcMain.handle("fs:readDirectory", (event, dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    return { success: false, error: "Đường dẫn không tồn tại" };
  }

  const rootNode: NodeItem = {
    id: dirPath,
    name: path.basename(dirPath),
    children: readDirRecursive(dirPath),
  };

  return { success: true, data: [rootNode] as NodeItem[] };
});

ipcMain.handle("fs:createFolder", async (event, folderPath) => {
  try {
    fs.mkdirSync(folderPath, { recursive: true });
    return { success: true, path: folderPath };
  } catch (error) {
    console.error("Lỗi khi tạo thư mục:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
});

ipcMain.handle("fs:createFile", async (event, filePath, content = "") => {
  try {
    fs.writeFileSync(filePath, content);
    return { success: true, path: filePath };
  } catch (error) {
    console.error("Lỗi khi tạo file:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
});

ipcMain.handle("fs:readFile", async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: "File không tồn tại" };
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return { success: true, data: content };
  } catch (error) {
    console.error("Lỗi khi đọc file:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
});

ipcMain.handle("fs:deleteItem", async (event, itemPath) => {
  try {
    fs.rmSync(itemPath, { recursive: true, force: true });
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
});

ipcMain.handle("fs:selectFolder", async () => {
  if (!mainWindow) return { canceled: true };

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"], // Chỉ cho phép chọn thư mục
    title: "Chọn thư mục dự án",
    buttonLabel: "Chọn Folder này",
  });

  if (result.canceled) {
    return { canceled: true };
  } else {
    // Trả về đường dẫn đầu tiên được chọn
    return { canceled: false, path: result.filePaths[0] };
  }
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
