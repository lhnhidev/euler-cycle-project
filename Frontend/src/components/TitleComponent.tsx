type Props = {
  title: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const TitleComponent = ({ title, style = {}, children }: Props) => {
  return (
    <div
      className="set-text-font-size-larger mx-[-8px] w-[calc(100%+16px)] border-b border-[var(--primary-color)] bg-[#eeeeee] px-2 py-1 text-lg font-bold text-[var(--primary-color)]"
      style={style}
    >
      {title}
      <div>{children}</div>
    </div>
  );
};
export default TitleComponent;
