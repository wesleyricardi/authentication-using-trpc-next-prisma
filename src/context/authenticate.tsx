import { createContext, useContext, useState } from "react";
import { User } from "~/server/routers/user.schema";
import { trpc } from "~/utils/trpc";

type Auth = {
  isAuthenticated: boolean;
  user?: User;
  setUser: (user: User | undefined) => void;
};

const AuthenticateContext = createContext({} as Auth);

export default function AuthenticateProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [user, setUser] = useState<User | undefined>();
  const isAuthenticated = !!user;

  trpc.user.authenticate.useQuery(undefined, {
    trpc: {
      ssr: false,
    },
    onSuccess(user) {
      setUser(user);
    },
  });

  return (
    <AuthenticateContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthenticateContext.Provider>
  );
}

export const useAuthentication = () => useContext(AuthenticateContext);
