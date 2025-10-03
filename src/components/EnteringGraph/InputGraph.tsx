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

const InputGraph = () => {
  const { graph } = useGraphContext();
  const [emit, setEmit] = useState<boolean>(false);

  const { minimizeDescriptionComponent } = useAppContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>("0 0\n");
  const viewRef = useRef<EditorView | null>(null);

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

    const g = graph.current;
    const amountOfNodes_g = g.getNumberOfNodes();
    const amountOfEdges_g = g.getNumberOfEdges();
    const listOfEdges_g = g.getEdges();
    const listOfNodes_g = g.getNodes();

    const amountOfNodes_iv = Number.parseInt(
      inputValue.trim().slice(0, inputValue.indexOf(" ")),
    );
    const amountOfEdges_iv = Number.parseInt(
      inputValue.trim().slice(inputValue.indexOf(" ") + 1),
    );

    // console.log(amountOfNodes_g, amountOfEdges_g);

    if (amountOfNodes_iv >= 0 && amountOfEdges_iv >= 0) {
      console.log(amountOfEdges_g, amountOfEdges_iv);
      console.log(amountOfNodes_g, amountOfNodes_iv);
      if (
        amountOfEdges_g !== amountOfEdges_iv ||
        amountOfNodes_g !== amountOfNodes_iv
      ) {
        console.log("Có sự khác biệt");
      } else {
        console.log("Không có sự khác biệt");
      }
    } else {
      console.log("Loi roi");
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
  }, []);

  return (
    <div className={`mt-4 flex flex-1 flex-col`} ref={containerRef}>
      <div
        ref={editorRef}
        style={{
          height: `${minimizeDescriptionComponent ? 450 : 250}px`,
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
