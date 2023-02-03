import { useForm } from "react-hook-form";
import { RecoverPasswordInput } from "~/server/routers/user.schema";
import Button from "../reusable/button";
import Error from "../reusable/error";
import { Input } from "../reusable/input";

type Props = {
  onSubmit: ({ email }: RecoverPasswordInput) => Promise<void>;
  isLoading: boolean;
  error: any;
};

const RecoverPasswordForm = ({ onSubmit, isLoading, error }: Props) => {
  const { register, handleSubmit, formState } = useForm<RecoverPasswordInput>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Error error={error} />

      <Input
        label="E-mail"
        type="email"
        id="email"
        {...register("email", { required: true })}
      />

      <Button
        disabled={isLoading}
        data-testid="send_recover_password_code"
        type="submit"
      >
        Send code
      </Button>
    </form>
  );
};

export default RecoverPasswordForm;
