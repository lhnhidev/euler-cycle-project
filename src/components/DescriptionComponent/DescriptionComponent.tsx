import { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import TitleComponent from "../TitleComponent";
import DescriptionTool from "../DescriptionTool";
import { useGraphContext } from "@/context/GraphContext";
import { useAppContext } from "@/context/AppContext";
import "./Description Component.css";

type TableType = {
  key: string;
  step: string;
  currentPosition: string;
  edge: string;
  temporaryCycle: string;
  stack: string;
};

const columns: TableColumnsType<TableType> = [
  {
    title: "Bước",
    width: 60,
    dataIndex: "step",
  },
  {
    title: "Vị trí hiện tại",
    width: 100,
    dataIndex: "currentPosition",
  },
  {
    title: "Cạnh được đi",
    width: 120,
    dataIndex: "edge",
  },
  {
    title: "Ngăn xếp",
    width: 180,
    dataIndex: "stack",
  },
  {
    title: "Chu trình tạm thời",
    dataIndex: "temporaryCycle",
  },
];

const DescriptionComponent = () => {
  const { isDirected, graph } = useGraphContext();
  const { render, nodeStart } = useAppContext();

  const [data, setData] = useState<TableType[]>([]);

  useEffect(() => {
    const result = graph.current.buildEulerCycle(nodeStart.id);
    console.log(result.tableSteps);

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
        temporaryCycle: step.tempCircuit.join(" -> "),
        stack: step.stack.join(", "),
      };
    });

    setData(formattedData);
  }, [graph, render, isDirected, nodeStart.id]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="relative">
        <TitleComponent
          title="Mô tả quy trình"
          style={{ paddingLeft: "8px", paddingRight: "8px" }}
        />
        <DescriptionTool
          style={{ position: "absolute", top: 0, right: 0, height: "100%" }}
        />
      </div>
      <div className="my-2 flex-1 overflow-auto bg-[var(--bg-color)]">
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
          className="[&_.ant-table-body]:!max-h-full [&_.ant-table-container]:!h-full [&_.ant-table-container]:!rounded-t-none [&_.ant-table-thead>tr>th:first-child]:!rounded-tl-none [&_.ant-table-thead>tr>th:last-child]:!rounded-tr-none [&_.ant-table]:!h-full"
        />
      </div>
    </div>
  );
};
export default DescriptionComponent;
