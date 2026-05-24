import { Apple, ArrowRight, KeyRound } from "lucide-react";

export default function CTASection() {
  return (
    <section id="download" className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-8 text-center shadow-glow sm:p-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-xs font-medium text-primary">
            <KeyRound className="h-3.5 w-3.5" />
            License activation included
          </span>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-display-sm">
            Ready to dub your first video?
          </h2>
          <p className="mb-8 text-base text-muted-foreground sm:text-lg">
            Install the Mac desktop app, activate your license, and start translating YouTube
            videos or creating audiobooks — all on your machine.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary-hover"
            >
              <Apple className="h-5 w-5" />
              Download for Mac
            </a>
            <a
              href="#faq"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
            >
              Read the FAQ
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Requires macOS with Apple Silicon or Intel.
          </p>
        </div>
      </div>
    </section>
  );
}
