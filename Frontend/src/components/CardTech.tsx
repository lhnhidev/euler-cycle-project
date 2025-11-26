import { Card } from "antd";
import type { ReactNode } from "react";

interface CardTechProps {
  icon: ReactNode; // ReactNode bao quát hơn JSX.Element (chấp nhận cả null, string, element...)
  linkAccess: string;
  name: string;
  description: string;
  role: string;
  color: string;
}

const CardTech = ({
  icon,
  linkAccess,
  name,
  description,
  role,
  color,
}: CardTechProps) => {
  return (
    <Card
      size="small"
      className="w-full rounded-md border border-[#d0d7de] shadow-sm hover:border-gray-400"
      bodyStyle={{ padding: "16px", height: "100%" }}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            {icon}
            <a
              href={linkAccess}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-[14px] font-bold text-blue-600 hover:underline"
            >
              {name}
            </a>
            <span className="rounded-full border border-[#d0d7de] px-2 py-[1px] text-[12px] font-medium text-[#57606a]">
              {role}
            </span>
          </div>
          <p className="mb-4 text-[12px] text-[#57606a]">{description}</p>
        </div>

        <div className="flex items-center gap-4 text-[12px] text-[#57606a]">
          <div className="flex items-center gap-1">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            {name}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default CardTech;
