import { AppContext } from "./AppContext";
import { useState, type ReactNode } from "react";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [test, setTest] = useState<string>("Hello from context!");
  const [minimizeDescriptionComponent, setMinimizeDescriptionComponent] =
    useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        test,
        setTest,
        minimizeDescriptionComponent,
        setMinimizeDescriptionComponent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
