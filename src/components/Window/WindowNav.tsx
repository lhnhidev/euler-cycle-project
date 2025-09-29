import { Tooltip } from "antd";
import { FaBook, FaHome } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";

const WindowNav = () => {
  return (
    <div className="fixed left-0 top-[var(--height-title-bar-windows)] flex h-[calc(100vh-var(--height-title-bar-windows))] w-[calc(var(--height-title-bar-windows)+2px)] flex-col items-center gap-3 border-r border-[var(--border-color)] bg-[var(--bg-color)] py-3 text-lg">
      <Tooltip title="Trang chủ" placement="right">
        <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
          <FaHome />
        </div>
      </Tooltip>

      <Tooltip title="Thông tin" placement="right">
        <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
          <IoInformationCircle />
        </div>
      </Tooltip>
      <Tooltip title="Tài liệu" placement="right">
        <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
          <FaBook />
        </div>
      </Tooltip>
    </div>
  );
};
export default WindowNav;
