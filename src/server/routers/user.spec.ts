/**
 * @jest-environment ./environment-jest
 */

import { expect } from "@jest/globals";
import { AppRouter, appRouter } from "./_app";
import { inferProcedureInput } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "./user.schema";
import { prisma } from "~/server/prisma";

interface CreateContextOptions {
  cookies?: {
    token: string;
  };
}

type CreateContextInner = (opts: CreateContextOptions) => Promise<{
  req: NextApiRequest;
  res: NextApiResponse<any>;
}>;

const createContextInner: CreateContextInner = async (_opts) => {
  return {
    req: { ..._opts } as any,
    res: {} as any,
  };
};

let token: string;

let user: User;

describe("User registration tests", () => {
  it("should create a user", async () => {
    const input: inferProcedureInput<AppRouter["user"]["register"]> = {
      username: "test",
      password: "123456789",
      confirmPassword: "123456789",
      name: "User Test",
      email: "email@test.com",
      phone: "111111111111",
      document: "11111111111",
      birthDate: "2021-01-01",
    };

    const caller = appRouter.createCaller(await createContextInner({}));

    const { password, confirmPassword, ...expected } = {
      ...input,
      blocked: false,
      active: false,
      id: expect.any(Number),
    };

    const received = await caller.user.register(input);

    expect(received).toStrictEqual({
      token: expect.any(String),
      user: { ...expected, birthDate: new Date(expected.birthDate) },
    });
  });

  describe("Tests for failure to register user", () => {
    const input: inferProcedureInput<AppRouter["user"]["register"]> = {
      username: "test2",
      password: "123456789",
      confirmPassword: "123456789",
      name: "User Test",
      email: "email2@test.com",
      phone: "22222222222",
      document: "22222222222",
      birthDate: "2021-01-01",
    };

    beforeAll(async () => {
      const caller = appRouter.createCaller(await createContextInner({}));
      await caller.user.register(input);
    });

    it("should not register duplicated email", async () => {
      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.register({
          ...input,
          username: "otherUsername",
          document: "33333333333",
          phone: "33333333333",
        });
      } catch (e: any) {
        expect(e.message).toBe("User already exists");
      }
    });

    it("should not register duplicated phone", async () => {
      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.register({
          ...input,
          email: "other@email.com",
          username: "otherUsername",
          document: "33333333333",
        });
      } catch (e: any) {
        expect(e.message).toBe("User already exists");
      }
    });

    it("should not register duplicated document", async () => {
      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.register({
          ...input,
          email: "other@email.com",
          username: "otherUsername",
          phone: "33333333333",
        });
      } catch (e: any) {
        expect(e.message).toBe("User already exists");
      }
    });

    it("should not register duplicated username", async () => {
      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.register({
          ...input,
          email: "other@email.com",
          document: "33333333333",
          phone: "33333333333",
        });
      } catch (e: any) {
        expect(e.message).toBe("User already exists");
      }
    });

    it("should not register with invalid confirm password", async () => {
      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.register({
          ...input,
          confirmPassword: "wrong password",
        });
      } catch (e: any) {
        expect(e.message).toBe("Passwords don't match");
      }
    });
  });
});

describe("User login test", () => {
  const input: inferProcedureInput<AppRouter["user"]["login"]> = {
    username: "test",
    password: "123456789",
  };

  it("should login a user", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));

    const received = await caller.user.login(input);

    token = received.token;
    user = received.user;

    expect(received).toStrictEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        username: "test",
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        document: expect.any(String),
        birthDate: expect.any(Date),
        active: expect.any(Boolean),
        blocked: expect.any(Boolean),
      },
    });
  });

  it("should not login a user with wrong password", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));

    try {
      await caller.user.login({
        ...input,
        password: "wrong password",
      });
    } catch (e: any) {
      expect(e.message).toBe("Invalid password");
    }
  });

  it("should not login a user with wrong username", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));

    try {
      await caller.user.login({
        ...input,
        username: "wrong_username",
      });
    } catch (e: any) {
      expect(e.message).toBe("No user with username wrong_username");
    }
  });
});

describe("User authentication test", () => {
  it("should authenticate a user", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    const received = await caller.user.authenticate();

    expect(received).toStrictEqual(user);
  });

  it("shound not authenticate a user without token", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));

    try {
      await caller.user.authenticate();
    } catch (e: any) {
      expect(e.message).toBe("No token provided");
    }
  });

  it("should not authenticate a user with invalid token", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token: "wrong.token" } })
    );

    try {
      await caller.user.authenticate();
    } catch (e: any) {
      expect(e.message).toBe("Invalid token");
    }
  });
});

