import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

if (!process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
  throw new Error("NEXT_PUBLIC_ROOT_DOMAIN not found.");
}

if (!process.env.NEXT_PUBLIC_TEST_DOMAIN) {
  throw new Error("NEXT_PUBLIC_TEST_DOMAIN not found.");
}

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Replace test domain with root domain in the hostname
  const hostname = request.headers
    .get("host")!
    .replace(
      `.${process.env.NEXT_PUBLIC_TEST_DOMAIN}`,
      `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    );

  // Redirect logic for requests from 'app' subdomain
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    // const token = await getToken({ req: request });

    // // Redirect to login if no token and not on login page
    // if (!token && path !== "/login") {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    // // Redirect to home if already logged in and on login page
    // else if (token && path === "/login") {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }

    // Rewrite URL to point to '/app' path
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, request.url),
    );
  }

  // Rewrite logic for requests without a subdomain
  if (
    hostname === process.env.NEXT_PUBLIC_TEST_DOMAIN ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(`/home${path}`, request.url));
  }

  // Handle requests from custom subdomains
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
}

export const config = {
  matcher: "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
};
