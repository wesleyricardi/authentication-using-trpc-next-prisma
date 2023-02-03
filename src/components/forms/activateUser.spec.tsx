import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivateUserForm from "~/components/forms/activateUser";
import { expect } from "@jest/globals";

describe("Testing activate user form", () => {
  const onSubmitMock = jest.fn();

  const data = {
    code: "100000",
  };

  it("should submit the code", async () => {
    render(
      <ActivateUserForm
        onSubmit={onSubmitMock}
        isLoading={false}
        error={null}
      />
    );

    await userEvent.type(getInputCode(), data.code);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(data, expect.any(Object));
    });
  });

  it("should not submit without code", async () => {
    render(
      <ActivateUserForm
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
});

const getInputCode = () => screen.getByLabelText("Code") as HTMLInputElement;
const getSubmitButton = () => screen.getByTestId("activate-submit");
