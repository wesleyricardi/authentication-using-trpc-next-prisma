import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("token");

  if (
    pathname === "/user/update" ||
    pathname === "/user/activate" ||
    pathname === "/user/blocked"
  ) {
    try {
      if (!token) return NextResponse.redirect(origin);

      const user = await fetch(origin + "/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }).then(
        (res) =>
          res.json() as Promise<{ [key: string]: string | boolean } | false>
      );

      // redirect to login if token is invalid
      if (!user) return NextResponse.redirect(origin + "/user/login");

      if (pathname === "/user/activate" && user.active)
        return NextResponse.redirect(origin + "/user/update");

      if (pathname === "/user/blocked" && !user.blocked)
        return NextResponse.redirect(origin);

      if (pathname === "/user/update") {
        if (user.blocked)
          return NextResponse.redirect(origin + "/user/blocked");

        if (!user.active)
          return NextResponse.redirect(origin + "/user/activate");
      }

      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(origin + "/user/login");
    }
  }
}
