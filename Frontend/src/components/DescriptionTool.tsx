import { useAppContext } from "@/context/AppContext";
import { Tooltip } from "antd";
import { IoMdClose } from "react-icons/io";

type Props = {
  style?: React.CSSProperties;
};

const DescriptionTool = ({ style }: Props) => {
  const { minimizeDescriptionComponent, setMinimizeDescriptionComponent } =
    useAppContext();

  return (
    <div style={style}>
      <Tooltip title="Đóng" placement="topLeft">
        <div
          className="hover-primary hover-bg-gray mr-2 flex cursor-pointer items-center p-2 text-xl"
          onClick={() =>
            setMinimizeDescriptionComponent(!minimizeDescriptionComponent)
          }
        >
          <IoMdClose />
        </div>
      </Tooltip>
    </div>
  );
};
export default DescriptionTool;
