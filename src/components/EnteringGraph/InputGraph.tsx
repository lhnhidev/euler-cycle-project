import { Button, ConfigProvider, Tooltip, Upload } from "antd";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { MdOutlineUploadFile } from "react-icons/md";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { useEffect, useRef } from "react";
import "./inputGraphEditor.css";

const InputGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Tạo state cho editor
    const state = EditorState.create({
      doc: `// Demo code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}`,
      extensions: [
        basicSetup,
        cpp(),
        EditorView.theme({
          "&": {
            fontSize: "16px", // chỉnh font-size
          },
        }),
      ],
    });

    // Render editor vào DOM
    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      view.destroy(); // cleanup
    };
  }, []);

  return (
    <div className={`mt-4 flex flex-1 flex-col`} ref={containerRef}>
      <div
        ref={editorRef}
        style={{
          height: "250px",
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
      <div className={`mt-3 flex items-center justify-end gap-2`}>
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
