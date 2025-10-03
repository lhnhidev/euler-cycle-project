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
      // Thêm nút và cạnh mẫu
      // graph.current.addNode("A", "A");
      // graph.current.addNode("B", "B");
      // graph.current.addNode("C", "C");
      // graph.current.addNode("D", "D");
      // graph.current.addNode("E", "E");
      // graph.current.addNode("F", "F");
      // graph.current.addNode("G", "G");
      // graph.current.addNode("H", "H");
      // graph.current.addNode("I", "I");
      // graph.current.addNode("J", "J");
      // graph.current.addNode("K", "K");
      // graph.current.addNode("L", "L");
      // graph.current.addNode("M", "M");
      // graph.current.addNode("N", "N");
      // graph.current.addNode("O", "O");
      // graph.current.addNode("P", "P");
      // graph.current.addNode("Q", "Q");
      // graph.current.addNode("R", "R");
      // graph.current.addNode("S", "S");
      // graph.current.addNode("T", "T");
      // graph.current.addNode("U", "U");
      // graph.current.addNode("V", "V");

      // graph.current.addEdge("A", "V");
      // graph.current.addEdge("B", "U");
      // graph.current.addEdge("C", "T");
      // graph.current.addEdge("D", "S");
      // graph.current.addEdge("E", "R");
      // graph.current.addEdge("F", "Q");
      // graph.current.addEdge("G", "P");
      // graph.current.addEdge("H", "O");
      // graph.current.addEdge("I", "N");
      // graph.current.addEdge("J", "M");
      // graph.current.addEdge("K", "L");
      // graph.current.addEdge("A", "B");

      // Mỗi đỉnh chỉ nối tối đa với 2 đỉnh khác
      // const nodes = [
      //   "A",
      //   "B",
      //   "C",
      //   "D",
      //   "E",
      //   "F",
      //   "G",
      //   "H",
      //   "I",
      //   "J",
      //   "K",
      //   "L",
      //   "M",
      //   "N",
      //   "O",
      //   "P",
      //   "Q",
      //   "R",
      //   "S",
      //   "T",
      //   "U",
      //   "V",
      // ];
      // // Đánh dấu số lần nối của mỗi đỉnh
      // const edgeCount: Record<string, number> = {};
      // nodes.forEach((node) => (edgeCount[node] = 0));

      // for (let i = 0; i < nodes.length; i++) {
      //   for (let j = i + 1; j < nodes.length; j++) {
      //     if (edgeCount[nodes[i]] < 2 && edgeCount[nodes[j]] < 2) {
      //       graph.current.addEdge(nodes[i], nodes[j]);
      //       edgeCount[nodes[i]]++;
      //       edgeCount[nodes[j]]++;
      //     }
      //   }
      // }

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
