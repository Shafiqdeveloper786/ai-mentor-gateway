"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import CyberBackground from "@/components/CyberBackground";
import PageHeader from "@/components/PageHeader";
import AuthCard from "@/components/AuthCard";

function OtpVerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const mode  = params.get("mode")  ?? "login";

  const [digits,    setDigits]    = useState(["", "", "", "", "", ""]);
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleDigitChange(index: number, val: string) {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);
    setError("");
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // signIn("otp") calls the Credentials provider's authorize() on the server.
      // NextAuth creates the session cookie automatically — works on both HTTP and HTTPS.
      const result = await signIn("otp", {
        email,
        otp,
        redirect: false,
      });

      if (!result?.ok || result?.error) {
        setError("Invalid or expired code. Please request a new one.");
        return;
      }

      // Fetch the user's name from the session for the dashboard URL
      let userName = "User";
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        userName = sessionData?.user?.name ?? "User";
      } catch {
        // Non-critical — dashboard falls back to session via useSession()
      }

      setSuccess("Successfully Verified! Redirecting to AI Mentor...");
      const name = encodeURIComponent(userName);

      // 1 second flash, then navigate to dashboard
      setTimeout(() => {
        router.push(`/dashboard?name=${name}`);
      }, 1000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to resend OTP.");
        return;
      }

      setCountdown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setSuccess("New code sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Network error.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Enter Verification Code"
      subtitle={`We sent a 6-digit code to ${email || "your email"}`}
    >
      <form onSubmit={handleVerify} noValidate>
        {/* OTP digit boxes */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`
                text-center text-xl sm:text-2xl font-['Orbitron'] font-bold
                rounded-xl input-cyber transition-all duration-200
                ${digit ? "border-[rgba(0,212,255,0.6)] text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]" : ""}
                focus:border-[rgba(0,255,136,0.6)] focus:shadow-[0_0_15px_rgba(0,255,136,0.3)]
                disabled:opacity-50
              `}
              disabled={loading}
              style={{ width: "44px", height: "56px" }}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-red-400 text-sm font-['Rajdhani'] text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88] text-sm font-['Rajdhani'] text-center">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || digits.join("").length !== 6}
          className="btn-primary w-full py-3.5 rounded-xl font-['Orbitron'] text-sm font-bold tracking-widest text-white relative z-10 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
        >
          <span className="relative z-10">
            {loading ? "VERIFYING..." : "VERIFY CODE"}
          </span>
        </button>
      </form>

      {/* Resend */}
      <div className="text-center">
        <p className="text-[rgba(148,163,184,0.5)] text-sm font-['Rajdhani'] mb-1">
          Didn&apos;t receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={countdown > 0 || resending}
          className="text-[#00d4ff] hover:text-[#00ff88] transition-colors text-sm font-semibold font-['Rajdhani'] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
        </button>
      </div>

      <p className="text-center text-[rgba(148,163,184,0.5)] text-sm mt-4 font-['Rajdhani']">
        <Link
          href={mode === "register" ? "/auth/register" : "/auth/login"}
          className="text-[rgba(148,163,184,0.6)] hover:text-[#00d4ff] transition-colors"
        >
          ← Back
        </Link>
      </p>
    </AuthCard>
  );
}

export default function VerifyOtpPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <CyberBackground />
      <div className="w-full max-w-md">
        <PageHeader />
        <Suspense fallback={
          <div className="text-center text-[rgba(148,163,184,0.5)] font-['Rajdhani']">
            Loading...
          </div>
        }>
          <OtpVerifyForm />
        </Suspense>
      </div>
    </main>
  );
}
