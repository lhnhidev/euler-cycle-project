import { Radio } from "antd";
import { useState } from "react";
import { useGraphContext } from "@/context/GraphContext";

type Props = {
  show: boolean;
};

const DownloadGraph = ({ show }: Props) => {
  const [typeFile, setTypeFile] = useState<string>("png");

  const { graph } = useGraphContext();

  const handleExportFile = () => {
    if (!graph?.current) return;
    const cy = graph.current.getCore();

    if (typeFile === "png" || typeFile === "jpg") {
      // xuất ảnh (png hoặc jpg)
      const data =
        typeFile === "png"
          ? cy!.png({ full: true, scale: 2, bg: "white" })
          : cy!.jpg({ full: true, quality: 0.9, bg: "white" });

      const link = document.createElement("a");
      link.href = data;
      link.download = `graph.${typeFile}`;
      link.click();
    } else if (typeFile === "json") {
      // xuất dữ liệu JSON
      const jsonString = JSON.stringify(cy!.json(), null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "graph.json";
      link.click();
    }
  };

  return (
    <div
      className={`set-text-font-size-smaller w-[220px] cursor-default rounded-sm bg-[var(--bg-color)] px-4 py-2 text-[var(--text-color)] shadow-sm ${show ? "" : "hidden"}`}
    >
      <p className="mb-2 font-bold text-[var(--primary-color)]">
        Chọn định dạng tải xuống:
      </p>
      <Radio.Group
        value={typeFile}
        onChange={(e) => setTypeFile(e.target.value)}
      >
        <Radio value="png">png</Radio>
        <Radio value="jpg">jpg</Radio>
        <Radio value="json">json</Radio>
      </Radio.Group>

      <div className="flex justify-center">
        <button
          onClick={handleExportFile}
          className="mt-3 block w-full rounded-md bg-[var(--primary-color)] p-1 text-[11px] text-white transition-all hover:bg-[var(--secondary-color)]"
        >
          Xuất File
        </button>
      </div>
    </div>
  );
};
export default DownloadGraph;
