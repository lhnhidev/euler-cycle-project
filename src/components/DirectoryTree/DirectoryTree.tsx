import { Input, Tooltip } from "antd";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import DirectoryTreeContent from "./DirectoryTreeContent";

const DirectoryTree = () => {
  return (
    <div className="flex h-full flex-col border-r border-[var(--border-color)] bg-[var(--bg-color)] px-2 pt-4">
      <div className="flex h-full flex-col">
        <div>
          <Input.Search placeholder="Nhập để tìm kiếm..." variant="filled" />

          <div className="mt-4 flex items-center justify-between">
            <div className="pl-1 font-bold text-[var(--primary-color)]">
              Thư mục dự án
            </div>
            <div className="flex justify-end gap-3">
              <Tooltip title="Tạo file mới" placement="bottom">
                <div className="hover-bg-gray cursor-pointer rounded-sm p-1">
                  <VscNewFile />
                </div>
              </Tooltip>
              <Tooltip title="Tạo thư mục mới" placement="bottom">
                <div className="hover-bg-gray cursor-pointer rounded-sm p-1">
                  <VscNewFolder />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <hr className="mb-2 mt-2 border-[var(--primary-color)] bg-[var(--primary-color)]" />

        <div className="flex-1">
          <DirectoryTreeContent />
        </div>
      </div>

      {/* <div className="flex-1">
        <ResultComponent />
      </div> */}
    </div>
  );
};
export default DirectoryTree;
