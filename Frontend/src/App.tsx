import { RouterProvider } from "react-router-dom";
import router from "./routers";
import { App as AntApp, ConfigProvider, theme } from "antd";
import { GraphProvider } from "./context/GraphContext";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
        event.preventDefault(); 
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        event.preventDefault(); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AntApp>
          <GraphProvider>
            <RouterProvider router={router} />
          </GraphProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
