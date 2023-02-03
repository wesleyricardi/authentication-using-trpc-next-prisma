import { useState } from "react";
import RecoverPassword from "~/components/pages/user/recoverPassword";
import ResetPassword from "~/components/pages/user/resetPassword";

import CustomLink from "~/components/reusable/link";
import SeparatorBar from "~/components/reusable/separatorBar";

const ForgotMyPassword = () => {
  const [email, setEmail] = useState<string>();

  return email ? (
    <ResetPassword email={email} />
  ) : (
    <div className="w-[36rem] mx-auto my-4 p-4 shadow-lg text-center bg-gray-50">
      {email ? (
        <ResetPassword email={email} />
      ) : (
        <RecoverPassword setEmail={setEmail} />
      )}
      <SeparatorBar>ou</SeparatorBar>
      <CustomLink href={"/user/login"}>I remembered the password</CustomLink>
      <CustomLink href={"/user/register"}>Register</CustomLink>
    </div>
  );
};

export default ForgotMyPassword;
