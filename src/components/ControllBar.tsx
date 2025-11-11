import { useGraphContext } from "@/context/GraphContext";
import { Input, Slider, Tooltip, type InputNumberProps } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  GiPerspectiveDiceSixFacesRandom,
  GiSpeaker,
  GiSpeakerOff,
} from "react-icons/gi";
import { ImNext2, ImPrevious2 } from "react-icons/im";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { MdAutoGraph, MdOutlineLoop } from "react-icons/md";
import { RiFileDownloadLine } from "react-icons/ri";
import FormatGraphOptions from "./FormatGraphOptions";
import { BiNetworkChart } from "react-icons/bi";
import { useAppContext } from "@/context/AppContext";
import { useNotificationWithIcon } from "@/services/notify";
import { createRunner } from "@/animation/playAlgorithm";
import DownloadGraph from "./DownloadGraph";

const ControllBar = () => {
  const { graph } = useGraphContext();
  const {
    nodeStart,
    setNodeStart,
    setLinesToHighlight,
    play,
    setPlay,
    render,
  } = useAppContext();
  const { info, setInfo, isDirected } = useGraphContext();

  // const [play, setPlay] = useState<boolean>(false);
  const [speak, setSpeak] = useState<boolean>(false);
  const [showFormatOption, setShowFormatOption] = useState<boolean>(false);
  const [showDownloadOption, setShowDownloadOption] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [maxSliderValue, setMaxSliderValue] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(2);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const onChange: InputNumberProps["onChange"] = (newValue) => {
    setSpeed(newValue as number);
  };

  const openNotificationWithIcon = useNotificationWithIcon();

  const runnerRef = useRef<ReturnType<typeof createRunner> | null>(null);

  useEffect(() => {
    if (!graph.current || info.detailSteps.length === 0) return;

    // Ngừng runner cũ nếu có
    runnerRef.current?.pause();

    // Tạo runner mới
    runnerRef.current = createRunner(
      graph.current,
      info, // ✅ Truyền toàn bộ info, không chỉ detailSteps
      setLinesToHighlight,
      () => 1500 / speedRef.current,
      setSliderValue,
      setPlay,
    );

    setMaxSliderValue(info.detailSteps.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph.current, info.detailSteps]);

  useEffect(() => {
    const runner = runnerRef.current;
    if (!runner) return;

    if (play) {
      console.log("▶ Bắt đầu chạy");
      runner.play();
    } else {
      console.log("⏸ Dừng lại");
      runner.pause();
    }
  }, [play]);

  useEffect(() => {
    setInfo(graph.current?.buildEulerCycle(nodeStart.id));
    setMaxSliderValue(info.steps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeStart.id, graph, render, isDirected]);

  const handlePlay = (run: boolean) => {
    if (!nodeStart.id && !nodeStart.label) {
      openNotificationWithIcon(
        "error",
        "Chưa chọn đỉnh bắt đầu",
        "Vui lòng chọn một đỉnh bắt đầu để tiếp tục",
        "bottomRight",
      );
      return;
    }

    if (!nodeStart.id && nodeStart.label) {
      openNotificationWithIcon(
        "error",
        "Đỉnh bắt đầu không hợp lệ",
        "Vui lòng chọn một đỉnh nằm trong đồ thị",
        "bottomRight",
      );
      return;
    }

    if (run) {
      setPlay(!play);
    }
  };

  const handleNext = () => {
    if (play) return;

    if (nodeStart.id === "") {
      openNotificationWithIcon(
        "error",
        "Chưa chọn đỉnh bắt đầu",
        "Vui lòng chọn một đỉnh bắt đầu để tiếp tục",
        "bottomRight",
      );
      return;
    }

    runnerRef.current?.next();
  };

  const handlePrev = () => {
    if (play) return;

    if (nodeStart.id === "") {
      openNotificationWithIcon(
        "error",
        "Chưa chọn đỉnh bắt đầu",
        "Vui lòng chọn một đỉnh bắt đầu để tiếp tục",
        "bottomRight",
      );
      return;
    }

    runnerRef.current?.prev();
  };

  const handleSliderChange = (value: number) => {
    if (play) return;
    runnerRef.current?.seek(value);
  };

  const randomNodeStart = () => {
    const nodeList = graph.current?.getNodes();

    if (nodeList && nodeList.length > 0) {
      const randomIndex = Math.floor(Math.random() * (nodeList.length - 1 + 1)); // từ 0 đến nodeList.length - 1
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

  const handleReverseGraph = () => {
    handlePlay(false);
    setSliderValue(0);
    setPlay(false);
    runnerRef.current?.seek(0);
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
          min={0}
          max={maxSliderValue - 1}
          value={sliderValue}
          onChange={handleSliderChange}
          style={{ margin: 0, padding: 0, height: "4px" }}
          handleStyle={{
            opacity: 0, // ẩn nhưng vẫn giữ tooltip
            pointerEvents: "none", // tránh click trúng handle
          }}
          tooltip={{
            // open: true,
            formatter: (value) => `${value}/${maxSliderValue - 1}`, // định dạng nội dung tooltip
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
              value={typeof speed === "number" ? speed : 0}
              railStyle={{ backgroundColor: "white" }}
              trackStyle={{ backgroundColor: "var(--secondary-color)" }}
            />
          </div>
          <div>{typeof speed === "number" ? speed : 0}x</div>
        </div>

        <div className="flex items-center gap-4 text-[20px]">
          <div className="flex items-center gap-2">
            <div
              onClick={() => handlePrev()}
              className={`${play ? "text-gray-400" : "hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"}`}
            >
              <ImPrevious2 />
            </div>
            <div
              className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"
              onClick={() => handlePlay(true)}
            >
              {!play ? <IoIosPlay /> : <IoIosPause />}
            </div>
            <div
              onClick={() => handleNext()}
              className={`${play ? "text-gray-400" : "hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"}`}
            >
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
                className={`text-[18px] ${play ? "text-gray-400" : "hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"}`}
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[22px]">
          <div
            onClick={handleReverseGraph}
            className="hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"
          >
            <Tooltip title="Đặt lại đồ thị" placement="top">
              <MdOutlineLoop />
            </Tooltip>
          </div>

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
              <FormatGraphOptions show={showFormatOption} />
            </div>
            <div
              onClick={() => setShowFormatOption(!showFormatOption)}
              className={`${play ? "cursor-default text-gray-400" : "hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"} ${showFormatOption ? "text-[var(--secondary-color)]" : ""}`}
            >
              <Tooltip
                title={`${showFormatOption ? "Ẩn" : "Hiện"} tùy chỉnh đồ thị`}
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

          <div className="relative hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300">
            <div className="absolute bottom-[calc(100%+15px)] right-0 z-[100] bg-red-400">
              <DownloadGraph show={showDownloadOption} />
            </div>

            <div
              onClick={() => setShowDownloadOption(!showDownloadOption)}
              className={`${play ? "cursor-default text-gray-400" : "hover:cursor-pointer hover:text-[var(--secondary-color)] active:text-gray-300"} ${showDownloadOption ? "text-[var(--secondary-color)]" : ""}`}
            >
              <Tooltip
                title={`${showDownloadOption ? "Ẩn" : "Hiện"} tùy chọn tải xuống`}
                placement="top"
              >
                <RiFileDownloadLine />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ControllBar;
