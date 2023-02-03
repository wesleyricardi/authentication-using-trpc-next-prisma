import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import { recoverPasswordSchema } from "~/server/routers/user.schema";
import sendRecoverPasswordMail from "~/services/mail/sendRecoverPasswordEmail";

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

let recoverPassword = t.procedure
  .input(recoverPasswordSchema)
  .mutation(async ({ input: { email } }) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: defaultUserSelect,
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `There are no user with the provide email`,
      });
    }

    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

    await prisma.userRecoveryCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
      },
    });

    await sendRecoverPasswordMail(email, code);

    return { message: "Recover password code sent" };
  });

export default recoverPassword;
