import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const username = process.env.SITE_USERNAME;
  const password = process.env.SITE_PASSWORD;
  if (!username || !password) return NextResponse.next();

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(":");
      if (separator >= 0 && decoded.slice(0, separator) === username && decoded.slice(separator + 1) === password) {
        return NextResponse.next();
      }
    } catch {
      // Fall through to the browser login prompt.
    }
  }

  return new NextResponse("需要登录后访问", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Hibiki Japanese", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
