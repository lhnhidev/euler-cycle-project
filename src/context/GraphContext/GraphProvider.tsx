import Graph from "@/libs/Graph";
import { GraphContext } from "./GraphContext";
import { useRef, useState, type ReactNode } from "react";

const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [ping, setPing] = useState<string>("Hello from graph context!");
  const [isDirected, setIsDirected] = useState<boolean>(false);
  const graph = useRef(new Graph());

  return (
    <GraphContext.Provider
      value={{
        ping,
        setPing,
        isDirected,
        setIsDirected,
        graph,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
export default GraphProvider;
