import cytoscape from "cytoscape";
import CSSGraph from "./CSSGraph";
import LayoutGraph from "./LayoutGraph";
import dblclick from "cytoscape-dblclick";
import MySet from "./data-structures/MySet";
import MyStack from "./data-structures/MyStack";
import {
  BG_COLOR_NODE,
  BG_COLOR_NODE_CHOOSED,
  BG_COLOR_NODE_CYCLED,
  BG_COLOR_NODE_DELETED_STATE,
  BG_COLOR_NODE_STACKED,
  COLOR_EDGE,
  COLOR_EDGE_CHECKED,
  COLOR_EDGE_CHOOSED,
  COLOR_NODE,
  COLOR_NODE_CHOOSED,
  COLOR_NODE_CYCLED,
  COLOR_NODE_DELETED_STATE,
  COLOR_NODE_STACKED,
} from "./CSSGraph/CSSGraph";

cytoscape.use(dblclick);

type Listener = () => void;

export type DetailSteps = {
  step: number;
  colorLine: number;
  // action?: () => void;
  nodes: { id: string; label: string; bgColor: string; color: string }[];
  edges: {
    id: string;
    sourceId: string;
    targetId: string;
    color: string;
  }[];
};

type GraphCopy = {
  numberOfNodes: number;
  isDirected: boolean;
  nodes: { id: string; label: string }[];
  edges: { id: string; source: string; target: string }[];
  adj: { [key: string]: MySet<string> };
};

export default class Graph {
  private cy: cytoscape.Core | null = null;
  private numberOfNodes: number = 0;
  private isDirected: boolean = true;
  private nodes: { id: string; label: string }[];
  private edges: { source: string; target: string; id: string }[];
  private _keydownHandler?: (e: KeyboardEvent) => void;
  private isChangeingLabelMode: boolean = false;
  private listeners: Listener[] = [];
  private adj: { [key: string]: MySet<string> } = {};

  public onChange?: () => void;

  setOnChange(callback: () => void) {
    this.onChange = callback;
  }

  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  getAdjacencyList() {
    return this.adj;
  }

  buildAdjacencyList() {
    const listEdges = this.getEdges();

    for (let i = 0; i < listEdges.length; i++) {
      const sourceId = listEdges[i].source;
      const targetId = listEdges[i].target;

      if (this.isDirected) {
        this.adj[sourceId] = this.adj[sourceId] || new MySet<number>();
        this.adj[sourceId].add(targetId);
      } else {
        this.adj[sourceId] = this.adj[sourceId] || new MySet<number>();
        this.adj[targetId] = this.adj[targetId] || new MySet<number>();
        this.adj[sourceId].add(targetId);
        this.adj[targetId].add(sourceId);
      }
    }
  }

  clearAdjacencyList() {
    this.adj = {};
  }

  getCore() {
    return this.cy;
  }

