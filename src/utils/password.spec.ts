import { hashPassword, verifyPassword } from "./password";
import { expect } from "@jest/globals";

describe("Test to see if hashing is working", () => {
  let hash: string;
  const password = "123456789";

  it("should create a hash password", async () => {
    hash = await hashPassword(password);

    expect(hash).not.toEqual(password);
  });

  it("should verify if the password is correct", async () => {
    const result = await verifyPassword(password, hash);

    expect(result).toBeTruthy();
  });
});
