import { useGraphContext } from "@/context/GraphContext";
import Title from "../TitleComponent";
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import ResultTable from "./ResultTable";
import { Tooltip } from "antd";
import { IoInformationCircleOutline } from "react-icons/io5";

const ResultComponent = () => {
  const {
    isDirected,
    graph,
    isEulerian,
    hasEulerPath,
    setIsEulerian,
    setHasEulerPath,
  } = useGraphContext();
  const {
    isDetailedResultHidden,
    setIsDetailedResultHidden,
    render,
    forceRender,
  } = useAppContext();

  const { connectedComponents, setConnectedComponents } = useGraphContext();

  useEffect(() => {
    graph.current.setOnChange(() => forceRender((v) => v + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setConnectedComponents(graph.current.countComponents());
    setIsEulerian(graph.current.isEulerGraph());
    setHasEulerPath(graph.current.hasEulerPath());
  }, [
    graph,
    render,
    isDirected,
    setIsEulerian,
    setHasEulerPath,
    isEulerian,
    hasEulerPath,
    setConnectedComponents,
  ]);

  // const handleCount = () => {
  //   console.log(graph.current);
  //   setConnectedComponents(graph.current.countComponents());
  // };

  // useEffect(() => {
  //   setConnectedComponents(graph.current.countComponents());
  // }, [graph]);

  return (
    <div className="flex h-full flex-col bg-[var(--bg-color)] px-2 pb-2">
      <Title title="Kết quả thuật toán" />

      {/* <button onClick={() => handleCount()}>click</button> */}

      <div className="mt-2 flex flex-1 flex-col gap-3 overflow-auto bg-white px-2 py-2">
        <div className="rouded-sm relative flex flex-1 flex-col">
          <Tooltip
            title="Kết quả chi tiết"
            placement="top"
            className="absolute right-0 top-[-4px]"
          >
            <div
              onClick={() => setIsDetailedResultHidden(!isDetailedResultHidden)}
              className="hover-primary cursor-pointer rounded-sm p-1 text-xl hover:bg-gray-200"
            >
              <IoInformationCircleOutline />
            </div>
          </Tooltip>

          <div className="w-full space-y-1">
            <div className="flex gap-1">
              <span className="set-text-font-size-smaller text-[var(--primary-color)]">
                Dạng đồ thị:
              </span>
              <p className="set-text-font-size-smaller">
                {isDirected ? "có hướng" : "vô hướng"}
              </p>
            </div>
            <div className="flex gap-1">
              <span className="set-text-font-size-smaller text-[var(--primary-color)]">
                {isDirected
                  ? "Số thành phần liên thông mạnh:"
                  : "Số thành phần liên thông:"}
              </span>
              <p className="set-text-font-size-smaller">
                {connectedComponents}
              </p>
            </div>

            <ResultTable></ResultTable>

            <div className="flex flex-col gap-1">
              {/* <hr className="my-1" /> */}

              <div>
                <span className="set-text-font-size-smaller text-[var(--primary-color)]">
                  Kết luận:
                </span>
                <div className="ml-2">
                  <ul className="list-disc pl-5">
                    <li>
                      <p className="set-text-font-size-smaller">
                        {isEulerian === null
                          ? "Đồ thị không khả dụng"
                          : isEulerian
                            ? "Đồ thị có chu trình Euler"
                            : "Đồ thị không có chu trình Euler"}
                      </p>
                    </li>

                    {hasEulerPath !== null && (
                      <li>
                        <p className="set-text-font-size-smaller">
                          {hasEulerPath
                            ? "Đồ thị có đường đi Euler"
                            : "Đồ thị không có đường đi Euler"}
                        </p>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <span className="set-text-font-size-smaller text-[var(--primary-color)]">
                  Giải thích:
                </span>

                <p className="set-text-font-size-smaller ml-3">
                  Vì nó không có đỉnh bậc chẵn
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-12">
            <div className="hover-primary cursor-pointer rounded-sm p-1 hover:bg-gray-200">
              <button
                onClick={() =>
                  setIsDetailedResultHidden(!isDetailedResultHidden)
                }
                className="set-text-font-size-smaller w-full rounded-md bg-[var(--primary-color)] p-2 text-white transition-all hover:bg-[var(--secondary-color)]"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultComponent;
