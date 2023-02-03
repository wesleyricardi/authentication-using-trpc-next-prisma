import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "~/components/forms/login";
import { expect } from "@jest/globals";

describe("Testing login form", () => {
  const credentials = {
    username: "testPage",
    password: "123456789",
  };

  const onSubmitMock = jest.fn();

  it("should send the form", async () => {
    render(
      <LoginForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputUsername(), credentials.username);
    await userEvent.type(getInputPassword(), credentials.password);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        credentials,
        expect.any(Object)
      );
    });
  });

  it("should not send the login form with empty fields", async () => {
    render(
      <LoginForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    //without password
    await userEvent.type(getInputUsername(), credentials.username);
    await userEvent.click(getSubmitButton());

    //without username
    await userEvent.clear(getInputUsername());
    await userEvent.type(getInputPassword(), credentials.password);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
});

function getInputUsername() {
  return screen.getByLabelText("Username");
}

function getInputPassword() {
  return screen.getByLabelText("Password");
}

function getSubmitButton() {
  return screen.getByTestId("login-submit");
}
