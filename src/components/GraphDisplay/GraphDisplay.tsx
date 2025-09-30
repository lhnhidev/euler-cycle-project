import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";

const GraphDisplay = () => {
  const cyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cytoscape({
        container: cyRef.current,
        elements: [
          { data: { id: "a", label: "A" } },
          { data: { id: "b", label: "B" } },
          { data: { id: "ab", source: "a", target: "b" } },
        ],
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#0074D9",
              label: "data(label)",
              color: "#fff",
              "text-valign": "center",
              "text-halign": "center",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#aaa",
              "target-arrow-color": "#aaa",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
            },
          },
        ],
        layout: { name: "grid" }, // bố cục dạng lưới
      });

      return () => {
        cy.destroy(); // cleanup khi component unmount
      };
    }
  }, []);

  return <div className="h-full w-full bg-white" ref={cyRef}></div>;
};
export default GraphDisplay;
