import { clerkMiddleware } from "@clerk/nextjs/server";

// Session plumbing only. Authorization is resource-based (Clerk's recommended model):
// every protected page/layout calls requireUser()/requireRole() and every server action
// calls assertRole() from src/lib/auth.ts, which read the role from our database.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
