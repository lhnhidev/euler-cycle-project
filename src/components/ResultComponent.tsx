import Title from "./TitleComponent";

const ResultComponent = () => {
  return (
    <div className="flex h-full flex-col bg-[var(--bg-color)] px-2 pb-2">
      <Title title="Kết quả thuật toán" />

      <div className="flex flex-1 flex-col gap-3">
        <p className="set-text-font-size-smaller mt-2 text-[var(--primary-color)]">
          Note: Đồ thị không khả dụng
        </p>
        <div className="rouded-sm flex-1">
          <div className="h-full w-full bg-white"></div>
          {/* Ở đây sẽ chứa code canvas của kết quả Euler-Cycle */}
        </div>
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-12">
            <button className="set-text-font-size-smaller w-full rounded-md bg-[var(--primary-color)] p-2 text-white transition-all hover:bg-[var(--secondary-color)]">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultComponent;
