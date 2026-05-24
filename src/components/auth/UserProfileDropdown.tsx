"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, MessageSquare, User } from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { cn } from "@/lib/cn";
import UserAvatar from "@/components/auth/UserAvatar";

interface UserProfileDropdownProps {
  user: AuthUser;
  onLogout: () => void;
  className?: string;
}

export default function UserProfileDropdown({ user, onLogout, className }: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex max-w-[180px] items-center gap-2 rounded-lg border border-border bg-card/40 px-2.5 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-card"
      >
        <UserAvatar name={user.name} imageUrl={user.imageUrl} size="sm" />
        <span className="truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-border bg-card/95 shadow-xl backdrop-blur-xl"
        >
          <div className="border-b border-border px-4 py-3 flex items-center gap-3">
            <UserAvatar name={user.name} imageUrl={user.imageUrl} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-secondary/60"
            >
              <User className="h-4 w-4 text-primary" />
              My account
            </Link>
            <Link
              href="/contact"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-secondary/60"
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              Contact support
            </Link>
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
