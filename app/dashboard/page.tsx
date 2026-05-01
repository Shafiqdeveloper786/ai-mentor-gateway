"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import CyberBackground from "@/components/CyberBackground";
import PageHeader from "@/components/PageHeader";

const STREAMLIT_URL = process.env.NEXT_PUBLIC_STREAMLIT_APP_URL ?? "";

function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();

  // Resolve name: URL param (OTP flow) → session (Google OAuth) → fallback
  const rawName = params.get("name");
  const name = rawName
    ? decodeURIComponent(rawName)
    : (session?.user?.name ?? "User");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    // Fire immediately on authenticated — no artificial delay
    if (status === "authenticated" && STREAMLIT_URL) {
      window.location.href = `${STREAMLIT_URL}?name=${encodeURIComponent(name)}`;
    }
  }, [status, name, router]);

  // Always render the UI — no loading overlay, no conditional spinner
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <CyberBackground />

      <div className="w-full max-w-lg text-center">
        <PageHeader />

        <div className="glass-card rounded-2xl p-8 sm:p-10 relative overflow-hidden">
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
            Successfully Verified! Launching AI Mentor...
          </p>

          {STREAMLIT_URL ? (
            <button
              onClick={() => { window.location.href = `${STREAMLIT_URL}?name=${encodeURIComponent(name)}`; }}
              className="btn-primary w-full py-3.5 rounded-xl font-['Orbitron'] text-sm font-bold tracking-widest text-white relative z-10 mb-3"
            >
              <span className="relative z-10">LAUNCH NOW →</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] mb-3">
              <p className="text-red-400 text-sm font-['Rajdhani']">
                Set <code className="text-[#00d4ff]">NEXT_PUBLIC_STREAMLIT_APP_URL</code> in{" "}
                <code className="text-[#00d4ff]">.env.local</code>.
              </p>
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full py-2.5 rounded-xl font-['Orbitron'] text-xs tracking-widest text-[rgba(148,163,184,0.5)] hover:text-[rgba(239,68,68,0.8)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(239,68,68,0.3)] transition-all duration-300"
          >
            SIGN OUT
          </button>

          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(168,85,247,0.3)] to-transparent" />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "CORE VERSION", value: "v4.0.2" },
            { label: "STATUS",       value: "ACTIVE"  },
            { label: "ENGINE",       value: "QUANTUM" },
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
  // No loading fallback — CyberBackground renders immediately via the inner component
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
