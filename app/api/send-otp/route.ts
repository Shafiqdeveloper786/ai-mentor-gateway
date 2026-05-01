import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, mode } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // For login: check user exists
    if (mode === "login") {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!existing) {
        return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
      }
    }

    // For register: create user if not exists
    if (mode === "register") {
      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json({ error: "Full name (min 2 chars) is required." }, { status: 400 });
      }
      await prisma.user.upsert({
        where: { email: normalizedEmail },
        create: { email: normalizedEmail, name: name.trim() },
        update: {},
      });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Invalidate old OTPs
    await prisma.otpToken.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Create new OTP (10 min expiry)
    const otp = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpToken.create({
      data: { userId: user.id, email: normalizedEmail, otp, expires },
    });

    await sendOtpEmail(normalizedEmail, otp, user.name ?? undefined);

    return NextResponse.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
