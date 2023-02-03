import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateUserForm from "~/components/forms/updateUser";
import { expect } from "@jest/globals";

describe("Testing update user form", () => {
  const user = {
    name: "User update test",
    email: "email@updated.com",
    phone: "44444444444",
    birthDate: "1995-05-05",
  };

  const onSubmitMock = jest.fn();
  const checkForDuplicityMock = jest.fn();

  it("should submit the form", async () => {
    render(
      <UpdateUserForm
        user={user}
        onSubmit={onSubmitMock}
        checkForDuplicity={checkForDuplicityMock}
        error={null}
        isLoading={false}
        isSuccess={false}
      />
    );

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(user, expect.any(Object));
    });
  });

  describe("testing submit with empty field", () => {
    beforeEach(() => {
      render(
        <UpdateUserForm
          user={user}
          onSubmit={onSubmitMock}
          checkForDuplicity={checkForDuplicityMock}
          error={undefined}
          isLoading={false}
          isSuccess={false}
        />
      );
    });

    it("should not submit with empty name", async () => {
      await userEvent.clear(getInputName());
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });

    it("should not submit with empty email", async () => {
      await userEvent.clear(getInputEmail());
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });

    it("should not submit with empty phone", async () => {
      await userEvent.clear(getInputPhone());
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });

    it("should not submit with empty birth date", async () => {
      await userEvent.clear(getInputBirthDate());
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(onSubmitMock).not.toHaveBeenCalled();
      });
    });
  });

  it("should not send the form when is loading", async () => {
    render(
      <UpdateUserForm
        user={user}
        onSubmit={onSubmitMock}
        checkForDuplicity={checkForDuplicityMock}
        error={undefined}
        isLoading={true}
        isSuccess={false}
      />
    );

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalledWith(user, expect.any(Object));
    });
  });
});

const getInputName = () => screen.getByLabelText("Name") as HTMLInputElement;

const getInputEmail = () => screen.getByLabelText("E-mail") as HTMLInputElement;

const getInputPhone = () => screen.getByLabelText("Phone") as HTMLInputElement;

const getInputBirthDate = () =>
  screen.getByLabelText("Birth Date") as HTMLInputElement;

const getSubmitButton = () => screen.getByTestId("update-submit");
