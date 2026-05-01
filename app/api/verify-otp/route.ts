import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const token = await prisma.otpToken.findFirst({
      where: {
        email: normalizedEmail,
        otp: otp.trim(),
        used: false,
        expires: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json({ error: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
    }

    // Mark as used
    await prisma.otpToken.update({ where: { id: token.id }, data: { used: true } });

    // Mark email as verified
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { emailVerified: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Create JWT session token
    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const secret = process.env.NEXTAUTH_SECRET!;
    const sessionToken = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.image,
      },
      secret,
      salt: cookieName,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });

    // Set session cookie
    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
