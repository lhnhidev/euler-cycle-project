import { AppContext } from "./AppContext";
import { useState, type ReactNode } from "react";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ping, setPing] = useState<string>("Hello from app context!");
  const [minimizeDescriptionComponent, setMinimizeDescriptionComponent] =
    useState<boolean>(false);

  const [isDetailedResultHidden, setIsDetailedResultHidden] =
    useState<boolean>(true);

  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);

  const [render, forceRender] = useState<number>(0);

  const [nodeStart, setNodeStart] = useState<{ id: string; label: string }>({
    id: "",
    label: "",
  });

  const [play, setPlay] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        ping,
        setPing,
        isDetailedResultHidden,
        setIsDetailedResultHidden,
        minimizeDescriptionComponent,
        setMinimizeDescriptionComponent,
        render,
        linesToHighlight,
        forceRender,
        setLinesToHighlight,
        nodeStart,
        setNodeStart,
        play,
        setPlay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
