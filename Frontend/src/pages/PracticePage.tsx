/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import {
  Button,
  Card,
  Radio,
  Table,
  Input,
  Typography,
  Tag,
  type RadioChangeEvent,
} from "antd";
import {
  AppstoreAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import CSSGraph from "@/libs/CSSGraph/CSSGraph";
import { useAppContext } from "@/context/AppContext";
import confetti from "canvas-confetti";

const { Text } = Typography;

const triggerFireworks = () => {
  const duration = 3 * 1000; // Thời gian chạy hiệu ứng (3 giây)
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Bắn từ 2 góc dưới ngẫu nhiên lên
    // origin y: 0.6 - 0.9 nghĩa là xuất phát từ phía dưới màn hình
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

const generateRandomGraph = () => {
  const isEuler = Math.random() < 0.5;
  const nodeCount = Math.floor(Math.random() * 3) + 4;
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: (i + 1).toString(),
    label: (i + 1).toString(),
  }));
  const edges = [];

  for (let i = 1; i < nodeCount; i++) {
    edges.push({
      id: `e${i}`,
      source: nodes[i - 1].id,
      target: nodes[i].id,
    });
  }
  edges.push({
    id: `e${nodeCount}`,
    source: nodes[nodeCount - 1].id,
    target: nodes[0].id,
  });

  const extraEdges = Math.floor(Math.random() * 3);
  for (let i = 0; i < extraEdges; i++) {
    const s = nodes[Math.floor(Math.random() * nodeCount)].id;
    const t = nodes[Math.floor(Math.random() * nodeCount)].id;
    if (s !== t) {
      edges.push({
        id: `rn${i}`,
        source: s,
        target: t,
      });
    }
  }

  const degrees: { [key: string]: number } = {};
  nodes.forEach((n) => (degrees[n.id] = 0));
  edges.forEach((e) => {
    degrees[e.source]++;
    degrees[e.target]++;
  });

  if (isEuler) {
    const oddNodes = nodes.filter((n) => degrees[n.id] % 2 !== 0);
    for (let i = 0; i < oddNodes.length; i += 2) {
      if (i + 1 < oddNodes.length) {
        edges.push({
          id: `fix${i}`,
          source: oddNodes[i].id,
          target: oddNodes[i + 1].id,
        });
      }
    }
  } else {
    let attempts = 0;
    while (attempts < 5) {
      const currentDegrees: { [key: string]: number } = {};
      nodes.forEach((n) => (currentDegrees[n.id] = 0));
      edges.forEach((e) => {
        currentDegrees[e.source]++;
        currentDegrees[e.target]++;
      });
      const oddCount = Object.values(currentDegrees).filter(
        (d) => d % 2 !== 0,
      ).length;
      if (oddCount > 2) break;

      const s = nodes[Math.floor(Math.random() * nodeCount)].id;
      const t = nodes[Math.floor(Math.random() * nodeCount)].id;
      if (s !== t) {
        edges.push({ id: `break${attempts}`, source: s, target: t });
      }
      attempts++;
    }
  }

  return {
    nodes: nodes.map((n) => ({ data: n })),
    edges: edges.map((e) => ({ data: e })),
    isEulerCircuit: isEuler,
  };
};

const solveHierholzer = (nodesData: any[], edgesData: any[]) => {
  const adj: { [key: string]: { to: string; id: string }[] } = {};
  nodesData.forEach((n) => (adj[n.data.id] = []));
  edgesData.forEach((e) => {
    adj[e.data.source].push({ to: e.data.target, id: e.data.id });
    adj[e.data.target].push({ to: e.data.source, id: e.data.id });
  });

  Object.keys(adj).forEach((k) => {
    adj[k].sort((a, b) => a.to.localeCompare(b.to));
  });

  const startNode = nodesData[0].data.id;
  const steps = [];
  const currentStack = [startNode];

  let stepCount = 1;

  steps.push({
    step: stepCount++,
    current: startNode,
    edge: "",
    stack: [...currentStack].join(", "),
    circuit: "",
  });

  const tempAdj = JSON.parse(JSON.stringify(adj));

  const finalPath = [];

  const workingStack = [startNode];
  const visitedEdges = new Set();
  const trace = [];

  while (workingStack.length > 0) {
    const u = workingStack[workingStack.length - 1];

    const availableEdgeIndex = tempAdj[u].findIndex(
      (e: { id: unknown }) => !visitedEdges.has(e.id),
    );

    if (availableEdgeIndex !== -1) {
      const edge = tempAdj[u][availableEdgeIndex];
      const v = edge.to;
      const edgeId = edge.id;
      visitedEdges.add(edgeId);

      workingStack.push(v);

      trace.push({
        step: stepCount++,
        current: u,
        edge: `${u}->${v}`,
        stack: [...workingStack].join(", "),
        circuit: [...finalPath].join("->"),
      });
    } else {
      const popped = workingStack.pop();
      finalPath.push(popped);

      trace.push({
        step: stepCount++,
        current: popped,
        edge: "", // Hoặc để trống
        stack: [...workingStack].join(", "),
        circuit: [...finalPath].join("->"),
      });
    }
  }

  return trace;
};

