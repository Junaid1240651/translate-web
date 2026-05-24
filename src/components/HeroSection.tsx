"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Apple,
  ArrowRight,
  Clock,
  Cpu,
  Headphones,
  ShieldCheck,
  Sparkles,
  Subtitles,
  Target,
  Zap,
} from "lucide-react";
import HeroWorkflowVisual from "@/components/HeroWorkflowVisual";
import LanguageMarquee from "@/components/LanguageMarquee";
import { HERO, STATS, TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/cn";

const TRUST_PILLS: { label: string; icon: LucideIcon; short: string }[] = [
  { label: "On-device dubbing", short: "On-device", icon: Cpu },
  { label: "Private by default", short: "Private", icon: ShieldCheck },
  { label: "Mac native app", short: "Mac app", icon: Apple },
];

const MINI_FEATURES = [
  {
    icon: Target,
    title: "Smart detection",
    desc: "Auto-detects source language",
  },
  {
    icon: Clock,
    title: "Real-time progress",
    desc: "Watch every dubbing stage",
  },
  {
    icon: Sparkles,
    title: "One-click workflow",
    desc: "Paste, pick, and play",
  },
];

const BOTTOM_BAR = [
  { icon: Subtitles, text: "Real-time dubbing progress" },
  { icon: Headphones, text: "Watch dubbed video in-app" },
  { icon: Sparkles, text: "Natural voice synthesis" },
];

export default function HeroSection() {
  const previewAvatars = TESTIMONIALS.slice(0, 5);

  return (
    <section className="relative flex min-h-0 flex-col overflow-x-clip lg:min-h-screen">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="hero-glow absolute inset-0" />
      <div className="absolute left-1/2 top-0 h-[480px] w-full max-w-6xl -translate-x-1/2 rounded-full bg-primary/15 blur-3xl lg:h-[560px]" />
      <div className="absolute -left-20 top-1/4 h-56 w-56 animate-float rounded-full bg-primary/10 blur-3xl sm:-left-32 sm:h-72 sm:w-72" />
      <div className="absolute -right-20 top-1/3 h-64 w-64 animate-float rounded-full bg-accent/10 blur-3xl [animation-delay:2s] sm:-right-32 sm:h-80 sm:w-80" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 md:pt-32 lg:px-8 lg:pt-36 xl:pt-40">
        <div className="grid flex-1 grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10 xl:gap-14">
          {/* Intro — trust + headline */}
          <div className="order-1 flex min-w-0 flex-col text-left lg:col-start-1 lg:row-start-1">
            <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-6 lg:mb-8 lg:flex lg:w-fit lg:rounded-full lg:border lg:border-border/60 lg:bg-card/40 lg:px-4 lg:py-2.5">
              {TRUST_PILLS.map((pill, i) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pill.label}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border border-primary/20 bg-card/60 px-2 py-2.5 text-center backdrop-blur-sm",
                      "lg:flex-row lg:gap-2 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-left",
                    )}
                  >
                    {i > 0 && (
                      <span
                        className="hidden h-3 w-px bg-border lg:inline-block"
                        aria-hidden
                      />
                    )}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 lg:h-auto lg:w-auto lg:bg-transparent">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-medium leading-tight text-muted-foreground sm:text-[11px] lg:text-sm">
                      <span className="lg:hidden">{pill.short}</span>
                      <span className="hidden lg:inline">{pill.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary sm:text-xs lg:hidden">
              <Zap className="h-3.5 w-3.5" />
              {HERO.badge.split(" · ")[0]}
            </div>

            <h1 className="mb-3 text-[2rem] font-bold leading-[1.1] tracking-tight sm:mb-4 sm:text-4xl md:text-[3.25rem] md:leading-[1.08] lg:mb-5 lg:text-6xl xl:text-[4rem] xl:leading-[1.06]">
              <span className="block text-foreground">{HERO.titleLine1}</span>
              <span className="gradient-text">{HERO.titleLine2}</span>
            </h1>

            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed lg:mb-0 lg:text-lg">
              {HERO.subtitle}
            </p>
          </div>

          {/* Workflow — elevated on mobile, right column on desktop */}
          <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="relative lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary lg:hidden">
                <Sparkles className="h-3.5 w-3.5" />
                Live dubbing preview
              </p>
              <HeroWorkflowVisual />
            </div>
          </div>

          {/* Actions — features, CTAs, social proof */}
          <div className="order-3 flex min-w-0 flex-col text-left lg:col-start-1 lg:row-start-2">
            <div className="-mx-1 mb-6 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:mb-8">
              {MINI_FEATURES.map((item, index) => {
                const Icon = item.icon;
                const edgeCard = index === 0 || index === 2;
                return (
                  <div
                    key={item.title}
                    className={cn(
                      "glass-card min-w-[220px] shrink-0 snap-start rounded-xl border-primary/15 p-3.5 transition hover:border-primary/30 sm:min-w-0 sm:p-4",
                      edgeCard &&
                        "border-primary/30 bg-card/70 shadow-glow ring-1 ring-primary/20",
                    )}
                  >
                    <div className="flex items-start gap-3 sm:block">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:mb-6 lg:mb-8 lg:flex-row lg:items-center">
              <a
                href="#download"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary-hover sm:rounded-lg lg:w-auto lg:min-w-[200px]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Sparkles className="h-4 w-4" />
                Download for Mac
              </a>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:border-primary/40 hover:bg-card sm:rounded-lg lg:w-auto lg:min-w-[200px]"
              >
                See how it works
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mb-5 rounded-xl border border-border/50 bg-card/30 p-3 backdrop-blur-sm sm:p-4 lg:mb-6">
              <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-3 sm:gap-3 lg:gap-4">
                {BOTTOM_BAR.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2.5 text-xs text-muted-foreground"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/20 px-3 py-2.5 backdrop-blur-sm sm:gap-4 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
              <div className="flex -space-x-2.5">
                {previewAvatars.map((person) => (
                  <Image
                    key={person.author}
                    src={person.avatar}
                    alt={person.author}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-background object-cover ring-1 ring-primary/20"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Trusted by{" "}
                <span className="font-semibold text-foreground">creators & learners</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-border/30 bg-card/30 backdrop-blur-sm lg:border-t-0">
        <div className="container mx-auto px-4 py-5 sm:py-6 lg:py-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/40 bg-card/40 px-2 py-3 text-center backdrop-blur-sm sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 lg:rounded-none"
              >
                <div className="text-xl font-bold gradient-text sm:text-2xl md:text-3xl lg:text-4xl">
                  {stat.value}
                </div>
                <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-xs md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LanguageMarquee />
    </section>
  );
}
