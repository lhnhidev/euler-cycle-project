/* eslint-disable no-unexpected-multiline */
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
  row: number | null;
  col: number | null;
};

type GraphCopy = {
  numberOfNodes: number;
  isDirected: boolean;
  nodes: { id: string; label: string }[];
  edges: { id: string; source: string; target: string }[];
  adj: { [key: string]: MySet<string> };
};

export type TableSteps = {
  row: number;
  currentNode: string;
  edgeMoved: {
    source: string;
    target: string;
  } | null;
  stack: string[];
  tempCircuit: string[];
  stackPrevious: string[];
  listEdge: { source: string; target: string; isMoved: boolean }[];
  pushOrPopStack: "push" | "pop" | "none";
  note: string[];
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

  displayByFile(
    container: HTMLDivElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    setIsDirectedFunc: (isDirected: boolean) => void,
  ) {
    if (!container) {
      console.error("Container không hợp lệ");
      return;
    }

    if (!this.cy) {
      console.error("Cytoscape instance chưa được khởi tạo!");
      return;
    }

    this.clear();

    const rawNodes = data.elements?.nodes || [];
    const rawEdges = data.elements?.edges || [];

    const nodePositions = new Map<string, { x: number; y: number }>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawNodes.forEach((node: any) => {
      const id = node.data.id;
      const label = node.data.label || id;

      if (node.position) {
        nodePositions.set(id, node.position);
      }

      this.addNode(id, label, true);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawEdges.forEach((edge: any) => {
      const sourceId = edge.data.source;
      const targetId = edge.data.target;
      const idEdge = edge.data.id || `${sourceId}-${targetId}`;

      this.addEdge(sourceId, targetId, idEdge);
    });

    this.cy.batch(() => {
      this.cy!.elements().remove();
      const cyNodes = this.nodes.map((n) => ({
        group: "nodes" as const,
        data: { id: n.id, label: n.label },
        position: nodePositions.get(n.id) || undefined,
      }));

      const cyEdges = this.edges.map((e) => ({
        group: "edges" as const,
        data: { id: e.id, source: e.source, target: e.target },
      }));

      this.cy!.add([...cyNodes, ...cyEdges]);

      const fileStyle = data.style;

      this.cy!.style().clear().fromJson(fileStyle).update();
    });

    const layout = this.cy.layout({
      name: "preset",
      fit: true,
      padding: 20,
    });

    layout.run();

    if (data?.style[1]?.style["target-arrow-shape"] !== "none") {
      this.setIsDirected(true);
      setIsDirectedFunc(true);
    } else {
      this.setIsDirected(false);
      setIsDirectedFunc(false);
    }
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
          // console.log(
          //   "Đã xóa node:",
          //   selectedNodes.map((n) => n.id()),
          // );
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
          // console.log(this.getEdges());
          // console.log(
          //   "Đã xóa edge:",
          //   selectedEdges.map((e) => e.id()),
          // );
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
          // console.log("Bật/tắt chế độ đổi label cho node:", node.id());
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

  getConnectedComponents(): {
    [key: string]: { componentId: string; labelNode: string };
  } {
    this.init();

    const nodeComponentMap: {
      [key: string]: { componentId: string; labelNode: string };
    } = {};
    const nodeIdToLabelMap = new Map<string, string>();
    this.getNodes().forEach((node) =>
      nodeIdToLabelMap.set(node.id, node.label),
    );

    let componentIndex = 0;

    if (!this.isDirected) {
      for (const node of this.getNodes()) {
        if (!this.marked[node.id]) {
          componentIndex++;
          const componentName = `component-${componentIndex}`;
          const st = new MyStack<string>();
          st.push(node.id);

          while (!st.isEmpty()) {
            const u = st.top()!;
            st.pop();

            if (this.marked[u]) continue;
            this.marked[u] = true;
            nodeComponentMap[u] = {
              componentId: componentName,
              labelNode: nodeIdToLabelMap.get(u)!,
            };

            const neighbors: string[] = this.adj[u]?.values() || [];
            for (let i = neighbors.length - 1; i >= 0; i--) {
              const v = neighbors[i];
              if (!this.marked[v]) {
                st.push(v);
              }
            }
          }
        }
      }
    } else {
      // Using Tarjan's algorithm for Strongly Connected Components
      this.k = 1;
      this.stScc.clear();
      this.onStack = {};
      this.sccCount = 0;

      const findScc = (startId: string) => {
        this.num[startId] = this.minNum[startId] = this.k;
        this.k++;
        this.stScc.push(startId);
        this.onStack[startId] = true;

        const neighbors: string[] = this.adj[startId]?.values() || [];
        for (const endId of neighbors) {
          if (this.num[endId] === -1) {
            findScc(endId);
            this.minNum[startId] = Math.min(
              this.minNum[startId],
              this.minNum[endId],
            );
          } else if (this.onStack[endId]) {
            this.minNum[startId] = Math.min(
              this.minNum[startId],
              this.num[endId],
            );
          }
        }

        if (this.num[startId] === this.minNum[startId]) {
          this.sccCount++;
          const componentName = `component-${this.sccCount}`;
          let w: string;
          do {
            w = this.stScc.pop()!;
            this.onStack[w] = false;
            nodeComponentMap[w] = {
              componentId: componentName,
              labelNode: nodeIdToLabelMap.get(w)!,
            };
          } while (w !== startId);
        }
      };

      for (const node of this.getNodes()) {
        if (this.num[node.id] === -1) {
          findScc(node.id);
        }
      }
    }

    return nodeComponentMap;
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

    const nodes = this.getNodes().length;
    if (nodes === 0 || nodes === 1) return false;

    if (components > 1) return false;
    if (components === 0) return false;

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

  hasEulerCycle(): { flag: boolean; note: string } {
    this.init();

    const nodes = this.getNodes();
    if (nodes.length === 0) {
      return {
        flag: false,
        note: "Đồ thị không có đỉnh nào.",
      };
    }

    if (this.getEdges().length === 0) {
      return {
        flag: false,
        note: "Đồ thị không có cạnh nào.",
      };
    }

    const components = this.countComponents();

    if (components > 1) {
      return {
        flag: false,
        note: `Vì đồ thị không ${this.isDirected ? "liên thông mạnh" : "liên thông"} (có ${components} thành phần).`,
      };
    }

    if (this.isDirected) {
      for (const node of nodes) {
        const inDeg = this.degIn[node.id] || 0;
        const outDeg = this.degOut[node.id] || 0;
        if (inDeg !== outDeg) {
          return {
            flag: false,
            note: `Vì đỉnh ${node.label} có bậc vào (${inDeg}) khác bậc ra (${outDeg}).`,
          };
        }
      }
    } else {
      const oddDegreeNodes: string[] = [];
      for (const node of nodes) {
        const deg = this.degree[node.id] || 0;
        if (deg % 2 !== 0) {
          oddDegreeNodes.push(node.label);
        }
      }
      if (oddDegreeNodes.length > 0) {
        return {
          flag: false,
          note: `Vì đồ thị có ${oddDegreeNodes.length} đỉnh bậc lẻ: ${oddDegreeNodes.join(", ")}.`,
        };
      }
    }

    return {
      flag: true,
      note: "Đồ thị thỏa mãn mọi điều kiện để có chu trình Euler.",
    };
  }

  hasEulerPath(): { flag: boolean; note: string } {
    this.init();

    if (this.isEulerGraph()) {
      return {
        flag: true,
        note: "Vì đồ thị thỏa mãn mọi điều kiện để có chu trình Euler.",
      };
    }

    const components = this.countComponents();
    if (components > 1) {
      return {
        flag: false,
        note: `Vì đồ thị không liên thông (đang có ${components} thành phần liên thông)`,
      };
    }
    if (components === 0) {
      return {
        flag: false,
        note: "Vì đồ thị rỗng",
      };
    }

    if (!this.isDirected) {
      let countNodeHaveOddDegree = 0;

      let tmpFlag = true;
      const oddDegreeNodes: string[] = [];

      for (const node of this.getNodes()) {
        const deg = this.degree[node.id] || 0;
        if (deg % 2 !== 0) {
          oddDegreeNodes.push(node.label);
          countNodeHaveOddDegree++;
        }

        // Logic cũ: nếu quá 2 đỉnh bậc lẻ thì sai ngay
        if (countNodeHaveOddDegree > 2) {
          tmpFlag = false;
        }
      }

      if (!tmpFlag) {
        return {
          flag: false,
          note: `Vì đồ thị vô hướng có nhiều hơn 2 đỉnh bậc lẻ (Điều kiện đường đi Euler là có đúng 2 đỉnh bậc lẻ);
          Số đỉnh bậc lẻ: ${countNodeHaveOddDegree};
          Các đỉnh bậc lẻ: ${oddDegreeNodes.join(", ")}`,
        };
      }

      // Logic cũ: return countNodeHaveOddDegree === 2;
      if (countNodeHaveOddDegree === 2) {
        return {
          flag: true,
          note: "Đồ thị thỏa mãn mọi điều kiện",
        };
      } else {
        return {
          flag: false,
          note: `Vì đồ thị vô hướng có nhiều hơn 2 đỉnh bậc lẻ (Điều kiện đường đi Euler là có đúng 2 đỉnh bậc lẻ);
          Số đỉnh bậc lẻ: ${countNodeHaveOddDegree};
          Các đỉnh bậc lẻ: ${oddDegreeNodes.join(", ")}`,
        };
      }
    } else {
      let startNode = 0; // Số đỉnh có out - in = 1
      let endNode = 0; // Số đỉnh có in - out = 1

      for (const node of this.getNodes()) {
        const outDeg = this.degOut[node.id] || 0;
        const inDeg = this.degIn[node.id] || 0;

        if (outDeg - inDeg === 1) {
          ++startNode;
        } else if (inDeg - outDeg === 1) {
          ++endNode;
        } else if (inDeg !== outDeg) {
          // Logic cũ: return false nếu đỉnh không cân bằng và không phải start/end
          return {
            flag: false,
            note: `Vi phạm tại đỉnh ${node.label}: Bậc vào (${inDeg}) khác bậc ra (${outDeg})`,
          };
        }

        // Logic cũ: return false nếu có nhiều hơn 1 đỉnh đầu hoặc 1 đỉnh cuối
        if (startNode > 1 || endNode > 1) {
          return {
            flag: false,
            note: "Vì đồ thị có hướng có nhiều hơn 1 đỉnh bắt đầu hoặc nhiều hơn 1 đỉnh kết thúc.",
          };
        }
      }

      // Nếu chạy hết vòng lặp mà không return false -> Thỏa mãn
      return {
        flag: true,
        note: "Vì đồ thị thỏa mãn mọi điều kiện",
      };
    }
  }

  private edgeVisited: { [key: string]: boolean } = {};

  getLabel = (id: string) =>
    this.nodes.find((node) => node.id === id)?.label || "";

  buildEulerCycle(startId: string): {
    steps: number;
    detailSteps: DetailSteps[];
    tableSteps: TableSteps[];
    circuit: { id: string; label: string }[];
  } {
    this.init();

    if (!this.getNodes().find((node) => node.id === startId)) {
      console.log(`Nút có id là ${startId} không tồn tại trong đồ thị.`);
      return {
        steps: 0,
        detailSteps: [],
        tableSteps: [],
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
        row: detailSteps[detailSteps.length - 1].row || null,
        col: detailSteps[detailSteps.length - 1].col || null,
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
      // row: number | null = null,
      // col: number | null = null,
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

      // detailSteps[step - 1].row = row;
      // detailSteps[step - 1].col = col;
    };

    if (!this.isEulerGraph()) {
      return {
        steps: countStepInit,
        detailSteps: [1, 2, 3].map((step) => ({
          step,
          colorLine: step === 3 ? 19 : step,
          nodes: resetNodeGraph(),
          edges: resetEdgeGraph(),
          row: null,
          col: null,
        })),
        tableSteps: [],
        circuit: [],
      };
    }

    const getLabel = (id: string) =>
      this.nodes.find((node) => node.id === id)?.label || "";

    // !NOTE: Những dòng sẽ chắc chắn tô màu
    const colorLineInit = [1, 2, 4, 5, 6, 8];
    const detailSteps: DetailSteps[] = [];
    const tableSteps: TableSteps[] = [];

    // TODO: Xây dựng dòng 1 của tableSteps
    // tableSteps không cần nằm trong vòng lặp for 1 -> 6
    const label = getLabel(startId);
    tableSteps.push({
      row: 1,
      currentNode: label,
      edgeMoved: null,
      stack: [label],
      tempCircuit: [],
      stackPrevious: [],
      listEdge: [],
      pushOrPopStack: "none",
      note: [`Chọn đỉnh ${label} làm đỉnh bắt đầu.`, `Đưa ${label} vào stack.`],
    });

    for (let i = 1; i <= 6; i++) {
      detailSteps.push({
        step: i,
        colorLine: colorLineInit[i - 1],
        nodes: resetNodeGraph(),
        edges: resetEdgeGraph(),
        row: i === 3 || i === 4 || i === 5 ? 1 : null,
        col: i === 3 ? 2 : i === 4 ? 4 : i === 5 ? 5 : null,
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

    let rowTable = 2;
    let i = 6;
    while (!stack.isEmpty()) {
      // lấy đỉnh u trong stacck ra duyệt
      const u = stack.top()!;

      const labelU = getLabel(u);

      // TODO: Xây dựng tableSteps
      tableSteps.push({
        row: rowTable,
        currentNode: labelU,
        edgeMoved: null,
        stack: [],
        tempCircuit: [...tableSteps[tableSteps.length - 1].tempCircuit],
        stackPrevious: tableSteps[tableSteps.length - 1].stack,
        listEdge:
          this.getAdjacencyList()
            [u]?.values()
            ?.map((id) => ({
              source: labelU,
              target: getLabel(id),
              isMoved: graphCopy.adj[u].has(id) ? false : true,
            })) || [],
        pushOrPopStack: "none",
        note: [`Lấy đỉnh ${labelU} từ đỉnh trên cùng của stack để duyệt.`],
      });

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
      detailSteps[detailSteps.length - 1].row = rowTable;
      detailSteps[detailSteps.length - 1].col = 2;

      copyPrevNodesAndEdges(detailSteps, ++i, 11);
      buildNextStep(detailSteps, i, [], [], [], [], []);

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

        const labelV = getLabel(v);

        tableSteps[tableSteps.length - 1].edgeMoved = {
          source: labelU,
          target: labelV,
        };
        tableSteps[tableSteps.length - 1].note.push(
          `Chọn cạnh (${labelU} - ${labelV}) để đi tiếp.`,
          `Đánh dấu cạnh (${labelU} - ${labelV}) đã đi qua.`,
          `Thêm đỉnh ${labelV} vào stack.`,
        );
        detailSteps[detailSteps.length - 1].row = rowTable;
        detailSteps[detailSteps.length - 1].col = 3;

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
        // tableSteps[tableSteps.length - 1].edgeMoved = {};
        tableSteps[tableSteps.length - 1].stack = stack
          .values()
          .map((id) => getLabel(id));
        detailSteps[detailSteps.length - 1].row = rowTable;
        detailSteps[detailSteps.length - 1].col = 4;

        if (graphCopy.isDirected) {
          graphCopy.adj[u].delete(v);
        } else {
          graphCopy.adj[u].delete(v);
          graphCopy.adj[v].delete(u);
        }
      } else {
        tableSteps[tableSteps.length - 1].note.push(
          `Không còn cạnh này xuất phát từ ${labelU} mà chưa duyệt.`,
          `Thêm đỉnh ${labelU} vào Chu trình`,
          `Xóa đỉnh ${labelU} khỏi stack.`,
        );
        tableSteps[tableSteps.length - 1].pushOrPopStack = "pop";
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
        tableSteps[tableSteps.length - 1].stack = stack
          .values()
          .map((id) => getLabel(id));
        detailSteps[detailSteps.length - 1].row = rowTable;
        detailSteps[detailSteps.length - 1].col = 4;

        // Thêm đỉnh u vào chu trình
        copyPrevNodesAndEdges(detailSteps, ++i, 17);
        circuit.push({
          id: u,
          label: getLabel(u),
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
        tableSteps[tableSteps.length - 1].tempCircuit.push(getLabel(u));
        detailSteps[detailSteps.length - 1].row = rowTable;
        detailSteps[detailSteps.length - 1].col = 5;
      }

      ++rowTable;

      // Kết thúc vòng lặp while
      if (stack.isEmpty()) {
        copyPrevNodesAndEdges(detailSteps, ++i, 18);
        buildNextStep(detailSteps, ++i, [], [], [], [], []);
      }
    }
    // console.log("Hoàn thành xây dựng chu trình Euler.");
    copyPrevNodesAndEdges(detailSteps, ++i, 19);

    // console.log(detailSteps);

    return {
      steps: detailSteps.length,
      detailSteps,
      tableSteps,
      circuit: circuit.reverse(),
    };
  }

  buildEulerPath(): { id: string; label: string }[] {
    this.init();

    if (!this.hasEulerPath().flag) {
      // console.log("Đồ thị không có đường đi Euler.");
      return [];
    }

    const graphCopyAdj: { [key: string]: MySet<string> } = {};
    for (const key in this.adj) {
      graphCopyAdj[key] = this.adj[key].clone();
    }

    let startNodeId: string | undefined = this.getNodes()[0]?.id;

    if (!this.isEulerGraph()) {
      if (!this.isDirected) {
        startNodeId = this.getNodes().find(
          (node) => (this.degree[node.id] || 0) % 2 !== 0,
        )?.id;
      } else {
        startNodeId = this.getNodes().find(
          (node) =>
            (this.degOut[node.id] || 0) - (this.degIn[node.id] || 0) === 1,
        )?.id;
      }
    }

    if (!startNodeId) {
      // This case should ideally not be reached if hasEulerPath is true
      // and the graph has nodes. It's a fallback.
      if (this.getNodes().length > 0) {
        startNodeId = this.getNodes()[0].id;
      } else {
        return []; // No nodes, no path
      }
    }

    const stack = new MyStack<string>();
    const path: string[] = [];

    stack.push(startNodeId);

    while (!stack.isEmpty()) {
      const u = stack.top()!;

      if (graphCopyAdj[u] && graphCopyAdj[u].size() > 0) {
        const v = graphCopyAdj[u].values()[0];
        stack.push(v);

        // Remove edge from the copied adjacency list
        graphCopyAdj[u].delete(v);
        if (!this.isDirected) {
          graphCopyAdj[v].delete(u);
        }
      } else {
        path.push(stack.pop()!);
      }
    }

    const getLabel = (id: string) =>
      this.nodes.find((node) => node.id === id)?.label || "";

    return path.reverse().map((id) => ({ id, label: getLabel(id) }));
  }
}
