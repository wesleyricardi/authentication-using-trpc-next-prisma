import { Input } from "../reusable/input";
import { useForm } from "react-hook-form";
import { UpdateUserInput, User } from "~/server/routers/user.schema";
import Error from "../reusable/error";
import Button from "../reusable/button";

interface Props {
  user: User;
  onSubmit: ({
    name,
    email,
    phone,
    birthDate,
  }: UpdateUserInput) => Promise<void>;
  checkForDuplicity: ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }) => Promise<void>;
  error: any;
  isLoading: boolean;
  isSuccess: boolean;
}

const UpdateUserForm = ({
  user,
  onSubmit,
  checkForDuplicity,
  error,
  isLoading,
  isSuccess,
}: Props) => {
  const { register, handleSubmit } = useForm<UpdateUserInput>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Error error={error} />

      <Input
        label="Name"
        type="text"
        id="name"
        placeholder=" "
        required
        {...register("name", { required: "true", value: user.name })}
      />

      <Input
        label="E-mail"
        type="email"
        id="email"
        placeholder=" "
        required
        {...register("email", { required: "true", value: user.email })}
        //  onBlur={(e) => checkForDuplicity({ email: e.target.value })}
      />

      <Input
        label="Phone"
        type="tel"
        id="phone"
        placeholder=" "
        required
        {...register("phone", { required: "true", value: user.phone })}
        //   onBlur={(e) => checkForDuplicity({ phone: e.target.value })}
      />

      <Input
        label="Document"
        type="text"
        id="document"
        name="document"
        placeholder=" "
        value={user.document}
        readOnly
      />

      <Input
        label="Birth Date"
        type="date"
        id="birthDate"
        required
        {...register("birthDate", {
          required: "true",
          value: (user.birthDate as Date).toISOString().split("T")[0],
        })}
      />

      <Button disabled={isLoading} type="submit" data-testid="update-submit">
        Update
      </Button>
    </form>
  );
};

export default UpdateUserForm;
