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
  // Hàm này thực hiện hiển thị animation cho đồ thị
  setLinesToHighlight([detailSteps.colorLine]); // Tô màu mã giả
  setSliderValue(step); // Cập nhật thanh trượt của controlbar
  setHighlightedCell({
    row: detailSteps.row ? detailSteps.row - 1 : null,
    col: detailSteps.col ? detailSteps.col - 1 : null,
  }); // Cập nhật ô được highlight trong bảng mô tả thuật toán

  const core = graph.getCore()!;

  // Remove previous algorithm state classes so each step applies cleanly
  const nodeStateClasses = [
    "algo-chosen",
    "algo-stacked",
    "algo-cycled",
    "algo-deleted",
  ];
  const edgeStateClasses = ["algo-edge-chosen", "algo-edge-checked"];

  core.nodes().removeClass(nodeStateClasses.join(" "));
  core.edges().removeClass(edgeStateClasses.join(" "));

  // Add class to nodes according to the step state instead of setting inline styles.
  // This preserves selected styling (which uses `node:selected` with !important).
  detailSteps.nodes.forEach((node) => {
    const el = core.getElementById(node.id);
    if (!el || el.empty()) return;

    // map bgColor to class name
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
        // no algorithm state
        break;
    }
  });

  // Add class to edges according to the step state
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

/**
 * Hàm này tạo ra một "runner" — bộ điều khiển cho quá trình chạy mô phỏng
 * Cho phép:
 *  - Play (chạy liên tục)
 *  - Pause (tạm dừng)
 *  - Next (tua tới 1 bước)
 *  - Prev (tua lui 1 bước)
 *  - Seek (nhảy đến bước cụ thể)
 */
export function createRunner(
  graph: Graph,
  info: { detailSteps: DetailSteps[] },
  setLinesToHighlight: (lines: number[]) => void,
  getSpeed: () => number, // Hàm trả về tốc độ (delay) giữa các bước
  setSliderValue: (value: number) => void,
  setPlay: (play: boolean) => void,
  setHighlightedCell: (cell: {
    row: number | null;
    col: number | null;
  }) => void,
) {
  // Chỉ số bước hiện tại trong danh sách các bước chi tiết
  let index = 0;

  let playing = false;

  // Biến lưu timeout để có thể dừng lại giữa chừng
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const steps = info.detailSteps;

  /**
   * Hàm play — chạy liên tục qua từng bước
   */
  const play = () => {
    playing = true;

    // Hàm lặp đệ quy: mỗi lần chạy 1 bước rồi tự gọi lại
    const loop = () => {
      if (!playing || index >= steps.length) return;

      // Thực hiện hiển thị bước hiện tại
      runAnimation(
        graph,
        steps[index],
        index,
        setLinesToHighlight,
        setSliderValue,
        setHighlightedCell,
      );

      // Chuyển sang bước kế tiếp
      index++;
      if (index === steps.length) {
        setPlay(false);
        pause();
        --index;
      }
      // Gọi lại loop sau một khoảng delay
      timeout = setTimeout(loop, getSpeed());
    };
    loop();
  };

  /**
   * Hàm pause — tạm dừng khi đang chạy
   */
  const pause = () => {
    playing = false;
    if (timeout) clearTimeout(timeout);
  };

  /**
   * Hàm next — chạy tới 1 bước
   */
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

  /**
   * Hàm prev — lùi lại 1 bước
   */
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

  /**
   * Hàm seek — nhảy đến bước bất kỳ (dùng cho Slider của control bar)
   */
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
    // Cho phép xem step hiện tại (ví dụ dùng cho hiển thị thanh tiến độ)
    get currentStep() {
      return index;
    },
  };
}
