import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { changePasswordSchema } from "~/server/routers/user.schema";
import { hashPassword, verifyPassword } from "~/utils/password";
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

let changePassword = t.procedure
  .input(changePasswordSchema)
  .mutation(
    async ({ input: { oldPassword, newPassword, confirmPassword }, ctx }) => {
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

      const { id } = verifyToken(token) as {
        id: number;
      };
      const user = await prisma.user.findUnique({
        where: { id },
        select: { ...defaultUserSelect, password: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with token ${token}`,
        });
      }

      const isPasswordCorrect = await verifyPassword(
        oldPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid password`,
        });
      }

      if (newPassword !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Passwords don't match`,
        });
      }

      const hashedPassword = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return { message: "Password changed" };
    }
  );

export default changePassword;
