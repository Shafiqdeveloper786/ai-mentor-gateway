"use client";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Deep navy base */}
      <div className="absolute inset-0 bg-[#030b1a]" />

      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Top-left radial glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00d4ff] opacity-[0.04] blur-[100px]" />

      {/* Top-right purple glow */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[#a855f7] opacity-[0.05] blur-[100px]" />

      {/* Bottom-center green glow */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00d4ff] opacity-[0.03] blur-[120px]" />

      {/* Horizontal scan line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.3)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.2)] to-transparent" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[rgba(0,212,255,0.3)] rounded-tl-sm" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[rgba(0,212,255,0.3)] rounded-tr-sm" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[rgba(0,212,255,0.3)] rounded-bl-sm" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[rgba(0,212,255,0.3)] rounded-br-sm" />

      {/* Sparkle bottom-right */}
      <div className="absolute bottom-8 right-8 text-[rgba(0,212,255,0.3)] text-3xl select-none animate-pulse-slow">✦</div>
    </div>
  );
}
