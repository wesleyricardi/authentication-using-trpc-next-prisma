import jwt from "jsonwebtoken";

export const createToken = (payload: any) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

  return jwt.verify(token, process.env.JWT_SECRET);
};
