import ResetPasswordForm from "~/components/forms/resetPassword";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "@jest/globals";
import { object } from "zod";

describe("Testing the reset password form", () => {
  const onSubmitMock = jest.fn();
  const data = {
    code: "000000", //any code
    newPassword: "newpassword",
    confirmPassword: "newpassword", //has to be the same as above
  };

  it("should submit the form", async () => {
    render(
      <ResetPasswordForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.type(getInputCode(), data.code);
    await userEvent.type(getInputPassword(), data.newPassword);
    await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(data, expect.any(Object));
    });
  });

  it("should not submit the form without code", async () => {
    render(
      <ResetPasswordForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.type(getInputPassword(), data.newPassword);
    await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  it("should not submit the form without password", async () => {
    render(
      <ResetPasswordForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.type(getInputCode(), data.code);
    await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  it("should not submit the form without confirm password", async () => {
    render(
      <ResetPasswordForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.type(getInputCode(), data.code);
    await userEvent.type(getInputPassword(), data.newPassword);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
});

const getInputCode = () => screen.getByLabelText("Code") as HTMLInputElement;
const getInputPassword = () =>
  screen.getByLabelText("Password") as HTMLInputElement;
const getInputConfirmPassword = () =>
  screen.getByLabelText("Confirm passaword") as HTMLInputElement;
const getSubmitButton = () => screen.getByTestId("change_password_submit");
