import { createContext } from "react";

export interface GraphContextType {
  ping: string;
  isDirected: boolean;
  setPing: React.Dispatch<React.SetStateAction<string>>;
  setIsDirected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GraphContext = createContext<GraphContextType | undefined>(
  undefined,
);
