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
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
