import { trpc } from "~/utils/trpc";
import nookies from "nookies";
import Link from "next/link";

const AuthenticatePage = () => {
  const authenticateQuery = trpc.user.authenticate.useQuery(undefined, {
    trpc: {
      ssr: false,
    },
  });

  if (authenticateQuery.error) {
    nookies.destroy(null, "token");
    return <div>Erro ao autenticar usuário</div>;
  }

  if (authenticateQuery.status === "loading") {
    return <div>Autenticando usuário...</div>;
  }

  return (
    <div>
      <h1>Authenticated</h1>
      <p>You are now logged in.</p>
      <Link href="/user/update">
        <button>GO TO PAINEL</button>
      </Link>
    </div>
  );
};
export default AuthenticatePage;
