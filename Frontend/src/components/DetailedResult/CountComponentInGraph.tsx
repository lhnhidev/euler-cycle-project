import { useGraphContext } from "@/context/GraphContext";
import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import CSSGraph from "@/libs/CSSGraph/CSSGraph";
import LayoutGraph from "@/libs/LayoutGraph";

const CountComponentInGraph = () => {
  const containerComponentRef = useRef<HTMLDivElement>(null);
  const { graph, isDirected } = useGraphContext();

  useEffect(() => {
    const connectedComponents = graph.current.getConnectedComponents();

    const components: {
      data: { id: string; label: string };
      classes: string;
    }[] = [];
    let index = 1;
    for (const value of Object.values(connectedComponents)) {
      const hasComponentId = components.find(
        (comp) => comp.data.id === value.componentId,
      );
      if (hasComponentId) {
        continue;
      }
      components.push({
        data: {
          id: value.componentId,
          label: `Thành phần ${index++}`,
        },
        classes: "parent-group",
      });
    }

    const nodeElements = [];
    for (const [key, value] of Object.entries(connectedComponents)) {
      nodeElements.push({
        data: { id: key, label: value.labelNode, parent: value.componentId },
      });
    }

    // const nodeElements = graph.current
    //   .getNodes()
    //   .map((node) => ({ data: { id: node.id } }));

    const edgeElements = graph.current.getEdges().map((edge) => ({
      data: { id: edge.id, source: edge.source, target: edge.target },
    }));

    const cy = cytoscape({
      container: containerComponentRef.current!,
      elements: [...components, ...nodeElements, ...edgeElements],
      style: CSSGraph(isDirected),
      layout: LayoutGraph(graph.current.getNumberOfNodes()),
    });

    console.log(cy);
  }, [graph, isDirected]);

  return (
    <div
      className="h-full w-full max-w-[550px] border border-[var(--secondary-color)] bg-gray-100"
      ref={containerComponentRef}
    ></div>
  );
};
export default CountComponentInGraph;
