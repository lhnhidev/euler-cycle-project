import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { Typography, Card, Table, Tag, Divider, Alert } from "antd";
import {
  BulbOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import CSSGraph from "@/libs/CSSGraph";

const { Paragraph, Text } = Typography;

const elementsEulerCircuit = [
  { data: { id: "a", label: "1" } },
  { data: { id: "b", label: "2" } },
  { data: { id: "c", label: "3" } },
  { data: { id: "d", label: "4" } },
  { data: { id: "e", label: "5" } },
  { data: { source: "a", target: "b" } },
  { data: { source: "b", target: "c" } },
  { data: { source: "c", target: "d" } },
  { data: { source: "d", target: "e" } },
  { data: { source: "e", target: "a" } },
  { data: { source: "b", target: "e" } },
  { data: { source: "b", target: "d" } },
  { data: { source: "e", target: "d" } },
];

const elementsEulerPath = [
  { data: { id: "1", label: "A" } },
  { data: { id: "2", label: "B" } },
  { data: { id: "3", label: "C" } },
  { data: { id: "4", label: "D" } },
  { data: { source: "1", target: "2" } },
  { data: { source: "2", target: "3" } },
  { data: { source: "3", target: "1" } },
  { data: { source: "3", target: "4" } },
];

interface GraphVisualizerProps {
  elements: cytoscape.ElementDefinition[];
  title: string;
  caption: string;
  isDirected?: boolean;
}

const GraphVisualizer = ({
  elements,
  title,
  caption,
  isDirected = false,
}: GraphVisualizerProps) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const cy = cytoscape({
        container: containerRef.current,
        elements: elements,
        style: CSSGraph(isDirected),
        layout: {
          name: "circle", // Sử dụng layout circle cho đẹp
          padding: 10,
        },
        userZoomingEnabled: false,
        userPanningEnabled: false,
      });

      return () => cy.destroy();
    }
  }, [elements, isDirected]);

  return (
    <div className="my-4 flex flex-col items-center">
      <div
        ref={containerRef}
        className="h-64 w-full rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
      />
      <span className="mt-2 text-center text-sm italic text-gray-500">
        {caption}
      </span>
      <Text strong className="mt-1">
        {title}
      </Text>
    </div>
  );
};

