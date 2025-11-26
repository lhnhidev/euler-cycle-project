/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Modal, Tooltip, Button, Empty } from "antd";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import DirectoryTreeContent from "./DirectoryTreeContent";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

export interface NodeItem {
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
      deleteItem: (fullPath: string) => Promise<unknown>;
      readFile: (
        fullPath: string,
      ) => Promise<{ success: boolean; data?: string; error?: string }>;
      selectFolder: () => Promise<{ canceled: boolean; path?: string }>;
    };
  }
}

const DirectoryTree = () => {
  const [projectPath, setProjectPath] = useState<string>(() => {
    return localStorage.getItem("PROJECT_PATH") || "";
  });

  const [treeData, setTreeData] = useState<NodeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { modal, messageApi } = useAppContext();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");

  const loadDirectory = async () => {
    if (!projectPath) return;

    setLoading(true);
    const result = await window.electronAPI.readDirectory(projectPath);

    if (!result.success) {
      messageApi.error(result.error || "Không thể đọc thư mục.");
      setTreeData([]);
      setLoading(false);
      return;
    }

    setTreeData(result.data as NodeItem[]);
    setLoading(false);
  };

  useEffect(() => {
    if (projectPath) {
      localStorage.setItem("PROJECT_PATH", projectPath);
      loadDirectory();
      setSelectedPath(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPath]);

  const handleSelectRootFolder = async () => {
    try {
      const result = await window.electronAPI.selectFolder();
      if (!result.canceled && result.path) {
        setProjectPath(result.path);
        messageApi.success("Đã chọn thư mục dự án: " + result.path);
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Lỗi khi mở hộp thoại chọn thư mục");
    }
  };

  const handleSelectNode = (node: any) => {
    if (node.isLeaf) return;
    setSelectedPath(node.id);
  };

  const handleCreateFolder = () => {
    setNewFolderName("");
    setFolderModalOpen(true);
  };

  const handleCreateFile = () => {
    setNewFileName("");
    setFileModalOpen(true);
  };

  const handleDelete = async (path: string) => {
    modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa: ${path}?`,
      okType: "danger",
      onOk: async () => {
        const res = await window.electronAPI.deleteItem(path);
        if ((res as any).success) {
          messageApi.success("Đã xóa thành công");
          if (path === selectedPath) setSelectedPath(null);
          loadDirectory();
        } else {
          messageApi.error((res as any).error || "Lỗi khi xóa");
        }
      },
    });
  };

  const handleReadFile = async (path: string) => {
    const res = await window.electronAPI.readFile(path);
    if (res.success) {
      console.log("Nội dung file:", res.data);
      messageApi.success("Đã mở file thành công");
    } else {
      messageApi.error(res.error || "Không thể đọc file");
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-[var(--border-color)] bg-[var(--bg-color)] px-2 pt-4">
      <div className="flex h-full flex-col">
        <Input.Search placeholder="Nhập để tìm kiếm..." variant="filled" />

        <div className="mt-4 flex items-center justify-between">
          <div className="pl-1 font-bold text-[var(--primary-color)]">
            Thư mục dự án
          </div>

          {projectPath && (
            <div className="flex justify-end gap-3">
              <Tooltip
                title={selectedPath ? "Tạo file con" : "Tạo file gốc"}
                placement="bottom"
              >
                <div
                  className="hover-bg-gray cursor-pointer rounded-sm p-1"
                  onClick={handleCreateFile}
                >
                  <VscNewFile />
                </div>
              </Tooltip>

              <Tooltip
                title={selectedPath ? "Tạo folder con" : "Tạo folder gốc"}
                placement="bottom"
              >
                <div
                  className="hover-bg-gray cursor-pointer rounded-sm p-1"
                  onClick={handleCreateFolder}
                >
                  <VscNewFolder />
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        <hr className="mb-2 mt-2 border-[var(--primary-color)] bg-[var(--primary-color)]" />

        <div className="flex-1 overflow-hidden">
          {!projectPath ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Empty
                description="Chưa chọn thư mục dự án"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <Button type="primary" onClick={handleSelectRootFolder}>
                Chọn thư mục ngay
              </Button>
            </div>
          ) : (
            <DirectoryTreeContent
              data={treeData}
              loading={loading}
              selectedPath={selectedPath}
              onSelectNode={handleSelectNode}
              onDelete={handleDelete}
              onReadFile={handleReadFile}
              onOpenSettings={handleSelectRootFolder}
              rootPathName={projectPath}
            />
          )}
        </div>
      </div>

      <Modal
        title="Tạo thư mục mới"
        open={folderModalOpen}
        onCancel={() => setFolderModalOpen(false)}
        onOk={async () => {
          if (!newFolderName.trim()) {
            messageApi.error("Tên không hợp lệ");
            return;
          }
          const parentDir = selectedPath || projectPath;
          const cleanParent = parentDir.endsWith("/")
            ? parentDir
            : `${parentDir}/`;
          const fullPath = `${cleanParent}${newFolderName}`;

          const res = await window.electronAPI.createFolder(fullPath);
          if ((res as any).success) {
            messageApi.success("Đã tạo thư mục");
            setFolderModalOpen(false);
            loadDirectory();
          } else {
            messageApi.error((res as any).error);
          }
        }}
      >
        <Input
          placeholder="Nhập tên thư mục..."
          autoFocus
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <div className="mt-2 text-xs text-gray-400">
          Vị trí: {selectedPath || projectPath}
        </div>
      </Modal>

      <Modal
        title="Tạo file mới"
        open={fileModalOpen}
        onCancel={() => setFileModalOpen(false)}
        onOk={async () => {
          if (!newFileName.trim()) {
            messageApi.error("Tên không hợp lệ");
            return;
          }
          const parentDir = selectedPath || projectPath;
          const cleanParent = parentDir.endsWith("/")
            ? parentDir
            : `${parentDir}/`;
          const fullPath = `${cleanParent}${newFileName}`;

          const res = await window.electronAPI.createFile(fullPath, "");
          if ((res as any).success) {
            messageApi.success("Đã tạo file");
            setFileModalOpen(false);
            loadDirectory();
          } else {
            messageApi.error((res as any).error);
          }
        }}
      >
        <Input
          placeholder="Nhập tên file..."
          autoFocus
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
        <div className="mt-2 text-xs text-gray-400">
          Vị trí: {selectedPath || projectPath}
        </div>
      </Modal>
    </div>
  );
};

export default DirectoryTree;
