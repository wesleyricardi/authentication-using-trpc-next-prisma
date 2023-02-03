import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecoverPasswordForm from "~/components/forms/recoverPassword";
import { expect } from "@jest/globals";

describe("Testing the recover password form component", () => {
  const onSubmitMock = jest.fn();

  it("should submit the form", async () => {
    const email = "any@email.valid";

    render(
      <RecoverPasswordForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.type(getInputEmail(), email);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({ email }, expect.any(Object));
    });
  });

  it("should not submit the form without email address", async () => {
    render(
      <RecoverPasswordForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  it("should not submit the form when is loading", async () => {
    const email = "any@email.valid";

    render(
      <RecoverPasswordForm
        onSubmit={onSubmitMock}
        isLoading={true}
        error={null}
      />
    );
    await userEvent.type(getInputEmail(), email);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
});

const getInputEmail = () => screen.getByLabelText("E-mail") as HTMLInputElement;
const getSubmitButton = () => screen.getByTestId("send_recover_password_code");
