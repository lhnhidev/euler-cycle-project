import { Tooltip } from "antd";
import { FaBars, FaBookmark, FaFolder } from "react-icons/fa";

const WindowTool = () => {
  return (
    <div className="flex h-full w-[var(--width-of-window-tool)] items-center px-3">
      <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
        <FaBars />
      </div>

      <div className="ml-5 flex gap-2 text-lg">
        <Tooltip title="Trình duyệt tệp" placement="bottom">
          <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
            <FaFolder />
          </div>
        </Tooltip>
        <Tooltip title="Đánh dấu" placement="bottom">
          <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
            <FaBookmark />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
export default WindowTool;
