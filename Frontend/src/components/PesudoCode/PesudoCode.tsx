import { useEffect, useRef, useState } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, minimalSetup } from "codemirror";
import { lineNumbers } from "@codemirror/view";
import {
  boldUppercasePlugin,
  createHighlightPlugin,
} from "@/libs/plugin-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useAppContext } from "@/context/AppContext";
import TitleComponent from "../TitleComponent";
import { Select } from "antd";
import { LANGUAGE_OPTIONS } from "@/const";

// ✅ Chỉ tạo 1 compartment duy nhất
const highlightCompartment = new Compartment();

const PesudoCode = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  const { nodeStart, linesToHighlight } = useAppContext();
  const [lang, setLang] = useState(LANGUAGE_OPTIONS[2].value);

  const [pesudoCode, setPesudoCode] = useState(
    LANGUAGE_OPTIONS[2].pesudoCode(nodeStart),
  );

  // ✅ Cập nhật nội dung mã giả khi nodeStart hoặc lang thay đổi
  useEffect(() => {
    const english = LANGUAGE_OPTIONS[2].pesudoCode(nodeStart);
    const vn = LANGUAGE_OPTIONS[1].pesudoCode(nodeStart);
    const cpp = LANGUAGE_OPTIONS[0].pesudoCode(nodeStart);

    switch (lang) {
      case "cpp":
        setPesudoCode(cpp);
        break;
      case "vn":
        setPesudoCode(vn);
        break;
      default:
        setPesudoCode(english);
    }
  }, [lang, nodeStart]);

  // ✅ Khởi tạo EditorView chỉ 1 lần
  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: pesudoCode,
      extensions: [
        minimalSetup,
        javascript(),
        lineNumbers(),
        boldUppercasePlugin,
        highlightCompartment.of(createHighlightPlugin(linesToHighlight)),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // chỉ chạy 1 lần

  // ✅ Cập nhật highlight mà không reset editor
  useEffect(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;

    view.dispatch({
      effects: highlightCompartment.reconfigure(
        createHighlightPlugin(linesToHighlight),
      ),
    });
  }, [linesToHighlight]);

  // ✅ Khi đổi ngôn ngữ hoặc nodeStart → cập nhật nội dung
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: pesudoCode,
        },
      });
    }
  }, [pesudoCode]);

  return (
    <div className="flex h-full flex-col">
      <TitleComponent
        title="Mã giả chương trình"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        children={
          <Select
            defaultValue="en"
            style={{ width: 105, height: 20, marginRight: 8 }}
            onChange={(value) => setLang(value)}
            size="small"
            options={[
              { value: "cpp", label: "C++" },
              { value: "vn", label: "Tiếng Việt" },
              { value: "en", label: "English" },
            ]}
          />
        }
      />
      <div className="flex-1 overflow-auto bg-[var(--bg-color)] p-2">
        <div
          className="h-full w-full overflow-hidden rounded-sm bg-white"
          ref={editorRef}
        />
      </div>
    </div>
  );
};

export default PesudoCode;
