import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

const Button: FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({
  className = "py-2 px-4 m-4 bg-green-300 rounded",
  children,
  ...props
}) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
