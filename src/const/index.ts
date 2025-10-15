import type Graph from "@/libs/Graph";

export const LANGUAGE_OPTIONS = [
  {
    value: "cpp",
    label: "C++",
    pesudoCode(nodeStart: { id: string; label: string }) {
      return `BEGIN
  IF graph infeasible THEN END

  select start node: start ← node ${nodeStart.label || "?"}
  init stack ← [start]
  init tour ← []

  WHILE (stack is not empty) DO
    current ← top of stack

    IF (current has unvisited edge) THEN
      {current, u} ← take unvisited edge
      mark edge {current, u} as visited
      push u onto stack
    ELSE
      pop stack
      append current to tour: tour ← tour ∪ {current}
  END WHILE
END`;
    },
  },
  {
    value: "vn",
    label: "Tiếng Việt",
    pesudoCode: (nodeStart: { id: string; label: string }) => `BEGIN
  IF đồ_thị_không_thoả_điều_kiện_Euler THEN END

  chọn đỉnh bắt đầu: start ← node ${nodeStart.label || "?"}
  khởi tạo stack ← [start]
  khởi tạo tour ← []

  WHILE (stack không rỗng) DO
    current ← đỉnh trên cùng của stack

    IF (current có cạnh chưa được thăm) THEN
      {current, u} ← lấy cạnh chưa được thăm
      đánh dấu cạnh {current, u} là đã thăm
      đẩy u vào stack
    ELSE
      pop stack
      thêm current vào tour: tour ← tour ∪ {current}
  END WHILE
END`,
  },
  {
    value: "en",
    label: "English",
    pesudoCode: (nodeStart: { id: string; label: string }) => `BEGIN
  IF graph infeasible THEN END

  select start node: start ← node ${nodeStart.label || "?"}
  init stack ← [start]
  init tour ← []

  WHILE (stack is not empty) DO
    current ← top of stack

    IF (current has unvisited edge) THEN
      {current, u} ← take unvisited edge
      mark edge {current, u} as visited
      push u onto stack
    ELSE
      pop stack
      append current to tour: tour ← tour ∪ {current}
  END WHILE
END`,
  },
];

export const ACTION_OPTIONS = {
  nothing: (graph?: Graph, id?: string, color?: string) => {
    if (!graph || !id || !color) return;
    else return;
  },
  colorEdge: (graph: Graph, idEdge: string, color: string) => {
    graph.getCore()?.getElementById(idEdge)?.style("line-color", color);
  },
  colorNode: (graph: Graph, idNode: string, color: string) => {
    graph.getCore()?.getElementById(idNode)?.style("background-color", color);
  },
  colorLabel: (graph: Graph, idNode: string, color: string) => {
    graph.getCore()?.getElementById(idNode)?.style("color", color);
  },
  colorLine: () => {},
};
