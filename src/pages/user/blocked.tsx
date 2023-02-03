import Link from "next/link";
import H1 from "~/components/reusable/h1";
import CustomLink from "~/components/reusable/link";

const UserBlockedPage = () => {
  return (
    <div className="w-[36rem] mx-auto my-4 p-4 shadow-lg text-center bg-gray-50">
      <H1>User Blocked</H1>
      <p>Your account has been blocked. Please contact the administrator.</p>

      <CustomLink href="/">Back to home page</CustomLink>
    </div>
  );
};

export default UserBlockedPage;
