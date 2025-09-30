import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import TitleComponent from "../TitleComponent";
import DescriptionTool from "../DescriptionTool";

interface DataType {
  key: React.Key;
  name?: string;
  age?: number;
  address?: string;
  step?: string;
  currentPosition?: string;
  edge?: string;
  temporaryCycle?: string;
  note?: string;
}

const columns: TableColumnsType<DataType> = [
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
    title: "Chu trình tạm thời",
    width: 250,
    dataIndex: "temporaryCycle",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
  },
];

const data: DataType[] = [
  {
    key: "1",
    step: "1",
    currentPosition: "A",
    edge: "A -> B",
    temporaryCycle: "A → B",
    note: "đi sang B",
  },
  {
    key: "2",
    step: "2",
    currentPosition: "B",
    edge: "B -> C",
    temporaryCycle: "A → B → C",
    note: "đi sang C",
  },
  {
    key: "3",
    step: "3",
    currentPosition: "C",
    edge: "C -> D",
    temporaryCycle: "A → B → C → D",
    note: "đi sang D",
  },
  {
    key: "4",
    step: "4",
    currentPosition: "D",
    edge: "D -> A",
    temporaryCycle: "A → B → C → D → A",
    note: "quay lại A (hoàn thành 1 vòng)",
  },
  {
    key: "5",
    step: "5",
    currentPosition: "A",
    edge: "A -> C",
    temporaryCycle: "A → B → C → D → A → C",
    note: "phát hiện còn cạnh A–C",
  },
  {
    key: "6",
    step: "6",
    currentPosition: "C",
    edge: "(đã đi hết)",
    temporaryCycle: "A → B → C → D → A → C → B → A",
    note: "khép kín chu trình",
  },
  {
    key: "7",
    step: "6",
    currentPosition: "C",
    edge: "(đã đi hết)",
    temporaryCycle: "A → B → C → D → A → C → B → A",
    note: "khép kín chu trình",
  },
  {
    key: "8",
    step: "6",
    currentPosition: "C",
    edge: "(đã đi hết)",
    temporaryCycle: "A → B → C → D → A → C → B → A",
    note: "khép kín chu trình",
  },
];

const DescriptionComponent = () => {
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
        <Table<DataType>
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
