import { t } from "../trpc";

import register from "./user/register";
import login from "./user/login";
import authenticate from "./user/authenticate";
import sendActivationCode from "./user/sendActivationCode";
import userActivate from "./user/userActivate";
import update from "./user/update";
import changePassword from "./user/changePassword";
import recoverPassword from "./user/recoverPassword";
import resetPassword from "./user/resetPassword";

export const appRouter = t.router({
  user: t.router({
    register,
    login,
    authenticate,
    sendActivationCode,
    userActivate,
    update,
    changePassword,
    recoverPassword,
    resetPassword,
  }),
});

export type AppRouter = typeof appRouter;
