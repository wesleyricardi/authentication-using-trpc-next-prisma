import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/prisma";
import { User } from "~/server/routers/user.schema";
import { hashPassword } from "~/utils/password";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!process.env.TEST_API_KEY) {
    console.log("No API key found");
    process.exit(1);
  }

  if (
    req.headers.host != "localhost:4000" &&
    req.headers.host != "127.0.0.1:4000"
  ) {
    console.log("Unauthorized acess to test api");
    return;
  }

  if (req.headers.authorization != `Bearer ${process.env.TEST_API_KEY}`) {
    console.log("Unauthorized acess to test api");
    return;
  }

  if (req.method === "GET") {
    res.status(500).json({ error: "Not implemented yet" });
    return;
  }

  if (req.method === "POST") {
    res.status(500).json({ error: "Not implemented yet" });
    return;
  }

  if (req.method === "PUT") {
    const user = req.body as {
      name: string;
      email: string;
      phone: string;
      cpf: string;
      birthDate: string;
      username: string;
      password: string;
      active: boolean;
      blocked: boolean;
    };
    try {
      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          cpf: Number(user.cpf),
          birthDate: new Date(user.birthDate),
          username: user.username,
          password: await hashPassword(user.password),
          active: user.active,
          blocked: user.blocked,
        },
      });
      res.status(200).json({ message: "User updated" });
      return;
    } catch (error) {
      res.status(500).json(error);
      return;
    }
  }

  if (req.method === "DELETE") {
    const email = req.query.email as string;

    await prisma.user.delete({
      where: {
        email,
      },
    });

    res.status(200).json({ message: "User deleted" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
