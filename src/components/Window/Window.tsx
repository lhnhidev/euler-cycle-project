import WindowNav from "./WindowNav";
import WindowTitle from "./WindowTitle";
import { useGraphContext } from "@/context/GraphContext";

const Window = () => {
  const { graph } = useGraphContext();
  const handleSubmit = () => {
    graph.current?.buildEulerCycle(graph.current?.getNodes()[0].id);
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
