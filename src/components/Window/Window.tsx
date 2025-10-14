import { useAppContext } from "@/context/AppContext";
import WindowNav from "./WindowNav";
import WindowTitle from "./WindowTitle";

const Window = () => {
  const { setLinesToHighlight } = useAppContext();
  const handleSubmit = () => {
    setLinesToHighlight([1, 5]);
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
