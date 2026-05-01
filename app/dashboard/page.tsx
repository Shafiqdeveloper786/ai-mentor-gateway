"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import CyberBackground from "@/components/CyberBackground";
import PageHeader from "@/components/PageHeader";

const STREAMLIT_URL = process.env.NEXT_PUBLIC_STREAMLIT_APP_URL ?? "";

// ─── Loading screen ────────────────────────────────────────────────────────────
function SessionLoading() {
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <CyberBackground />
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[rgba(0,212,255,0.2)] border-t-[#00d4ff] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#00d4ff] font-['Orbitron'] text-xs tracking-widest animate-pulse">
          VERIFYING SESSION...
        </p>
      </div>
    </main>
  );
}

// ─── Main content (only renders when authenticated) ────────────────────────────
function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();

  // ── Client-side auth guard ──────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  // URL param (OTP flow) → session name (Google OAuth) → fallback
  const rawName = params.get("name");
  const name = rawName
    ? decodeURIComponent(rawName)
    : (session?.user?.name ?? "User");

  // Progress bar fills over 1.5s via CSS transition
  const [barStarted, setBarStarted] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Do NOT start the redirect timer until we know the user IS authenticated
    if (status !== "authenticated" || !STREAMLIT_URL || redirected) return;

    const frame = requestAnimationFrame(() => setBarStarted(true));

    const timer = setTimeout(() => {
      setRedirected(true);
      window.location.href = `${STREAMLIT_URL}?name=${encodeURIComponent(name)}`;
    }, 1500);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [status, name, redirected]);

  function handleRedirectNow() {
    if (!STREAMLIT_URL) return;
    setRedirected(true);
    window.location.href = `${STREAMLIT_URL}?name=${encodeURIComponent(name)}`;
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  // Show spinner while session is resolving or while redirecting unauthenticated users
  if (status === "loading" || status === "unauthenticated") {
    return <SessionLoading />;
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <CyberBackground />

      <div className="w-full max-w-lg text-center">
        <PageHeader />

        {/* Welcome card */}
        <div className="glass-card rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          {/* Top neon line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,255,136,0.5)] to-transparent" />

          {/* Success checkmark */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(0,255,136,0.15)] to-[rgba(0,212,255,0.15)] border border-[rgba(0,255,136,0.4)] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-[rgba(0,255,136,0.15)] blur-xl -z-10 animate-pulse-slow" />
            </div>
          </div>

          {/* Welcome message */}
          <h2
            className="font-['Orbitron'] text-2xl sm:text-3xl font-black tracking-wider mb-2"
            style={{
              background: "linear-gradient(90deg, #00ff88, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            WELCOME ABOARD!
          </h2>
          <p className="text-[rgba(226,232,240,0.9)] font-['Rajdhani'] text-xl sm:text-2xl font-semibold mb-1">
            Hello, <span className="text-[#00d4ff]">{name}</span> 👋
          </p>
          <p className="text-[rgba(148,163,184,0.6)] font-['Rajdhani'] text-sm mb-8">
            Successfully Verified! Redirecting to AI Mentor...
          </p>

          {/* Progress bar + launch button */}
          {STREAMLIT_URL ? (
            <>
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[rgba(148,163,184,0.6)] font-['Orbitron'] text-xs tracking-widest">
                    LAUNCHING AI MENTOR
                  </span>
                  <span className="text-[#00d4ff] font-['Orbitron'] text-xs font-bold">1.5s</span>
                </div>
                <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full"
                    style={{
                      width: barStarted ? "100%" : "0%",
                      transition: "width 1.5s linear",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleRedirectNow}
                className="btn-primary w-full py-3.5 rounded-xl font-['Orbitron'] text-sm font-bold tracking-widest text-white relative z-10 mb-3"
              >
                <span className="relative z-10">LAUNCH NOW →</span>
              </button>
            </>
          ) : (
            <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] mb-3">
              <p className="text-red-400 text-sm font-['Rajdhani']">
                Streamlit URL not configured. Set{" "}
                <code className="text-[#00d4ff]">NEXT_PUBLIC_STREAMLIT_APP_URL</code> in{" "}
                <code className="text-[#00d4ff]">.env.local</code>.
              </p>
            </div>
          )}

          {/* Sign Out — clears session for fresh testing */}
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 rounded-xl font-['Orbitron'] text-xs tracking-widest text-[rgba(148,163,184,0.5)] hover:text-[rgba(239,68,68,0.8)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(239,68,68,0.3)] transition-all duration-300"
          >
            SIGN OUT
          </button>

          {/* Bottom neon line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(168,85,247,0.3)] to-transparent" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "CORE VERSION", value: "v4.0.2" },
            { label: "STATUS", value: "ACTIVE" },
            { label: "ENGINE", value: "QUANTUM" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
              <p className="text-[#00d4ff] font-['Orbitron'] text-xs sm:text-sm font-bold">{stat.value}</p>
              <p className="text-[rgba(148,163,184,0.4)] font-['Orbitron'] text-[9px] sm:text-[10px] tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<SessionLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
