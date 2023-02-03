import { FC } from "react";

const Error: FC<{ error: any }> = ({ error = undefined }) => {
  if (!error) return <></>;

  function hideError(errorElement: HTMLDivElement) {
    errorElement.style.display = "none";
  }

  const ErrorComponent: FC<any> = ({ children }) => {
    return (
      <div
        className="bg-red-400 w-fit mx-auto text-white px-2 py-1"
        id="errorContainer"
      >
        {children}
        <span
          className="ml-5 font-bold text-gray-600 hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            hideError(e.currentTarget.parentElement as HTMLDivElement);
          }}
        >
          X
        </span>
      </div>
    );
  };

  try {
    const errorsParsed = JSON.parse(error.message);

    if (Array.isArray(errorsParsed)) {
      return (
        <>
          {errorsParsed.map((errorParsed) => (
            <ErrorComponent>{errorParsed.message}</ErrorComponent>
          ))}
        </>
      );
    }
  } catch {}

  return <ErrorComponent>{error.message}</ErrorComponent>;
};

export default Error;
