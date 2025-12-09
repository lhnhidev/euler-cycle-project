# Euler Cycle Project - Graph Theory Simulation

# Dự án Mô phỏng Chu trình Euler

## 📖 Introduction / Giới thiệu

**[English]**
The **Euler Cycle Project** is a simulation tool built for research purposes and to illustrate Graph Theory concepts. It specifically focuses on visualizing **Euler Cycles** using **Hierholzer's Algorithm**. This project was developed over 2 months for the Fundamental Software Engineering Project report. Please kindly overlook any errors or shortcomings.

- **GitHub Repository:** [Github](https://github.com/lhnhidev/euler-cycle-project)

**[Tiếng Việt]**
**Euler Cycle Project** là dự án mô phỏng được xây dựng để phục vụ cho nhu cầu nghiên cứu và minh họa Lý thuyết đồ thị. Dự án tập trung đặc biệt vào việc mô phỏng **Chu trình Euler** bằng **thuật toán Hierholzer**. Dự án này được xây dựng trong 2 tháng để phục vụ cho bài báo cáo Niên luận cơ sở ngành Kỹ thuật phần mềm. Nếu có sai sót và lỗi xin vui lòng bỏ qua.

- **Link GitHub:** [Github](https://github.com/lhnhidev/euler-cycle-project)

---

## 🛠 Tech Stack / Công nghệ sử dụng

This project is built using **TypeScript** and deployed as a Desktop App using **ElectronJS**.
Dự án sử dụng ngôn ngữ **TypeScript** và được deploy thành ứng dụng Desktop nhờ **ElectronJS**.

### Frontend (FE)

- **Core:** React
- **Visualization:** Cytoscape.js
- **Styling:** Tailwind CSS, Ant Design
- **Icons:** React Icons
- **Editor:** CodeMirror

### Backend (BE)

- **Runtime:** Node.js
- **Framework:** Express
- **AI Integration:** Google Gemini API

---

## ⚙️ Installation / Hướng dẫn cài đặt

### 1. Clone the repository / Tải dự án

Open your terminal and run the following commands:
Mở terminal và chạy các lệnh sau:

```bash
git init
git clone <url-repo>
cd euler-cycle-project
```

### 2. Install Dependencies / Cài đặt thư viện

You need to install dependencies for both Frontend and Backend folders. Bạn cần cài đặt thư viện cho cả hai thư mục Frontend và Backend.

**Frontend:**

```bash
cd Frontend
npm i
```

**Backend:** (Open a new terminal or navigate back / Mở terminal mới hoặc quay lại thư mục gốc)

```bash
cd ../Backend
npm i
```

---

## 🔑 Configuration / Cấu hình môi trường (.env)

You need to create a **.env** file in both **Frontend** and **Backend** folders. Bạn cần tạo file **.env** tại cả hai thư mục **Frontend** và **Backend**.

**Frontend (Frontend/.env)**
Copy and paste the following content: Sao chép và dán nội dung sau:

```bash
VITE_SERVER_URL=http://localhost:3001/api/chat
VITE_START_URL=http://localhost:3001/api/start
VITE_FACEBOOK_LINK=<your_facebokk>
VITE_EMAIL=<your_email>
VITE_API_GITHUB_PROFILE=<your_link_github>
```

**Backend (Backend/.env)**
Copy and paste the following content: Sao chép và dán nội dung sau:

```bash
GEMINI_API_KEY=<your_api_key>
```

> **How to get `GEMINI_API_KEY`:**
>
> 1. Visit [Google AI Studio](https://aistudio.google.com/).
> 2. Create a new API Key.
> 3. Paste it into the `GEMINI_API_KEY` field above.
>
> **Cách lấy `GEMINI_API_KEY`:**
>
> 1. Truy cập [Google AI Studio](https://aistudio.google.com/).
> 2. Tạo một API Key mới.
> 3. Dán nó vào dòng `GEMINI_API_KEY` ở trên.

---

## 🚀 Running the Project / Chạy dự án

### 1. Start Backend

Open the terminal in the **Backend** folder and run:
Mở terminal tại thư mục **Backend** và chạy:

```bash
node ./server.ts
```

### 2. Start Frontend

Open the terminal in the **Frontend** folder and run:
Mở terminal tại thư mục **Frontend** và chạy:

```bash
npm run dev
```

---

## 🎉 Result / Kết quả

If configured successfully, after about 1-3 minutes, you will see an interface like this:
Nếu cấu hình thành công, sau khoảng 1-3 phút bạn sẽ thấy giao diện như thế này hiện ra:

![interface of software](https://res.cloudinary.com/dpsj6nk7y/image/upload/v1765297091/image_bjvyre.png)

---

## 💡 Usage Guide / Hướng dẫn sử dụng

**[English]**
Simply ask the Chatbot inside the software about Euler cycles or how to use the graph. Note: If you don't have an API Key... well, it's not a big deal. You can just figure out how to use it yourself =))

**[Tiếng Việt]**
Đơn giản là hãy hỏi con Chatbot được tích hợp trong phần mềm để biết cách dùng. Lưu ý: Nếu bạn không có API Key thì không sao cả, bạn có thể tự mò cách dùng =))
