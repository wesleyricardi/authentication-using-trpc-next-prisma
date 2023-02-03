import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";

const CustomLink: FC<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
> = ({
  children,
  href = "#",
  className = "font-semibold text-blue-700 my-4 block",
  ...props
}) => {
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};

export default CustomLink;
