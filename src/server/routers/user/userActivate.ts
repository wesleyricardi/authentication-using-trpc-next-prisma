import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { activateUserSchema } from "~/server/routers/user.schema";
import { createToken, verifyToken } from "~/utils/token";

import { setCookie } from "nookies";

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

let userActivate = t.procedure
  .input(activateUserSchema)
  .mutation(async ({ input: { code }, ctx }) => {
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
          code: "FORBIDDEN",
          message: "the provided token is invalid",
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

    const activationCode = await prisma.userActivationCode.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: { id: true, code: true, expiresAt: true },
    });

    if (!activationCode) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No activation code for user ${user.id}`,
      });
    }

    if (activationCode.expiresAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Activation code expired`,
      });
    }

    if (activationCode.code !== code) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid activation code`,
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        active: true,
      },
    });

    await prisma.userActivationCode.delete({
      where: { id: activationCode.id },
    });

    const newtoken = createToken({
      username: user.username,
      id: user.id,
      active: true,
      blocked: user.blocked,
    });

    setCookie(ctx, "token", newtoken, {
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return { ...user, active: true };
  });

export default userActivate;
