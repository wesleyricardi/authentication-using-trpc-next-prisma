import { useForm } from "react-hook-form";
import { ActivateUserInput } from "~/server/routers/user.schema";
import Button from "../reusable/button";
import Error from "../reusable/error";
import { Input } from "../reusable/input";

type Props = {
  onSubmit: ({ code }: ActivateUserInput) => Promise<void>;
  isLoading: boolean;
  error: any;
};

const ActivateUserForm = ({ onSubmit, error, isLoading }: Props) => {
  const { register, handleSubmit } = useForm<ActivateUserInput>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Error error={error} />
      <Input
        label="Code"
        type="text"
        placeholder=" "
        id="code"
        required
        {...register("code", { required: "true" })}
      />

      <Button
        data-testid="activate-submit"
        title="activate account"
        type="submit"
        disabled={isLoading}
      >
        Activate
      </Button>
    </form>
  );
};

export default ActivateUserForm;
