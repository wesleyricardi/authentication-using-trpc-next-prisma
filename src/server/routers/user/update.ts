import { t } from "../../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/prisma";
import {
  updateUserSchema,
  UpdateUserOutput,
} from "~/server/routers/user.schema";
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

let update = t.procedure
  .input(updateUserSchema)
  .mutation(async ({ input: { name, email, phone, birthDate }, ctx }) => {
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

    const oldRegistrationData = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        document: true,
        phone: true,
        birthDate: true,
      },
    });

    if (!oldRegistrationData)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Not found any user with the provided token`,
      });

    let dataToUpdate: UpdateUserOutput = {
      name,
      email,
      phone,
      birthDate,
    };

    if (name && name === oldRegistrationData.name) {
      const { name: _, ...dataToUpdateWithoutName } = dataToUpdate;
      dataToUpdate = dataToUpdateWithoutName;
    }

    if (
      birthDate &&
      birthDate.toISOString() === oldRegistrationData.birthDate.toISOString()
    ) {
      const { birthDate: _, ...dataToUpdateWithoutBirthDate } = dataToUpdate;
      dataToUpdate = dataToUpdateWithoutBirthDate;
    }

    if (email && email !== oldRegistrationData.email) {
      const userWithEmailProvided = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (userWithEmailProvided)
        throw new TRPCError({
          code: "CONFLICT",
          message: `Email already in use`,
        });
    } else {
      const { email: _, ...dataToUpdateWithoutEmail } = dataToUpdate;
      dataToUpdate = dataToUpdateWithoutEmail;
    }

    if (phone && phone !== oldRegistrationData.phone) {
      const userWithPhoneProvided = await prisma.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        },
      });

      if (userWithPhoneProvided)
        throw new TRPCError({
          code: "CONFLICT",
          message: `Phone already in use`,
        });
    } else {
      const { phone: _, ...dataToUpdateWithoutPhone } = dataToUpdate;
      dataToUpdate = dataToUpdateWithoutPhone;
    }

    console.log(Object.keys(dataToUpdate).length);

    if (Object.keys(dataToUpdate).length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "There are no data to be update",
      });

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...dataToUpdate,
      },
      select: defaultUserSelect,
    });

    return user;
  });

export default update;
