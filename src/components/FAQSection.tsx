"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-card/30 py-16 sm:py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-16">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary sm:mb-4 sm:text-sm">
            FAQ
          </span>
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-display-sm md:text-display-md">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Everything you need to know about Video Translator — from first setup to
            troubleshooting.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  isOpen ? "border-primary/30 bg-card" : "border-border bg-card/50",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold sm:text-base">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180 text-primary",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
