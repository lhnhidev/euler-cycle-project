import { ConfigProvider, Segmented, Tooltip } from "antd";
import TitleComponent from "../TitleComponent";
import InputGraph from "./InputGraph";
import { FaAnglesUp } from "react-icons/fa6";
import { useAppContext } from "@/context/AppContext";
import { useGraphContext } from "@/context/GraphContext";

const EnteringGraph = () => {
  const { minimizeDescriptionComponent, setMinimizeDescriptionComponent } =
    useAppContext();

  const { isDirected, setIsDirected } = useGraphContext();

  return (
    <div className="h-full border-l border-[var(--border-color)] bg-[var(--bg-color)] px-2 py-4">
      <div className="flex h-full flex-col">
        <TitleComponent
          title="Nhập liệu đồ thị"
          style={{ marginTop: "-16px" }}
        />

        <div className="mt-3">
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  trackBg: "#ffffff", // nền track
                  itemSelectedBg: "var(--primary-color)", // nền khi chọn
                  colorText: "#ffffff", // màu chữ
                  itemHoverColor: "var(--text-color)", // màu chữ khi hover
                  itemSelectedColor: "#ffffff", // màu chữ khi chọn
                },
              },
            }}
          >
            <Segmented
              options={["Vô hướng", "Có hướng"]}
              value={isDirected ? "Có hướng" : "Vô hướng"}
              onChange={(value) => {
                // console.log(value);
                setIsDirected(value === "Có hướng" ? true : false);
              }}
              size="large"
              block
              className="flex h-10 items-center"
            />
          </ConfigProvider>
        </div>

        <InputGraph />

        <div
          className={`flex w-full justify-end pb-3 pr-4 transition-all ${minimizeDescriptionComponent ? "" : "hidden"}`}
        >
          <Tooltip title="Hiển thị mô tả" placement="topLeft">
            <div
              className="rounded-full border border-gray-300 bg-[var(--primary-color)] p-3 text-white shadow-md hover:cursor-pointer hover:opacity-80"
              onClick={() =>
                setMinimizeDescriptionComponent(!minimizeDescriptionComponent)
              }
            >
              <FaAnglesUp />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
export default EnteringGraph;
