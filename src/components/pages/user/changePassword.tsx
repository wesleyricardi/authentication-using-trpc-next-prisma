import ChangePasswordForm from "~/components/forms/changePassword";
import { ChangePasswordInput } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";

const ChangePassword = () => {
  const {
    mutateAsync: changePassword,
    isLoading,
    isSuccess,
    error,
  } = trpc.user.changePassword.useMutation();

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword({ ...data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Change password</h2>
      <ChangePasswordForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        isSuccess={isSuccess}
        error={error}
      />
    </>
  );
};

export default ChangePassword;
