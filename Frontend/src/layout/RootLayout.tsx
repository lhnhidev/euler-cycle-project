import { Outlet } from "react-router-dom";
import Window from "@/components/Window";
import { useAppContext } from "@/context/AppContext";

const RootLayout = () => {
  const { contextHolder, contextHolderMess } = useAppContext();

  return (
    <>
      <Window />
      <Outlet />
      {contextHolder}
      {contextHolderMess}
    </>
  );
};

export default RootLayout;
