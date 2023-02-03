import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!process.env.TEST_API_KEY) {
    console.log("No API key found");
    process.exit(1);
  }

  if (req.headers.host != "localhost:4000") {
    console.log("Unauthorized acess to test api");
    return;
  }

  if (req.headers.authorization != `Bearer ${process.env.TEST_API_KEY}`) {
    console.log("Unauthorized acess to test api");
    return;
  }

  if (req.method === "PUT") {
    const email = req.query.email as string;

    const { expiresAt } = req.body as {
      expiresAt: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const recoveryCode = await prisma.userRecoveryCode.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!recoveryCode) {
      res.status(404).json({ error: "Recovery code not found" });
      return;
    }

    await prisma.userRecoveryCode.update({
      where: {
        id: recoveryCode.id,
      },
      data: {
        expiresAt: new Date(expiresAt),
      },
    });

    res.status(200).json({ message: "Recovery code updated" });
    return;
  }

  if (req.method === "GET") {
    const email = req.query.email as string;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const recoveryCode = await prisma.userRecoveryCode.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!recoveryCode) {
      res.status(404).json({ error: "Recovery code not found" });
      return;
    }

    res.status(200).json({ recoveryCode });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
  return;
}
