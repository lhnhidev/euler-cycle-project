import { useContext } from "react";
import { GraphContext } from "./GraphContext";

// eslint-disable-next-line react-refresh/only-export-components
export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within an GraphProvider");
  }
  return context;
};

export { default as GraphProvider } from "./GraphProvider";
