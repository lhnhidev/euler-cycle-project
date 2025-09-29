import { Tooltip } from "antd";
import { IoSettingsSharp } from "react-icons/io5";

const DirectoryTreeContent = () => {
  return (
    <div className="set-text-font-size-smaller flex h-full flex-col justify-between">
      <div>DirectoryTreeContent</div>
      <footer className="mx-[-8px] mt-4 flex w-[calc(100%+16px)] items-center justify-between border-b border-t border-[var(--border-color)] px-2 py-2">
        <div>My_Folder</div>
        <Tooltip title="Cài đặt" placement="top">
          <div className="hover-bg-gray hover-primary cursor-pointer rounded-sm p-1">
            <IoSettingsSharp />
          </div>
        </Tooltip>
      </footer>
    </div>
  );
};
export default DirectoryTreeContent;
