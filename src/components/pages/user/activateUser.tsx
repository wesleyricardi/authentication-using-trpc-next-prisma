import { useRouter } from "next/router";
import ActivateUserForm from "~/components/forms/activateUser";
import { useAuthentication } from "~/context/authenticate";
import { ActivateUserInput } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";

const ActivateUser = () => {
  const router = useRouter();
  const { setUser } = useAuthentication();

  const {
    mutateAsync: activateUser,
    isLoading,
    error,
  } = trpc.user.userActivate.useMutation({
    async onSuccess(user) {
      if (user) {
        setUser(user);
        router.push("/user/update");
      }
    },

    onError(error) {
      console.log(error.message);
    },
  });

  const onSubmit = async ({ code }: ActivateUserInput) => {
    try {
      await activateUser({ code });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ActivateUserForm
        onSubmit={onSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ActivateUser;
