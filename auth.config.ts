import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe config — NO Prisma here (middleware runs on Edge Runtime)
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isDashboard = path.startsWith("/dashboard");
      const isAuthPage = path.startsWith("/auth/");

      // Unauthenticated user trying to reach /dashboard → hard redirect to login
      if (isDashboard && !isLoggedIn) {
        const loginUrl = new URL("/auth/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(loginUrl);
      }

      // Already logged in → bounce off all /auth/* pages back to dashboard
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Everything else is allowed
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
