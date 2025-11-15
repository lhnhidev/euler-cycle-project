import { useGraphContext } from "@/context/GraphContext";
import { useEffect, useRef } from "react";
import ControllBar from "../ControllBar";
import { useAppContext } from "@/context/AppContext";

const GraphDisplay = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const { graph, isDirected } = useGraphContext();
  const { play } = useAppContext();

  useEffect(() => {
    graph.current.setIsDirected(isDirected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirected]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (cyRef.current) {
      cleanup = graph.current.display(cyRef.current);

      graph.current.addNodeByClick(cyRef.current);
      graph.current.addEdgeByClick();
      graph.current.deleteSelectedNode();
      graph.current.deleteSelectedEdge();
      graph.current.changeLabelNodeByClick(cyRef.current);
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="relative h-[calc(100%-40px)] w-full border border-b-0 border-[var(--primary-color)]">
        <div
          className={`absolute left-0 right-0 top-0 h-full w-full ${play ? "z-[100]" : "z-[-100]"}`}
        ></div>
        <div className="h-full w-full bg-white" ref={cyRef} id="cy"></div>
      </div>
      <ControllBar />
    </>
  );
};
export default GraphDisplay;
