import { useForm } from "react-hook-form";
import { ChangePasswordInput } from "~/server/routers/user.schema";
import Button from "../reusable/button";
import Error from "../reusable/error";
import { Input } from "../reusable/input";

interface Props {
  onSubmit: (data: ChangePasswordInput) => Promise<void>;
  error: any;
  isLoading: boolean;
  isSuccess: boolean;
}

const ChangePasswordForm = ({
  onSubmit,
  error,
  isLoading,
  isSuccess,
}: Props) => {
  const { register, handleSubmit } = useForm<ChangePasswordInput>();

  function checkPasswordMatch() {
    const password = document.getElementById("newPassword") as HTMLInputElement;
    const confirmPassword = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;

    if (!confirmPassword.value) {
      return;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Passwords do not match");
    } else {
      confirmPassword.setCustomValidity("");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Password"
        type="password"
        id="oldPassword"
        placeholder=" "
        required
        {...register("oldPassword", { required: "true" })}
      />

      <Input
        label="New Password"
        type="password"
        id="newPassword"
        placeholder=" "
        required
        {...register("newPassword", { required: "true" })}
        onChange={() => checkPasswordMatch()}
      />

      <Input
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        placeholder=" "
        required
        {...register("confirmPassword", { required: "true" })}
        onChange={() => checkPasswordMatch()}
      />

      <Button
        disabled={isLoading}
        data-testid="change-password-submit"
        type="submit"
      >
        Change Password
      </Button>
      <Error error={error} />
    </form>
  );
};

export default ChangePasswordForm;
