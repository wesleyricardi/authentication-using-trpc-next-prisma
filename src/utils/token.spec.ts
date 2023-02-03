import { createToken, verifyToken } from "./token";
import { expect } from "@jest/globals";

describe("Test to verify that JWT manipulation is working", () => {
  const payload = {
    id: 1,
    username: "test",
    name: "User Test",
  };

  let JWT: string;

  it("should create a token", () => {
    JWT = createToken(payload);

    expect(JWT).not.toEqual(payload);
  });

  it("should verify if the token is correct", () => {
    const result = verifyToken(JWT);

    expect(result).toEqual({
      ...payload,
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
});
