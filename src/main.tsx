// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppProvider from "./context/AppContext/AppProvider.tsx";
import GraphProvider from "./context/GraphContext/GraphProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AppProvider>
    <GraphProvider>
      <App />
    </GraphProvider>
  </AppProvider>,
  // </StrictMode>,
);
