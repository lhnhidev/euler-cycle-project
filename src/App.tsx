import DescriptionComponent from "./components/DescriptionComponent";
import DirectoryTree from "./components/DirectoryTree";
import EnteringGraph from "./components/EnteringGraph";
import GraphDisplay from "./components/GraphDisplay";
import PesudoCode from "./components/PesudoCode";
import ResultComponent from "./components/ResultComponent";
import Window from "./components/Window";

function App() {
  return (
    <>
      <Window />
      <div className="ml-[calc(var(--height-title-bar-windows)+2px)] mt-[var(--height-title-bar-windows)] grid h-[calc(100vh-var(--height-title-bar-windows))] grid-cols-[repeat(14,minmax(0,1fr))] grid-rows-[repeat(13,minmax(0,1fr))]">
        <div className="col-start-1 col-end-4 row-start-1 row-end-8">
          <DirectoryTree />
        </div>

        <div className="col-start-1 col-end-4 row-start-8 row-end-[14]">
          <ResultComponent />
        </div>

        <div className="col-start-4 col-end-8 row-start-8 row-end-[14] bg-red-300">
          <PesudoCode />
        </div>

        <div className="col-start-4 col-end-[12] row-start-1 row-end-8 bg-pink-300">
          <GraphDisplay />
        </div>

        <div className="col-start-8 col-end-[15] row-start-8 row-end-[14] bg-green-300">
          <DescriptionComponent />
        </div>

        <div className="col-start-[12] col-end-[15] row-start-1 row-end-8">
          <EnteringGraph />
        </div>
      </div>
    </>
  );
}

export default App;
