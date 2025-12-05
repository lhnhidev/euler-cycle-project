import { useEffect, useState } from "react";
import { Avatar, Button, Card, Skeleton, Tag, message } from "antd";
import {
  FaGithub,
  FaFacebook,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaCodeBranch,
  FaProjectDiagram,
  FaCode,
  FaIcons,
} from "react-icons/fa";
import {
  SiElectron,
  SiReact,
  SiTailwindcss,
  SiAntdesign,
  SiTypescript,
  SiGoogle,
} from "react-icons/si";
import { MdOpenInNew } from "react-icons/md";
import CardTech from "@/components/CardTech";

interface GithubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
}

const TECH_STACK = [
  {
    name: "ElectronJS",
    link: "https://www.electronjs.org/",
    description: "Framework xây dựng ứng dụng desktop đa nền tảng.",
    role: "Core Runtime",
    icon: <SiElectron className="text-lg text-[#47848F]" />,
    color: "#47848F",
  },
  {
    name: "ReactJS",
    link: "https://react.dev/",
    description: "Thư viện UI xây dựng giao diện người dùng component-based.",
    role: "Frontend Lib",
    icon: <SiReact className="text-lg text-[#61DAFB]" />,
    color: "#61DAFB",
  },
  {
    name: "TypeScript",
    link: "https://www.typescriptlang.org/",
    description: "Ngôn ngữ chính giúp code an toàn và dễ bảo trì.",
    role: "Language",
    icon: <SiTypescript className="text-lg text-[#3178C6]" />,
    color: "#3178C6",
  },
  {
    name: "Cytoscape.js",
    link: "https://js.cytoscape.org/",
    description: "Thư viện cốt lõi để hiển thị và tương tác đồ thị.",
    role: "Visualization",
    icon: <FaProjectDiagram className="text-lg text-[#EA580C]" />,
    color: "#EA580C",
  },
  {
    name: "Tailwind CSS",
    link: "https://tailwindcss.com/",
    description: "Utility-first CSS framework để style giao diện nhanh chóng.",
    role: "Styling",
    icon: <SiTailwindcss className="text-lg text-[#06B6D4]" />,
    color: "#06B6D4",
  },
  {
    name: "Ant Design",
    link: "https://ant.design/",
    description: "Hệ thống UI Component chuyên nghiệp cho ứng dụng React.",
    role: "UI Library",
    icon: <SiAntdesign className="text-lg text-[#1677FF]" />,
    color: "#1677FF",
  },
  {
    name: "Code Mirror",
    link: "https://codemirror.net/",
    description: "Trình soạn thảo code nhúng để nhập ma trận/script.",
    role: "Editor",
    icon: <FaCode className="text-lg text-[#000000]" />,
    color: "#000000",
  },
  {
    name: "Google AI API",
    link: "https://ai.google.dev/",
    description: "Tích hợp Gemini API để tạo Chatbot hỗ trợ giải toán.",
    role: "AI Integration",
    icon: <SiGoogle className="text-lg text-[#4285F4]" />, // Google Blue
    color: "#4285F4",
  },
  {
    name: "React Icons",
    link: "https://react-icons.github.io/react-icons/",
    description: "Thư viện icon đa dạng (FontAwesome, SimpleIcons...)",
    role: "Assets",
    icon: <FaIcons className="text-lg text-[#E91E63]" />,
    color: "#E91E63",
  },
];

