import { RouterProvider } from "react-router-dom";
import router from "./routers";
import { App as AntApp, ConfigProvider, theme } from "antd";
import { AppProvider } from "./context/AppContext";
import { GraphProvider } from "./context/GraphContext";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <AppProvider>
          <GraphProvider>
            <RouterProvider router={router} />
          </GraphProvider>
        </AppProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
