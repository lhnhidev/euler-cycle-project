import { useAppContext } from "@/context/AppContext";
import WindowNav from "./WindowNav";
import WindowTitle from "./WindowTitle";
import { useGraphContext } from "@/context/GraphContext";
// import { useAppContext } from "@/context/AppContext";

const Window = () => {
  const { graph } = useGraphContext();
  const { nodeStart } = useAppContext();
  // const { setLinesToHighlight } = useAppContext();
  const handleSubmit = () => {
    console.log(
      "Thực hiện thuật toán với nút: ",
      nodeStart.id,
      nodeStart.label,
    );
    console.log(graph.current.buildEulerCycle(nodeStart.id));
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
