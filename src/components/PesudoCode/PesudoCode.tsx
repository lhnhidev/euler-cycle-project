import { useEffect, useRef, useState } from "react";
import TitleComponent from "../TitleComponent";
import { EditorState } from "@codemirror/state";
import { EditorView, minimalSetup } from "codemirror";
// import { cpp } from "@codemirror/lang-cpp";
import {
  boldUppercasePlugin,
  createHighlightPlugin,
} from "@/libs/plugin-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useAppContext } from "@/context/AppContext";
import { Select } from "antd";

const PesudoCode = () => {
  const editorRef = useRef(null);
  const { linesToHighlight } = useAppContext();
  const [lang, setLang] = useState("vn");

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setLang(value);
  };

  // Các dòng cần bôi vàng

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pesudoCodeEnglish = `BEGIN
  IF graph infeasible THEN END
  start ← suitable node
  tour ← {start}
  REPEAT
    current = start ← node in tour with
                  unvisited edge
    subtour ← {start}
    DO
      {current, u} ← take unvisited edge
      subtour ← subtour ∪ {u}
      current ← u
    WHILE start ≠ current
    Integrate subtour in tour
  UNTIL tour is Eulerian path/cycle
END`;

  const pesudoCodeVietnamese = `BEGIN
  IF (đồ_thị_không_thoả_điều_kiện_Euler) THEN END
  start ← chọn đỉnh thích hợp để duyệt
  tour ← {start}
  REPEAT
    current = start ← đỉnh trong tour 
                      còn cạnh chưa được đi qua
    subtour ← {start}
    DO
      {current, u} ← lấy một cạnh chưa được đi qua
      subtour ← subtour ∪ {u}
      current ← u
    WHILE start ≠ current
    Hợp nhất subtour vào tour
  UNTIL tour là đường hoặc chu trình Euler
KẾT THÚC`;

  const pesudoCodeCpp = `123`;

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
  }, [lang]);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: pesudoCode,
      extensions: [
        minimalSetup,
        javascript(),
        EditorView.editable.of(false),
        boldUppercasePlugin,
        createHighlightPlugin(linesToHighlight),
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
                defaultValue="vn"
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
