import { useAppContext } from "@/context/AppContext";
import { IoMdClose } from "react-icons/io";

type Props = {
  isHidden: boolean;
};

const DetailedResult = ({ isHidden }: Props) => {
  const { setIsDetailedResultHidden } = useAppContext();

  return (
    <div
      onClick={() => setIsDetailedResultHidden(true)}
      className={`fixed inset-0 z-[50000000000] flex items-center justify-center bg-black/50 ${isHidden ? "hidden" : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[90vh] w-[90vw] rounded-lg bg-white p-6 shadow-lg"
      >
        {/* Nút đóng */}
        <button
          onClick={() => setIsDetailedResultHidden(true)}
          className="absolute right-3 top-3 text-xl text-gray-500 hover:text-gray-700"
        >
          <IoMdClose />
        </button>

        {/* Nội dung modal */}
        <h2 className="mb-4 text-2xl font-bold">Detailed Result</h2>
        <div className="h-full overflow-auto">
          {/* Chèn nội dung ở đây */}
          <p>
            This is where your detailed Euler cycle result will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedResult;
