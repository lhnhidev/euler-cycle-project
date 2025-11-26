import type { Message } from "@/components/ChatComponent/ChatComponent";
import { AppContext } from "./AppContext";
import { useState, type ReactNode } from "react";
import { Modal, message } from "antd";

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

  const [highlightedCell, setHighlightedCell] = useState<{
    row: number | null;
    col: number | null;
  }>({
    row: null,
    col: null,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [messageApi, contextHolderMess] = message.useMessage();

  const [modal, contextHolder] = Modal.useModal();

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
        highlightedCell,
        setHighlightedCell,
        messages,
        setMessages,
        modal,
        contextHolder,
        messageApi,
        contextHolderMess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
