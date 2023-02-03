import { FC } from "react";
import RecoverPasswordForm from "~/components/forms/recoverPassword";
import H1 from "~/components/reusable/h1";
import { RecoverPasswordInput } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";

const RecoverPassword: FC<{ setEmail: (arg: string) => void }> = ({
  setEmail,
}) => {
  const {
    mutateAsync: recoverPassword,
    isLoading,
    error,
  } = trpc.user.recoverPassword.useMutation();

  const onSubmit = async ({ email }: RecoverPasswordInput) => {
    try {
      await recoverPassword({ email });
      setEmail(email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <H1>Recover password</H1>
      <RecoverPasswordForm
        onSubmit={onSubmit}
        error={error}
        isLoading={isLoading}
      />
    </>
  );
};

export default RecoverPassword;