const InfoPage = () => {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_GITHUB_PROFILE}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải thông tin GitHub");
      } finally {
        setLoading(false);
      }
    };

    fetchGithubProfile();
  }, []);

  const displayEmail = import.meta.env.VITE_EMAIL;
  const displayFacebook = import.meta.env.VITE_FACEBOOK_LINK;

  return (
    <div className="mx-auto ml-[calc(var(--height-title-bar-windows)-5px)] mt-[var(--height-title-bar-windows)] h-full w-[calc(100vw-var(--height-title-bar-windows))+5px] overflow-y-auto px-32 pb-10">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-12">
        {/* --- CỘT TRÁI: THÔNG TIN CÁ NHÂN --- */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4">
          <Card bordered={false} className="h-full shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center">
                <Skeleton.Avatar active size={200} shape="circle" />
                <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Avatar */}
                <div className="mb-4 flex justify-center md:justify-start">
                  <Avatar
                    size={260}
                    src={profile?.avatar_url}
                    className="border-4 border-[var(--bg-color)] shadow-md"
                  />
                </div>

                {/* Tên & Nickname */}
                <div>
                  <h1 className="mb-0 text-2xl font-bold text-[var(--text-color)]">
                    {profile?.name || "Le Hoang Nhi"}
                  </h1>
                  <p className="text-lg text-gray-500">
                    {profile?.login || "lhnhidev"}
                  </p>
                </div>

                {/* Bio */}
                <p className="mt-2 text-[var(--text-color)]">
                  {profile?.bio || "Developer passionate about Graph Theory."}
                </p>

                {/* Nút Follow GitHub */}
                <Button
                  type="primary"
                  block
                  className="mb-4 mt-2 bg-[var(--primary-color)] hover:!bg-[var(--secondary-color)]"
                  icon={<FaGithub />}
                  href={profile?.html_url}
                  target="_blank"
                >
                  Theo dõi GitHub
                </Button>

                {/* Stats: Followers/Following */}
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 hover:text-[var(--primary-color)]">
                    <FaUsers />
                    <span className="font-bold text-[var(--text-color)]">
                      {profile?.followers}
                    </span>{" "}
                    người theo dõi
                  </div>
                  <div className="flex items-center gap-1 hover:text-[var(--primary-color)]">
                    <span className="font-bold text-[var(--text-color)]">
                      {profile?.following}
                    </span>{" "}
                    đang theo dõi
                  </div>
                </div>

                <hr className="my-4 border-[var(--border-color)]" />

                {/* Thông tin liên hệ */}
                <div className="flex flex-col gap-3 text-sm">
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-[var(--text-color)]">
                      <FaMapMarkerAlt className="text-gray-400" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[var(--text-color)]">
                    <FaEnvelope className="text-gray-400" />
                    <a
                      href={`mailto:${displayEmail}`}
                      className="hover:text-[var(--primary-color)]"
                    >
                      {displayEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-color)]">
                    <FaFacebook className="text-gray-400" />
                    <a
                      href={displayFacebook}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--primary-color)]"
                    >
                      lhnhidev
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="col-span-1 md:col-span-8 lg:col-span-8">
          <Card
            title={
              <h2 className="text-2xl font-bold text-[var(--primary-color)]">
                Giới thiệu dự án
              </h2>
            }
            bordered={false}
            className="h-full shadow-sm"
          >
            <div className="space-y-6">
              {/* Header Dự án */}
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-[var(--text-color)]">
                  Euler Cycle Project
                  <Tag color="blue">v1.0.0</Tag>
                </h2>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Tag color="#2C2E3A">Electron</Tag>
                  <Tag color="#00afef">React</Tag>
                  <Tag color="#F7DF1E">Cytoscape.js</Tag>
                  <Tag color="#1677ff">Ant Design</Tag>
                  <Tag color="gold">Graph Theory</Tag>
                  <Tag color="green">Algorithms</Tag>
                  <Tag color="purple">Visualization</Tag>
                </div>
              </div>

              {/* Nội dung giới thiệu */}
              <div className="text-justify text-base leading-relaxed text-[var(--text-color)]">
                <p className="mb-4">
                  <strong>Euler Cycle Project</strong> là một phần mềm mô phỏng
                  và trực quan hóa thuật toán tìm chu trình Euler (Eulerian
                  Cycle) và đường đi Euler (Eulerian Path) trên đồ thị. Dự án
                  được xây dựng nhằm mục đích hỗ trợ sinh viên, giảng viên và
                  những người yêu thích toán học rời rạc (lý thuyết đồ thị) có
                  cái nhìn trực quan nhất về cách thuật toán hoạt động từng
                  bước.
                </p>
                <p className="mb-4">
                  Phần mềm cung cấp môi trường tương tác mạnh mẽ, cho phép người
                  dùng tự do <strong>tạo đồ thị</strong>, chỉnh sửa đỉnh/cạnh,
                  nhập file hoặc trực tiếp. Điểm đặc biệt là khả năng kết hợp
                  với <strong>Cytoscape.js</strong> để hiển thị đồ thị đẹp mắt,
                  cùng với bảng điều khiển "step-by-step" giúp theo dõi biến đổi
                  của ngăn xếp (stack) và các cạnh đã duyệt theo thời gian thực.
                </p>
                <p>
                  Dự án được phát triển dựa trên nền tảng{" "}
                  <strong>Electron</strong> hiện đại, kết hợp sức mạnh của{" "}
                  <strong>ReactJS</strong> và <strong>Ant Design</strong>, mang
                  lại trải nghiệm người dùng mượt mà như một ứng dụng Native
                  trên Windows/MacOS.
                </p>
              </div>

              {/* GitHub Repo Card (Mô phỏng) */}
              <div
                className="mt-6 rounded-lg bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md"
                style={{ border: "1px solid var(--border-color)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCodeBranch className="text-xl text-[var(--secondary-color)]" />
                    <div>
                      <h3 className="text-lg font-bold text-[var(--primary-color)]">
                        lhnhidev/euler-cycle-project
                      </h3>
                      <p className="text-sm text-gray-500">
                        Phần mềm mô phỏng thuật toán chu trình Euler đồ thị
                      </p>
                    </div>
                  </div>
                  <Button
                    type="default"
                    icon={<MdOpenInNew />}
                    href="https://github.com/lhnhidev/euler-cycle-project"
                    target="_blank"
                    className="border-[var(--primary-color)] text-[var(--primary-color)]"
                  >
                    Truy cập Repo
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto mt-8">
        <div className="mb-2 flex flex-col">
          <h2 className="w-full border-b border-b-gray-100 pb-4 text-2xl font-bold text-[var(--primary-color)]">
            Công nghệ sử dụng
          </h2>
          <span className="mb-2 mt-2 flex items-center gap-2 text-xl font-bold text-[var(--text-color)]">
            Dự án được thiết kế và phát triển bằng các công nghệ:
          </span>
        </div>

        <div className="mt-4 grid w-full grid-cols-3 gap-4">
          {TECH_STACK.map((tech, idx) => {
            return (
              <div key={idx}>
                <CardTech
                  icon={tech.icon}
                  linkAccess={tech.link}
                  name={tech.name}
                  description={tech.description}
                  role={tech.role}
                  color={tech.color}
                ></CardTech>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
