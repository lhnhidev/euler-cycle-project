import type { StylesheetJson } from "cytoscape";

const CSSGraph = (isDirected: boolean): StylesheetJson => {
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
        "target-arrow-shape": isDirected ? "triangle" : "none",
        "curve-style": "bezier",
      },
    },
    {
      selector: "node:selected",
      style: {
        "background-color": "white",
        "border-color": "#00AFEF",
        "border-width": 3,
        color: "black",
      },
    },
    // Khi chọn edge thì highlight
    {
      selector: "edge:selected",
      style: {
        "line-color": "#00AFEF",
        "target-arrow-color": "#00AFEF",
        width: 4,
      },
    },
  ];
};
export default CSSGraph;
