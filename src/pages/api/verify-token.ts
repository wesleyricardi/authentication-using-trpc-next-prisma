import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "~/utils/token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { token } = req.body as { [key: string]: string };

  if (req.method !== "POST") {
    res.status(405).json("method not allowed");
    return;
  }

  try {
    const data = verifyToken(token) as { [key: string]: string };

    res.status(200).json(data);
  } catch {
    res.status(403).json(false);
  }
}
