import { FC } from "react";

const SeparatorBar: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({
  className = `before:content-[''] before:inline-block before:w-20 before:mr-3 before:h-[5px] 
  before:border-b-[1px] before:border-gray-400 before:border-solid  after:content-[''] 
  after:inline-block after:w-20 after:ml-3 after:h-[5px] after:border-b-[1px] 
  after:border-gray-400 after:border-solid flex justify-center items-center my-2`,
  children,
}) => {
  return <div className={className}>{children}</div>;
};

export default SeparatorBar;
