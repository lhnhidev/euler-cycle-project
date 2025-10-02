import { useGraphContext } from "@/context/GraphContext";
import Graph from "@/libs/Graph";
import { useEffect, useRef } from "react";

const GraphDisplay = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef(new Graph());
  const { isDirected } = useGraphContext();

  useEffect(() => {
    graphRef.current.setIsDirected(isDirected);
  }, [isDirected]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (cyRef.current) {
      // Thêm nút và cạnh mẫu
      graphRef.current.addNode("A", "A");
      graphRef.current.addNode("B", "B");
      graphRef.current.addNode("C", "C");
      graphRef.current.addNode("D", "D");
      graphRef.current.addNode("E", "E");
      graphRef.current.addNode("F", "F");
      graphRef.current.addNode("G", "G");
      graphRef.current.addNode("H", "H");
      graphRef.current.addNode("I", "I");
      graphRef.current.addNode("J", "J");
      graphRef.current.addNode("K", "K");
      graphRef.current.addNode("L", "L");
      graphRef.current.addNode("M", "M");
      graphRef.current.addNode("N", "N");
      graphRef.current.addNode("O", "O");
      graphRef.current.addNode("P", "P");
      graphRef.current.addNode("Q", "Q");
      graphRef.current.addNode("R", "R");
      graphRef.current.addNode("S", "S");
      graphRef.current.addNode("T", "T");
      graphRef.current.addNode("U", "U");
      graphRef.current.addNode("V", "V");

      // Mỗi đỉnh chỉ nối tối đa với 2 đỉnh khác
      const nodes = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
      ];
      // Đánh dấu số lần nối của mỗi đỉnh
      const edgeCount: Record<string, number> = {};
      nodes.forEach((node) => (edgeCount[node] = 0));

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (edgeCount[nodes[i]] < 2 && edgeCount[nodes[j]] < 2) {
            graphRef.current.addEdge(nodes[i], nodes[j]);
            edgeCount[nodes[i]]++;
            edgeCount[nodes[j]]++;
          }
        }
      }

      graphRef.current.addEdge("A", "V");
      graphRef.current.addEdge("B", "U");
      graphRef.current.addEdge("C", "T");
      graphRef.current.addEdge("D", "S");
      graphRef.current.addEdge("E", "R");
      graphRef.current.addEdge("F", "Q");
      graphRef.current.addEdge("G", "P");
      graphRef.current.addEdge("H", "O");
      graphRef.current.addEdge("I", "N");
      graphRef.current.addEdge("J", "M");
      graphRef.current.addEdge("K", "L");
      graphRef.current.addEdge("A", "B");

      cleanup = graphRef.current.display(cyRef.current);

      graphRef.current.addNodeByClick(cyRef.current);
      graphRef.current.addEdgeByClick();
      graphRef.current.deleteSelectedNode();
      graphRef.current.deleteSelectedEdge();
      graphRef.current.changeLabelNodeByClick(cyRef.current);
    }

    return cleanup;
  }, []);

  return (
    <div className="relative h-full w-full bg-white" ref={cyRef} id="cy"></div>
  );
};
export default GraphDisplay;
