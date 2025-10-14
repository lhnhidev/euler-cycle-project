import { ColorPicker, Slider } from "antd";
import { FaCircleNodes } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { TbVectorSpline } from "react-icons/tb";

type Props = {
  show: boolean;
};

const DownloadOptions = ({ show }: Props) => {
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
              defaultValue={30}
              max={100}
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
              defaultValue={30}
              max={100}
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
            <ColorPicker defaultValue="#1677ff" size="small" showText />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <IoColorPaletteOutline />
            <p>Màu cung: </p>
          </div>
          <div className="w-[90px]">
            <ColorPicker defaultValue="#1677ff" size="small" showText />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <IoColorPaletteOutline />
            <p>Màu nhãn: </p>
          </div>
          <div className="w-[90px]">
            <ColorPicker defaultValue="#1677ff" size="small" showText />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DownloadOptions;