  getNodeIdByLabel(label: string) {
    return this.nodes.find((node) => node.label === label)?.id;
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  addNode(id: string, label: string, isShameLabel: boolean = true): boolean {
    if (this.nodes.find((node) => node.id === id)) {
      console.log(`Nút với id là ${id} đã tồn tại`);
      return false;
    }

    if (!isShameLabel) {
      if (this.nodes.find((node) => node.label === label)) {
        console.log(`Nút với label là ${label} đã tồn tại`);
        return false;
      }
    }

    this.setNumberOfNodes(this.numberOfNodes + 1);
    this.notify();
    this.nodes.push({ id, label });
    this.onChange?.();
    return true;
  }

  removeNode(id: string): boolean {
    const nodeIndex = this.nodes.findIndex((node) => node.id === id);
    if (nodeIndex === -1) {
      console.log(`Nút có id là ${id} không tồn tại.`);
      return false;
    }

    // Xóa tất cả các cạnh liên quan đến nút này
    this.edges = this.edges.filter(
      (edge) => edge.source !== id && edge.target !== id,
    );

    this.nodes.splice(nodeIndex, 1);
    this.notify();
    this.setNumberOfNodes(this.numberOfNodes - 1);
    this.onChange?.();
    return true;
  }

  changeLabelNode(id: string, newLabel: string): boolean {
    const node = this.nodes.find((node) => node.id === id);
    if (!node) {
      console.log(`Nút có id là ${id} không tồn tại.`);
      return false;
    }

    // if (this.nodes.find((node) => node.label === newLabel)) {
    //   console.log(`Nút với label là ${newLabel} đã tồn tại.`);
    //   return false;
    // }

    node.label = newLabel;
    this.notify();
    return true;
  }

  addEdge(sourceId: string, targetId: string, idEdge: string): boolean {
    // Nút nguồn và đích phải tồn tại

    if (!this.nodes.find((node) => node.id === sourceId)) {
      console.log(`Nút có id là ${sourceId} không tồn tại.`);
      return false;
    }

    if (!this.nodes.find((node) => node.id === targetId)) {
      console.log(`Nút có id là ${targetId} không tồn tại.`);
      return false;
    }
    //

    this.edges.push({ source: sourceId, target: targetId, id: idEdge });
    this.notify();
    this.onChange?.();
    return true;
  }

  removeEdge(sourceId: string, targetId: string): boolean {
    const edgeIndex = this.edges.findIndex(
      (edge) => edge.source === sourceId && edge.target === targetId,
    );

    if (edgeIndex === -1) {
      console.log(`Cạnh từ ${sourceId} đến ${targetId} không tồn tại.`);
      return false;
    }

    this.edges.splice(edgeIndex, 1);
    this.notify();
    this.onChange?.();
    return true;
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }

  getNumberOfNodes() {
    return this.numberOfNodes;
  }

  getNumberOfEdges() {
    return this.edges.length;
  }

  setNumberOfNodes(count: number): boolean {
    if (count < 0) {
      console.log("Số lượng nút không thể âm");
      return false;
    }
    this.numberOfNodes = count;
    // this.notify();
    return true;
  }

  getIsDirected() {
    return this.isDirected;
  }

  setIsDirected(isDirected: boolean) {
    this.isDirected = isDirected;

    if (this.cy) {
      this.cy.edges().forEach((edge) => {
        edge.style("target-arrow-shape", this.isDirected ? "triangle" : "none");
      });
    }
  }

  clear() {
    this.setNumberOfNodes(0);
    this.nodes = [];
    this.edges = [];
    // this.notify();
  }

  formatGraph(
    bgColorNode: string,
    colorLabel: string,
    colorEdge: string,
    targetArrowColor: string,
    nodeSize: number,
    // edgeLength: number,
  ) {
    if (!this.cy) return;
    this.cy
      .style()
      .fromJson(
        CSSGraph(
          this.getIsDirected(),
          bgColorNode,
          colorLabel,
          colorEdge,
          targetArrowColor,
          nodeSize,
        ),
      )
      .update();
  }

  display(container: HTMLDivElement, isRandom = false): () => void {
    if (this.cy) {
      this.cy!.dblclick(200);
    }

    if (!container) {
      console.log("Container không hợp lệ");
      throw new Error("Container không hợp lệ");
    }

    const nodeElements = this.nodes.map((node) => {
      return {
        data: { id: node.id, label: node.label },
      };
    });

    const edgeElements = this.edges.map((edge) => {
      return {
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
        },
      };
    });

    if (!this.cy || isRandom) {
      this.cy = cytoscape({
        container,
        elements: [...nodeElements, ...edgeElements],
        style: CSSGraph(this.getIsDirected()),
        layout: LayoutGraph(this.getNumberOfNodes()),
      });
    } else {
      console.log("Cytoscape đã được khởi tạo, cập nhật lại đồ thị.");
      if (this.cy) {
        this.cy.edges().forEach((edge) => {
          edge.style(
            "target-arrow-shape",
            this.getIsDirected() ? "triangle" : "none",
          );
        });
      }
    }

    return () => {
      if (this.cy) {
        this.cy.destroy();
        this.cy = null;
      }
    };
  }

