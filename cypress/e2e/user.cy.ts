describe("testing all parts of authenticate user, register, login, update, activate, forgot password, reset password", () => {
  const user = {
    name: "User Tests",
    email: "email@test.com",
    phone: "111111111111",
    document: "11111111111",
    birthDate: "2021-01-01",
    username: "test",
    password: "123456789",
    confirmPassword: "123456789",
  };

  const user2 = {
    name: "User Tests 2",
    email: "email2@test.com",
    phone: "333333333333",
    document: "333333333333",
    birthDate: "2021-01-01",
    username: "test2",
    password: "123456789",
    confirmPassword: "123456789",
  };

  it("should register a new user", () => {
    cy.register(user);
    cy.get("h1").should("not.contain", "Register");
  });

  it("should login with the new user", () => {
    cy.login(user.username, user.password);
    cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);
  });

  it("should activate the new user successfully", () => {
    cy.login(user.username, user.password);
    cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);

    cy.sendActivationCode(user.email);

    const request = cy.getActivationCode(user.username);

    request.then((response) => {
      const activationCode = response.body.activationCode;

      cy.get("#code", { timeout: 5000 })
        .should("be.visible")
        .type(activationCode.code);

      cy.get('[data-testid="activate-submit"]').should("be.visible").click();

      cy.get("h1").should("contain", "Update User");
    });
  });

  it("should update the new user", () => {
    cy.login(user.username, user.password);
    cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);

    cy.changeUser({
      name: "User Tests Updated",
      email: "email3@test.com",
      phone: "222222222222",
      birthDate: "2022-01-01",
    });

    cy.get("#name").should("have.value", "User Tests Updated");
    cy.get("#email").should("have.value", "email3@test.com");
    cy.get("#phone").should("have.value", "222222222222");
    cy.get("#document").should("have.value", "22222222222");
    cy.get("#birthDate").should("have.value", "2022-01-01");

    //undo changes, to not break other tests
    cy.changeUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
    });
  });

  it("should change the password successfully", () => {
    cy.login(user.username, user.password);
    cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);

    cy.changePassword(user.password, "987654321", "987654321");

    cy.clearCookie("token");

    cy.login(user.username, "987654321");
    cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);
  });

  it("should recovery the password of the new user", () => {
    cy.sendRecoveryPasswordCode(user.email);

    cy.get("h1").should("contain", "Reset password");

    const request = cy.getRecoveryCode(user.email);

    request.then((response) => {
      const { recoveryCode } = response.body;

      cy.get("#code", { timeout: 5000 })
        .should("be.visible")
        .type(recoveryCode.code);

      cy.get("#password").should("be.visible").type(user.password);
      cy.get("#confirmPassword")
        .should("be.visible")
        .type(user.confirmPassword);

      cy.get('[data-testid="change_password_submit"]')
        .should("be.visible")
        .click();

      cy.get("h1").should("contain", "Login");
    });
  });

  describe("testing unsuccessful register", () => {
    it("should not register duplicated username", () => {
      cy.register({
        ...user,
        email: "other@email.com",
        document: "22222222222",
        phone: "22222222222",
      });

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain.text", "User already exists");
    });

    it("should not register duplicated email", () => {
      cy.register({
        ...user,
        username: "other",
        document: "22222222222",
        phone: "22222222222",
      });

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain.text", "User already exists");
    });

    it("should not register duplicated document", () => {
      cy.register({
        ...user,
        username: "other",
        email: "other@email.com",
        phone: "22222222222",
      });

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain.text", "User already exists");
    });

    it("should not register duplicated phone", () => {
      cy.register({
        ...user,
        username: "other",
        email: "other@email.com",
        document: "22222222222",
      });

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain.text", "User already exists");
    });

    it("should not register with wrong confirm password", () => {
      cy.register({
        ...user,
        username: "other",
        email: "other@email.com",
        document: "22222222222",
        phone: "22222222222",
        confirmPassword: "wrong confirm password",
      });

      cy.get("#confirmPassword:invalid")
        .invoke("prop", "validationMessage")
        .should("equal", "Passwords do not match");
    });
  });

  describe("testing unsuccessful activate", () => {
    before(() => {
      const { confirmPassword: _, ...userWithoutConfirmPassword } = user;

      cy.updateUser(
        { ...userWithoutConfirmPassword, active: false, blocked: false },
        user.email
      );
    });

    beforeEach(() => {
      cy.login(user.username, user.password);
      cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);
    });

    it("should not activate with invalid token", () => {
      cy.sendActivationCode(user.email);

      cy.get("#code").should("be.visible").type("000001");

      cy.get('[data-testid="activate-submit"]').should("be.visible").click();

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "Invalid activation code");
    });

    it("should not activate with expired token", () => {
      cy.sendActivationCode(user.email);

      cy.changeActivationCode("2000-01-01", user.username);

      const request = cy.getActivationCode(user.username);

      request.then((response) => {
        const activationCode = response.body.activationCode;

        cy.get("#code").should("be.visible").type(activationCode.code);

        cy.get('[data-testid="activate-submit"]').should("be.visible").click();

        cy.get("#errorContainer")
          .should("be.visible")
          .should("contain", "Activation code expired");
      });
    });
  });

  describe("testing unsuccessful login", () => {
    it("should not login with wrong username", () => {
      cy.login("wrongUsername", user.password);
      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "No user with username wrongUsername");
    });

    it("should not login with wrong password", () => {
      cy.login(user.username, "wrong password");

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "Invalid password");
    });
  });

  describe("testing unsuccessful update", () => {
    before(() => {
      cy.register(user2);
      cy.get("h1").should("not.contain", "Register");

      const { confirmPassword: _, ...userWithoutConfirmPassword } = user;

      cy.updateUser(
        { ...userWithoutConfirmPassword, active: true, blocked: false },
        user.email
      );
    });

    beforeEach(() => {
      cy.login(user.username, user.password);
      cy.url().should("not.contain", `${Cypress.config("baseUrl")}/user/login`);
    });

    it("should not update with duplicate email", () => {
      cy.changeUser({
        name: "User Tests Updated",
        email: user2.email,
        phone: "222222222222",
        birthDate: "2022-01-01",
      });

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "Email already in use");
    });

    it("should not update with duplicate phone", () => {
      cy.changeUser({
        name: "User Tests Updated",
        email: "email3@test.com",
        phone: user2.phone,
        birthDate: "2022-01-01",
      });

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "Phone already in use");
    });

    it("should not update with invalid old password", () => {
      cy.changePassword("wrong old password", "987654321", "987654321");

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "Invalid password");
    });

    it("should not update with invalid confirm password", () => {
      cy.changePassword(user.password, "987654321", "wrong confirm password");

      cy.get("#confirmPassword:invalid")
        .invoke("prop", "validationMessage")
        .should("equal", "Passwords do not match");
    });
  });

  describe("testing unsuccessful forgot password", () => {
    it("should not recovery password with invalid email", () => {
      cy.sendRecoveryPasswordCode("invalid@email.com");

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "There are no user with the provide email");
    });

    it("should not recovery with invalid token", () => {
      cy.sendRecoveryPasswordCode(user.email);

      cy.get("h1").should("contain", "Reset password");

      cy.get("#code", { timeout: 5000 }).should("be.visible").type("00001"); //wrong code

      cy.get("#password").should("be.visible").type(user.password);

      cy.get("#confirmPassword")
        .should("be.visible")
        .type(user.confirmPassword);

      cy.get('[data-testid="change_password_submit"]')
        .should("be.visible")
        .click();

      cy.get("#errorContainer")
        .should("be.visible")
        .should("contain", "Invalid recovery code");
    });

    it("should not recovery with expired token", () => {
      cy.sendRecoveryPasswordCode(user.email);

      cy.get("h1").should("contain", "Reset password");

      cy.changeRecoveryCode("2000-01-01", user.email);

      const request = cy.getRecoveryCode(user.email);

      request.then((response) => {
        const { recoveryCode } = response.body;

        cy.get("#code", { timeout: 5000 })
          .should("be.visible")
          .type(recoveryCode.code);

        cy.get("#password").should("be.visible").type(user.password);
        cy.get("#confirmPassword")
          .should("be.visible")
          .type(user.confirmPassword);

        cy.get('[data-testid="change_password_submit"]')
          .should("be.visible")
          .click();

        cy.get("#errorContainer")
          .should("be.visible")
          .should("contain", "Code expired");
      });
    });
  });

  describe("delete all when finish all tests", () => {
    it("should delete the create user", () => {
      cy.deleteUser(user.email);
      cy.deleteUser(user2.email);
    });
  });
});

export {};
