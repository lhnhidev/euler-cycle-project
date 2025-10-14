import { Button, ConfigProvider, Tooltip, Upload } from "antd";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { MdOutlineUploadFile } from "react-icons/md";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
// import { cpp } from "@codemirror/lang-cpp";
import { useEffect, useRef, useState } from "react";
import "./inputGraphEditor.css";
import { useAppContext } from "@/context/AppContext";
import { useGraphContext } from "@/context/GraphContext";
import { useNotificationWithIcon } from "@/services/notify";

const InputGraph = () => {
  const { graph } = useGraphContext();
  const [emit, setEmit] = useState<boolean>(false);
  const openNotificationWithIcon = useNotificationWithIcon();

  const { minimizeDescriptionComponent } = useAppContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>("0 0\n");
  const viewRef = useRef<EditorView | null>(null);

  const handleSubmitInput = () => {
    const amountOfNodes_iv = Number.parseInt(
      inputValue.trim().slice(0, inputValue.indexOf(" ")),
    );

    const amountOfEdges_iv = Number.parseInt(
      inputValue.trim().slice(inputValue.indexOf(" ") + 1),
    );

    if (amountOfNodes_iv >= 0 && amountOfEdges_iv >= 0) {
      const lines = inputValue
        .trim()
        .toUpperCase()
        .split("\n")
        .map((line) => line.trim().split(" "));

      const edges = lines.slice(1);
      const nodesSet = new Set(edges.flat());
      // const listOfNodes_iv = [...nodesSet].slice(0, amountOfNodes_iv);
      const listOfNodes_iv = [...nodesSet];

      // console.log(listOfNodes_iv);

      if (amountOfNodes_iv !== listOfNodes_iv.length) {
        openNotificationWithIcon(
          "warning",
          "Số đỉnh không hợp lệ",
          "Các đỉnh trong danh sách cạnh khác với số đỉnh đã nhập dòng đầu",
          "bottomRight",
        );
        return;
      }

      if (amountOfEdges_iv !== edges.length) {
        openNotificationWithIcon(
          "warning",
          "Số cạnh không hợp lệ",
          "Các cạnh trong danh sách cạnh khác với số cạnh đã nhập dòng đầu",
          "bottomRight",
        );
        return;
      }
      openNotificationWithIcon(
        "success",
        "Áp dụng thành công",
        "Chọn play để bắt đầu thuật toán",
        "bottomRight",
      );

      const g = graph.current;
      g.clear();
      listOfNodes_iv.forEach((label, idx) => {
        g.addNode(idx.toString(), label);
      });
      edges.forEach((edge) => {
        const id1 = g.getNodeIdByLabel(edge[0]);
        const id2 = g.getNodeIdByLabel(edge[1]);
        g.addEdge(id1!, id2!);
      });

      g.display(document.querySelector("#cy")!, true);
      g.addNodeByClick(document.querySelector("#cy")!);
      g.addEdgeByClick();
      g.changeLabelNodeByClick(document.querySelector("#cy")!);
      g.deleteSelectedNode();
      g.deleteSelectedEdge();
      g.onChange?.();
    } else {
      console.log("Chưa có số đỉnh hoặc số cạnh hoặc cả 2"); // Not enough information
      openNotificationWithIcon(
        "error",
        "Dữ liệu không hợp lệ",
        "Chưa có số đỉnh hoặc số cạnh hoặc cả hai",
        "bottomRight",
      );
      return;
    }
  };

  const handleReadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setInputValue(content);
      }
    };
    handleSubmitInput();
    reader.readAsText(file);
  };

  useEffect(() => {
    const g = graph.current;
    const listener = () => {
      setEmit(!emit);
    };

    g.subscribe(listener);

    return () => {
      g.unsubscribe(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emit]);

  useEffect(() => {
    const g = graph.current;

    const amountOfNodes = g.getNumberOfNodes();
    const amountOfEdges = g.getNumberOfEdges();
    const listOfEdges = g.getEdges();
    setInputValue(
      `${amountOfNodes} ${amountOfEdges}\n${listOfEdges.map((edge) => `${g.getCore()!.getElementById(edge.source).data("label")} ${g.getCore()!.getElementById(edge.target).data("label")}`).join("\n")}`,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emit]);

  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (currentValue !== inputValue) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentValue.length, insert: inputValue },
        });
      }
    }
  }, [inputValue]);

  useEffect(() => {
    if (!editorRef.current) return;

    const style = {
      fontSize: "16px",
      color: "var(--text-color)",
    };

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        setInputValue(text); // cập nhật state React khi user gõ
      }
    });

    const state = EditorState.create({
      doc: inputValue,
      extensions: [
        basicSetup,
        updateListener,
        EditorView.theme({
          "&": style,
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative mt-4 flex flex-1 flex-col transition-all"
      ref={containerRef}
    >
      <div
        ref={editorRef}
        style={{
          height: `${minimizeDescriptionComponent ? 450 : 250}px`,
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      ></div>
      <button
        className="absolute flex h-8 items-center justify-center rounded-sm bg-[var(--primary-color)] px-3 py-1 text-white shadow-md transition-all hover:bg-[var(--secondary-color)]"
        style={{
          top: `calc(${minimizeDescriptionComponent ? 450 : 250}px - 32px - 12px)`,
          right: "18px",
        }}
        onClick={() => handleSubmitInput()}
      >
        Áp dụng
      </button>
      <div className="mt-3 flex items-center justify-end gap-2 transition-all">
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
              onClick={() =>
                graph.current.randomGraph(
                  document.getElementById("cy") as HTMLDivElement,
                )
              }
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
            <Upload
              accept=".txt"
              beforeUpload={(file) => {
                handleReadFile(file);
                return false;
              }}
            >
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
