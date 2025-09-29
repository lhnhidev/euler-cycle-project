export {};

declare global {
  interface Window {
    electronAPI: {
      send: (
        channel: "window-control",
        data: "minimize" | "maximize" | "unmaximize" | "close",
      ) => void;
    };
  }
}
