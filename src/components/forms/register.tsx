import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { CreateUserInput } from "~/server/routers/user.schema";
import Button from "../reusable/button";
import Error from "../reusable/error";
import { Input } from "../reusable/input";

type Props = {
  onSubmit: ({
    username,
    password,
    confirmPassword,
    name,
    email,
    phone,
    document,
    birthDate,
  }: CreateUserInput) => Promise<void>;
  error: any;
  isLoading: boolean;
  isSuccess: boolean;
};

/**
 * Component that renders a form to register a new user.
 * @param onSubmit Function that will be called when the form is submitted.
 * @param error Error object returned by the mutation.
 * @param isLoading Boolean that indicates if the mutation is loading.
 * @param isSuccess Boolean that indicates if the mutation was successful.
 * @returns A JSX.Element.
 */
const RegisterForm = ({ onSubmit, error, isLoading, isSuccess }: Props) => {
  const { register, handleSubmit, reset } = useForm<CreateUserInput>();

  useEffect(() => {
    reset({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      document: undefined,
      birthDate: undefined,
    });
  }, [isSuccess]);

  function checkPasswordMatch() {
    const password = document.getElementById("password") as HTMLInputElement;
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
    <form data-testid="register-form" onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        label="Name"
        id="name"
        placeholder=" "
        required
        {...register("name", { required: "true" })}
      />

      <Input
        type="email"
        label="E-mail"
        id="email"
        required
        {...register("email", { required: "true" })}
      />

      <Input
        type="tel"
        label="Phone"
        id="phone"
        placeholder=" "
        required
        {...register("phone", { required: "true" })}
      />

      <Input
        label="Document"
        type="text"
        id="document"
        placeholder=" "
        required
        {...register("document", { required: "true" })}
      />

      <Input
        label="Birth Date"
        type="date"
        id="birthDate"
        required
        {...register("birthDate", { required: "true" })}
      />

      <Input
        label="Username"
        type="text"
        placeholder=" "
        id="username"
        required
        {...register("username", { required: "true" })}
      />

      <Input
        label="Password"
        type="password"
        id="password"
        placeholder=" "
        required
        {...register("password", { required: "true" })}
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
        type="submit"
        data-testid="register-submit"
        name="register"
        disabled={isLoading}
      >
        Register
      </Button>
      <Error error={error} />
    </form>
  );
};

export default RegisterForm;
