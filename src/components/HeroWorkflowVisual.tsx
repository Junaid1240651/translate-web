"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Languages,
  Link2,
  Play,
  Sparkles,
} from "lucide-react";

function Connector() {
  return (
    <div className="relative flex h-6 items-center justify-center sm:h-8" aria-hidden>
      <div className="h-full w-px border-l border-dashed border-primary/70" />
      <div className="absolute h-1.5 w-1.5 rounded-full bg-primary/80" />
    </div>
  );
}

const STACK_TRANSFORM = "rotateY(-14deg) rotateX(8deg)";
const CARD_TRANSFORMS = [
  "translateZ(24px) rotateX(-1deg)",
  "translateZ(48px) translateX(6px) rotateX(1deg)",
  "translateZ(20px) translateX(-4px) rotateX(-2deg)",
] as const;

export default function HeroWorkflowVisual() {
  const [progress, setProgress] = useState(28);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => (p >= 92 ? 28 : p + 2));
    }, 140);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,380px)] sm:max-w-[400px] lg:mx-0 lg:max-w-none">
      <div className="relative mx-auto [perspective:1100px]">
        <div
          className="flex flex-col items-center [transform-style:preserve-3d]"
          style={{ transform: STACK_TRANSFORM }}
        >
          <div
            className="relative w-full rounded-2xl bg-card/85 p-5 shadow-lg backdrop-blur-xl"
            style={{ transform: CARD_TRANSFORMS[0] }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                Step 1
              </span>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Paste YouTube URL</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  youtube.com/watch?v=...
                </p>
              </div>
            </div>
          </div>

          <Connector />

          <div
            className="relative w-full rounded-2xl bg-card/90 p-5 shadow-glow backdrop-blur-xl"
            style={{ transform: CARD_TRANSFORMS[1] }}
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Languages className="h-4 w-4 text-primary" />
              Translating dialogue
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {["Speech", "Translate", "Voice dub"].map((tag, i) => (
                <span
                  key={tag}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    progress > 30 + i * 20
                      ? "border border-primary/30 bg-primary/15 text-primary"
                      : "border border-border bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Match strength</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
          </div>

          <Connector />

          <div
            className="relative w-full rounded-2xl bg-card/85 p-5 shadow-lg backdrop-blur-xl"
            style={{ transform: CARD_TRANSFORMS[2] }}
          >
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Result
            </p>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground">Dubbed video ready</p>
                <p className="text-sm text-muted-foreground">Spanish · Saved locally</p>
              </div>
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
            </div>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <Play className="h-4 w-4" />
              Open in player
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
