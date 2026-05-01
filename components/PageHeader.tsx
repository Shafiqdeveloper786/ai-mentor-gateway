export default function PageHeader() {
  return (
    <div className="text-center mb-8 px-4">
      <h1
        className="gradient-text-main font-['Orbitron'] text-4xl sm:text-5xl md:text-6xl font-black tracking-widest leading-tight"
        style={{ textShadow: "0 0 30px rgba(0,212,255,0.3)" }}
      >
        AI MENTOR
      </h1>
      <p className="mt-2 text-[#00d4ff] font-['Orbitron'] text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] font-semibold">
        ⚡ QUANTUM KNOWLEDGE CORE ⚡
      </p>
      <p className="mt-3 text-[rgba(148,163,184,0.6)] font-['Orbitron'] text-[10px] sm:text-xs tracking-[2px]">
        CORE v4.0.2 | CREATED BY SHAFIQ CHOHAN
      </p>
    </div>
  );
}
