import type Graph from "@/libs/Graph";

function* infoGenerator(
  graph: Graph,
  info: {
    step: number;
    colorLine: number;
    action: (graph?: Graph, id?: string, color?: string) => void;
  }[],
) {
  for (const item of info) {
    yield item.action(graph);
  }
}

export async function run(
  graph: Graph,
  info: { step: number; colorLine: number; action: () => void }[],
) {
  const gen = infoGenerator(graph, info);
  for (const { value, done } of gen) {
    if (done) break;
    console.log(value);
    await new Promise((r) => setTimeout(r, 1000));
  }
}
