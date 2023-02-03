import { useForm } from "react-hook-form";
import { ResetPasswordInput } from "~/server/routers/user.schema";
import Button from "../reusable/button";
import Error from "../reusable/error";
import { Input } from "../reusable/input";

type Props = {
  onSubmit: (data: ResetPasswordInput) => Promise<void>;
  isLoading: boolean;
  error: any;
};

const ResetPasswordForm = ({ onSubmit, error, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Error error={error} />

      <Input
        label="Code"
        type="text"
        id="code"
        {...register("code", { required: true })}
      />

      <Input
        label="Password"
        type="password"
        id="password"
        {...register("newPassword", { required: true })}
      />

      <Input
        label="Confirm password"
        type="password"
        id="confirmPassword"
        {...register("confirmPassword", { required: true })}
      />

      <Button
        disabled={isLoading}
        data-testid="change_password_submit"
        type="submit"
      >
        Change
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
