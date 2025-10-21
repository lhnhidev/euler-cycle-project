import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, minimalSetup } from "codemirror";
import { lineNumbers } from "@codemirror/view";
// import { cpp } from "@codemirror/lang-cpp";
import {
  boldUppercasePlugin,
  createHighlightPlugin,
} from "@/libs/plugin-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useAppContext } from "@/context/AppContext";
import TitleComponent from "../TitleComponent";
import { Select } from "antd";
import { LANGUAGE_OPTIONS } from "@/const";

const PesudoCode = () => {
  const { nodeStart } = useAppContext();

  const editorRef = useRef(null);
  const { linesToHighlight } = useAppContext();
  const [lang, setLang] = useState(LANGUAGE_OPTIONS[2].value);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setLang(value);
  };

  const [pesudoCodeEnglish, setPesudoCodeEnglish] = useState(
    LANGUAGE_OPTIONS[2].pesudoCode(nodeStart),
  );
  const [pesudoCodeVietnamese, setPesudoCodeVietnamese] = useState(
    LANGUAGE_OPTIONS[1].pesudoCode(nodeStart),
  );
  const [pesudoCodeCpp, setPesudoCodeCpp] = useState(
    LANGUAGE_OPTIONS[0].pesudoCode(nodeStart),
  );

  useEffect(() => {
    setPesudoCodeEnglish(LANGUAGE_OPTIONS[2].pesudoCode(nodeStart));
    setPesudoCodeVietnamese(LANGUAGE_OPTIONS[1].pesudoCode(nodeStart));
    setPesudoCodeCpp(LANGUAGE_OPTIONS[0].pesudoCode(nodeStart));
  }, [nodeStart, nodeStart.label]);

  const [pesudoCode, setPesudoCode] = useState(pesudoCodeEnglish);

  useEffect(() => {
    switch (lang) {
      case "cpp":
        setPesudoCode(pesudoCodeCpp);
        break;
      case "vn":
        setPesudoCode(pesudoCodeVietnamese);
        break;
      default:
        setPesudoCode(pesudoCodeEnglish);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, pesudoCodeEnglish, pesudoCodeVietnamese, pesudoCodeCpp]);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: pesudoCode,
      extensions: [
        minimalSetup,
        javascript(),
        boldUppercasePlugin,
        createHighlightPlugin(linesToHighlight),
        lineNumbers(), // Hiển thị cột số dòng
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => view.destroy(); // cleanup khi component unmount
  }, [linesToHighlight, pesudoCode]);

  return (
    <div className="flex h-full flex-col">
      <div>
        <TitleComponent
          title="Mã giả chương trình"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          children={
            <div>
              <Select
                defaultValue="en"
                style={{ width: 105, height: 20, marginRight: 8 }}
                onChange={handleChange}
                size="small"
                options={[
                  { value: "cpp", label: "C++" },
                  { value: "vn", label: "Tiếng Việt" },
                  { value: "en", label: "English" },
                ]}
              />
            </div>
          }
        ></TitleComponent>
      </div>

      <div className="flex-1 overflow-auto bg-[var(--bg-color)] p-2">
        <div
          className="h-full w-full overflow-hidden rounded-sm bg-white"
          ref={editorRef}
        >
          {/* Component mã giả sẽ đặt ở đây */}
        </div>
      </div>
    </div>
  );
};
export default PesudoCode;
