import { useGraphContext } from "@/context/GraphContext";
import { useEffect, useRef } from "react";

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
    <div className="relative h-full w-full bg-white" ref={cyRef} id="cy"></div>
  );
};
export default GraphDisplay;
