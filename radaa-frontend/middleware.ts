import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/edge/verifyToken";

const TOKEN_COOKIE_NAME = "radaa_token";

export async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const isDashboardPath = pathname.startsWith("/dashboard");
  const isDriverRootPath = pathname.startsWith("/driver");

  if (!isDashboardPath && !isDriverRootPath) {
    return NextResponse.next();
  }

  const token = cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }

  try {
    const verification = await verifyToken(token);

    if (!verification.valid) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }

    const payload: any = verification.payload || {};
    const rawRole = payload.role;
    const role = rawRole ? String(rawRole).trim().toLowerCase() : undefined;
    const userId = payload.id || payload.sub || payload._id || null;

    if (!userId || !role) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }

    const isDriver = role === "driver";

    const isDriverDashboardPath =
      pathname.startsWith("/dashboard/driver") ||
      pathname.startsWith("/dashboard/drivers") ||
      pathname.startsWith("/driver");

    if (isDriverDashboardPath) {
      if (!isDriver) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // eslint-disable-next-line no-console
      console.log("[middleware] allowing driver route:", pathname);
      return NextResponse.next();
    }

    const isPassengerDashboardPath = pathname.startsWith("/dashboard/passenger");

    if (isPassengerDashboardPath && isDriver) {
      return NextResponse.redirect(
        new URL("/dashboard/driver/live", request.url),
      );
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/driver/:path*"],
};
