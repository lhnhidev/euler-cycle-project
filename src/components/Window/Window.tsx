import { ACTION_OPTIONS } from "@/const";
import WindowNav from "./WindowNav";
import WindowTitle from "./WindowTitle";
import { useGraphContext } from "@/context/GraphContext";

const Window = () => {
  const { graph } = useGraphContext();
  const handleSubmit = () => {
    console.log(graph.current.getNodes());
    console.log(graph.current.getEdges());
    ACTION_OPTIONS.colorNode(graph.current!, "1", "pink");
    // console.log(graph.current!.getEdges()[0].id);
    ACTION_OPTIONS.colorEdge(
      graph.current!,
      graph.current!.getEdges()[0].id,
      "red",
    );
    ACTION_OPTIONS.colorLabel(graph.current!, "1", "blue");
  };

  return (
    <>
      <button
        className="absolute z-[1000000000] ml-[300px] bg-red-500 p-5"
        onClick={() => handleSubmit()}
      >
        click
      </button>
      <WindowTitle />
      <WindowNav />
    </>
  );
};
export default Window;
