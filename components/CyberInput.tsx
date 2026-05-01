"use client";

import { useState } from "react";

interface CyberInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
}

export default function CyberInput({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required,
  autoComplete,
  maxLength,
  disabled,
}: CyberInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-[rgba(148,163,184,0.8)] font-['Orbitron'] text-[10px] tracking-[2px] uppercase mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,212,255,0.5)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            input-cyber w-full rounded-lg py-3 pr-4 text-sm font-['Rajdhani'] font-medium
            ${icon ? "pl-10" : "pl-4"}
            ${isPassword ? "pr-16" : "pr-4"}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(0,212,255,0.5)] hover:text-[rgba(0,212,255,0.9)] transition-colors text-xs font-['Orbitron'] tracking-wider"
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>
    </div>
  );
}
