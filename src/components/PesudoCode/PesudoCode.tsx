import TitleComponent from "../TitleComponent";

const PesudoCode = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="px-2">
        <TitleComponent title="Mã giả chương trình"></TitleComponent>
      </div>

      <div className="flex-1 bg-[var(--bg-color)] p-2">
        <div className="h-full w-full rounded-sm bg-white">
          {/* Component mã giả sẽ đặt ở đây */}
        </div>
      </div>
    </div>
  );
};
export default PesudoCode;
