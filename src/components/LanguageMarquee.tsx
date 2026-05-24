import { Globe } from "lucide-react";
import { HERO_LANGUAGES } from "@/lib/constants";

export default function LanguageMarquee() {
  return (
    <div className="relative overflow-hidden border-t border-border/30 bg-card/20 py-4 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <div className="flex animate-marquee whitespace-nowrap">
        {[...HERO_LANGUAGES, ...HERO_LANGUAGES].map((lang, i) => (
          <span
            key={`${lang}-${i}`}
            className="mx-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-primary sm:mx-4 sm:text-sm"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}

