import { useGraphContext } from "@/context/GraphContext";
import { ColorPicker, Slider } from "antd";
import { useEffect } from "react";
import { FaCircleNodes } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { TbVectorSpline } from "react-icons/tb";

type Props = {
  show: boolean;
};

const FormatGraphOption = ({ show }: Props) => {
  const {
    bgNodeColor,
    labelColor,
    nodeSize,
    edgeLength,
    edgeColor,
    setNodeSize,
    setEdgeLength,
    setEdgeColor,
    setBgNodeColor,
    setLabelColor,
    setTargetArrowColor,
    graph,
  } = useGraphContext();

  useEffect(() => {
    graph.current?.formatGraph(
      bgNodeColor,
      labelColor,
      edgeColor,
      edgeColor,
      nodeSize,
    );
  }, [bgNodeColor, labelColor, edgeColor, nodeSize, graph]);

  return (
    <div
      className={`set-text-font-size-smaller cursor-default rounded-sm bg-[var(--bg-color)] px-4 py-2 text-[var(--text-color)] shadow-sm ${show ? "" : "hidden"}`}
    >
      <div className="flex w-[230px] flex-col gap-3">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <FaCircleNodes />
            <p>Kích thước nút: </p>
          </div>
          <div className="w-[90px]">
            <Slider
              value={nodeSize}
              max={100}
              onChange={(value) => setNodeSize(value)}
              className="my-0"
              railStyle={{ backgroundColor: "#bbb" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <TbVectorSpline />
            <p>Độ dài cung: </p>
          </div>
          <div className="w-[90px]">
            <Slider
              value={edgeLength}
              max={100}
              onChange={(value) => setEdgeLength(value)}
              className="my-0"
              railStyle={{ backgroundColor: "#bbb" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <IoColorPaletteOutline />
            <p>Màu nền nút: </p>
          </div>
          <div className="w-[90px]">
            <ColorPicker
              value={bgNodeColor}
              size="small"
              showText
              onChange={(value) =>
                setBgNodeColor(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (value as any)?.toHexString?.() ?? String(value),
                )
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <IoColorPaletteOutline />
            <p>Màu cung: </p>
          </div>
          <div className="w-[90px]">
            <ColorPicker
              value={edgeColor}
              size="small"
              showText
              onChange={(value) => {
                setEdgeColor(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (value as any)?.toHexString?.() ?? String(value),
                );
                setTargetArrowColor(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (value as any)?.toHexString?.() ?? String(value),
                );
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <IoColorPaletteOutline />
            <p>Màu nhãn: </p>
          </div>
          <div className="w-[90px]">
            <ColorPicker
              value={labelColor}
              size="small"
              showText
              onChange={(value) =>
                setLabelColor(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (value as any)?.toHexString?.() ?? String(value),
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormatGraphOption;
