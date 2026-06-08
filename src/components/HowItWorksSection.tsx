"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Languages,
  Play,
  Sparkles,
  Subtitles,
  Volume2,
} from "lucide-react";
import { DEMO_PIPELINE, STEPS } from "@/lib/constants";

const DEMO_VIDEOS = [
  { url: "tech-conference-keynote.mp4", lang: "Japanese", title: "Tech conference keynote" },
  { url: "french-cooking-tutorial.mp4", lang: "English", title: "French cooking tutorial" },
  { url: "history-documentary.mp4", lang: "Spanish", title: "Documentary excerpt" },
];

export default function HowItWorksSection() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const current = DEMO_VIDEOS[activeDemo];

  useEffect(() => {
    const run = () => {
      setIsProcessing(true);
      setShowResult(false);
      setTimeout(() => {
        setIsProcessing(false);
        setShowResult(true);
      }, 1600);
      setTimeout(() => {
        setActiveDemo((p) => (p + 1) % DEMO_VIDEOS.length);
      }, 4500);
    };
    run();
    const interval = setInterval(run, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <span className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-20">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary sm:mb-4 sm:text-sm">
            How It Works
          </span>
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-display-sm md:text-display-md">
            Paste, dub, <span className="gradient-text">enjoy</span>
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Upload a video, pick a language, and let Video Translator handle the rest — all on
            your Mac, with real-time progress you can follow.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-5xl sm:mb-20">
          <div className="relative grid gap-6 sm:grid-cols-3 sm:gap-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === STEPS.length - 1;
              return (
                <div key={step.title} className="relative text-center">
                  <div className="mb-4 flex justify-center sm:mb-6">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card sm:h-16 sm:w-16 sm:rounded-2xl">
                        <Icon
                          className={`h-7 w-7 sm:h-8 sm:w-8 ${
                            step.status === "warning"
                              ? "text-warning"
                              : step.status === "success"
                                ? "text-success"
                                : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground sm:-right-2 sm:-top-2 sm:h-6 sm:w-6 sm:text-xs">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold sm:mb-3 sm:text-xl">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                  {!isLast && (
                    <div className="my-4 flex justify-center sm:hidden">
                      <ArrowRight className="h-5 w-5 rotate-90 text-primary/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="glass-card relative overflow-hidden rounded-xl p-4 sm:rounded-2xl sm:p-6 md:p-10">
            {isProcessing && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
            )}

            <div className="grid items-start gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Live preview
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex flex-1 items-center justify-center gap-2">
                      <Subtitles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Video Translator</span>
                    </div>
                  </div>

                  <div className="space-y-3 p-3">
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                      <Play className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {current.url}
                      </span>
                    </div>

                    <div className="min-h-[140px] p-2">
                      {isProcessing ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-6">
                          <Languages className="h-8 w-8 animate-pulse text-primary" />
                          <p className="text-sm text-muted-foreground">Dubbing in progress…</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {DEMO_PIPELINE.map((step, i) => (
                              <span
                                key={step}
                                className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] text-primary"
                              >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                                {step}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : showResult ? (
                        <div className="space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/10 p-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-success">
                                Ready
                              </p>
                              <p className="text-sm font-medium">{current.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Dubbed to {current.lang}
                              </p>
                            </div>
                            <Volume2 className="h-8 w-8 text-success" />
                          </div>
                          <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
                            Video saved locally — open in the built-in player or export when ready.
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {DEMO_VIDEOS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i === activeDemo ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl font-bold sm:text-2xl">Built for real workflows</h3>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Whether you&apos;re learning a language, localizing content, or creating
                  audiobooks — Video Translator keeps everything on your Mac.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Upload any video file or paste a URL, then pick a target language",
                    "Track dubbing progress step by step in real time",
                    "Create audiobooks from text with a short voice sample",
                    "Export transcripts and keep all files stored locally",
                    "Activate once and use offline after initial setup",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Video Translate + Audio Book in one native Mac app</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

