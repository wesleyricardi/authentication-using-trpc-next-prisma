import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoginUserInput } from "~/server/routers/user.schema";
import Button from "../reusable/button";
import Error from "../reusable/error";
import { Input } from "../reusable/input";

type LoginFormType = (props: LoginFormProps) => JSX.Element;

type LoginFormProps = {
  onSubmit: ({ username, password }: LoginUserInput) => Promise<void>;
  error?: any;
  isLoading: boolean;
  isSuccess: boolean;
};

/**
 * Component that renders a form to login.
 * @param onSubmit Function that will be called when the form is submitted.
 * @param error Error object returned by the mutation.
 * @param isLoading Boolean that indicates if the mutation is loading.
 * @param isSuccess Boolean that indicates if the mutation was successful.
 * @returns A JSX.Element.
 */
const LoginForm: LoginFormType = ({
  onSubmit,
  error,
  isLoading,
  isSuccess,
}) => {
  const { register, handleSubmit, reset } = useForm<LoginUserInput>();

  useEffect(() => {
    reset();
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        id="username"
        placeholder=" "
        label="Username"
        required
        {...register("username", { required: "true" })}
      />

      <Input
        type="password"
        id="password"
        placeholder=" "
        label="Password"
        required
        {...register("password", { required: "true" })}
      />

      <Button
        data-testid="login-submit"
        disabled={isLoading ? true : false}
        type="submit"
      >
        Login
      </Button>

      <Error error={error} />
    </form>
  );
};

export default LoginForm;
