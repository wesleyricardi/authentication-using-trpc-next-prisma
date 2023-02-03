import { expect } from "@jest/globals";
import sendMail from "./sendEmail";

it("should send an email", async () => {
  const response = await sendMail(
    "email@test.com",
    "test",
    "this is a text",
    "<h1>This is a text</h1>"
  );

  expect(response).toBeUndefined();
});
