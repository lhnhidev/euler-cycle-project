import { GraphContext } from "./GraphContext";
import { useState, type ReactNode } from "react";

const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [ping, setPing] = useState<string>("Hello from graph context!");
  const [isDirected, setIsDirected] = useState<boolean>(false);

  return (
    <GraphContext.Provider
      value={{
        ping,
        setPing,
        isDirected,
        setIsDirected,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
export default GraphProvider;
