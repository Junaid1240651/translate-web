"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export interface AppModalAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  actions?: AppModalAction[];
  children?: React.ReactNode;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  titleId?: string;
}

const actionStyles: Record<NonNullable<AppModalAction["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow",
  secondary:
    "border border-border bg-transparent hover:border-primary/40 hover:bg-card/80",
  danger: "border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20",
};

function ActionButton({ action }: { action: AppModalAction }) {
  const className = cn(
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    actionStyles[action.variant ?? "secondary"],
  );

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      className={className}
    >
      {action.label}
    </button>
  );
}

export default function AppModal({
  open,
  onClose,
  title,
  description,
  icon,
  iconClassName,
  actions = [],
  children,
  closeOnBackdrop = true,
  showClose = true,
  titleId = "app-modal-title",
}: AppModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-2xl sm:p-10">
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {icon ? (
          <div
            className={cn(
              "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full",
              iconClassName,
            )}
          >
            {icon}
          </div>
        ) : null}

        <h2 id={titleId} className="mb-2 text-xl font-bold">
          {title}
        </h2>

        {description ? (
          <p className="mb-6 text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}

        {children}

        {actions.length > 0 ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {actions.map((action) => (
              <ActionButton key={action.label} action={action} />
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
