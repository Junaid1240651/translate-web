"use client";

import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

interface LoadingScreenProps {
  variant?: "page" | "overlay" | "inline";
  message?: string;
  className?: string;
}

function LoadingContent({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", className)}>
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-loading-ring rounded-full border-2 border-primary/20" />
        <span className="absolute inset-2 animate-loading-ring-reverse rounded-full border-2 border-primary/30" />
        <span className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-card/80 shadow-glow">
          <Shield className="h-7 w-7 text-primary" />
        </div>
      </div>

      <p className="mb-2 text-lg font-semibold">
        <span className="text-foreground">Video </span>
        <span className="gradient-text">Translator</span>
      </p>

      <p className="text-sm text-muted-foreground">{message}</p>

      <div className="mt-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-loading-dot rounded-full bg-primary"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LoadingScreen({
  variant = "page",
  message = "Loading…",
  className,
}: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (variant === "overlay") {
    if (!mounted) return null;
    return createPortal(
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/70 backdrop-blur-sm">
        <LoadingContent message={message} className={className} />
      </div>,
      document.body,
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center py-12">
        <LoadingContent message={message} className={className} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center py-16">
      <LoadingContent message={message} className={className} />
    </div>
  );
}
