import nookies from "nookies";
import Link from "next/link";
import { useAuthentication } from "~/context/authenticate";

const NavBar = () => {
  const { isAuthenticated, setUser } = useAuthentication();

  function logout() {
    nookies.destroy(undefined, "token");
    setUser(undefined);
  }

  return (
    <nav className="bg-black opacity-90 text-white px-2  text-right">
      <ul className="list-none">
        {isAuthenticated ? (
          <>
            <Link href={"/user/update"}>
              <li className="inline-block px-4 py-4 hover:bg-gray-700">
                My account
              </li>
            </Link>
            <li
              onClick={logout}
              className="inline-block px-4 py-4 hover:bg-gray-700"
            >
              Logout
            </li>
          </>
        ) : (
          <>
            <Link href={"/user/login"}>
              <li className="inline-block px-4 py-4 hover:bg-gray-700">
                Sign in
              </li>
            </Link>
            <Link href={"/user/register"}>
              <li className="inline-block px-4 py-4 hover:bg-gray-700">
                Sign up
              </li>
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
