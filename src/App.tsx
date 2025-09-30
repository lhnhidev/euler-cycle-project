import DescriptionComponent from "./components/DescriptionComponent";
import DirectoryTree from "./components/DirectoryTree";
import EnteringGraph from "./components/EnteringGraph";
import GraphDisplay from "./components/GraphDisplay";
import PesudoCode from "./components/PesudoCode";
import ResultComponent from "./components/ResultComponent";
import Window from "./components/Window";
import { useAppContext } from "./context/AppContext";

function App() {
  const { minimizeDescriptionComponent } = useAppContext();

  return (
    <>
      <Window />
      <div className="ml-[calc(var(--height-title-bar-windows)+2px)] mt-[var(--height-title-bar-windows)] grid h-[calc(100vh-var(--height-title-bar-windows))] grid-cols-[repeat(14,minmax(0,1fr))] grid-rows-[repeat(13,minmax(0,1fr))]">
        <div
          className={`col-start-1 col-end-4 row-start-1 ${minimizeDescriptionComponent ? "row-end-[14]" : "row-end-8"}`}
        >
          <DirectoryTree />
        </div>

        <div
          className={`col-start-1 col-end-4 row-start-8 row-end-[14] ${minimizeDescriptionComponent ? "hidden" : ""}`}
        >
          <ResultComponent />
        </div>

        <div
          className={`col-start-4 col-end-8 row-start-8 row-end-[14] bg-red-300 ${minimizeDescriptionComponent ? "hidden" : ""}`}
        >
          <PesudoCode />
        </div>

        <div
          className={`col-start-4 col-end-[12] row-start-1 bg-pink-300 ${minimizeDescriptionComponent ? "row-end-[14]" : "row-end-8"}`}
        >
          <GraphDisplay />
        </div>

        <div
          className={`col-start-8 col-end-[15] row-start-8 row-end-[14] bg-[var(--bg-color)] ${minimizeDescriptionComponent ? "hidden" : ""}`}
        >
          <DescriptionComponent />
        </div>

        <div
          className={`col-start-[12] col-end-[15] row-start-1 ${minimizeDescriptionComponent ? "row-end-[14]" : "row-end-8"}`}
        >
          <EnteringGraph />
        </div>
      </div>
    </>
  );
}

export default App;
