// import { useAppContext } from "@/context/AppContext";
import WindowNav from "./WindowNav";
import WindowTitle from "./WindowTitle";
// import { useGraphContext } from "@/context/GraphContext";
// import { useAppContext } from "@/context/AppContext";

const Window = () => {
  // const { graph } = useGraphContext();
  // const { nodeStart } = useAppContext();
  // const { setLinesToHighlight } = useAppContext();
  // const handleTest = () => {
  //   console.log(graph.current.buildEulerCycle(nodeStart.id).tableSteps);
  // };

  return (
    <>
      {/* html này để test nhanh một số hàm thôi =)) */}
      {/* <button
        className="absolute z-[1000000000] ml-[300px] bg-red-500 p-5"
        onClick={() => handleTest()}
      >
        click
      </button> */}
      <WindowTitle />
      <WindowNav />
    </>
  );
};
export default Window;
