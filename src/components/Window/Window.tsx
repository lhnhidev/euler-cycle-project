import { run } from "@/animation/playAlgorithm";
import WindowNav from "./WindowNav";
import WindowTitle from "./WindowTitle";
import { useGraphContext } from "@/context/GraphContext";
import { useAppContext } from "@/context/AppContext";

const Window = () => {
  const { graph } = useGraphContext();
  const { setLinesToHighlight } = useAppContext();
  const handleSubmit = () => {
    const res = graph.current.buildEulerCycle("0");
    console.log(res);
    run(graph.current, { detailSteps: res.detailSteps }, setLinesToHighlight);
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