describe("User activation code submission tests", () => {
  it("should send a activation code", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    const received = await caller.user.sendActivationCode();

    expect(received).toStrictEqual({ message: "Activation code sent" });
  });

  it("shound not send activation code without token", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));

    try {
      await caller.user.sendActivationCode();
    } catch (e: any) {
      expect(e.message).toBe("No token provided");
    }
  });

  it("should not send activation code with a invalid token", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token: "token.invalid" } })
    );

    try {
      await caller.user.sendActivationCode();
    } catch (e: any) {
      expect(e.message).toBe("the provided token is invalid");
    }
  });
});

describe("User activation tests", () => {
  it("should activate a user", async () => {
    const activationCode = await prisma.userActivationCode.findFirst({
      where: {
        userId: user.id,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: { id: true, code: true, expiresAt: true },
    });

    if (!activationCode) {
      throw new Error("Activation code not found");
    }

    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    const received = await caller.user.userActivate({
      code: activationCode.code,
    });

    user = { ...user, active: true };

    expect(received).toStrictEqual({
      ...user,
    });
  });

  describe("Tests for failure to activate user", () => {
    beforeAll(async () => {
      const caller = appRouter.createCaller(
        await createContextInner({ cookies: { token } })
      );

      await caller.user.sendActivationCode();
    });

    it("should not activate without token", async () => {
      const activationCode = await prisma.userActivationCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true, code: true, expiresAt: true },
      });

      if (!activationCode) {
        throw new Error("Activation code not found");
      }

      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.userActivate({
          code: activationCode.code,
        });
      } catch (e: any) {
        expect(e.message).toBe("No token provided");
      }
    });

    it("should not activate with wrong token", async () => {
      const activationCode = await prisma.userActivationCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true, code: true, expiresAt: true },
      });

      if (!activationCode) {
        throw new Error("Activation code not found");
      }

      const caller = appRouter.createCaller(
        await createContextInner({
          cookies: {
            token: "invalid.token",
          },
        })
      );

      try {
        await caller.user.userActivate({
          code: activationCode.code,
        });
      } catch (e: any) {
        expect(e.message).toBe("the provided token is invalid");
      }
    });

    it("should not activate with wrong code", async () => {
      const caller = appRouter.createCaller(
        await createContextInner({ cookies: { token } })
      );

      try {
        await caller.user.userActivate({
          code: "00000",
        });
      } catch (e: any) {
        expect(e.message).toBe("Invalid activation code");
      }
    });

    it("should not activate with expired token", async () => {
      const activationCode = await prisma.userActivationCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true, code: true, expiresAt: true },
      });

      if (!activationCode) {
        throw new Error("Recover code not found");
      }

      await prisma.userActivationCode.update({
        where: {
          id: activationCode.id,
        },
        data: {
          expiresAt: new Date("2020-12-12"),
        },
      });

      const caller = appRouter.createCaller(
        await createContextInner({ cookies: { token } })
      );

      try {
        await caller.user.userActivate({
          code: activationCode.code,
        });
      } catch (e: any) {
        expect(e.message).toBe("Activation code expired");
      }
    });
  });
});

describe("Update user tests", () => {
  const input: Required<inferProcedureInput<AppRouter["user"]["update"]>> = {
    name: "User Test Updated",
    email: "email3@test.com",
    phone: "33333333333",
    birthDate: "2021-12-12",
  };

  it("should update a user", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    const received = await caller.user.update(input);

    expect(received).toStrictEqual({
      ...user,
      ...input,
      birthDate: new Date(input.birthDate),
    });
  });

  it("shound not updade a user without token", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));
    try {
      await caller.user.update(input);
    } catch (e: any) {
      expect(e.message).toBe("No token provided");
    }
  });

  it("should not update with duplicate email", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    try {
      await caller.user.update({
        ...input,
        email: "email2@test.com",
      });

      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBe("Email already in use");
    }
  });

  it("should not update with duplicate phone", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    try {
      await caller.user.update({
        ...input,
        phone: "22222222222",
      });

      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBe("Phone already in use");
    }
  });
});

