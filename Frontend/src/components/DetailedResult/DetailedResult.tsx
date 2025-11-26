import { useAppContext } from "@/context/AppContext";
import { IoMdClose } from "react-icons/io";
import CountComponentInGraph from "./CountComponentInGraph";
import { useGraphContext } from "@/context/GraphContext";
import { useEffect, useState } from "react";
import ResultTable from "../ResultComponent/ResultTable";
import { Table, type TableColumnsType } from "antd";
import type { TableType } from "../DescriptionComponent/DescriptionComponent";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

type Props = {
  isHidden: boolean;
};

const DetailedResult = ({ isHidden }: Props) => {
  const { setIsDetailedResultHidden, nodeStart } = useAppContext();
  const { isDirected, info, graph, isEulerian, hasEulerPath } =
    useGraphContext();

  const [data, setData] = useState<TableType[]>([]);

  useEffect(() => {
    const result = info;

    const formattedData = result.tableSteps.map((step, index) => {
      return {
        key: (index + 1).toString(),
        step: (index + 1).toString(),
        currentPosition: step.currentNode,
        edge: step.edgeMoved
          ? `${step.edgeMoved.source} -> ${step.edgeMoved.target}`
          : index === 0
            ? ""
            : "Đã đi hết",
        temporaryCycle: isDirected
          ? step.tempCircuit.reverse().join(" -> ")
          : step.tempCircuit.join(" -> "),
        stack: step.stack.join(", "),
      };
    });

    setData(formattedData);
  }, [graph, isDirected, nodeStart.id, info]);

  const columns: TableColumnsType<TableType> = [
    {
      title: "Bước",
      width: 50,
      dataIndex: "step",
    },
    {
      title: "Vị trí hiện tại",
      width: 100,
      dataIndex: "currentPosition",
    },
    {
      title: "Cạnh được đi",
      width: 110,
      dataIndex: "edge",
    },
    {
      title: "Ngăn xếp",
      width: 150,
      dataIndex: "stack",
    },
    {
      title: "Chu trình tạm thời",
      dataIndex: "temporaryCycle",
    },
  ];

  return isHidden ? null : (
    <div
      onClick={() => setIsDetailedResultHidden(true)}
      className="fixed inset-0 z-[50000000000] flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[80vh] w-[80vw] rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="flex h-full flex-col">
          {/* Nút đóng */}
          <button
            onClick={() => setIsDetailedResultHidden(true)}
            className="absolute right-3 top-3 text-xl text-gray-500 hover:text-gray-700"
          >
            <IoMdClose />
          </button>

          {/* Nội dung modal */}
          <div className="flex h-full flex-1 flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[var(--primary-color)]">
                Kết quả chi tiết
              </h2>
              <hr className="mt-3" />
            </div>
            <div className="flex h-[calc(100%-70px)] w-full">
              <div className="flex-1">
                <CountComponentInGraph />
              </div>
              <div className="flex h-full flex-1 flex-col gap-4 overflow-auto pr-1">
                <div className="flex gap-10">
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-[var(--primary-color)]">
                      Thông tin đồ thị:
                    </h3>
                    <ul className="list-disc pl-5">
                      <li>
                        Đỉnh bắt đầu:{" "}
                        {nodeStart.id ? (
                          nodeStart.label
                        ) : (
                          <span
                            className={`${nodeStart.id ? "" : "text-red-500"}`}
                          >
                            Chưa chọn
                          </span>
                        )}
                      </li>
                      <li>
                        Dạng đồ thị: {isDirected ? "Có hướng" : "Vô hướng"}
                      </li>
                      <li>Số đỉnh: {graph.current.getNodes().length}</li>
                      <li>Số cạnh: {graph.current.getEdges().length}</li>
                      <li>
                        Số thành phần liên thông {isDirected ? "mạnh" : ""}:{" "}
                        {graph.current.countComponents()}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-bold text-[var(--primary-color)]">
                      Kết luận:
                    </h3>
                    <ul className="list-disc pl-5">
                      <li>
                        Đồ thị{" "}
                        {isEulerian === null
                          ? "không khả dụng"
                          : isEulerian
                            ? "có chu trình Euler"
                            : "không có chu trình Euler"}
                      </li>
                      <p className="mb-2 mt-1 pl-4 text-sm italic text-[var(--secondary-color)]">
                        {nodeStart.id
                          ? info.circuit.map((node) => node.label).join(" -> ")
                          : "Chưa chọn đỉnh bắt đầu"}
                      </p>
                      <li>
                        Đồ thị{" "}
                        {hasEulerPath !== null
                          ? hasEulerPath
                            ? "có đường đi Euler"
                            : "không có đường đi Euler"
                          : ""}
                      </li>
                      <p className="mb-2 mt-1 pl-4 text-sm italic text-[var(--secondary-color)]">
                        {nodeStart.id
                          ? hasEulerPath
                            ? graph.current
                                .buildEulerPath()
                                .map((node) => node.label)
                                .join(" -> ")
                            : ""
                          : "Chưa chọn đỉnh bắt đầu"}
                      </p>
                    </ul>
                  </div>
                </div>

                <hr />

                <div className="w-full">
                  <h3 className="mb-2 text-lg font-bold text-[var(--primary-color)]">
                    Bậc của đỉnh:
                  </h3>
                  <div>
                    <ResultTable isDetailed={true}></ResultTable>
                  </div>
                </div>

                <hr className="mt-3" />

                <div className="w-full">
                  <h3 className="mb-2 text-lg font-bold text-[var(--primary-color)]">
                    Mô tả quy trình:
                  </h3>
                  <div>
                    <Table<TableType>
                      bordered={true}
                      columns={columns}
                      dataSource={data}
                      size="small"
                      pagination={false}
                      sticky
                      style={{
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                      }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <>
                            <div className="mb-3">
                              <h4 className="font-semibold text-[var(--primary-color)]">
                                Thông tin Bước {record.step}:
                              </h4>
                              <ul className="list-disc space-y-1 pl-5">
                                <li>
                                  Ngăn xếp ở bước trước: [{"  "}
                                  {info.tableSteps[
                                    Number(record.step) - 1
                                  ].stackPrevious.join(", ")}
                                  {"  "}]
                                </li>
                                {record.step !== "1" && (
                                  <li>
                                    Danh sách cạnh kề của đỉnh{" "}
                                    {
                                      info.tableSteps[Number(record.step) - 1]
                                        .currentNode
                                    }
                                    :
                                    <table className="mt-1 w-full table-auto border-collapse border border-slate-400">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="w-20 border border-slate-300 px-2 py-1 text-left">
                                            Cạnh
                                          </th>
                                          <th className="w-36 border border-slate-300 px-2 py-1 text-left">
                                            Trạng thái
                                          </th>
                                          <th className="border border-slate-300 px-2 py-1 text-left">
                                            Kết luận
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {info.tableSteps[
                                          Number(record.step) - 1
                                        ].listEdge.map((edge, index) => (
                                          <tr key={index}>
                                            <td className="border border-slate-300 px-2 py-1">
                                              {edge.source} - {edge.target}
                                            </td>
                                            <td className="border border-slate-300 px-2 py-1">
                                              {edge.isMoved
                                                ? "Đã duyệt"
                                                : "Chưa duyệt"}
                                            </td>
                                            <td className="border border-slate-300 px-2 py-1">
                                              Cạnh ({edge.source} -{" "}
                                              {edge.target}){" "}
                                              {edge.isMoved
                                                ? "không đi được"
                                                : "có thể đi"}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </li>
                                )}
                              </ul>
                            </div>

                            <div className="mb-3">
                              <h4 className="font-semibold text-[var(--primary-color)]">
                                Chi tiết Bước {record.step}:
                              </h4>

                              <ol className="space-y-1 pl-5">
                                {info.tableSteps[
                                  Number(record.step) - 1
                                ].note.map((note) => (
                                  <li key={crypto.randomUUID()}>{note}</li>
                                ))}
                              </ol>
                            </div>
                          </>
                        ),
                        expandIcon: ({ expanded, onExpand, record }) =>
                          expanded ? (
                            <span
                              onClick={(e) => onExpand(record, e)}
                              style={{ cursor: "pointer" }}
                              className="hover:text-[var(--primary-color)]"
                            >
                              <AiOutlineMinus />
                            </span>
                          ) : (
                            <span
                              onClick={(e) => onExpand(record, e)}
                              style={{ cursor: "pointer" }}
                              className="hover:text-[var(--primary-color)]"
                            >
                              <AiOutlinePlus />
                            </span>
                          ),
                      }}
                      className="[&_.ant-table-body]:!max-h-full [&_.ant-table-container]:!h-full [&_.ant-table-container]:!rounded-t-none [&_.ant-table-thead>tr>th:first-child]:!rounded-tl-none [&_.ant-table-thead>tr>th:last-child]:!rounded-tr-none [&_.ant-table]:!h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResult;
