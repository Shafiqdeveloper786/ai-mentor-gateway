"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import CyberBackground from "@/components/CyberBackground";
import PageHeader from "@/components/PageHeader";
import AuthCard from "@/components/AuthCard";
import CyberInput from "@/components/CyberInput";

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), mode: "login" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to send OTP.");
        return;
      }

      const params = new URLSearchParams({ email: email.toLowerCase().trim(), mode: "login" });
      router.push(`/auth/verify-otp?${params}`);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <CyberBackground />

      <div className="w-full max-w-md">
        <PageHeader />

        <AuthCard
          title="Welcome back to AI Mentor"
          subtitle="Enter your email to receive a login code"
        >
          <form onSubmit={handleSubmit} noValidate>
            <CyberInput
              label="Email Address"
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={setEmail}
              icon={<MailIcon />}
              required
              autoComplete="email"
            />

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-red-400 text-sm font-['Rajdhani']">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-['Orbitron'] text-sm font-bold tracking-widest text-white relative z-10 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
            >
              <span className="relative z-10">
                {loading ? "SENDING OTP..." : "SEND LOGIN CODE"}
              </span>
            </button>
          </form>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.08)]" />
            <span className="text-[rgba(148,163,184,0.5)] text-xs font-['Orbitron'] tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.08)]" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn-google w-full py-3 rounded-xl font-['Rajdhani'] text-sm font-semibold tracking-wider text-[rgba(226,232,240,0.9)] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {googleLoading ? "Connecting..." : "CONTINUE WITH GOOGLE"}
          </button>

          <p className="text-center text-[rgba(148,163,184,0.5)] text-sm mt-5 font-['Rajdhani']">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#00d4ff] hover:text-[#00ff88] transition-colors font-semibold">
              Sign Up
            </Link>
          </p>
        </AuthCard>

        <div className="mt-6 relative">
          <div className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 opacity-40">
            <span className="text-[rgba(148,163,184,0.5)] text-sm flex-1 font-['Rajdhani']">Ask me anything...</span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center">
              <svg className="w-4 h-4 text-[rgba(0,212,255,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
