import { AppContext } from "./AppContext";
import { useState, type ReactNode } from "react";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ping, setPing] = useState<string>("Hello from app context!");
  const [minimizeDescriptionComponent, setMinimizeDescriptionComponent] =
    useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        ping,
        setPing,
        minimizeDescriptionComponent,
        setMinimizeDescriptionComponent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
