import { trpc } from "~/utils/trpc";
import nookies from "nookies";
import { useState } from "react";
import ActivateUser from "~/components/pages/user/activateUser";
import SendActivationCode from "~/components/pages/user/sendActivationCode";
import H1 from "~/components/reusable/h1";

const sendActivationCode = () => {
  const [theCodeHasBeenSent, setTheCodeHasBeenSent] = useState<boolean>(false);

  return (
    <div className="w-[36rem] mx-auto my-4 p-4 shadow-lg text-center bg-gray-50">
      <H1>Activate user</H1>

      {theCodeHasBeenSent ? (
        <ActivateUser />
      ) : (
        <SendActivationCode setTheCodeHasBeenSent={setTheCodeHasBeenSent} />
      )}
    </div>
  );
};

export default sendActivationCode;
