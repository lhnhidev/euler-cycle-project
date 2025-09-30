import { createContext } from "react";

export interface AppContextType {
  test: string;
  minimizeDescriptionComponent: boolean;
  setMinimizeDescriptionComponent: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setTest: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
