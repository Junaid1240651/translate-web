"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Apple, LogIn, Menu, Shield, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import UserProfileDropdown from "@/components/auth/UserProfileDropdown";
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredUser,
} from "@/lib/auth-client";
import type { AuthUser } from "@/lib/auth/types";
import { cn } from "@/lib/cn";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = async () => {
      const cached = getStoredUser();
      if (cached) setUser(cached);
      const fresh = await fetchCurrentUser();
      setUser(fresh);
    };
    sync();
    window.addEventListener("vt-auth-changed", sync);
    return () => window.removeEventListener("vt-auth-changed", sync);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    if (isHome) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${href}`;
    }
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/80 py-3 backdrop-blur-xl"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-1.5 sm:gap-2" aria-label="Video Translator">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all group-hover:bg-primary/30" />
              <Shield className="relative h-6 w-6 text-primary transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
            </div>
            <span className="text-lg font-bold tracking-tight sm:text-xl">
              <span className="text-foreground">Video </span>
              <span className="gradient-text">Translator</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href.startsWith("#") ? (isHome ? link.href : `/${link.href}`) : link.href}
                    onClick={(e) => handleHashClick(e, link.href)}
                    className={cn(
                      "group relative py-2 text-sm transition-colors hover:text-foreground",
                      !link.href.startsWith("#") && pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mx-1 h-6 w-px bg-border" />

            {user ? (
              <UserProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-card"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}

            <Link
              href={isHome ? "#download" : "/#download"}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary-hover"
            >
              <Apple className="h-4 w-4" />
              Get the app
            </Link>
          </div>

          <button
            type="button"
            className="p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 md:hidden",
            open ? "mt-4 max-h-[520px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="glass-card space-y-4 rounded-lg p-4">
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href.startsWith("#") ? (isHome ? link.href : `/${link.href}`) : link.href}
                    onClick={(e) => handleHashClick(e, link.href)}
                    className={cn(
                      "block rounded-md px-3 py-2 transition-colors hover:bg-secondary/50 hover:text-foreground",
                      !link.href.startsWith("#") && pathname === link.href
                        ? "bg-secondary/50 text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-border pt-2">
              {user ? (
                <>
                  <div className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold"
                  >
                    My account
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
              <Link
                href={isHome ? "#download" : "/#download"}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Apple className="h-4 w-4" />
                Get the app
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

