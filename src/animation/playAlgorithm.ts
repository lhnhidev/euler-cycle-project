import type { DetailSteps } from "@/libs/Graph";
import type Graph from "@/libs/Graph";

function* infoGenerator(
  graph: Graph,
  info: { detailSteps: DetailSteps[] },
  setLinesToHighlight: (lines: number[]) => void,
) {
  const runAnimation = (detailSteps: DetailSteps) => {
    // console.log("Animation started", detailSteps);
    console.log(detailSteps.colorLine);
    setLinesToHighlight([detailSteps.colorLine]);
    detailSteps.nodes.forEach((node) => {
      graph
        .getCore()!
        .getElementById(node.id)
        ?.style("background-color", node.bgColor);
      graph.getCore()!.getElementById(node.id)?.style("color", node.color);
    });

    detailSteps.edges.forEach((edge) => {
      graph.getCore()!.getElementById(edge.id)?.style("line-color", edge.color);
    });
  };

  // let idx = 0;
  for (const item of info.detailSteps) {
    yield runAnimation(item);
  }
}

export async function run(
  graph: Graph,
  info: { detailSteps: DetailSteps[] },
  setLinesToHighlight: (lines: number[]) => void,
) {
  const gen = infoGenerator(graph, info, setLinesToHighlight);
  let result = gen.next();
  while (!result.done) {
    console.log(result.value);
    await new Promise((r) => setTimeout(r, 1000));
    result = gen.next();
  }
}