const PracticePage = () => {
  const cyRef = useRef(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [solution, setSolution] = useState<any[]>([]);

  const { messageApi } = useAppContext();

  const [tableInputs, setTableInputs] = useState<{ [key: string]: string }>({});

  const [showTable, setShowTable] = useState(false);

  const handleRandom = () => {
    const data = generateRandomGraph();
    setGraphData(data);
    setUserAnswer(null);
    setCheckResult(null);
    setShowTable(false);
    setTableInputs({});

    // Nếu là Euler Circuit, tính trước đáp án
    if (data.isEulerCircuit) {
      const sol = solveHierholzer(data.nodes, data.edges);
      console.log(sol);
      setSolution(sol);
    } else {
      setSolution([]);
    }
  };

  useEffect(() => {
    if (graphData && cyRef.current) {
      const cy = cytoscape({
        container: cyRef.current,
        elements: [...graphData.nodes, ...graphData.edges],
        style: CSSGraph(false),
        layout: {
          name: "circle",
          padding: 10,
        },
        userZoomingEnabled: false,
        userPanningEnabled: false,
      });

      return () => cy.destroy();
    }
  }, [graphData]);

  const handleAnswerQ1 = (e: RadioChangeEvent) => {
    const ans = e.target.value;
    setUserAnswer(ans);
    setUserAnswer(ans);

    const isYes = ans === "yes";
    const isCorrect =
      (graphData.isEulerCircuit && isYes) ||
      (!graphData.isEulerCircuit && !isYes);

    if (!isCorrect) {
      messageApi.error("Sai rồi, thử lại nhé!");
      setCheckResult("wrong");
      setShowTable(false);
    } else {
      setCheckResult("correct");
      if (graphData.isEulerCircuit) {
        messageApi.success(
          "Chính xác! Đây là đồ thị Euler. Hãy điền tiếp bảng mô phỏng.",
        );
        setShowTable(true);
      } else {
        messageApi.success("Chính xác! Đây không phải đồ thị Euler.");
        triggerFireworks();
      }
    }
  };

  const handleInputChange = (rowIndex: any, colKey: string, value: string) => {
    setTableInputs((prev) => ({
      ...prev,
      [`${rowIndex}_${colKey}`]: value,
    }));
  };

  const handleSubmitTable = () => {
    let isAllCorrect = true;

    for (let i = 0; i < solution.length; i++) {
      const row = solution[i];

      const normalize = (val: string) =>
        val ? val.toString().replace(/\s/g, "").toLowerCase() : "";

      const userStack = normalize(tableInputs[`${i}_stack`]);
      console.log(userStack);
      const solStack = normalize(row.stack);
      if (userStack !== solStack) isAllCorrect = false;

      const userCircuit = normalize(tableInputs[`${i}_circuit`]);
      const solCircuit = normalize(row.circuit);
      if (userCircuit !== solCircuit) isAllCorrect = false;

      const userCurrent = normalize(tableInputs[`${i}_current`]);
      const solCurrent = normalize(row.current);
      if (userCurrent !== solCurrent) isAllCorrect = false;

      if (!isAllCorrect) break;
    }

    if (isAllCorrect) {
      messageApi.success("Chính xác! Bạn đã hoàn thành.");
      triggerFireworks();
    } else {
      messageApi.error("Bạn đã nhập sai ở bước nào đó.");
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Bước",
      dataIndex: "step",
      key: "step",
      width: 60,
      render: (_text: any, _record: any, index: number) => (
        <Text strong>{index + 1}</Text>
      ),
    },
    {
      title: "Vị trí hiện tại",
      dataIndex: "current",
      key: "current",
      render: (_text: any, _record: any, index: any) => (
        <Input
          placeholder="VD: 1"
          onChange={(e) => handleInputChange(index, "current", e.target.value)}
        />
      ),
    },
    {
      title: "Cạnh được đi",
      dataIndex: "edge",
      key: "edge",
      render: (_text: any, _record: any, index: any) => (
        <Input
          placeholder="VD: 1->2"
          onChange={(e) => handleInputChange(index, "edge", e.target.value)}
        />
      ),
    },
    {
      title: "Ngăn xếp",
      dataIndex: "stack",
      key: "stack",
      render: (_text: any, _record: any, index: any) => (
        <Input
          placeholder="VD: 1, 2, 3"
          onChange={(e) => handleInputChange(index, "stack", e.target.value)}
        />
      ),
    },
    {
      title: "Chu trình tạm thời",
      dataIndex: "circuit",
      key: "circuit",
      render: (_text: any, _record: any, index: any) => (
        <Input
          placeholder="VD: 1->2"
          onChange={(e) => handleInputChange(index, "circuit", e.target.value)}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto ml-[calc(var(--height-title-bar-windows)-5px)] mt-[var(--height-title-bar-windows)] h-full w-[calc(100vw-var(--height-title-bar-windows))+5px] overflow-y-auto px-10 pb-10 md:px-32">
      <div className="mb-6 mt-6 flex items-center justify-between border-b pb-4">
        <div>
          <p className="mb-3 text-2xl font-bold text-[var(--primary-color)]">
            Luyện tập
          </p>
          <Text type="secondary">Sinh đồ thị ngẫu nhiên bằng nút bên.</Text>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={handleRandom}
          className="bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]"
        >
          Tạo đồ thị mới
        </Button>
      </div>

      {!graphData ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <AppstoreAddOutlined style={{ fontSize: 48, color: "#ccc" }} />
          <Text type="secondary" className="mt-4">
            Nhấn nút "Tạo bài tập mới" để bắt đầu
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card
              title="Hình ảnh đồ thị"
              bordered={false}
              className="shadow-sm"
            >
              <div
                ref={cyRef}
                className="h-64 w-full rounded-md border border-[var(--secondary-color)] bg-gray-50"
              />
            </Card>

            <Card title="Câu hỏi 1" bordered={false} className="shadow-sm">
              <div className="flex flex-col gap-4">
                <Text strong className="text-lg">
                  Đồ thị trên có thể vẽ được bằng một nét liền duy nhất không?
                  (Có chu trình Euler hay không?)
                </Text>
                <Radio.Group
                  onChange={handleAnswerQ1}
                  value={userAnswer}
                  buttonStyle="solid"
                  size="large"
                  disabled={checkResult === "correct"}
                >
                  <Radio.Button value="yes" className="w-24 text-center">
                    Có
                  </Radio.Button>
                  <Radio.Button value="no" className="w-24 text-center">
                    Không
                  </Radio.Button>
                </Radio.Group>

                {checkResult === "wrong" && (
                  <Tag color="error" icon={<CloseCircleOutlined />}>
                    Sai rồi, thử lại nhé!
                  </Tag>
                )}
                {checkResult === "correct" && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Chính xác!
                  </Tag>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {showTable ? (
              <Card
                title="Câu hỏi 2: Mô phỏng thuật toán Hierholzer"
                bordered={false}
                className="h-full shadow-sm"
                extra={
                  <Tag color="blue">
                    Gợi ý: Luôn chọn đỉnh kề có nhãn nhỏ nhất
                  </Tag>
                }
              >
                <Text className="mb-4 block">
                  Điền vào bảng bên dưới quá trình chạy thuật toán Hierholzer:
                </Text>

                <Table
                  dataSource={solution}
                  columns={columns}
                  pagination={false}
                  rowKey="step"
                  scroll={{ x: 600 }}
                  bordered
                  size="small"
                />

                <div className="mt-6 flex justify-end">
                  <Button
                    type="primary"
                    className="bg-[var(--primary-color)]"
                    size="large"
                    onClick={handleSubmitTable}
                  >
                    Kiểm tra
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-400">
                {checkResult === "correct" && !graphData.isEulerCircuit
                  ? "Hoàn thành! Đồ thị này không yêu cầu điền bảng"
                  : "Hãy trả lời đúng câu hỏi bên trái để mở khóa phần này"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
