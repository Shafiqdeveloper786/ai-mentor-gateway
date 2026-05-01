import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use edge-safe config (no Prisma) for middleware
export default NextAuth(authConfig).auth;

export const config = {
  // Run middleware on dashboard (requires auth) AND auth pages (redirect if already logged in)
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
