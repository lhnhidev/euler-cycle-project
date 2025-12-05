import { Tooltip } from "antd";
import { FaBook, FaHome } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { MdAssignment } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const WindowNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getItemClass = (path: string) => {
    const active = isActive(path);
    return `cursor-pointer rounded-md p-2 transition-all duration-200 text-lg mb-2
      ${
        active
          ? "bg-gray-300 text-[var(--primary-color)]"
          : "hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200"
      }`;
  };

  return (
    <div className="fixed left-0 top-[var(--height-title-bar-windows)] flex h-[calc(100vh-var(--height-title-bar-windows))] w-[calc(var(--height-title-bar-windows)+10px)] flex-col items-center border-r border-[var(--border-color)] bg-[var(--bg-color)] py-3">
      <Tooltip title="Trang chủ" placement="right">
        <div className={getItemClass("/")} onClick={() => navigate("/")}>
          <FaHome />
        </div>
      </Tooltip>

      <Tooltip title="Thông tin" placement="right">
        <div
          className={getItemClass("/info")}
          onClick={() => navigate("/info")}
        >
          <IoInformationCircle />
        </div>
      </Tooltip>

      <Tooltip title="Tài liệu" placement="right">
        <div
          className={getItemClass("/document")}
          onClick={() => navigate("/document")}
        >
          <FaBook />
        </div>
      </Tooltip>

      <Tooltip title="Luyện tập" placement="right">
        <div
          className={getItemClass("/practice")}
          onClick={() => navigate("/practice")}
        >
          <MdAssignment />
        </div>
      </Tooltip>
    </div>
  );
};

export default WindowNav;
