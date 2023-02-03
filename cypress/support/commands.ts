import { prisma } from "~/server/prisma";

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add(
  "register",
  (user: {
    username: string;
    password: string;
    confirmPassword: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    birthDate: string;
  }) => {
    cy.visit("/user/register");
    cy.get("h1").should("contain", "Register");

    cy.get("#name").should("be.visible").type(user.name);
    cy.get("#email").should("be.visible").type(user.email);
    cy.get("#phone").should("be.visible").type(user.phone);
    cy.get("#document").should("be.visible").type(user.document);
    cy.get("#birthDate").should("be.visible").type(user.birthDate);
    cy.get("#username").should("be.visible").type(user.username);
    cy.get("#password").should("be.visible").type(user.password);
    cy.get("#confirmPassword").should("be.visible").type(user.confirmPassword);
    cy.get('[data-testid="register-submit"]').should("be.visible").click();
  }
);

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.visit("/user/login");

  cy.get("h1").should("contain", "Login");

  cy.get("#username").should("be.visible").type(username);
  cy.get("#password").should("be.visible").type(password);

  cy.get('[data-testid="login-submit"]').should("be.visible").click();
});

Cypress.Commands.add(
  "changeUser",
  (user: { name: string; email: string; phone: string; birthDate: string }) => {
    cy.visit("/user/update");
    cy.get("h1").should("contain", "Update User");

    cy.get("#name").should("be.visible").clear().type(user.name);
    cy.get("#email").should("be.visible").clear().type(user.email);
    cy.get("#phone").should("be.visible").clear().type(user.phone);
    cy.get("#birthDate").should("be.visible").clear().type(user.birthDate);
    cy.get('[data-testid="update-submit"]').should("be.visible").click();
  }
);

Cypress.Commands.add(
  "changePassword",
  (oldpassword: string, password: string, confirmPassword: string) => {
    cy.visit("/user/update");
    cy.get("h1").should("contain", "Update User");
    cy.get("h2").should("contain", "Change password");

    cy.get("#oldPassword").should("be.visible").type(oldpassword);
    cy.get("#newPassword").should("be.visible").type(password);
    cy.get("#confirmPassword").should("be.visible").type(confirmPassword);

    cy.get('[data-testid="change-password-submit"]')
      .should("be.visible")
      .click();
  }
);

Cypress.Commands.add("sendRecoveryPasswordCode", (email: string) => {
  cy.visit("/user/forgot_my_password");

  cy.get("h1").should("contain", "Recover password");

  cy.get("#email").should("be.visible").type(email);

  cy.get('[data-testid="send_recover_password_code"]')
    .should("be.visible")
    .click();
});

Cypress.Commands.add("sendActivationCode", (email: string) => {
  cy.visit("/user/activate");

  cy.get("#email-to-receive-code")
    .should("be.visible")
    .should("contain", email);

  cy.get('[data-testid="send-code-submit"]').should("be.visible").click();
});

//* this functions below are for calls directly to the database by api only for tests
Cypress.Commands.add(
  "updateUser",
  (
    user: {
      name: string;
      email: string;
      phone: string;
      document: string;
      birthDate: string;
      username: string;
      password: string;
      active: boolean;
      blocked: boolean;
    },
    email: string
  ) => {
    cy.request({
      url: `${Cypress.config("baseUrl")}/api/only4test/user/${email}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cypress.env("TEST_API_KEY")}`,
      },
      body: JSON.stringify(user),
    });
  }
);

Cypress.Commands.add("deleteUser", (email: string) => {
  cy.request({
    url: `${Cypress.config("baseUrl")}/api/only4test/user/${email}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Cypress.env("TEST_API_KEY")}`,
    },
  });
});

Cypress.Commands.add("getActivationCode", (username: string) => {
  return cy.request({
    url: `${Cypress.config(
      "baseUrl"
    )}/api/only4test/activation_code/${username}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${Cypress.env("TEST_API_KEY")}`,
    },
  });
});

Cypress.Commands.add(
  "changeActivationCode",
  (expiresAt: string, username: string) => {
    cy.request({
      url: `${Cypress.config(
        "baseUrl"
      )}/api/only4test/activation_code/${username}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cypress.env("TEST_API_KEY")}`,
      },
      body: JSON.stringify({ expiresAt }),
    });
  }
);

Cypress.Commands.add("getRecoveryCode", (email: string) => {
  return cy.request({
    url: `${Cypress.config("baseUrl")}/api/only4test/recovery_code/${email}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${Cypress.env("TEST_API_KEY")}`,
    },
  });
});

Cypress.Commands.add(
  "changeRecoveryCode",
  (expiresAt: string, email: string) => {
    cy.request({
      url: `${Cypress.config("baseUrl")}/api/only4test/recovery_code/${email}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cypress.env("TEST_API_KEY")}`,
      },
      body: JSON.stringify({ expiresAt }),
    });
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      register(user: {
        username: string;
        password: string;
        confirmPassword: string;
        name: string;
        email: string;
        phone: string;
        document: string;
        birthDate: string;
      }): void;
      login(username: string, password: string): void;
      changeUser(user: {
        name: string;
        email: string;
        phone: string;
        birthDate: string;
      }): void;
      changePassword(
        oldpassword: string,
        password: string,
        confirmPassword: string
      ): void;
      sendActivationCode(email: string): void;
      sendRecoveryPasswordCode(email: string): void;

      getActivationCode(username: string): Cypress.Chainable<any>;
      changeActivationCode(expiresAt: string, username: string): void;

      getRecoveryCode(email: string): Cypress.Chainable<any>;
      changeRecoveryCode(expiresAt: string, email: string): void;

      deleteUser(email: string): void;
      updateUser(
        user: {
          name: string;
          email: string;
          phone: string;
          document: string;
          birthDate: string;
          username: string;
          password: string;
          active: boolean;
          blocked: boolean;
        },
        email: string
      ): void;
    }
  }
}
