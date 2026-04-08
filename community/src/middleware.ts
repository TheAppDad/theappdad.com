import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    if (isProtectedRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url).toString();
      await auth.protect({ unauthenticatedUrl: signInUrl });
    }
  } catch (e) {
    console.error("[middleware] auth.protect", e);
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Auth middleware failed. Check Clerk environment variables." },
        { status: 503 }
      );
    }
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Clerk on static legal pages (avoids dev-only middleware/Clerk edge failures).
    "/((?!_next|legal(?:/|$)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
