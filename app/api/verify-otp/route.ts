import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This route is kept as a pre-check endpoint.
// Actual session creation now goes through NextAuth's Credentials provider
// via signIn("otp", { email, otp, redirect: false }) on the client.
export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const token = await prisma.otpToken.findFirst({
      where: {
        email:   normalizedEmail,
        otp:     otp.trim(),
        used:    false,
        expires: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new one." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Return user info so the frontend can pass the name to the dashboard URL
    return NextResponse.json({
      success: true,
      user: { id: user?.id, name: user?.name, email: user?.email },
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
