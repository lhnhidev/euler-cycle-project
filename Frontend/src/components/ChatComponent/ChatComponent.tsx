import { useAppContext } from "@/context/AppContext";
import { useGraphContext } from "@/context/GraphContext";
import {
  useState,
  type FormEvent,
  type ChangeEvent,
  useEffect,
  useRef,
} from "react";
import { IoCloseOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import "./index.css";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

type Props = {
  setShowChatbot: (value: boolean) => void;
};

const ChatComponent = ({ setShowChatbot }: Props) => {
  const {
    graph,
    isDirected,
    info,
    connectedComponents,
    isEulerian,
    hasEulerPath,
  } = useGraphContext();

  // State để lưu danh sách các tin nhắn
  const { messages, setMessages, nodeStart } = useAppContext();

  // State để lưu nội dung tin nhắn đang nhập
  const [newMessage, setNewMessage] = useState<string>("");

  // Ref để tự động cuộn xuống tin nhắn mới nhất
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // useEffect(() => {
  //   const startChatSession = async () => {
  //     const response = await fetch(import.meta.env.VITE_START_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({}),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //   };

  //   startChatSession();
  // }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMessage.trim() === "" || isLoading) return;

    // Tạo tin nhắn mới của người dùng
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    // Cập nhật state với tin nhắn mới và bật loading
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const messageToSend = newMessage;
    // Xóa nội dung input
    setNewMessage("");

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend, // Gửi tin nhắn của người dùng
          defaultRole: `${
            graph.current.getNodes().length === 0
              ? "Đồ thị hiện tại đang trống, chưa có dữ liệu"
              : `Đây là toàn bộ dữ liệu về đồ thị mà bạn sẽ dựa vào để trả lời các câu hỏi liên quan:
- Đồ thị có các đỉnh ${graph.current
                  .getNodes()
                  .map((node) => node.label)
                  .join(", ")}.
- Các cạnh của đồ thị bao gồm: ${graph.current
                  .getEdges()
                  .map(
                    (edge) =>
                      `(${graph.current.getLabel(edge.source)}-${graph.current.getLabel(edge.target)})`,
                  )
                  .join(", ")}.
- Đồ thị này ${isDirected ? "có hướng" : "vô hướng"}.
- Hãy sử dụng dữ liệu này để trả lời các câu hỏi của người dùng một cách chính xác và chi tiết.
- Số thành phần liên thông ${isDirected ? "mạnh" : ""} trong đồ thị là ${connectedComponents}
- Thuật toán được sử dụng để phân tích đồ thị này là Hierholzer’s Algorithm
- Đỉnh bắt đầu được cài đặt trong giải thuật là ${nodeStart?.label ? nodeStart.label : "chưa có đỉnh bắt đầu"}
- Đồ thị đã cho ${isEulerian ? "là" : "không phải là"} đồ thị Euler, ${
                  isEulerian
                    ? `chu trình Euler là: ${
                        nodeStart.id
                          ? info.circuit.map((node) => node.label).join(" -> ")
                          : "Chưa chọn đỉnh bắt đầu nên chưa thể xác định được chu trình Euler"
                      }`
                    : "không có chu trình Euler hoặc chưa thể xác định chu trình Euler do chưa chọn đỉnh bắt đầu"
                }
- Đồ thị đã cho ${hasEulerPath ? "có đường đi Euler" : "không có đường đi Euler hoặc chưa thể xác định được do chưa chọn đỉnh bắt đầu"}`
          }`,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botText = data.reply || "Sorry, I had an error.";

      const botMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: botText,
        timestamp: new Date().toLocaleTimeString(),
      };

      // Thêm tin nhắn của bot vào danh sách
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling chat API:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: "Lỗi kết nối, vui lòng thử lại.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-5 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-md border border-gray-300 shadow-lg">
      <div className="flex justify-center bg-[#367cd1] p-2.5 text-center font-bold text-white">
        <p>U-Lầy Chatbot</p>
      </div>
      <div
        className="absolute right-[8px] top-[28px] cursor-pointer text-xl text-white hover:text-red-500"
        onClick={() => setShowChatbot(false)}
      >
        <IoCloseOutline />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-gray-50 p-2.5 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] break-words rounded-2xl px-3 py-2 ${
              msg.sender === "user"
                ? "self-end bg-[#E5F1FF] text-black"
                : "self-start bg-gray-200 text-black"
            }`}
          >
            <div className="space-y-3">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            <div className="mt-1 text-xs text-gray-500">{msg.timestamp}</div>
          </div>
        ))}
        {isLoading && (
          <div className="self-start px-3 py-2 italic text-gray-500">
            U-Lầy đang suy nghĩ...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex border-t border-gray-300 bg-gray-100 p-2.5"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          className="mr-2.5 flex-1 rounded-full border border-gray-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--secondary-color)] disabled:bg-gray-100"
          value={newMessage}
          onChange={handleInputChange}
          placeholder={isLoading ? "Đang chờ phản hồi..." : "Nhập tin nhắn..."}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="cursor-pointer rounded-full border-none bg-[#367cd1] px-3 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? (
            "..."
          ) : (
            <span className="flex items-center gap-2">
              Gửi <LuSendHorizontal />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
