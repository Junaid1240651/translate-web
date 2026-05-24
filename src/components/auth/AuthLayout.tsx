"use client";

import Link from "next/link";
import { BookOpen, Globe, Headphones, Lock, Play, Shield, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <Link href="/" className="group mb-12 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl transition-all group-hover:bg-primary/40" />
              <Shield className="relative h-10 w-10 text-primary transition-transform group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">Video </span>
              <span className="gradient-text">Translator</span>
            </span>
          </Link>

          <h1 className="mb-6 text-4xl font-bold leading-tight xl:text-5xl">
            <span className="text-foreground">Dub any video</span>
            <br />
            <span className="gradient-text">in your language</span>
          </h1>

          <p className="mb-12 max-w-md text-lg leading-relaxed text-muted-foreground">
            Paste a YouTube link or create an audiobook — private, fast, and entirely on your Mac.
          </p>

          <div className="space-y-4">
            {[
              { icon: Play, text: "Instant YouTube video dubbing" },
              { icon: BookOpen, text: "Audiobook creator with voice samples" },
              { icon: Globe, text: "50+ languages supported" },
              { icon: Lock, text: "100% on-device — your data stays local" },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-border/30 pt-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Privacy first</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span>Native Mac app</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <Headphones className="h-4 w-4 text-primary" />
              <span>Offline ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 bg-background lg:bg-card/30" />
        <div className="absolute inset-0 grid-pattern opacity-20 lg:hidden" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              <span className="text-foreground">Video </span>
              <span className="gradient-text">Translator</span>
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

