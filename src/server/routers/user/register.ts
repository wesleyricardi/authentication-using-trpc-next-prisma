import { t } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { Prisma } from "@prisma/client";
import { createUserSchema } from "~/server/routers/user.schema";
import { hashPassword } from "~/utils/password";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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

let register = t.procedure
  .input(createUserSchema)
  .mutation(async ({ input, ctx }) => {
    const {
      username,
      password,
      confirmPassword,
      name,
      email,
      document,
      phone,
      birthDate,
    } = input;

    if (password !== confirmPassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Passwords don't match`,
      });
    }

    const hashedPassword = await hashPassword(password);

    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          name,
          email,
          document,
          phone,
          birthDate,
        },
        select: defaultUserSelect,
      });

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

      return { token, user };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists",
          });
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
      } else {
        console.log(e);
      }
    }
  });

export default register;
