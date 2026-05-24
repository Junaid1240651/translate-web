"use client";

import { cn } from "@/lib/cn";

export type AuthMethod = "password" | "otp";

interface AuthMethodToggleProps {
  value: AuthMethod;
  onChange: (value: AuthMethod) => void;
  disabled?: boolean;
}

export default function AuthMethodToggle({ value, onChange, disabled }: AuthMethodToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Sign-in method"
      className="flex rounded-xl border border-primary/25 bg-primary/[0.07] p-1 shadow-[inset_0_1px_0_rgba(16,185,129,0.08)]"
    >
      {(
        [
          { id: "password" as const, label: "Password" },
          { id: "otp" as const, label: "Email code" },
        ] as const
      ).map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              active
                ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/35"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary/80",
              disabled && "pointer-events-none opacity-60",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
