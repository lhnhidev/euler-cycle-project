import { useAppContext } from "@/context/AppContext";
import { useGraphContext } from "@/context/GraphContext";
import { Table } from "antd";
import { useEffect, useState } from "react";

const ResultTable = () => {
  const { isDirected, graph } = useGraphContext();
  const { render } = useAppContext();
  const [dataSource, setDataSource] = useState<
    {
      key: number;
      node: string;
      degree?: number;
      inDegree?: number;
      outDegree?: number;
    }[]
  >([]);

  const graphHasDirectedColumns = [
    {
      title: "Đỉnh",
      dataIndex: "node",
      key: "node",
    },
    {
      title: "Bậc vào",
      dataIndex: "inDegree",
      key: "inDegree",
    },
    {
      title: "Bậc ra",
      dataIndex: "outDegree",
      key: "outDegree",
    },
  ];

  const graphHasNotDirectedColumns = [
    {
      title: "Đỉnh",
      dataIndex: "node",
      key: "node",
    },
    {
      title: "Bậc",
      dataIndex: "degree",
      key: "degree",
    },
  ];

  useEffect(() => {
    const newDataSource: {
      key: number;
      node: string;
      degree?: number;
      inDegree?: number;
      outDegree?: number;
    }[] = [];
    if (isDirected) {
      // console.log("directed", graph.current.getDegIn());
      // console.log("directed", graph.current.getDegOut());

      const inDegList = graph.current.getDegIn();
      const outDegList = graph.current.getDegOut();
      let index = 0;
      for (const nodeId in inDegList) {
        const node = graph.current.getCore()!.getElementById(nodeId);
        newDataSource.push({
          key: index++,
          node: node.data().label,
          inDegree: inDegList[nodeId] ?? 0,
          outDegree: outDegList[nodeId] ?? 0,
        });
      }

      setDataSource(newDataSource);
    } else {
      // console.log("not directed", graph.current.getDegree());
      const degList = graph.current.getDegree();
      let index = 0;
      for (const nodeId in degList) {
        const node = graph.current.getCore()!.getElementById(nodeId);
        newDataSource.push({
          key: index++,
          node: node.data().label,
          degree: degList[nodeId],
        });
      }

      setDataSource(newDataSource);
    }
  }, [graph, render, isDirected]);

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={
          isDirected ? graphHasDirectedColumns : graphHasNotDirectedColumns
        }
        size="small"
        pagination={false}
        sticky
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        className="[&_.ant-table-body]:!max-h-full [&_.ant-table-container]:!h-full [&_.ant-table-container]:!rounded-t-none [&_.ant-table-thead>tr>th:first-child]:!rounded-tl-none [&_.ant-table-thead>tr>th:last-child]:!rounded-tr-none [&_.ant-table]:!h-full"
        bordered={true}
      />
    </div>
  );
};
export default ResultTable;
