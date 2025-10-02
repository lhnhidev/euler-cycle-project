import cytoscape from "cytoscape";
import CSSGraph from "./CSSGraph";
import LayoutGraph from "./LayoutGraph";
import dblclick from "cytoscape-dblclick";

cytoscape.use(dblclick);

export default class Graph {
  private cy: cytoscape.Core | null = null;
  private numberOfNodes: number = 0;
  private isDirected: boolean = true;
  private nodes: { id: string; label: string }[];
  private edges: { source: string; target: string }[];
  private _keydownHandler?: (e: KeyboardEvent) => void;
  private isChangeingLabelMode: boolean = false;

  constructor() {
    this.nodes = [];
    this.edges = [];
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
    this.nodes.push({ id, label });
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
    this.setNumberOfNodes(this.numberOfNodes - 1);
    return true;
  }

  addEdge(sourceId: string, targetId: string): boolean {
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

    this.edges.push({ source: sourceId, target: targetId });
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

  setNumberOfNodes(count: number): boolean {
    if (count < 0) {
      console.log("Số lượng nút không thể âm");
      return false;
    }
    this.numberOfNodes = count;
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
    this.nodes = [];
    this.edges = [];
  }

  display(container: HTMLDivElement): () => void {
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
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
        },
      };
    });

    if (!this.cy) {
      this.cy = cytoscape({
        container,
        elements: [...nodeElements, ...edgeElements],
        style: CSSGraph(this.getIsDirected()),
        layout: LayoutGraph(this.getNumberOfNodes()),
      });
    } else {
      this.cy.edges().forEach((edge) => {
        edge.style(
          "target-arrow-shape",
          this.getIsDirected() ? "triangle" : "none",
        );
      });
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
            return {
              sourceId: edge.source().id(),
              targetId: edge.target().id(),
            };
          });
          selectedIds.forEach((id) =>
            this.removeEdge(id.sourceId, id.targetId),
          );
          // console.log(this.nodes);
          console.log(this.edges);
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
      const nodeId = `${Date.now()}`;
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

        const value = input.value.trim()[0]?.toUpperCase() || "";
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

          const finish = () => {
            const value = input.value.trim()[0]?.toUpperCase() || "";
            if (value) {
              node.data("label", value);
            } else {
              node.remove();
            }

            this.isChangeingLabelMode = false;

            console.log(this.getNodes());

            screen.removeChild(input);
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
        const newEdge = this.cy!.add({
          group: "edges",
          data: {
            id: `${sourceNode.id()}-${targetNode!.id()}-${Date.now()}`,
            source: sourceNode.id(),
            target: targetNode!.id(),
          },
        });

        newEdge.style({
          "target-arrow-shape": this.isDirected ? "triangle" : "none",
          "curve-style": "bezier",
        });

        this.addEdge(sourceNode.id(), targetNode!.id());
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
}
