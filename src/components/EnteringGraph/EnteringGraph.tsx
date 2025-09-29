import { ConfigProvider, Segmented } from "antd";
import TitleComponent from "../TitleComponent";
import InputGraph from "./InputGraph";

const EnteringGraph = () => {
  return (
    <div className="h-full border-l border-[var(--border-color)] bg-[var(--bg-color)] px-2 py-4">
      <div className="">
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
              block
              className="flex h-10 items-center"
            />
          </ConfigProvider>
        </div>

        <div className="mt-4">
          <InputGraph />
        </div>
      </div>
    </div>
  );
};
export default EnteringGraph;
