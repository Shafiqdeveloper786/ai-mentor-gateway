import { ShieldIcon } from "./icons/ShieldIcon";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="glass-card rounded-2xl p-7 sm:p-9 w-full max-w-md mx-auto relative overflow-hidden animate-float">
      {/* Top neon line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.5)] to-transparent" />

      {/* Shield icon */}
      <div className="flex justify-center mb-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(0,212,255,0.15)] to-[rgba(168,85,247,0.15)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center">
            <ShieldIcon className="w-7 h-7 text-[#00d4ff]" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[rgba(0,212,255,0.1)] blur-md -z-10" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center text-[#00ff88] font-['Orbitron'] text-xl sm:text-2xl font-bold leading-tight mb-2">
        {title}
      </h2>
      <p className="text-center text-[rgba(148,163,184,0.7)] text-sm mb-7">{subtitle}</p>

      {children}

      {/* Bottom neon line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(168,85,247,0.3)] to-transparent" />
    </div>
  );
}
