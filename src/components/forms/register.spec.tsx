import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "~/components/forms/register";
import { expect } from "@jest/globals";

describe("Testing register form", () => {
  const user = {
    username: "testPage",
    password: "123456789",
    confirmPassword: "123456789",
    name: "User Test",
    email: "email@test.com",
    phone: "41999999999",
    document: "44444444444",
    birthDate: "2021-01-01",
  };
  const onSubmitMock = jest.fn();

  it("should send the form", async () => {
    render(
      <RegisterForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputName(), user.name);
    await userEvent.type(getInputEmail(), user.email);
    await userEvent.type(getInputPhone(), user.phone);
    await userEvent.type(getInputDocument(), user.document);
    await userEvent.type(getInputBirthDate(), user.birthDate);
    await userEvent.type(getInputUsername(), user.username);
    await userEvent.type(getInputPassword(), user.password);
    await userEvent.type(getInputConfirmPassword(), user.confirmPassword);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(user, expect.any(Object));
    });
  });

  it("should not send the form with wrong confirm password", async () => {
    render(
      <RegisterForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputName(), user.name);
    await userEvent.type(getInputEmail(), user.email);
    await userEvent.type(getInputPhone(), user.phone);
    await userEvent.type(getInputDocument(), user.document);
    await userEvent.type(getInputBirthDate(), user.birthDate);
    await userEvent.type(getInputUsername(), user.username);
    await userEvent.type(getInputPassword(), user.password);
    await userEvent.type(getInputConfirmPassword(), "12345678");
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  it("should not send the form with wrong email", async () => {
    render(
      <RegisterForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputName(), user.name);
    await userEvent.type(getInputEmail(), "wesley.ricardi");
    await userEvent.type(getInputPhone(), user.phone);
    await userEvent.type(getInputDocument(), user.document);
    await userEvent.type(getInputBirthDate(), user.birthDate);
    await userEvent.type(getInputUsername(), user.username);
    await userEvent.type(getInputPassword(), user.password);
    await userEvent.type(getInputConfirmPassword(), user.confirmPassword);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  it("should not send the form with empty fields", async () => {
    render(
      <RegisterForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputName(), user.name);
    await userEvent.type(getInputEmail(), user.email);
    await userEvent.type(getInputPhone(), user.phone);
    await userEvent.type(getInputDocument(), user.document);
    await userEvent.type(getInputBirthDate(), user.birthDate);
    await userEvent.type(getInputUsername(), user.username);
    await userEvent.type(getInputPassword(), user.password);
    await userEvent.type(getInputConfirmPassword(), user.confirmPassword);

    //without input name
    await userEvent.clear(getInputName());
    await userEvent.click(getSubmitButton());

    //without input email
    await userEvent.type(getInputName(), user.name);
    await userEvent.clear(getInputEmail());
    await userEvent.click(getSubmitButton());

    //without input phone
    await userEvent.type(getInputEmail(), user.email);
    await userEvent.clear(getInputPhone());
    await userEvent.click(getSubmitButton());

    //without input document
    await userEvent.type(getInputPhone(), user.phone);
    await userEvent.clear(getInputDocument());
    await userEvent.click(getSubmitButton());

    //without input birth date
    await userEvent.type(getInputDocument(), user.document);
    await userEvent.clear(getInputBirthDate());
    await userEvent.click(getSubmitButton());

    //without input username
    await userEvent.type(getInputBirthDate(), user.birthDate);
    await userEvent.clear(getInputUsername());
    await userEvent.click(getSubmitButton());

    //without input password
    await userEvent.type(getInputUsername(), user.username);
    await userEvent.clear(getInputPassword());
    await userEvent.click(getSubmitButton());

    //without input confirm password
    await userEvent.type(getInputPassword(), user.password);
    await userEvent.clear(getInputConfirmPassword());
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  it("should not send the form when is loading", async () => {
    render(
      <RegisterForm
        onSubmit={onSubmitMock}
        error={null}
        isLoading={true}
        isSuccess={false}
      />
    );

    await userEvent.type(getInputName(), user.name);
    await userEvent.type(getInputEmail(), user.email);
    await userEvent.type(getInputPhone(), user.phone);
    await userEvent.type(getInputDocument(), user.document);
    await userEvent.type(getInputBirthDate(), user.birthDate);
    await userEvent.type(getInputUsername(), user.username);
    await userEvent.type(getInputPassword(), user.password);
    await userEvent.type(getInputConfirmPassword(), user.confirmPassword);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
});

function getInputName() {
  return screen.getByLabelText("Name") as HTMLInputElement;
}

function getInputEmail() {
  return screen.getByLabelText("E-mail") as HTMLInputElement;
}

function getInputPhone() {
  return screen.getByLabelText("Phone") as HTMLInputElement;
}

function getInputDocument() {
  return screen.getByLabelText("Document") as HTMLInputElement;
}

function getInputBirthDate() {
  return screen.getByLabelText("Birth Date") as HTMLInputElement;
}

function getInputUsername() {
  return screen.getByLabelText("Username") as HTMLInputElement;
}

function getInputPassword() {
  return screen.getByLabelText("Password") as HTMLInputElement;
}

function getInputConfirmPassword() {
  return screen.getByLabelText("Confirm Password") as HTMLInputElement;
}

function getSubmitButton() {
  return screen.getByTestId("register-submit");
}
