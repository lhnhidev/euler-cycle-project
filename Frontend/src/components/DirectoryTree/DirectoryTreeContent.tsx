import { Tooltip, Spin } from "antd";
import { IoSettingsSharp } from "react-icons/io5";
import { Tree, TreeApi } from "react-arborist";
import { FaFolder, FaFolderOpen, FaFile, FaTrash, FaEye } from "react-icons/fa";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import type { NodeItem } from "./DirectoryTree";

interface DirectoryTreeContentProps {
  data: NodeItem[];
  loading: boolean;
  selectedPath: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectNode: (node: any) => void;
  onDelete: (path: string) => void;
  onReadFile: (path: string) => void;
  onOpenSettings: () => void;
  rootPathName: string;
}

const DirectoryTreeContent = ({
  data,
  loading,
  selectedPath,
  onSelectNode,
  onDelete,
  onReadFile,
  onOpenSettings,
  rootPathName,
}: DirectoryTreeContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const treeRef = useRef<TreeApi<NodeItem>>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!loading && data && data.length > 0 && treeRef.current) {
      data.forEach((node) => {
        treeRef.current?.open(node.id);
      });
    }
  }, [loading, data]);

  return (
    <div className="set-text-font-size-smaller flex h-full flex-col justify-between">
      <div className="flex-1 overflow-auto" ref={containerRef}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Tree
            ref={treeRef}
            data={data}
            width={size.width}
            height={size.height}
            indent={20}
            rowHeight={28}
            padding={6}
            openByDefault={false}
            selection={selectedPath ? selectedPath : undefined}
          >
            {({ node, style }) => {
              const isSelected = selectedPath === node.id;

              return (
                <div
                  style={style}
                  className={`group flex cursor-pointer select-none items-center justify-between px-1 ${isSelected ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"} `}
                  onClick={() => {
                    onSelectNode(node);
                    if (!node.isLeaf) node.toggle();
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden truncate">
                    <span className="shrink-0">
                      {node.isLeaf ? (
                        <FaFile size={14} className="text-gray-500" />
                      ) : node.isOpen ? (
                        <FaFolderOpen size={14} className="text-blue-400" />
                      ) : (
                        <FaFolder size={14} className="text-blue-400" />
                      )}
                    </span>
                    <span className="truncate">{node.data.name}</span>
                  </div>

                  <div className="invisible flex items-center gap-2 pr-1 group-hover:visible">
                    {node.isLeaf && (
                      <Tooltip title="Mở file">
                        <div
                          className="rounded p-1 text-gray-600 hover:bg-gray-300 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReadFile(node.id);
                          }}
                        >
                          <FaEye size={12} />
                        </div>
                      </Tooltip>
                    )}

                    <Tooltip title="Xóa">
                      <div
                        className="rounded p-1 text-gray-600 hover:bg-red-100 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(node.id);
                        }}
                      >
                        <FaTrash size={12} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              );
            }}
          </Tree>
        )}
      </div>

      <footer className="mx-[-8px] mt-4 flex w-[calc(100%+16px)] items-center justify-between border-b border-t border-[var(--border-color)] px-2 py-2">
        <div
          className="max-w-[150px] truncate px-2 text-xs text-gray-500"
          title={rootPathName}
        >
          {selectedPath
            ? `...${selectedPath.slice(-15)}`
            : rootPathName.split("/").pop() || "Root"}
        </div>

        <Tooltip title="Cài đặt thư mục gốc" placement="top">
          <div
            className="hover-bg-gray hover-primary cursor-pointer rounded-sm p-1"
            onClick={onOpenSettings}
          >
            <IoSettingsSharp />
          </div>
        </Tooltip>
      </footer>
    </div>
  );
};

export default DirectoryTreeContent;
