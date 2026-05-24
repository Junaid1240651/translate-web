"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const LENGTH = 6;

export default function OtpInput({ value, onChange, disabled, error }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(LENGTH, " ").slice(0, LENGTH).split("");

  useEffect(() => {
    if (value.length === 0) {
      inputsRef.current[0]?.focus();
    }
  }, [value]);

  const updateAt = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d.trim())).join("").slice(0, LENGTH);
    onChange(next.replace(/\s/g, ""));
  };

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      updateAt(index, "");
      return;
    }
    if (cleaned.length > 1) {
      const merged = (value.slice(0, index) + cleaned).slice(0, LENGTH);
      onChange(merged);
      const focusIndex = Math.min(index + cleaned.length, LENGTH - 1);
      inputsRef.current[focusIndex]?.focus();
      return;
    }
    updateAt(index, cleaned);
    if (index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (pasted) onChange(pasted);
  };

  return (
    <div>
      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length: LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={6}
            disabled={disabled}
            value={digits[index]?.trim() || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "h-12 w-10 rounded-lg border bg-card/50 text-center text-lg font-semibold text-foreground outline-none transition sm:h-14 sm:w-12 sm:text-xl",
              error ? "border-red-500/50" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
              disabled && "opacity-60",
            )}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
      {error ? <p className="mt-2 text-center text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
