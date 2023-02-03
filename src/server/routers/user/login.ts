import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { loginUserSchema } from "~/server/routers/user.schema";
import { verifyPassword } from "~/utils/password";
import { createToken } from "~/utils/token";
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

let login = t.procedure
  .input(loginUserSchema)
  .mutation(async ({ input: { username, password }, ctx }) => {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { ...defaultUserSelect, password: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No user with username ${username}`,
      });
    }

    const isPasswordCorrect = await verifyPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid password`,
      });
    }

    const token = createToken({
      username: user.username,
      id: user.id,
      active: user.active,
      blocked: user.blocked,
    });

    setCookie(ctx, "token", token, {
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  });

export default login;
