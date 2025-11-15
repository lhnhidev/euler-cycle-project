import { useEffect, useState } from "react";
import DescriptionComponent from "./components/DescriptionComponent";
import DetailedResult from "./components/DetailedResult";
import DirectoryTree from "./components/DirectoryTree";
import EnteringGraph from "./components/EnteringGraph";
import GraphDisplay from "./components/GraphDisplay";
import PesudoCode from "./components/PesudoCode";
import ResultComponent from "./components/ResultComponent";
import Window from "./components/Window";
import { useAppContext } from "./context/AppContext";
import { BsRobot } from "react-icons/bs";
import "animate.css";
import ChatComponent from "./components/ChatComponent";

function App() {
  const { minimizeDescriptionComponent, isDetailedResultHidden } =
    useAppContext();
  const [showChatbotLabel, setShowChatbotLabel] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleShowChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  useEffect(() => {
    if (showChatbot) {
      setShowChatbotLabel(false);
      return;
    }
    const timer = setTimeout(
      () => {
        setShowChatbotLabel((prev) => !prev);
      },
      showChatbotLabel ? 4000 : 8000,
    );

    return () => clearTimeout(timer);
  }, [showChatbotLabel, showChatbot]);

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
          className={`col-start-4 col-end-[12] row-start-1 flex flex-col bg-pink-300 ${minimizeDescriptionComponent ? "row-end-[14]" : "row-end-8"}`}
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

      <DetailedResult isHidden={isDetailedResultHidden} />
      <div className="absolute bottom-[40px] right-[30px] z-[99999999] flex items-center gap-3">
        {showChatbotLabel && (
          <span className="animate__bounceIn animate__animated rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 opacity-65 shadow-md">
            Hỏi mình gì đó đi...
          </span>
        )}
        {!showChatbot ? (
          <div
            onClick={handleShowChatbot}
            className="cursor-pointer rounded-full bg-[var(--primary-color)] p-3 text-3xl text-white shadow-lg hover:bg-[var(--secondary-color)]"
          >
            <BsRobot />
          </div>
        ) : (
          <div className="">
            <ChatComponent setShowChatbot={setShowChatbot}></ChatComponent>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
