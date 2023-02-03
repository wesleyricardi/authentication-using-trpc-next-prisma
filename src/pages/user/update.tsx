import { UpdateUserInput, User } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";
import { useState } from "react";
import NextError from "next/error";
import UpdateUserForm from "~/components/forms/updateUser";
import ChangePassword from "~/components/pages/user/changePassword";
import H1 from "~/components/reusable/h1";
import { useAuthentication } from "~/context/authenticate";

const UpdateUser = () => {
  const { user } = useAuthentication();

  if (!user) return <>Authenticating user...</>;

  /* const [user, setUser] = useState<Partial<User>>();

  const authenticateQuery = trpc.user.authenticate.useQuery(undefined, {
    trpc: {
      ssr: false,
    },
    onSuccess(user) {
      setUser({
        name: user.name,
        email: user.email,
        phone: user.phone,
        document: user.document,
        birthDate: user.birthDate.toISOString().split("T")[0], //get yyyy-mm-dd fron ISOString
      });
    },
    onError(error) {
      console.log(error.message);
    },
  }); */

  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
  } = trpc.user.update.useMutation();

  const onSubmit = async ({
    name,
    email,
    phone,
    birthDate,
  }: UpdateUserInput) => {
    try {
      await updateUser({
        name,
        email,
        phone,
        birthDate,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkForDuplicity = async ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }) => {
    if (email && email === user.email) return;
    if (phone && phone === user.phone) return;

    /**
     * @todo
     * [ ] put here the code to verify if email or phone is duplicate
     */
  };

  /*   if (authenticateQuery.error) {
    return (
      <NextError
        title={authenticateQuery.error.message}
        statusCode={authenticateQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (authenticateQuery.status === "loading" || !user) {
    return <div>Autenticando usuário...</div>;
  } */

  return (
    <div className="w-[36rem] mx-auto my-4 p-4 shadow-lg text-center bg-gray-50">
      <H1>Update User</H1>
      <UpdateUserForm
        user={user}
        onSubmit={onSubmit}
        checkForDuplicity={checkForDuplicity}
        error={error}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
      <ChangePassword />
    </div>
  );
};

export default UpdateUser;
