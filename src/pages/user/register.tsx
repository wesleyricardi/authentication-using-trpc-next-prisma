import { trpc } from "~/utils/trpc";
import { CreateUserInput } from "~/server/routers/user.schema";
import { useRouter } from "next/router";
import RegisterForm from "~/components/forms/register";
import H1 from "~/components/reusable/h1";
import SeparatorBar from "~/components/reusable/separatorBar";
import CustomLink from "~/components/reusable/link";
import { useAuthentication } from "~/context/authenticate";

const Register = () => {
  const { push } = useRouter();
  const { setUser } = useAuthentication();

  const {
    mutateAsync: createUser,
    isLoading,
    error,
    isSuccess,
  } = trpc.user.register.useMutation({
    async onSuccess(data) {
      if (data) {
        setUser(data.user);
        if (data.user.active === false) push("/user/activate");
        else push("/user/update");
      }
    },

    onError(error) {
      console.log(error.message);
    },
  });

  const onSubmit = async ({
    username,
    password,
    confirmPassword,
    name,
    email,
    phone,
    document,
    birthDate,
  }: CreateUserInput) => {
    try {
      await createUser({
        username,
        password,
        confirmPassword,
        name,
        email,
        phone,
        document,
        birthDate,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[36rem] mx-auto my-4 p-4 shadow-lg text-center bg-gray-50">
      <H1>Register</H1>
      <RegisterForm
        onSubmit={onSubmit}
        error={error}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
      <SeparatorBar>ou</SeparatorBar>
      <CustomLink href={"/user/login"}>Login</CustomLink>
      <CustomLink href={"/user/forgot_my_password"}>
        Forgot my password
      </CustomLink>
    </div>
  );
};

export default Register;
