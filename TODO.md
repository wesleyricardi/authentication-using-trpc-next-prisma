# [ ] APPLICATION FRONTEND

- Global
  [ ] Create a context to store de authenticate

- Components
  [ ] NavBar is not logout

- Register
  [√] Rota
  [√] Functions
  [√] Style
  [√] Separate into small components and hooks

- Login
  [√] Rota
  [√] Functions
  [√] Style
  [√] Separate into small components and hooks

- Activate
  [√] Rota
  [√] Functions
  [√] Style
  [√] Separate into small components and hooks

- Recover
  [√] Rota
  [√] Functions
  [√] Style
  [√] Separate into small components and hooks

- Update
  [√] Rota
  [√] Functions
  [√] Style
  [v] Separate into small components and hooks
  [ ] Verify is there are a user with the same {email, phone} when focus out input

# [ ] APLICATION BACKEND

- User router
  [√] Register
  [√] Login
  [√] Activate
  [√] Recover
  [√] Update
  [√] Change password

# [√] TEST TRPC & PRISMA USER ROUTERS (BACK-END)

- Registration tests [complete]
  [√] create a user

  - Tests for failure to register user [complete]
    [√] not register duplicate email
    [√] not register duplicate phone
    [√] not register duplicate username
    [√] not register with invalid confirm password

* Login tests [complete]
  [√] login a user
  [√] not login with wrong password
  [√] not login with wrong username

* Authenticate tests [complete]
  [√] authenticate successfully
  [√] not authenticate without token
  [√] not authenticate with invalid token

* Activation code submission tests [complete]
  [√] send a activation code
  [√] not send activation code without token
  [√] not send activation code with a invalid token

* Activation tests [complete]
  [√] activate a user

  - Tests for failure to activate user [complete]
    [√] not activate withou token
    [√] not activate with wrong token
    [√] not activate with wrong code
    [√] not activate with expired token

* Update user tests [complete]
  [√] update the user
  [√] not update a user withou token
  [√] not update with duplicate email
  [√] not update with duplicate phone
  [√] not update with duplicate cpf

* Change password user tests [complete]
  [√] change a user's password
  [√] not change a user's password without token
  [√] not change a user's password with wrong old password
  [√] not change a users's password with wrong confirm password

* Tests to send a user password recovery code [complete]
  [√] send a recover password code
  [√] not send a recover password code with wrong email

* User password reset tests [complete]
  [√] reset a user password
  - Tests for failure to reset user password [complete]
    [√] not reset a user password with wrong code
    [√] not reset a user password with wrong confirm password
    [√] not reset a user password with expired code

# [√] TEST E2E USER

- [√] register successfully

- [√] login successfully

- [√] activate successfully

- [√] update successfully

- [√] update the password successfully

- [√] recovery password successfully

- [√] not register duplicated username
- [√] not register duplicated email
- [√] not register duplicated phone
- [√] not register with invalid confirm password //

- [√] not activate with invalid token
- [√] not activate with expired token

- [√] not login with invalid username
- [√] not login with invalid password

- [√] not update with duplicate email
- [√] not update with duplicate phone
- [√] not update with duplicate cpf
- [√] not update with invalid old password
- [√] not update with invalid confirm password
  [ ] remove this test after create a component test for the same purpose

- [√] not recovery password with invalid email
- [√] not recovery with invalid token
- [√] not recovery with expired token

- [√] delete all when finish all tests

# [ ] TEST COMPONENTS REACT

- Registration form tests [missing-1]
  [√] register form is being sent
  [√] do not send the registration form with empty fields {name, email, phone, cpf, birth date, username ,password, confirm password}
  [√] do not send the registration form with invalid confirm password
  [√] do not send the registration form with invalid email
  [√] do not send the registration form when is loading
  [ ] create a test to see if the error is visible

- Login form tests [missing-1]
  [√] login form is being sent
  [√] do not send the login form with empty fields {login, password}
  [ ] create a test to see if the error is visible

* update user form [missing-1]
  [√] should submit the form
  [√] should not send the form when is loading
  [ ] create a test to see if the error is visible

  - testing submit with empty field [complete]
    [√] should not submit with empty name
    [√] should not submit with empty email
    [√] should not submit with empty phone
    [√] should not submit with empty birth date

* Change password form [missing-1]
  [√] submit the form
  [√] not submit with with dont mach confirm password
  [√] not submit the form when is is loading
  [ ] create a test to see if the error is visible

  - testing submit with empty field [complete]
    [√] not submit with empty old password
    [√] not submit with empty new password
    [√] not submit with empty confirm new password

- Activate form tests [missing-1]
  [√] activate form is being sent
  [√] do not send activate form without code
  [ ] create a test to see if the error is visible

- Recovery form tests [missing-2]
  [√] recovery password form is being sent
  [√] do not send recovery form without an email address
  [ ] create a test to see if the error is visible
  - Reset password [missing-1]
    [√] reset password form is being sent
    [√] do not send reset password form with empty fields {code, password, confirm password}
    [ ] create a test to see if the error is visible
