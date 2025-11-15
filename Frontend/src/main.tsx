// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppProvider from "./context/AppContext/AppProvider.tsx";
import GraphProvider from "./context/GraphContext/GraphProvider.tsx";
import { NotificationProvider } from "./services/notify/index.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AppProvider>
    <NotificationProvider>
      <GraphProvider>
        <App />
      </GraphProvider>
    </NotificationProvider>
  </AppProvider>,
  // </StrictMode>,
);