describe("Change password user tests", () => {
  const input: inferProcedureInput<AppRouter["user"]["changePassword"]> = {
    oldPassword: "123456789",
    newPassword: "1234567890",
    confirmPassword: "1234567890",
  };

  it("must change a user's password", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    const received = await caller.user.changePassword(input);

    expect(received).toStrictEqual({ message: "Password changed" });
  });

  it("it must not change a user's passoword without token", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));
    try {
      await caller.user.changePassword(input);
    } catch (e: any) {
      expect(e.message).toBe("No token provided");
    }
  });

  it("must not change a user's password with wrong old password", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    try {
      await caller.user.changePassword({
        ...input,
        oldPassword: "wrong password",
      });
    } catch (e: any) {
      expect(e.message).toBe("Invalid password");
    }
  });

  it("must not change a user's password with wrong confirm password", async () => {
    const caller = appRouter.createCaller(
      await createContextInner({ cookies: { token } })
    );

    try {
      await caller.user.changePassword({
        ...input,
        oldPassword: "1234567890",
        confirmPassword: "wrong password",
      });
    } catch (e: any) {
      expect(e.message).toBe("Passwords don't match");
    }
  });
});

describe("Tests to send user password recovery code", () => {
  it("should send a recover password code", async () => {
    const email = "email2@test.com";
    const caller = appRouter.createCaller(await createContextInner({}));

    const received = await caller.user.recoverPassword({ email });

    expect(received).toStrictEqual({ message: "Recover password code sent" });
  });

  it("should not send a recover password code with wrong email", async () => {
    const caller = appRouter.createCaller(await createContextInner({}));
    try {
      await caller.user.recoverPassword({
        email: "non@existent.email",
      });
    } catch (e: any) {
      expect(e.message).toBe(`There are no user with the provide email`);
    }
  });
});

describe("User password reset tests", () => {
  const email = "email2@test.com";

  it("should reset a user password", async () => {
    const result = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        document: true,
        birthDate: true,
        active: true,
        blocked: true,
      },
    });

    if (!result) throw new Error("User not found");

    const user = { ...result, document: String(result.document) };

    const recoveryCode = await prisma.userRecoveryCode.findFirst({
      where: {
        userId: user.id,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: { id: true, code: true, expiresAt: true },
    });

    if (!recoveryCode) throw new Error("Recover code not found");

    const caller = appRouter.createCaller(await createContextInner({}));

    const received = await caller.user.resetPassword({
      email,
      code: recoveryCode.code,
      newPassword: "123456789",
      confirmPassword: "123456789",
    });

    expect(received).toStrictEqual({ token: expect.any(String), user });
  });

  describe("Tests for failure to reset user password", () => {
    //Resending recovery code
    beforeAll(async () => {
      const caller = appRouter.createCaller(await createContextInner({}));
      await caller.user.recoverPassword({
        email,
      });
    });

    it("should not reset a user password with wrong code", async () => {
      const caller = appRouter.createCaller(await createContextInner({}));
      try {
        await caller.user.resetPassword({
          email,
          code: "wrong code",
          newPassword: "123456789",
          confirmPassword: "123456789",
        });

        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.message).toBe("Invalid recovery code");
      }
    });

    it("should not reset a user password with wrong confirm password", async () => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (!user) throw new Error("User not found");

      const recoverCode = await prisma.userRecoveryCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true, code: true, expiresAt: true },
      });

      if (!recoverCode) throw new Error("Recover code not found");

      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.resetPassword({
          email,
          code: recoverCode.code,
          newPassword: "123456789",
          confirmPassword: "wrong password",
        });

        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.message).toBe("Passwords don't match");
      }
    });

    it("should not reset a user password with expired code", async () => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (!user) throw new Error("User not found");

      const recoverCode = await prisma.userRecoveryCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: { id: true, code: true, expiresAt: true },
      });

      if (!recoverCode) throw new Error("Recover code not found");

      await prisma.userRecoveryCode.update({
        where: {
          id: recoverCode.id,
        },
        data: {
          expiresAt: new Date("2020-12-12"),
        },
      });

      const caller = appRouter.createCaller(await createContextInner({}));

      try {
        await caller.user.resetPassword({
          email,
          code: recoverCode.code,
          newPassword: "123456789",
          confirmPassword: "123456789",
        });

        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.message).toBe("Code expired");
      }
    });
  });
});
