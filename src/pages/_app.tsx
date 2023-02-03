import { NextPage } from "next";
import { AppProps } from "next/app";
import { AppType } from "next/dist/shared/lib/utils";
import { ReactElement, ReactNode } from "react";
import { DefaultLayout } from "~/components/layout";
import { trpc } from "~/utils/trpc";
import "tailwindcss/tailwind.css";
import AuthenticateProvider from "~/context/authenticate";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <AuthenticateProvider>
        <DefaultLayout>{page}</DefaultLayout>
      </AuthenticateProvider>
    ));

  return getLayout(<Component {...pageProps} />);
}) as AppType;

export default trpc.withTRPC(MyApp);
