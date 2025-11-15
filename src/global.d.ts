export {};

declare global {
  interface Window {
    electronAPI: {
      createFile(newPath: string, arg1: string): unknown;
      createFolder(newPath: string): unknown;
      readDirectory(ROOT_DIRECTORY: string): unknown;
      send: (
        channel: "window-control",
        data: "minimize" | "maximize" | "unmaximize" | "close",
      ) => void;
    };
  }
}
