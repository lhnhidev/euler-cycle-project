import type { DetailSteps } from "@/libs/Graph";
import type Graph from "@/libs/Graph";
import {
  BG_COLOR_NODE_CHOOSED,
  BG_COLOR_NODE_STACKED,
  BG_COLOR_NODE_CYCLED,
  BG_COLOR_NODE_DELETED_STATE,
  COLOR_EDGE_CHOOSED,
  COLOR_EDGE_CHECKED,
} from "@/libs/CSSGraph/CSSGraph";

const runAnimation = (
  graph: Graph,
  detailSteps: DetailSteps,
  step: number,
  setLinesToHighlight: (lines: number[]) => void,
  setSliderValue: (value: number) => void,
  setHighlightedCell: (cell: {
    row: number | null;
    col: number | null;
  }) => void,
) => {
  setLinesToHighlight([detailSteps.colorLine]); // Tô màu mã giả
  setSliderValue(step); // Cập nhật thanh trượt của controlbar
  setHighlightedCell({
    row: detailSteps.row ? detailSteps.row - 1 : null,
    col: detailSteps.col ? detailSteps.col - 1 : null,
  });

  const core = graph.getCore()!;

  const nodeStateClasses = [
    "algo-chosen",
    "algo-stacked",
    "algo-cycled",
    "algo-deleted",
  ];
  const edgeStateClasses = ["algo-edge-chosen", "algo-edge-checked"];

  core.nodes().removeClass(nodeStateClasses.join(" "));
  core.edges().removeClass(edgeStateClasses.join(" "));

  detailSteps.nodes.forEach((node) => {
    const el = core.getElementById(node.id);
    if (!el || el.empty()) return;

    switch (node.bgColor) {
      case BG_COLOR_NODE_CHOOSED:
        el.addClass("algo-chosen");
        break;
      case BG_COLOR_NODE_STACKED:
        el.addClass("algo-stacked");
        break;
      case BG_COLOR_NODE_CYCLED:
        el.addClass("algo-cycled");
        break;
      case BG_COLOR_NODE_DELETED_STATE:
        el.addClass("algo-deleted");
        break;
      default:
        break;
    }
  });

  detailSteps.edges.forEach((edge) => {
    const el = core.getElementById(edge.id);
    if (!el || el.empty()) return;

    switch (edge.color) {
      case COLOR_EDGE_CHOOSED:
        el.addClass("algo-edge-chosen");
        break;
      case COLOR_EDGE_CHECKED:
        el.addClass("algo-edge-checked");
        break;
      default:
        break;
    }
  });
};

export function createRunner(
  graph: Graph,
  info: { detailSteps: DetailSteps[] },
  setLinesToHighlight: (lines: number[]) => void,
  getSpeed: () => number,
  setSliderValue: (value: number) => void,
  setPlay: (play: boolean) => void,
  setHighlightedCell: (cell: {
    row: number | null;
    col: number | null;
  }) => void,
) {
  let index = 0;

  let playing = false;

  let timeout: ReturnType<typeof setTimeout> | null = null;

  const steps = info.detailSteps;

  const play = () => {
    playing = true;

    const loop = () => {
      if (!playing || index >= steps.length) return;

      runAnimation(
        graph,
        steps[index],
        index,
        setLinesToHighlight,
        setSliderValue,
        setHighlightedCell,
      );

      index++;
      if (index === steps.length) {
        setPlay(false);
        pause();
        --index;
      }
      timeout = setTimeout(loop, getSpeed());
    };
    loop();
  };

  const pause = () => {
    playing = false;
    if (timeout) clearTimeout(timeout);
  };

  const next = () => {
    if (index < steps.length - 1) {
      index++;
      runAnimation(
        graph,
        steps[index],
        index,
        setLinesToHighlight,
        setSliderValue,
        setHighlightedCell,
      );
    }
  };

  const prev = () => {
    if (index > 0) {
      index--;
      runAnimation(
        graph,
        steps[index],
        index,
        setLinesToHighlight,
        setSliderValue,
        setHighlightedCell,
      );
    }
  };

  const seek = (i: number) => {
    if (i >= 0 && i < steps.length) {
      index = i;
      runAnimation(
        graph,
        steps[index],
        index,
        setLinesToHighlight,
        setSliderValue,
        setHighlightedCell,
      );
    }
  };

  return {
    play,
    pause,
    next,
    prev,
    seek,
    get currentStep() {
      return index;
    },
  };
}
