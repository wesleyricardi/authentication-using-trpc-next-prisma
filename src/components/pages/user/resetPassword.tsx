import { useRouter } from "next/router";
import ResetPasswordForm from "~/components/forms/resetPassword";
import H1 from "~/components/reusable/h1";
import { ResetPasswordInput } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";

const ResetPassword = ({ email }: { email: string }) => {
  const router = useRouter();

  const {
    mutateAsync: resetPassword,
    error,
    isLoading,
  } = trpc.user.resetPassword.useMutation();

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword({ ...data, email });
      router.push("/user/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <H1>Reset password</H1>

      <ResetPasswordForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default ResetPassword;