const DocumentPage = () => {
  const columns = [
    {
      title: "Loại đồ thị",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Điều kiện có Đường đi Euler",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "Điều kiện có Chu trình Euler",
      dataIndex: "circuit",
      key: "circuit",
    },
  ];

  const data = [
    {
      key: "1",
      type: "Vô hướng",
      path: "Liên thông và có đúng 0 hoặc 2 đỉnh bậc lẻ.",
      circuit: "Liên thông và mọi đỉnh đều có bậc chẵn.",
    },
    {
      key: "2",
      type: "Có hướng",
      path: (
        <span>
          Liên thông yếu và thỏa mãn một trong hai:
          <br />- Mọi đỉnh có <code>deg_in = deg_out</code>
          <br />- Hoặc tồn tại 2 đỉnh đặc biệt: 1 đỉnh có{" "}
          <code>deg_out - deg_in = 1</code> (bắt đầu), 1 đỉnh có{" "}
          <code>deg_in - deg_out = 1</code> (kết thúc), các đỉnh còn lại cân
          bằng.
        </span>
      ),
      circuit: "Liên thông yếu và mọi đỉnh đều có bậc vào bằng bậc ra.",
    },
  ];

  return (
    <div className="mx-auto ml-[calc(var(--height-title-bar-windows)-5px)] mt-[var(--height-title-bar-windows)] h-full w-[calc(100vw-var(--height-title-bar-windows))+5px] overflow-y-auto bg-white px-10 pb-10 md:px-20 lg:px-32">
      {/* Header */}
      <div className="mb-8 mt-5 border-b pb-4">
        <h2 className="text-2xl font-bold text-[var(--primary-color)]">
          Lý thuyết: Đường đi và Chu trình Euler
        </h2>
        <Paragraph className="mt-2 text-sm text-gray-500">
          Tổng hợp kiến thức cơ bản về bài toán bảy cây cầu Königsberg và các
          định lý đồ thị Euler.
        </Paragraph>
      </div>

      <section className="mb-10">
        <p className="text-2xl font-bold text-[var(--primary-color)]">
          1. Video lý thuyết tham khảo
        </p>
        <div>
          <Paragraph className="mt-2 text-sm text-gray-500">
            Theo dõi video dưới đây để hiểu rõ hơn về lý thuyết và cách nhận
            biết Chu trình Euler qua bài giảng chi tiết.
          </Paragraph>
          <a
            href="https://www.youtube.com/watch?v=RauZYMePmRg"
            className="text-blue-600 underline"
          >
            Nguồn 28tech
          </a>
        </div>
        <div className="flex items-center gap-16 overflow-hidden">
          <div className="w-[1000px]">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/RauZYMePmRg"
              title="#22 [Lý thuyết đồ thị | Toán rời rạc]. Chu Trình Euler Và Đường Đi Euler"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <Text strong className="mb-3 block text-lg text-blue-800">
              <FileTextOutlined className="mr-2" />
              Tóm tắt nội dung chính:
            </Text>
            <ul className="list-disc space-y-2 pl-6 text-base text-gray-700">
              <li>
                Giới thiệu lịch sử bài toán{" "}
                <strong>7 cây cầu Königsberg</strong> và sự ra đời của lý thuyết
                đồ thị.
              </li>
              <li>
                Phân biệt rõ ràng giữa <strong>Chu trình Euler</strong> (đi qua
                mọi cạnh và quay về đỉnh xuất phát) và{" "}
                <strong>Đường đi Euler</strong> (đi qua mọi cạnh nhưng không
                quay về).
              </li>
              <li>
                Định lý quan trọng cho <strong>đồ thị vô hướng</strong>: Liên
                quan đến số lượng đỉnh bậc lẻ (0 đỉnh hoặc 2 đỉnh).
              </li>
              <li>
                Định lý quan trọng cho <strong>đồ thị có hướng</strong>: Liên
                quan đến sự cân bằng giữa bậc vào (deg_in) và bậc ra (deg_out).
              </li>
              <li>
                Hướng dẫn cách kiểm tra nhanh một đồ thị có phải là đồ thị Euler
                hay không thông qua ví dụ trực quan.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <p className="mb-5 text-2xl font-bold text-[var(--primary-color)]">
          2. Định nghĩa
        </p>
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <ul className="list-disc space-y-2 pl-5 text-base text-gray-700">
            <li>
              <Text strong>Đường đi Euler (Euler Path):</Text> là một đường đi
              trong đồ thị đi qua mỗi cạnh đúng một lần.
            </li>
            <li>
              <Text strong>Chu trình Euler (Euler Circuit):</Text> là một đường
              đi Euler nhưng có đỉnh đầu trùng với đỉnh cuối (đi qua mọi cạnh
              mỗi cạnh đúng 1 lần và quay về điểm xuất phát).
            </li>
            <li>
              <Text strong>Đồ thị Euler:</Text> là đồ thị có chứa chu trình
              Euler.
            </li>
            <li>
              <Text strong>Đồ thị nửa Euler (Semi-Eulerian):</Text> là đồ thị có
              chứa đường đi Euler nhưng không chứa chu trình Euler.
            </li>
          </ul>
        </Card>

        {/* Minh họa trực quan */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <GraphVisualizer
            elements={elementsEulerCircuit}
            isDirected={false}
            title="Đồ thị Euler"
            caption="Ví dụ: Tất cả các đỉnh đều có bậc chẵn (2 hoặc 4). Tồn tại chu trình đi qua tất cả các cạnh."
          />
          <GraphVisualizer
            elements={elementsEulerPath}
            isDirected={false}
            title="Đồ thị nửa Euler"
            caption="Ví dụ: Có đỉnh A (bậc 1) và D (bậc 1) là bậc lẻ. Chỉ tồn tại đường đi từ A đến D."
          />
        </div>
      </section>

      <section className="mb-10">
        <p className="mb-5 text-2xl font-bold text-[var(--primary-color)]">
          3. Điều kiện tồn tại
        </p>
        <Alert
          message="Điều kiện tiên quyết"
          description="Một đồ thị muốn có đường đi hoặc chu trình Euler thì trước hết phải không có các đỉnh cô lập (các cạnh phải thuộc cùng một thành phần liên thông)."
          type="info"
          showIcon
          className="mb-4"
        />

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          rowClassName="align-top"
        />
      </section>

      {/* 4. Thuật toán tìm chu trình Euler */}
      <section className="mb-10">
        <p className="mb-5 text-2xl font-bold text-[var(--primary-color)]">
          4. Thuật toán Hierholzer
        </p>
        <Paragraph>
          Một trong những thuật toán hiệu quả nhất để tìm chu trình Euler là
          thuật toán <Text strong>Hierholzer</Text>. Ý tưởng chính của thuật
          toán là ghép nối các chu trình nhỏ lại với nhau.
        </Paragraph>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <Card
              title={
                <>
                  <BulbOutlined /> Ý tưởng thuật toán
                </>
              }
              size="small"
              className="h-full bg-orange-50"
            >
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Bắt đầu từ một đỉnh bất kỳ <Text code>u</Text>.
                </li>
                <li>
                  Đi theo các cạnh chưa thăm để tạo thành một chu trình đơn
                  (không nhất thiết đi qua hết các cạnh của đồ thị) quay về{" "}
                  <Text code>u</Text>.
                </li>
                <li>
                  Nếu đồ thị vẫn còn cạnh chưa thăm nối với các đỉnh trong chu
                  trình hiện tại:
                  <ul className="mt-1 list-disc pl-5 text-gray-600">
                    <li>
                      Chọn một đỉnh <Text code>v</Text> trên chu trình mà còn
                      cạnh chưa thăm.
                    </li>
                    <li>
                      Bắt đầu từ <Text code>v</Text>, tìm một chu trình mới.
                    </li>
                    <li>
                      Hợp nhất chu trình mới vào chu trình cũ tại vị trí{" "}
                      <Text code>v</Text>.
                    </li>
                  </ul>
                </li>
                <li>Lặp lại cho đến khi không còn cạnh nào chưa thăm.</li>
              </ol>
            </Card>
          </div>

          <div className="flex-1">
            <Card title="Độ phức tạp" size="small" className="h-full">
              <Paragraph>
                Thuật toán Hierholzer có thể được cài đặt để chạy trong thời
                gian tuyến tính <Tag color="green">O(E)</Tag>, với E là số cạnh
                của đồ thị.
              </Paragraph>
              <Divider />
              <Paragraph>
                <CheckCircleOutlined className="mr-2 text-green-500" />
                Hiệu quả hơn thuật toán Fleury (thường là O(E²)).
              </Paragraph>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Video Bài Giảng */}

      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-6 text-center text-gray-400">
        <Text italic>Tham khảo từ VNOI Wiki & Giáo trình Lý thuyết đồ thị</Text>
      </div>
    </div>
  );
};

export default DocumentPage;
