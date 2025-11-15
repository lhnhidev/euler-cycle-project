import { useState } from "react";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
} from "react-icons/vsc";
import WindowTool from "./WindowTool";

const WindowTitle = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    window.electronAPI.send("window-control", "minimize");
  };

  const handleMaximize = () => {
    window.electronAPI.send(
      "window-control",
      isMaximized ? "unmaximize" : "maximize",
    );
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    window.electronAPI.send("window-control", "close");
  };

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex h-[var(--height-title-bar-windows)] w-full justify-between gap-2 border-b border-[var(--border-color)] bg-[var(--bg-color)]"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <WindowTool />
      </div>

      <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <button
          className="h-full px-4 py-1 hover:bg-gray-300"
          onClick={handleMinimize}
        >
          <VscChromeMinimize />
        </button>
        <button
          className="h-full px-4 py-1 hover:bg-gray-300"
          onClick={handleMaximize}
        >
          {isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
        </button>
        <button
          className="h-full px-4 py-1 hover:bg-red-500"
          onClick={handleClose}
        >
          <VscChromeClose />
        </button>
      </div>
    </div>
  );
};

export default WindowTitle;
