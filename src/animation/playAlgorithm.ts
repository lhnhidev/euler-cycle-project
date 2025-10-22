import type { DetailSteps } from "@/libs/Graph";
import type Graph from "@/libs/Graph";

const runAnimation = (
  graph: Graph,
  detailSteps: DetailSteps,
  step: number,
  setLinesToHighlight: (lines: number[]) => void,
  setSliderValue: (value: number) => void,
) => {
  // Hàm này thực hiện hiển thị animation cho đồ thị
  setLinesToHighlight([detailSteps.colorLine]); // Tô màu mã giả
  setSliderValue(step); // Cập nhật thanh trượt của controllbar

  // css màu cho từng nút
  detailSteps.nodes.forEach((node) => {
    graph
      .getCore()!
      .getElementById(node.id)
      ?.style("background-color", node.bgColor);
    graph.getCore()!.getElementById(node.id)?.style("color", node.color);
  });

  // css màu cho từng cạnh
  detailSteps.edges.forEach((edge) => {
    graph.getCore()!.getElementById(edge.id)?.style("line-color", edge.color);
    graph
      .getCore()!
      .getElementById(edge.id)
      ?.style("target-arrow-color", edge.color);
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
