import { Tooltip, Spin } from "antd";
import { IoSettingsSharp } from "react-icons/io5";
import { Tree } from "react-arborist";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import { useLayoutEffect, useRef, useState } from "react";

interface NodeItem {
  id: string;
  name: string;
  children?: NodeItem[];
}

const DirectoryTreeContent = ({
  data,
  loading,
}: {
  data: NodeItem[];
  loading: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="set-text-font-size-smaller flex h-full flex-col justify-between">
      <div className="flex-1 overflow-auto" ref={containerRef}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Tree
            data={data}
            width={size.width}
            height={size.height}
            indent={20}
            rowHeight={28}
            padding={6}
            openByDefault={false}
          >
            {({ node, style }) => (
              <div
                style={style}
                className="flex cursor-pointer select-none items-center gap-2 px-1 hover:bg-gray-200"
                onClick={() => {
                  if (!node.isLeaf) node.toggle();
                }}
              >
                {node.isLeaf ? (
                  <FaFile size={14} />
                ) : node.isOpen ? (
                  <FaFolderOpen size={14} />
                ) : (
                  <FaFolder size={14} />
                )}
                <span>{node.data.name}</span>
              </div>
            )}
          </Tree>
        )}
      </div>

      {/* FOOTER */}
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
