import { destroyCookie } from "nookies";
import { FC } from "react";
import Button from "~/components/reusable/button";
import Error from "~/components/reusable/error";
import { trpc } from "~/utils/trpc";

const SendActivationCode: FC<{
  setTheCodeHasBeenSent: (arg: boolean) => void;
}> = ({ setTheCodeHasBeenSent }) => {
  const authenticateQuery = trpc.user.authenticate.useQuery(undefined, {
    trpc: {
      ssr: false,
    },
  });

  if (authenticateQuery.error) {
    destroyCookie(null, "token");
    return <div>Erro ao recuperar dados do usuário</div>;
  }

  const {
    mutateAsync: sendActivationCode,
    isLoading,
    error,
  } = trpc.user.sendActivationCode.useMutation();

  const onSubmit = async () => {
    try {
      await sendActivationCode();
      setTheCodeHasBeenSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (authenticateQuery.isLoading) return <>Loading</>;

  return (
    <>
      <Error error={error} />
      <div>
        Enviar codigo de ativação para o email:{" "}
        <span id="email-to-receive-code">{authenticateQuery.data.email}</span>
      </div>
      <Button data-testid="send-code-submit" onClick={onSubmit} type="submit">
        Enviar
      </Button>
    </>
  );
};

export default SendActivationCode;
