import type { Message } from "@/components/ChatComponent/ChatComponent";
import { createContext } from "react";

export interface AppContextType {
  ping: string;
  setPing: React.Dispatch<React.SetStateAction<string>>;
  minimizeDescriptionComponent: boolean;
  setMinimizeDescriptionComponent: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  isDetailedResultHidden: boolean;
  setIsDetailedResultHidden: React.Dispatch<React.SetStateAction<boolean>>;
  render: number;
  linesToHighlight: number[];
  setLinesToHighlight: React.Dispatch<React.SetStateAction<number[]>>;
  forceRender: React.Dispatch<React.SetStateAction<number>>;
  nodeStart: { id: string; label: string };
  setNodeStart: React.Dispatch<
    React.SetStateAction<{ id: string; label: string }>
  >;
  play: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  highlightedCell: { row: number | null; col: number | null };
  setHighlightedCell: React.Dispatch<
    React.SetStateAction<{ row: number | null; col: number | null }>
  >;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modal: any;
  contextHolder: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageApi: any;
  contextHolderMess: React.ReactNode;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
