import cytoscape from "cytoscape";
import CSSGraph from "./CSSGraph";

export default class Graph {
  private numberOfNodes: number = 0;
  private nodes: { id: string; label: string }[];
  private edges: { source: string; target: string }[];

  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  addNode(id: string, label: string): boolean {
    if (this.nodes.find((node) => node.id === id)) {
      console.log("Nút với ID này đã tồn tại");
      return false;
    }

    if (this.nodes.find((node) => node.label === label)) {
      console.log("Nút với nhãn này đã tồn tại");
      return false;
    }

    this.nodes.push({ id, label });
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

  clear() {
    this.nodes = [];
    this.edges = [];
  }

  display(container: HTMLDivElement): () => void {
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

    const cy = cytoscape({
      container,
      elements: [...nodeElements, ...edgeElements],
      style: CSSGraph(),
      layout: { name: "grid" }, // bố cục dạng lưới
    });

    return () => {
      cy.destroy(); // cleanup khi component unmount
    };
  }
}
