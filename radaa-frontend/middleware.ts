import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSession } from "@/lib/api/auth";

const TOKEN_COOKIE_NAME = "radaa_token";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }

  try {
    const result = await validateSession(token);

    if (!result.authenticated) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
