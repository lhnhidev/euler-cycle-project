const LayoutGraph = (numberOfNodes: number) => {
  return {
    name: "cose",
    animate: false,
    fit: true,
    nodeRepulsion: 4000,
    idealEdgeLength: numberOfNodes > 20 ? 70 : 50,
    padding: 10,
  };
};

export default LayoutGraph;
