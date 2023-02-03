import { FC } from "react";

const H1: FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
> = ({ className = "text-5xl my-4", children, ...props }) => {
  return (
    <h1 className={className} {...props}>
      {children}
    </h1>
  );
};

export default H1;
