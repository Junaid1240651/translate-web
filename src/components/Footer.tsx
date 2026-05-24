import { Shield } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <a href="#" className="group mb-4 flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
              <span className="text-lg font-bold sm:text-xl">
                <span className="text-foreground">Video </span>
                <span className="gradient-text">Translator</span>
              </span>
            </a>
            <p className="mb-6 max-w-sm text-xs text-muted-foreground sm:text-sm">
              Local AI dubbing for YouTube videos and audiobooks. Translate and listen on your
              Mac — private, fast, and entirely on your device.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:contents">
            {FOOTER_LINKS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">
                  {column.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-xs text-muted-foreground sm:text-sm md:text-left">
              © {year} Video Translator. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground sm:text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground sm:text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
}

