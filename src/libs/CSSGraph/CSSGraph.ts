import type { StylesheetJson } from "cytoscape";

export const BG_COLOR_NODE = "#0074D9";
export const COLOR_NODE = "#fff";
export const COLOR_EDGE = "#aaa";
export const COLOR_TARGET_ARROW_EDGE = "#aaa";

export const COLOR_BORDER_CLICKED = "#00AFEF";
export const COLOR_NODE_CLICKED = "#000";

export const COLOR_EDGE_CLICKED = "#00AFEF";
export const COLOR_TARGET_ARROW_EDGE_CLICKED = "#00AFEF";

// Khi chay thuat toan
export const BG_COLOR_NODE_CHOOSED = "green";
export const COLOR_NODE_CHOOSED = "white";
export const BG_COLOR_NODE_STACKED = "pink";
export const COLOR_NODE_STACKED = "white";

export const COLOR_EDGE_CHOOSED = "yellow";
export const COLOR_EDGE_CHECKED = "red";

export const BG_COLOR_NODE_DELETED_STATE = "gray";
export const COLOR_NODE_DELETED_STATE = "white";

export const BG_COLOR_NODE_CYCLED = "brown";
export const COLOR_NODE_CYCLED = "white";

const CSSGraph = (isDirected: boolean): StylesheetJson => {
  return [
    {
      selector: "node",
      style: {
        "background-color": BG_COLOR_NODE,
        label: "data(label)",
        color: COLOR_NODE,
        "text-valign": "center",
        "text-halign": "center",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": COLOR_EDGE,
        "target-arrow-color": COLOR_TARGET_ARROW_EDGE,
        "target-arrow-shape": isDirected ? "triangle" : "none",
        "curve-style": "bezier",
      },
    },
    // Các trạng thái tạm thời khi đang chạy thuật toán — dùng class thay vì inline styles
    {
      selector: "node.algo-chosen",
      style: {
        "background-color": BG_COLOR_NODE_CHOOSED,
        color: COLOR_NODE_CHOOSED,
      },
    },
    {
      selector: "node.algo-stacked",
      style: {
        "background-color": BG_COLOR_NODE_STACKED,
        color: COLOR_NODE_STACKED,
      },
    },
    {
      selector: "node.algo-cycled",
      style: {
        "background-color": BG_COLOR_NODE_CYCLED,
        color: COLOR_NODE_CYCLED,
      },
    },
    {
      selector: "node.algo-deleted",
      style: {
        "background-color": BG_COLOR_NODE_DELETED_STATE,
        color: COLOR_NODE_DELETED_STATE,
      },
    },
    {
      selector: "edge.algo-edge-chosen",
      style: {
        "line-color": COLOR_EDGE_CHOOSED,
        "target-arrow-color": COLOR_EDGE_CHOOSED,
        width: 3,
      },
    },
    {
      selector: "edge.algo-edge-checked",
      style: {
        "line-color": COLOR_EDGE_CHECKED,
        "target-arrow-color": COLOR_EDGE_CHECKED,
        width: 3,
      },
    },
    {
      selector: "node:selected",
      style: {
        "background-color": "white",
        "border-color": `${COLOR_BORDER_CLICKED}`,
        "border-width": `${3}`,
        color: `${COLOR_NODE_CLICKED}`,
      },
    },
    // Khi chọn edge thì highlight
    {
      selector: "edge:selected",
      style: {
        "line-color": `${COLOR_EDGE_CLICKED}`,
        "target-arrow-color": `${COLOR_TARGET_ARROW_EDGE_CLICKED}`,
        width: `${4}`,
      },
    },
  ];
};
export default CSSGraph;
