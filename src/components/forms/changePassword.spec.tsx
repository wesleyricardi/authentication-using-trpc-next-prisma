import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePasswordForm from "~/components/forms/changePassword";
import { expect } from "@jest/globals";

describe("Testing change password form", () => {
  const onSubmitMock = jest.fn();

  const data = {
    oldPassword: "theoldpassowrd",
    newPassword: "newpassword",
    confirmPassword: "newpassword",
  };

  it("should submit the form", async () => {
    render(
      <ChangePasswordForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputOldPassword(), data.oldPassword);
    await userEvent.type(getInputNewPassword(), data.newPassword);
    await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(data, expect.any(Object));
    });
  });

  describe("testing submit with empty field", () => {
    beforeEach(() => {
      render(
        <ChangePasswordForm
          onSubmit={onSubmitMock}
          error={null}
          isLoading={false}
          isSuccess={false}
        />
      );
    });

    it("should not submit with empty old password", async () => {
      await userEvent.type(getInputNewPassword(), data.newPassword);
      await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });

    it("should not submit with empty new password", async () => {
      await userEvent.type(getInputOldPassword(), data.oldPassword);
      await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });

    it("should not submit with empty confirm new password", async () => {
      await userEvent.type(getInputOldPassword(), data.oldPassword);
      await userEvent.type(getInputNewPassword(), data.newPassword);

      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });
  });

  it("should not submit with with dont mach confirm password", async () => {
    render(
      <ChangePasswordForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputOldPassword(), data.oldPassword);
    await userEvent.type(getInputNewPassword(), data.newPassword);
    await userEvent.type(getInputConfirmPassword(), "wrong confirm password");

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
  it("should not submit the form when is is loading", async () => {
    render(
      <ChangePasswordForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={true}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputOldPassword(), data.oldPassword);
    await userEvent.type(getInputNewPassword(), data.newPassword);
    await userEvent.type(getInputConfirmPassword(), data.confirmPassword);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
});

const getInputOldPassword = () =>
  screen.getByLabelText("Password") as HTMLInputElement;

const getInputNewPassword = () =>
  screen.getByLabelText("New Password") as HTMLInputElement;

const getInputConfirmPassword = () =>
  screen.getByLabelText("Confirm Password") as HTMLInputElement;

const getSubmitButton = () => screen.getByTestId("change-password-submit");