  // Xóa node khi chọn và nhấn Delete/Backspace
  deleteSelectedNode() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (this.isChangeingLabelMode) return;
        const selectedNodes = this.cy!.$("node:selected");
        if (selectedNodes.nonempty()) {
          selectedNodes.remove();
          const selectedIds = selectedNodes.map((n) => n.id());
          selectedIds.forEach((id) => this.removeNode(id));
          // console.log(this.nodes);
          // console.log(this.edges);
          console.log(
            "Đã xóa node:",
            selectedNodes.map((n) => n.id()),
          );
        }
      }
    });
  }

  // Xóa edge khi chọn và nhấn Delete/Backspace
  deleteSelectedEdge() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedEdges = this.cy!.$("edge:selected");
        if (selectedEdges.nonempty()) {
          selectedEdges.remove();
          const selectedIds = selectedEdges.map((n) => {
            const edge = n as cytoscape.EdgeSingular;

            // const sourceId = edge.source().id();
            // const targetId = edge.target().id();

            // this.cy!.remove(
            //   `edge[source = "${sourceId}"][target = "${targetId}"]`,
            // );

            return {
              sourceId: edge.source().id(),
              targetId: edge.target().id(),
            };
          });
          selectedIds.forEach((id) =>
            this.removeEdge(id.sourceId, id.targetId),
          );
          // console.log(this.nodes);
          console.log(this.getEdges());
          console.log(
            "Đã xóa edge:",
            selectedEdges.map((e) => e.id()),
          );
        }
      }
    });
  }

  addNodeByClick(screen: HTMLDivElement) {
    if (!this.cy) return;

    this.cy.on("cxttap", (event) => {
      const { x, y } = event.position;
      const renderedPos = event.renderedPosition;
      const nodeId = `${crypto.randomUUID()}`;
      // const nodeId = (this.cy!.elements().length + 1).toString();

      // Thêm node mới với label tạm
      this.cy!.add({ data: { id: nodeId, label: "" }, position: { x, y } });

      // Tạo input HTML để nhập label
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "absolute";
      input.style.top = `${renderedPos.y}px`;
      input.style.left = `${renderedPos.x}px`;
      input.style.transform = "translate(-50%, -50%)";
      input.style.zIndex = "999";
      input.style.width = `${this.cy!.getElementById(nodeId).renderedWidth()}px`;
      input.style.height = `${this.cy!.getElementById(nodeId).renderedHeight()}px`;
      input.style.background = "transparent";
      input.style.border = "none";
      input.style.outline = "none";
      input.style.textAlign = "center";
      input.style.lineHeight = input.style.height;
      input.style.fontFamily =
        this.cy!.getElementById(nodeId).style("font-family");
      input.style.fontSize = `${parseFloat(this.cy!.getElementById(nodeId).style("font-size")) * this.cy!.zoom()}px`;
      input.style.color = "white";

      screen.appendChild(input);
      input.focus();

      const removeInput = () => {
        if (screen.contains(input)) {
          screen.removeChild(input);
        }
      };

      // Khi nhấn Enter hoặc rời khỏi input, cập nhật label
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;

        // const value = input.value.trim()[0]?.toUpperCase() || "";
        const value = input.value.trim()?.toUpperCase() || "";
        if (value) {
          const node = this.cy!.getElementById(nodeId);
          node.data("label", value);
          // this.addNode(`${value}-${Date.now()}`, value);
          this.addNode(nodeId, value);
        } else {
          this.cy!.getElementById(nodeId).remove();
        }

        removeInput();
        this.cy!.off("zoom", zoomHandler);
      };

      input.addEventListener("blur", finish);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Escape" || e.key === "Tab")
          finish();
      });

      const zoomHandler = () => finish();
      this.cy!.on("zoom", zoomHandler);
    });
  }

  changeLabelNodeByClick(screen: HTMLDivElement) {
    if (!this.cy) return;
    let isChangeLabelMode = false;

    document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "r" && e.ctrlKey) {
        isChangeLabelMode = !isChangeLabelMode;
      }
    });

    this.cy.on("tap", "node", (event) => {
      const node = event.target;
      if (this._keydownHandler) {
        document.removeEventListener("keydown", this._keydownHandler);
        this._keydownHandler = undefined;
      }

      this._keydownHandler = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key.toLowerCase() === "r") {
          e.preventDefault();
          console.log("Bật/tắt chế độ đổi label cho node:", node.id());
          this.isChangeingLabelMode = true;

          // --- thực hiện logic đổi label ở đây ---
          const renderedPos = node.renderedPosition();

          // Tạo input HTML để nhập label
          const input = document.createElement("input");
          input.type = "text";
          input.value = node.data("label");
          node.data("label", "");
          input.style.position = "absolute";
          input.style.top = `${renderedPos.y}px`;
          input.style.left = `${renderedPos.x}px`;
          input.style.transform = "translate(-50%, -50%)";
          input.style.zIndex = "999";
          input.style.width = `${node.renderedWidth()}px`;
          input.style.height = `${node.renderedHeight()}px`;
          input.style.background = "transparent";
          input.style.border = "none";
          input.style.outline = "none";
          input.style.textAlign = "center";
          input.style.lineHeight = input.style.height;
          input.style.fontFamily = node.style("font-family");
          input.style.fontSize = `${parseFloat(node.style("font-size")) * this.cy!.zoom()}px`;
          input.style.color = "black";

          screen.appendChild(input);
          input.focus();

          let finished = false;

          const finish = () => {
            if (finished) return;
            finished = true;
            // const value = input.value.trim()[0]?.toUpperCase() || "";
            const value = input.value.trim()?.toUpperCase() || "";
            if (value) {
              node.data("label", value);
              this.changeLabelNode(node.id(), value);
            } else {
              node.remove();
            }

            this.isChangeingLabelMode = false;

            // console.log(this.getNodes());

            this.notify();
            if (screen && input && input.parentNode === screen) {
              if (screen.contains(input)) {
                screen.removeChild(input);
              }
            }
            this.cy!.off("zoom", zoomHandler);
            isChangeLabelMode = false;
          };

          input.addEventListener("blur", finish);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === "Escape" || e.key === "Tab")
              finish();
          });

          const zoomHandler = () => finish();
          this.cy!.on("zoom", zoomHandler);

          // remove handler
          if (this._keydownHandler) {
            document.removeEventListener("keydown", this._keydownHandler);
            this._keydownHandler = undefined;
          }
        }
      };

      document.addEventListener("keydown", this._keydownHandler);
    });
  }

  addEdgeByClick() {
    let sourceNode: cytoscape.NodeSingular | null = null;
    let targetNode: cytoscape.NodeSingular | null = null;
    let tempEdge: cytoscape.EdgeSingular | null = null;
    let isAddingEdge: boolean = false;
    let ghostNode: cytoscape.NodeSingular | null = null;

    document.addEventListener("keydown", (e) => {
      if (e.key.toLocaleLowerCase() === "e" && e.ctrlKey) {
        sourceNode = null;
        targetNode = null;
        tempEdge = null;
        if (ghostNode) {
          ghostNode!.remove();
        }
        isAddingEdge = !isAddingEdge;
      }
    });

    this.cy!.on("tap", "node", (event) => {
      if (!isAddingEdge) return;

      if (!sourceNode) {
        sourceNode = event.target;
        console.log("Bắt đầu thêm cạnh từ nút:", sourceNode!.id());
        // tạo ghost node tạm
        ghostNode = this.cy!.getElementById("ghost");
        if (ghostNode.empty()) {
          ghostNode = this.cy!.add({
            group: "nodes",
            data: { id: "ghost" },
            position: event.position,
            selectable: false,
            grabbable: false,
          });
          ghostNode.style({
            opacity: 0,
            width: 1,
            height: 1,
            position: "absolute",
            "z-index": "-1",
          });
        }

        // tạo edge tạm
        tempEdge = this.cy!.add({
          group: "edges",
          data: {
            id: `tempEdge-${sourceNode!.id()}-${ghostNode.id()}`,
            source: sourceNode!.id(),
            target: ghostNode.id(),
          },
          selectable: false,
          grabbable: false,
        });

        tempEdge.style({
          "target-arrow-shape": this.isDirected ? "triangle" : "none",
          "curve-style": "bezier",
        });
      } else {
        console.log(this.nodes);
        console.log(sourceNode!.id());
        if (!this.nodes.find((node) => node.id === sourceNode!.id())) {
          sourceNode = event.target;
          if (tempEdge) tempEdge.remove();
          if (this.cy!.getElementById("ghost").nonempty())
            this.cy!.getElementById("ghost").remove();
          const ghostNode = this.cy!.add({
            group: "nodes",
            data: { id: "ghost" },
            position: event.position,
            selectable: false,
            grabbable: false,
          });
          ghostNode.style({
            opacity: 0,
            width: 1,
            height: 1,
            position: "absolute",
            "z-index": "-1",
          });
          tempEdge = this.cy!.add({
            group: "edges",
            data: {
              id: `tempEdge-${sourceNode!.id()}-${ghostNode.id()}`,
              source: sourceNode!.id(),
              target: ghostNode.id(),
            },
            selectable: false,
            grabbable: false,
          });

          tempEdge.style({
            "target-arrow-shape": this.isDirected ? "triangle" : "none",
            "curve-style": "bezier",
          });
          console.log("Nút nguồn không còn tồn tại, hủy thao tác thêm cạnh.");
          return;
        }

        targetNode = event.target;
        console.log("Kết thúc thêm cạnh đến nút:", targetNode!.id());

        if (targetNode?.id() === "ghost") {
          console.log("Không thể kết nối đến ghost node.");
          // reset state
          this.cy!.getElementById("ghost").remove();
          if (tempEdge) tempEdge.remove();
          sourceNode = null;
          return;
        }

        // if (targetNode!.id() !== sourceNode.id()) {
        // }
        const idEdge = `${sourceNode.id()}-${targetNode!.id()}-${crypto.randomUUID()}`;

        const newEdge = this.cy!.add({
          group: "edges",
          data: {
            id: idEdge,
            source: sourceNode.id(),
            target: targetNode!.id(),
          },
        });

        newEdge.style({
          "target-arrow-shape": this.isDirected ? "triangle" : "none",
          "curve-style": "bezier",
        });

        this.addEdge(sourceNode.id(), targetNode!.id(), idEdge);
        console.log(`Tạo cạnh: ${sourceNode.id()} -> ${targetNode!.id()}`);

        // reset state
        this.cy!.getElementById("ghost").remove();
        if (tempEdge) tempEdge.remove();
        sourceNode = null;
      }
    });

    this.cy!.on("mousemove", (event) => {
      if (!isAddingEdge || !sourceNode) return;

      const ghostNode = this.cy!.getElementById("ghost");
      if (!ghostNode.empty()) {
        ghostNode.position(event.position);
      }
    });
  }

  randomGraph(container: HTMLDivElement) {
    this.clear();
    const randomNumber = Math.round(Math.random());
    const amountOfNodes = Math.floor(Math.random() * 6) + 5; // từ 5 đến 10
    let nodeLabels: string[] = [];

    // Khởi tạo label cho các node dựa vào randomNumber là gì (số hay chữ)
    if (randomNumber === 0) {
      // Node là số
      nodeLabels = Array.from({ length: amountOfNodes }, (_, i) =>
        (i + 1).toString(),
      );
    } else {
      // Node là chữ
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      nodeLabels = Array.from(
        { length: amountOfNodes },
        (_, i) => alphabet[i % alphabet.length],
      );
    }

    // Thêm node
    nodeLabels.forEach((label, idx) => {
      this.addNode(idx.toString(), label);
    });

    // Random cạnh
    const maxEdges =
      (amountOfNodes * (amountOfNodes - (this.isDirected ? 1 : 2))) /
      (this.isDirected ? 1 : 2);
    const amountOfEdges =
      Math.floor(Math.random() * (maxEdges - amountOfNodes + 1)) +
      amountOfNodes;

    const edgeSet = new Set<string>();
    while (edgeSet.size < amountOfEdges) {
      const sourceIdx = Math.floor(Math.random() * amountOfNodes);
      const targetIdx = Math.floor(Math.random() * amountOfNodes);

      // console.log("random cạnh: src - tar", sourceIdx, targetIdx);
      // Không nối cạnh vào chính đỉnh đó (đồ thị random sẽ không có cung)
      if (sourceIdx === targetIdx) continue;
      const edgeKey = this.isDirected
        ? `${sourceIdx}-${targetIdx}-${crypto.randomUUID()}`
        : [...[sourceIdx, targetIdx].sort(), `${crypto.randomUUID()}`].join(
            "-",
          );
      if (edgeSet.has(edgeKey)) continue;
      edgeSet.add(edgeKey);
      this.addEdge(sourceIdx.toString(), targetIdx.toString(), edgeKey);
    }

    this.display(container, true);
    this.addNodeByClick(container);
    this.addEdgeByClick();
    this.changeLabelNodeByClick(container);
    this.deleteSelectedNode();
    this.deleteSelectedEdge();
    this.onChange?.();
  }

  private marked: { [key: string]: boolean } = {};
  private degree: { [key: string]: number } = {};
  private degIn: { [key: string]: number } = {};
  private degOut: { [key: string]: number } = {};

  getDegIn() {
    return this.degIn;
  }

  getDegOut() {
    return this.degOut;
  }

  getDegree() {
    return this.degree;
  }

  private buildDegree() {
    this.getNodes().forEach((node) => {
      this.degree[node.id] = 0;
      this.degIn[node.id] = 0;
      this.degOut[node.id] = 0;
    });

    if (this.isDirected) {
      this.getEdges().forEach((edge) => {
        this.degOut[edge.source] = (this.degOut[edge.source] || 0) + 1;
        this.degIn[edge.target] = (this.degIn[edge.target] || 0) + 1;
      });
    } else {
      this.getEdges().forEach((edge) => {
        this.degree[edge.source] = (this.degree[edge.source] || 0) + 1;
        this.degree[edge.target] = (this.degree[edge.target] || 0) + 1;
      });
    }
  }

  private clearDegree() {
    this.degree = {};
  }

  private clearDegIn() {
    this.degIn = {};
  }

  private clearDegOut() {
    this.degOut = {};
  }

  private clearMarked() {
    this.marked = {};
  }

  private clearNum() {
    this.num = {};
  }

  private clearMinNum() {
    this.minNum = {};
  }

  private buildMarked() {
    this.getNodes().forEach((node) => (this.marked[node.id] = false));
  }

  private buildNum() {
    this.getNodes().forEach((node) => (this.num[node.id] = -1));
  }

  private buildMinNum() {
    this.getNodes().forEach((node) => (this.minNum[node.id] = 0));
  }

  private buildVisitedEdges() {
    this.getEdges().forEach((edge) => {
      this.edgeVisited[edge.id] = false;
    });
  }

  private init() {
    this.clearMarked();
    this.buildMarked();
    this.clearNum();
    this.buildNum();
    this.clearMinNum();
    this.buildMinNum();
    this.clearAdjacencyList();
    this.buildAdjacencyList();
    this.clearDegree();
    this.clearDegIn();
    this.clearDegOut();
    this.buildDegree();

    this.buildVisitedEdges();
  }

  dfsStack(startId: string) {
    const st = new MyStack<string>();

    st.push(startId);
    while (!st.isEmpty()) {
      const u: string = st.top()!;
      st.pop();

      if (this.marked[u]) continue;
      this.marked[u] = true;

      const neighbors: string[] = this.adj[u]?.values() || [];

      for (let i = neighbors.length - 1; i >= 0; i--) {
        const v = neighbors[i];
        if (!this.marked[v]) {
          st.push(v);
        }
      }
    }
  }

  private k: number = 1;
  private stScc: MyStack<string> = new MyStack<string>();
  private onStack: { [key: string]: boolean } = {};
  private num: { [key: string]: number } = {};
  private minNum: { [key: string]: number } = {};
  private sccCount: number = 0;

  scc(startId: string) {
    this.num[startId] = this.minNum[startId] = this.k;

    this.k++;
    this.stScc.push(startId);
    this.onStack[startId] = true;

    const neighbors: string[] = this.adj[startId]?.values() || [];

    for (let v = 0; v < neighbors.length; v++) {
      const endId = neighbors[v];
      if (this.num[endId] === -1) {
        this.scc(endId);
        this.minNum[startId] = Math.min(
          this.minNum[startId],
          this.minNum[endId],
        );
      } else if (this.onStack[endId]) {
        this.minNum[startId] = Math.min(this.minNum[startId], this.num[endId]);
      }
    }

    if (this.num[startId] === this.minNum[startId]) {
      let w: string;
      do {
        w = this.stScc.pop()!;
        this.onStack[w] = false;
      } while (w !== startId);
      this.sccCount++;
    }
  }

  countComponents(): number {
    this.init(); // reset toàn bộ graph trước khi chạy

    this.k = 1;
    this.stScc.clear();
    this.onStack = {};
    this.sccCount = 0;

    let count = 0;

    if (!this.isDirected) {
      for (const node of this.getNodes()) {
        if (!this.marked[node.id]) {
          count++;
          this.dfsStack(node.id);
        }
      }
    } else {
      for (const node of this.getNodes()) {
        if (this.num[node.id] === -1) {
          this.scc(node.id);
        }
      }
      count = this.sccCount;
    }

    return count;
  }

  isEulerGraph(): boolean {
    this.init(); // reset toàn bộ graph trước khi chạy
    const components = this.countComponents();

    if (components > 1) return false;

    for (const node of this.getNodes()) {
      if (this.isDirected) {
        const outDeg = this.degOut[node.id] || 0;
        const inDeg = this.degIn[node.id] || 0;

        if (outDeg !== inDeg) return false;
      } else {
        const deg = this.degree[node.id] || 0;
        if (deg % 2 !== 0) return false;
      }
    }

    return true;
  }

  hasEulerPath(): boolean {
    this.init();
    if (this.isEulerGraph()) return true;

    const components = this.countComponents();
    if (components > 1) return false;

    if (!this.isDirected) {
      let countNodeHaveOddDegree = 0;
      for (const node of this.getNodes()) {
        const deg = this.degree[node.id] || 0;
        if (deg % 2 !== 0) ++countNodeHaveOddDegree;

        if (countNodeHaveOddDegree > 2) return false;
      }
      return countNodeHaveOddDegree === 2;
    } else {
      let startNode = 0;
      let endNode = 0;
      for (const node of this.getNodes()) {
        const outDeg = this.degOut[node.id] || 0;
        const inDeg = this.degIn[node.id] || 0;

        if (outDeg - inDeg === 1) ++startNode;
        else if (inDeg - outDeg === 1) ++endNode;
        else if (inDeg !== outDeg) return false;

        if (startNode > 1 || endNode > 1) return false;
      }
    }

    return true;
  }

  private edgeVisited: { [key: string]: boolean } = {};

  buildEulerCycle(startId: string): {
    steps: number;
    detailSteps: DetailSteps[];
    circuit: { id: string; label: string }[];
  } {
    this.init();

    if (!this.getNodes().find((node) => node.id === startId)) {
      console.log(`Nút có id là ${startId} không tồn tại trong đồ thị.`);
      return {
        steps: 0,
        detailSteps: [],
        circuit: [],
      };
    }

    const graphCopy: GraphCopy = {
      numberOfNodes: this.numberOfNodes,
      isDirected: this.isDirected,
      nodes: this.getNodes().map((node) => ({
        id: node.id,
        label: node.label,
      })),
      edges: this.getEdges().map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
      adj: { ...this.adj },
    };

    const countStepInit = 3;

    const resetNodeGraph = () => {
      return this.getNodes().map((node) => ({
        id: node.id,
        label: node.label,
        bgColor: BG_COLOR_NODE,
        color: COLOR_NODE,
      }));
    };

    const resetEdgeGraph = () => {
      return this.getEdges().map((edge) => ({
        id: edge.id,
        sourceId: edge.source,
        targetId: edge.target,
        color: COLOR_EDGE,
      }));
    };

    const copyPrevNodesAndEdges = (
      detailSteps: DetailSteps[],
      step: number,
      colorLine: number,
    ) => {
      // Deep-clone nodes and edges from the previous step so subsequent
      // modifications don't mutate earlier steps (was using shared refs).
      const prev = detailSteps[detailSteps.length - 1];
      detailSteps.push({
        step,
        colorLine,
        nodes: prev.nodes.map((n) => ({
          id: n.id,
          label: n.label,
          bgColor: n.bgColor,
          color: n.color,
        })),
        edges: prev.edges.map((e) => ({
          id: e.id,
          sourceId: e.sourceId,
          targetId: e.targetId,
          color: e.color,
        })),
      });
    };

    const buildNextStep = (
      detailSteps: DetailSteps[],
      step: number,
      idNodes: (string | number)[],
      idEdges: (string | number)[],
      bgColorNode: string[],
      colorNode: string[],
      colorEdge: string[],
    ) => {
      idNodes.forEach((id, idx) => {
        detailSteps[step - 1].nodes.forEach((node) => {
          if (node.id === id.toString()) {
            node.bgColor = bgColorNode[idx];
            node.color = colorNode[idx];
          }
        });
      });

      idEdges.forEach((id, idx) => {
        detailSteps[step - 1].edges.forEach((edge) => {
          if (edge.id === id.toString()) {
            edge.color = colorEdge[idx];
          }
        });
      });
    };

    if (!this.isEulerGraph()) {
      return {
        steps: countStepInit,
        detailSteps: [1, 2, 3].map((step) => ({
          step,
          colorLine: step === 3 ? 19 : step,
          nodes: resetNodeGraph(),
          edges: resetEdgeGraph(),
        })),
        circuit: [],
      };
    }

    // Những dòng sẽ chắc chắn tô màu
    const colorLineInit = [1, 2, 4, 5, 6, 8];
    const detailSteps: DetailSteps[] = [];
    for (let i = 1; i <= 6; i++) {
      detailSteps.push({
        step: i,
        colorLine: colorLineInit[i - 1],
        nodes: resetNodeGraph(),
        edges: resetEdgeGraph(),
      });

      switch (i) {
        case 3:
          detailSteps[detailSteps.length - 1].nodes.forEach((node) => {
            if (node.id === startId) {
              node.bgColor = BG_COLOR_NODE_CHOOSED;
              node.color = COLOR_NODE_CHOOSED;
            }
          });
          break;
        case 4:
          // bg hồng, color trắng
          detailSteps[detailSteps.length - 1].nodes.forEach((node) => {
            if (node.id === startId) {
              node.bgColor = BG_COLOR_NODE_STACKED;
              node.color = COLOR_NODE_STACKED;
            }
          });
          break;
        case 5:
          break;
        case 6:
          break;
      }
    }

    const stack: MyStack<string> = new MyStack<string>();
    stack.push(startId);

    const circuit: { id: string; label: string }[] = [];

    let i = 6;
    // console.log("trước khi bắt đầu white", detailSteps);
    // throw new Error("Debugging");

    const getEdgeId = (u: string, v: string): string | null => {
      for (const edge of graphCopy.edges) {
        if (this.edgeVisited[edge.id] === false) {
          if (edge.source === u && edge.target === v) return edge.id;
          if (!graphCopy.isDirected) {
            if (edge.source === v && edge.target === u) return edge.id;
          }
        }
      }
      return null;
    };

    while (!stack.isEmpty()) {
      // lấy đỉnh u trong stacck ra duyệt
      copyPrevNodesAndEdges(detailSteps, ++i, 9);
      buildNextStep(
        detailSteps,
        i,
        [stack.top()!],
        [],
        [BG_COLOR_NODE_CHOOSED],
        [COLOR_NODE],
        [],
      );
      // console.log(detailSteps);
      // throw new Error("Debugging");

      copyPrevNodesAndEdges(detailSteps, ++i, 11);
      buildNextStep(detailSteps, i, [], [], [], [], []);
      const u = stack.top()!;

      if (graphCopy.adj[u].size() > 0) {
        // v là đỉnh kề, lấy cạnh kề {u, v} và css
        copyPrevNodesAndEdges(detailSteps, ++i, 12);
        const v = graphCopy.adj[u].values()[0];
        const edge = getEdgeId(u, v);
        buildNextStep(
          detailSteps,
          i,
          [],
          [edge!],
          [],
          [],
          [COLOR_EDGE_CHOOSED],
        );
        // console.log(detailSteps);
        // throw new Error("Debugging");

        // đánh dấu cạnh {u, v} đã đi qua
        this.edgeVisited[edge!] = true;
        copyPrevNodesAndEdges(detailSteps, ++i, 13);
        buildNextStep(
          detailSteps,
          i,
          [u],
          [edge!],
          [BG_COLOR_NODE],
          [COLOR_NODE],
          [COLOR_EDGE_CHECKED],
        );

        // Thêm v vào stack
        copyPrevNodesAndEdges(detailSteps, ++i, 14);
        stack.push(v);
        buildNextStep(
          detailSteps,
          i,
          [v],
          [],
          [BG_COLOR_NODE_STACKED],
          [COLOR_NODE_STACKED],
          [],
        );

        if (graphCopy.isDirected) {
          graphCopy.adj[u].delete(v);
        } else {
          graphCopy.adj[u].delete(v);
          graphCopy.adj[v].delete(u);
        }
      } else {
        // Tô màu dòng else
        copyPrevNodesAndEdges(detailSteps, ++i, 15);
        buildNextStep(detailSteps, i, [], [], [], [], []);

        // Xóa u khỏi stack
        copyPrevNodesAndEdges(detailSteps, ++i, 16);
        stack.pop();
        buildNextStep(
          detailSteps,
          i,
          [u],
          [],
          [BG_COLOR_NODE_DELETED_STATE],
          [COLOR_NODE_DELETED_STATE],
          [],
        );

        // Thêm đỉnh u vào chu trình
        copyPrevNodesAndEdges(detailSteps, ++i, 17);
        circuit.push({
          id: u,
          label: this.nodes.find((node) => node.id === u)?.label || "",
        });
        buildNextStep(
          detailSteps,
          i,
          [u],
          [],
          [BG_COLOR_NODE_CYCLED],
          [COLOR_NODE_CYCLED],
          [],
        );
      }

      // console.log("sau khi white 1 lần", detailSteps);
      // throw new Error("Debugging");

      // Kết thúc vòng lặp while
      if (stack.isEmpty()) {
        copyPrevNodesAndEdges(detailSteps, ++i, 18);
        buildNextStep(detailSteps, ++i, [], [], [], [], []);
      }
    }
    console.log("Hoàn thành xây dựng chu trình Euler.");
    copyPrevNodesAndEdges(detailSteps, ++i, 19);
    console.log("detailSteps:", detailSteps);

    return {
      steps: detailSteps.length,
      detailSteps,
      circuit: circuit.reverse(),
    };
  }
}
