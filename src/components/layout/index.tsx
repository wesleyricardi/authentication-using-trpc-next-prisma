import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";

import { ReactNode } from "react";
import NavBar from "./navBar";

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main>{children}</main>

      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
