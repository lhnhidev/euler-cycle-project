/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Tooltip, message, Modal } from "antd";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import DirectoryTreeContent from "./DirectoryTreeContent";
import { useEffect, useState } from "react";

interface NodeItem {
  id: string;
  name: string;
  children?: NodeItem[];
}

declare global {
  interface Window {
    electronAPI: {
      readDirectory: (dirPath: string) => Promise<{
        success: boolean;
        data?: unknown;
        error?: string;
      }>;
      createFolder: (fullPath: string) => Promise<unknown>;
      createFile: (fullPath: string, content: string) => Promise<unknown>;
    };
  }
}

const PROJECT_PATH = "D:/euler/"; // thư mục dự án thật

const DirectoryTree = () => {
  const [treeData, setTreeData] = useState<NodeItem[]>([]);
  const [loading, setLoading] = useState(false);

  // state modal
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");

  const loadDirectory = async () => {
    setLoading(true);
    const result = await window.electronAPI.readDirectory(PROJECT_PATH);

    if (!result.success) {
      message.error(result.error || "Không thể đọc thư mục.");
      setLoading(false);
      return;
    }

    setTreeData(result.data as NodeItem[]);
    setLoading(false);
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const handleCreateFolder = () => {
    setNewFolderName("");
    setFolderModalOpen(true);
  };

  const handleCreateFile = () => {
    setNewFileName("");
    setFileModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col border-r border-[var(--border-color)] bg-[var(--bg-color)] px-2 pt-4">
      <div className="flex h-full flex-col">
        {/* Ô tìm kiếm */}
        <Input.Search placeholder="Nhập để tìm kiếm..." variant="filled" />

        <div className="mt-4 flex items-center justify-between">
          <div className="pl-1 font-bold text-[var(--primary-color)]">
            Thư mục dự án
          </div>

          <div className="flex justify-end gap-3">
            {/* Tạo file */}
            <Tooltip title="Tạo file mới" placement="bottom">
              <div
                className="hover-bg-gray cursor-pointer rounded-sm p-1"
                onClick={handleCreateFile}
              >
                <VscNewFile />
              </div>
            </Tooltip>

            {/* Tạo folder */}
            <Tooltip title="Tạo thư mục mới" placement="bottom">
              <div
                className="hover-bg-gray cursor-pointer rounded-sm p-1"
                onClick={handleCreateFolder}
              >
                <VscNewFolder />
              </div>
            </Tooltip>
          </div>
        </div>

        <hr className="mb-2 mt-2 border-[var(--primary-color)] bg-[var(--primary-color)]" />

        {/* CÂY THƯ MỤC */}
        <div className="flex-1">
          <DirectoryTreeContent data={treeData} loading={loading} />
        </div>
      </div>

      {/* MODAL TẠO FOLDER */}
      <Modal
        title="Tạo thư mục mới"
        open={folderModalOpen}
        onCancel={() => setFolderModalOpen(false)}
        onOk={async () => {
          if (!newFolderName.trim()) {
            message.error("Tên không hợp lệ");
            return;
          }
          const fullPath = `${PROJECT_PATH}/${newFolderName}`;
          const res = await window.electronAPI.createFolder(fullPath);
          if ((res as any).success) {
            message.success("Đã tạo thư mục");
            setFolderModalOpen(false);
            loadDirectory();
          } else {
            message.error((res as any).error);
          }
        }}
      >
        <Input
          placeholder="Nhập tên thư mục..."
          autoFocus
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
      </Modal>

      {/* MODAL TẠO FILE */}
      <Modal
        title="Tạo file mới"
        open={fileModalOpen}
        onCancel={() => setFileModalOpen(false)}
        onOk={async () => {
          if (!newFileName.trim()) {
            message.error("Tên không hợp lệ");
            return;
          }
          const fullPath = `${PROJECT_PATH}/${newFileName}`;
          const res = await window.electronAPI.createFile(fullPath, "");
          if ((res as any).success) {
            message.success("Đã tạo file");
            setFileModalOpen(false);
            loadDirectory();
          } else {
            message.error((res as any).error);
          }
        }}
      >
        <Input
          placeholder="Nhập tên file (vd: test.txt)"
          autoFocus
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default DirectoryTree;
