import Graph from "@/libs/Graph";
import { GraphContext } from "./GraphContext";
import { useRef, useState, type ReactNode } from "react";
import {
  BG_COLOR_NODE,
  COLOR_EDGE,
  COLOR_NODE,
  COLOR_TARGET_ARROW_EDGE,
} from "@/libs/CSSGraph/CSSGraph";

const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [ping, setPing] = useState<string>("Hello from graph context!");
  const [isDirected, setIsDirected] = useState<boolean>(false);
  const [nodeSize, setNodeSize] = useState<number>(30);
  const [edgeLength, setEdgeLength] = useState<number>(30);
  const [bgNodeColor, setBgNodeColor] = useState<string>(BG_COLOR_NODE);
  const [edgeColor, setEdgeColor] = useState<string>(COLOR_EDGE);
  const [targetArrowColor, setTargetArrowColor] = useState<string>(
    COLOR_TARGET_ARROW_EDGE,
  );
  const [labelColor, setLabelColor] = useState<string>(COLOR_NODE);

  const graph = useRef(new Graph());

  return (
    <GraphContext.Provider
      value={{
        ping,
        setPing,
        isDirected,
        setIsDirected,
        graph,
        nodeSize,
        setNodeSize,
        edgeLength,
        setEdgeLength,
        bgNodeColor,
        setBgNodeColor,
        edgeColor,
        setEdgeColor,
        targetArrowColor,
        setTargetArrowColor,
        labelColor,
        setLabelColor,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
export default GraphProvider;
