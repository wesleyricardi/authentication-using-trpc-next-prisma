import { LoginUserInput } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
import LoginForm from "~/components/forms/login";
import H1 from "~/components/reusable/h1";
import CustomLink from "~/components/reusable/link";
import SeparatorBar from "~/components/reusable/separatorBar";
import { useAuthentication } from "~/context/authenticate";

const login = () => {
  const router = useRouter();
  const { setUser } = useAuthentication();

  const {
    mutateAsync: loginUser,
    isLoading,
    error,
    isSuccess,
  } = trpc.user.login.useMutation({
    async onSuccess(data) {
      if (data) {
        setUser(data.user);
        if (data.user.active === false) router.push("/user/activate");
        else router.push("/user/update");
      }
    },

    onError(error) {
      console.log(error.message);
    },
  });

  const onSubmit = async ({ username, password }: LoginUserInput) => {
    try {
      await loginUser({ username, password });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[36rem] mx-auto my-4 p-4 shadow-lg text-center bg-gray-50">
      <H1>Login</H1>
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        isSuccess={isSuccess}
      />
      <SeparatorBar>ou</SeparatorBar>
      <CustomLink href={"/user/register"}>Register</CustomLink>
      <CustomLink href={"/user/forgot_my_password"}>
        Forgot my password
      </CustomLink>
    </div>
  );
};

export default login;
