import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

const isProd = process.env.NODE_ENV === "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // Merge Google (from authConfig) + OTP Credentials provider
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp:   { label: "Code",  type: "text"  },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const otp   = String(credentials.otp).trim();

        try {
          // Find a valid, unused, non-expired OTP
          const token = await prisma.otpToken.findFirst({
            where: {
              email,
              otp,
              used: false,
              expires: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
          });

          if (!token) return null;

          // Consume the token immediately to prevent replay
          await prisma.otpToken.update({
            where: { id: token.id },
            data:  { used: true },
          });

          // Mark the email as verified and return the user
          const user = await prisma.user.update({
            where: { email },
            data:  { emailVerified: new Date() },
          });

          return {
            id:    user.id,
            name:  user.name,
            email: user.email,
            image: user.image,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  // Explicit production-safe cookie settings (covers Vercel HTTPS)
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   isProd,
      },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   isProd,
      },
    },
    callbackUrl: {
      name: isProd ? "__Secure-authjs.callback-url" : "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   isProd,
      },
    },
    csrfToken: {
      name: isProd ? "__Host-authjs.csrf-token" : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   isProd,
      },
    },
  },
});
