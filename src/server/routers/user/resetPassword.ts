import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { resetPasswordSchema } from "~/server/routers/user.schema";
import { hashPassword } from "~/utils/password";
import { createToken } from "~/utils/token";

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

let resetPassword = t.procedure
  .input(resetPasswordSchema)
  .mutation(
    async ({ input: { code, email, newPassword, confirmPassword } }) => {
      if (newPassword !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords don't match",
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with email ${email}`,
        });
      }

      const recover = await prisma.userRecoveryCode.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true, code: true, expiresAt: true },
      });

      if (!recover) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No recovery code for user ${user.id}`,
        });
      }

      if (recover.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Code expired`,
        });
      }

      if (recover.code !== code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid recovery code`,
        });
      }

      const hashedPassword = await hashPassword(newPassword);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
        select: defaultUserSelect,
      });

      await prisma.userRecoveryCode.delete({ where: { id: recover.id } });

      const token = createToken({
        username: updatedUser.username,
        id: updatedUser.id,
        active: updatedUser.active,
        blocked: updatedUser.blocked,
      });

      return {
        token,
        user: updatedUser,
      };
    }
  );

export default resetPassword;
