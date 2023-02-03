import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { verifyToken } from "~/utils/token";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  name: true,
  email: true,
  phone: true,
  document: true,
  birthDate: true,
  active: true,
  blocked: true,
});

let authenticate = t.procedure.query(async ({ ctx }) => {
  const token = (() => {
    try {
      const { token } = ctx.req.cookies as { token: string };
      return token;
    } catch (error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No token provided",
      });
    }
  })();

  const { username, id } = (() => {
    try {
      return verifyToken(token) as {
        username: string;
        id: number;
      };
    } catch (e) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }
  })();

  const user = await prisma.user.findUnique({
    where: { id },
    select: defaultUserSelect,
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No user with username ${username}`,
    });
  }

  return user;
});

export default authenticate;
