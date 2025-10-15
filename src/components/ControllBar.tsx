import { useGraphContext } from "@/context/GraphContext";
import { Input, Slider, Tooltip, type InputNumberProps } from "antd";
import { useState } from "react";
import {
  GiPerspectiveDiceSixFacesRandom,
  GiSpeaker,
  GiSpeakerOff,
} from "react-icons/gi";
import { ImNext2, ImPrevious2 } from "react-icons/im";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { MdAutoGraph } from "react-icons/md";
import { RiFileDownloadLine } from "react-icons/ri";
import DownloadOptions from "./FormatGraphOptions";
import { BiNetworkChart } from "react-icons/bi";
import { useAppContext } from "@/context/AppContext";

const ControllBar = () => {
  const { graph } = useGraphContext();
  const { nodeStart, setNodeStart } = useAppContext();

  const [play, setPlay] = useState<boolean>(true);
  const [speak, setSpeak] = useState<boolean>(false);
  const [showDownloadOptions, setShowDownloadOptions] =
    useState<boolean>(false);

  const [inputValue, setInputValue] = useState(2);

  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setInputValue(newValue as number);
  };

  const handlePlay = () => {
    setPlay(!play);
    const info = graph.current?.buildEulerCycle(
      graph.current?.getNodes()[0].id,
    );
    console.log("info", info);
  };

  const randomNodeStart = () => {
    const nodeList = graph.current?.getNodes();

    if (nodeList && nodeList.length > 0) {
      const randomIndex = Math.floor(Math.random() * (nodeList.length - 1 + 1)); // từ 0 đến nodeList.length - 1
      console.log(nodeList[randomIndex]);
      setNodeStart(nodeList[randomIndex] || { id: "", label: "" });
    }
  };

  const handleFitGraph = () => {
    graph.current?.getCore()?.resize();
    graph.current?.getCore()?.fit(undefined, 20);
    graph.current
      ?.getCore()
      ?.layout({
        name: "cose", // layout phổ biến nhất cho đồ thị không hướng
        animate: false, // có hiệu ứng mượt
        padding: 20, // khoảng cách giữa biên và đồ thị
      })
      .run();
  };

  const handleChange = (value: string) => {
    const nodeList = graph.current?.getNodes();
    setNodeStart({ id: "", label: value });
    if (nodeList && nodeList.length > 0) {
      const foundNode = nodeList.find((node) => node.label === value);
      if (foundNode) {
        console.log({ id: foundNode.id, label: foundNode.label });
        setNodeStart({ id: foundNode.id, label: foundNode.label });
      }
    }
  };

  return (
    <div
      className="flex h-[40px] w-full flex-col border-t border-[var(--border-color)] bg-[var(--primary-color)] text-white"
      style={{
        borderRight: "1px solid var(--primary-color)",
        borderLeft: "1px solid var(--primary-color)",
      }}
    >
      <div>
        <Slider
          min={1}
          max={100}
          defaultValue={32}
          style={{ margin: 0, padding: 0, height: "4px" }}
          handleStyle={{
            opacity: 0, // ẩn nhưng vẫn giữ tooltip
            pointerEvents: "none", // tránh click trúng handle
          }}
          tooltip={{
            // open: true,
            formatter: (value) => `${value}/${100}`, // định dạng nội dung tooltip
          }}
          trackStyle={{
            backgroundColor: "var(--secondary-color)",
            borderRadius: 0,
            borderRight: "none",
            borderLeft: "none",
          }}
          railStyle={{
            backgroundColor: "#e6e6e6",
            borderRadius: 0,
            borderRight: "none",
            borderLeft: "none",
          }}
        />
      </div>
      <div className="flex h-[40px] w-full items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <div className="w-[100px]">
            <Slider
              min={1}
              max={5}
              defaultValue={2}
              onChange={onChange}
              value={typeof inputValue === "number" ? inputValue : 0}
              railStyle={{ backgroundColor: "white" }}
              trackStyle={{ backgroundColor: "var(--secondary-color)" }}
            />
          </div>
          <div>{typeof inputValue === "number" ? inputValue : 0}x</div>
        </div>

        <div className="flex items-center gap-4 text-[20px]">
          <div className="flex items-center gap-2">
            <div className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300">
              <ImPrevious2 />
            </div>
            <div
              className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"
              onClick={handlePlay}
            >
              {play ? <IoIosPlay /> : <IoIosPause />}
            </div>
            <div className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300">
              <ImNext2 />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Đỉnh bắt đầu"
              size="small"
              className="w-[100px] rounded-sm text-[12px]"
              value={nodeStart.label}
              onChange={(e) => handleChange(e.target.value)}
            />

            <Tooltip title="Chọn đỉnh ngẫu nhiên" placement="top">
              <GiPerspectiveDiceSixFacesRandom
                onClick={randomNodeStart}
                className="text-[18px] hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[22px]">
          <div className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300">
            <Tooltip
              title={speak ? "Tắt âm thanh" : "Bật âm thanh"}
              placement="top"
            >
              {speak ? <GiSpeaker /> : <GiSpeakerOff />}
            </Tooltip>
          </div>
          <div className="relative hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300">
            <div className="absolute bottom-[calc(100%+15px)] right-[-30px]">
              <DownloadOptions show={showDownloadOptions} />
            </div>
            <div
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className={`hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300 ${showDownloadOptions ? "text-[var(--secondary-color)]" : ""}`}
            >
              <Tooltip
                title={`${showDownloadOptions ? "Ẩn" : "Hiện"} tùy chọn điều chỉnh đồ thị`}
                placement="top"
              >
                <BiNetworkChart />
              </Tooltip>
            </div>
          </div>
          <div
            onClick={() => handleFitGraph()}
            className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"
          >
            <Tooltip title="Tự động căn chỉnh vị trí đồ thị" placement="top">
              <MdAutoGraph />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Hiện tùy chọn tải xuống" placement="top">
              <RiFileDownloadLine />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ControllBar;
