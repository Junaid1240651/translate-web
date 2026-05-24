"use client";

import Image from "next/image";
import { Quote, Star, Subtitles } from "lucide-react";
import { TESTIMONIALS, TRUST_BADGES } from "@/lib/constants";

function StarRating({
  rating,
  className = "h-3.5 w-3.5 sm:h-4 sm:w-4",
}: {
  rating: number;
  className?: string;
}) {
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;
  const hasPartial = partialFill > 0 && fullStars < 5;
  const emptyCount = 5 - fullStars - (hasPartial ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${className} fill-warning text-warning`} />
      ))}
      {hasPartial && (
        <span className={`relative inline-block shrink-0 ${className}`}>
          <Star
            className="absolute inset-0 h-full w-full fill-warning text-warning"
            style={{ clipPath: `inset(0 ${100 - partialFill * 100}% 0 0)` }}
          />
          <Star
            className="absolute inset-0 h-full w-full fill-none stroke-[1.5] text-warning"
            style={{ clipPath: `inset(0 0 0 ${partialFill * 100}%)` }}
          />
        </span>
      )}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${className} text-muted-foreground`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-16">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary sm:mb-4 sm:text-sm">
            Loved by creators & learners
          </span>
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-display-sm md:text-display-md">
            Trusted by <span className="gradient-text">Mac users</span> worldwide
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            From language learners to independent authors — see why people choose Video
            Translator for private, local dubbing.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3 sm:mb-16 sm:gap-6 md:gap-10">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3"
              >
                <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                <div>
                  <div className="text-base font-bold sm:text-lg">{badge.value}</div>
                  <div className="text-[10px] text-muted-foreground sm:text-xs">{badge.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.author}
              className="group relative rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-primary/30 sm:rounded-2xl sm:p-6"
            >
              <Quote className="absolute right-3 top-3 h-6 w-6 text-primary/10 transition-colors group-hover:text-primary/20 sm:right-4 sm:top-4 sm:h-8 sm:w-8" />

              <div className="mb-3 sm:mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-6 sm:text-base">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={40}
                  height={40}
                  className="h-9 w-9 rounded-full border-2 border-background object-cover ring-2 ring-primary/20 sm:h-10 sm:w-10"
                />
                <div>
                  <p className="text-sm font-semibold">{testimonial.author}</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{testimonial.role}</p>
                </div>
              </div>

              {testimonial.highlight && (
                <div className="mt-3 border-t border-border/50 pt-3 sm:mt-4 sm:pt-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-success sm:gap-2 sm:text-xs">
                    <Subtitles className="h-3 w-3" />
                    <span>Used for: {testimonial.highlight}</span>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* <div className="mt-10 text-center sm:mt-16">
          <p className="mb-2 text-sm text-muted-foreground sm:text-base">
            Join creators who dub privately on their Mac
          </p>
          <div className="flex items-center justify-center gap-1">
            <StarRating rating={4.7} className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="ml-2 text-xs text-muted-foreground sm:text-sm">
              4.7/5 average rating
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
}

