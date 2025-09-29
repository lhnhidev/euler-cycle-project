import { Button, ConfigProvider, Tooltip, Upload } from "antd";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { MdOutlineUploadFile } from "react-icons/md";

const InputGraph = () => {
  return (
    <div>
      <div className="h-[235px] w-full rounded-sm bg-white p-3">InputGraph</div>
      <div className="mt-3 flex items-center justify-end gap-2">
        {/* <label htmlFor="input-graph">Nhập bằng file .txt</label> */}
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBorderColor: "var(--primary-color)",
                defaultHoverColor: "var(--primary-color)",
              },
            },
          }}
        >
          <Tooltip placement="top" title="Đồ thị ngẫu nhiên">
            <Button
              icon={<GiPerspectiveDiceSixFacesRandom />}
              className="rounded-sm"
            >
              Random
            </Button>
          </Tooltip>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBorderColor: "var(--primary-color)",
                defaultHoverColor: "var(--primary-color)",
              },
            },
          }}
        >
          <Tooltip placement="top" title="Nhập bằng file .txt">
            <Upload accept=".txt" beforeUpload={() => false}>
              <Button icon={<MdOutlineUploadFile />} className="rounded-sm">
                Upload file TXT
              </Button>
            </Upload>
          </Tooltip>
        </ConfigProvider>
      </div>
    </div>
  );
};
export default InputGraph;
