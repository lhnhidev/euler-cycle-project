import type Graph from "@/libs/Graph";

export const LANGUAGE_OPTIONS = [
  {
    value: "cpp",
    label: "C++",
    pesudoCode(nodeStart: { id: string; label: string }) {
      return `{
  if (!isEulerianGraph()) return;

  Node startNode = ${nodeStart.label || "?"};
  stack<Node> st; st.push(startNode);
  vector<Node> tour;

  while (!st.empty()) {
    Node current = st.top();

    if (current.hasUnvisitedEdge()) {
      Edge e = current.getUnvisitedEdge();
      markEdgeAsVisited(e);
      Node u = e.getOtherNode(current); st.push(u);
    } else {
      st.pop();
      tour.push_back(current); }
  }
}`;
    },
  },
  {
    value: "vn",
    label: "Tiếng Việt",
    pesudoCode: (nodeStart: { id: string; label: string }) => `BẮT ĐẦU
  NẾU (KHÔNG THỎA ĐIỀU KIỆN EULER) THÌ KẾT THÚC

  ĐỈNH BẮT ĐẦU: BĐ ← Đỉnh ${nodeStart.label || "?"}
  KHỞI TẠO STACK ← [BĐ]
  KHỞI TẠO TOUR ← []

  TRONG KHI (STACK KHÔNG RỖNG) THÌ
    CURRENT ← ĐỈNH TRÊN CÙNG CỦA STACK

    NẾU (CURRENT CÓ CẠNH CHƯA ĐƯỢC THĂM) THÌ
      {CURRENT, U} ← LẤY CẠNH CHƯA ĐƯỢC THĂM
      ĐÁNH DẤU CẠNH {CURRENT, U} LÀ ĐÃ THĂM
      ĐẨY U VÀO STACK
    KHÔNG THÌ
      POP STACK
      THÊM CURRENT VÀO TOUR: TOUR ← TOUR ∪ {CURRENT}
  KẾT THÚC
KẾT THÚC`,
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
