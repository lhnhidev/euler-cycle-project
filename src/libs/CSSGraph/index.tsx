import type { StylesheetJson } from "cytoscape";

const CSSGraph = (): StylesheetJson => {
  return [
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
  ];
};
export default CSSGraph;
