import { useGraphContext } from "@/context/GraphContext";
import { useEffect, useRef } from "react";
import ControllBar from "../ControllBar";

const GraphDisplay = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const { graph } = useGraphContext();
  const { isDirected } = useGraphContext();

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
      <div
        className="relative h-[calc(100%-40px)] w-full border border-b-0 border-[var(--primary-color)] bg-white"
        ref={cyRef}
        id="cy"
      ></div>
      <ControllBar />
    </>
  );
};
export default GraphDisplay;
