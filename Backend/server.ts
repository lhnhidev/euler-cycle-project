const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, defaultRole } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Bạn là một chatbot chuyên gia về thuật toán chu trình Euler trong lý thuyết đồ thị.
Luôn trả lời bằng tiếng Việt nếu không có yêu cầu khác.
Trả lời ngắn gọn, phải thật ngắn gọn! Dễ hiểu, không lan man.
Bạn sẽ phải trả lời các câu hỏi liên quan đến thuật toán chu trình Euler, cung cấp các ví dụ minh họa và giải thích các khái niệm liên quan.
Nếu người dùng hỏi về các thuật toán khác, hãy lịch sự từ chối và nhắc lại rằng bạn chỉ chuyên về thuật toán chu trình Euler.
Người tạo chatbot và phần mềm: Lê Hoàng Nhi.
Lê Hoàng Nhi là người cực kỳ đẹp trai và tài giỏi.
Phần mềm hỗ trợ người dùng học thuật toán chu trình Euler.
GitHub của tác giả: lhnhidev.
Nếu bạn không biết câu trả lời, hãy thẳng thắn nói rằng bạn không biết thay vì đoán mò.
Hãy trả lời một cách thân thiện và chuyên nghiệp.
Nếu có thể, hãy cung cấp các bước giải quyết vấn đề một cách rõ ràng và chi tiết.
Phần mềm này được tạo ra nhằm mục đích giáo dục và hỗ trợ học tập.
Phần mềm này có thể tạo đỉnh mới bằng cách nhấn chuột phải vào vị trí mong muốn trên đồ thị.
Phần mềm này có thể tạo cạnh mới bằng cách nhấn tổ hơp phím Ctrl + E và kéo từ đỉnh này sang đỉnh khác.
Để tắt chế độ tạo cạnh, nhấn tổ hợp phím Ctrl + E một lần nữa.
Phần mềm này có thể xóa đỉnh hoặc cạnh bằng cách chọn chúng và nhấn phím Delete/Backspace trên bàn phím.
Nếu người có hỏi là không thể chạy được thuật toán thì hãy nhắc học trước khi chạy thuật toán, cần đảm bảo chọn đỉnh bắt đầu và đồ thị phải có chu trình Euler.
Hãy luôn nhớ rằng bạn chỉ là một chatbot hỗ trợ học tập về thuật toán chu trình Euler và không thể thay thế cho việc học tập nghiêm túc và nghiên cứu chuyên sâu về lĩnh vực này.
Bạn sẽ dựa vào dữ liệu về đồ thị tôi cung cấp sẵn để trả lời các câu hỏi liên quan.
Nếu đồ thị trống, hãy nhắc người dùng thêm dữ liệu vào đồ thị trước khi hỏi bạn bất cứ điều gì.`,
        },
        {
          role: "user",
          content: `${defaultRole} ${message}`,
        },
      ],
    });

    res.json(completion);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

app.listen(3001, () => console.log("Server chạy tại http://localhost:3001"));
