import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes } from "react";

/* type Props = {
  id: string;
  name: string;
  className: string;
  type: React.HTMLInputTypeAttribute;
  value: 
}; */
type InputType =
  | "date"
  | "datetime-local"
  | "email"
  | "hidden"
  | "month"
  | "number"
  | "password"
  | "range"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url";

type InputProps = {
  id: string;
  name: string;
  label: string;
  type?: InputType;
  className?: string;
  containerClassName?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      type = "text",
      className = "bg-transparent my-1 border-solid border-[1px] border-gray-200",
      containerClassName = "w-64 mx-auto text-left flex justify-between items-center",
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          ref={ref}
          name={name}
          type={type}
          aria-label={label}
          placeholder={placeholder}
          className={className}
          {...props}
        />
      </div>
    );
  }
);
