import { FEATURES } from "@/lib/constants";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-card/30 py-16 sm:py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-16">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary sm:mb-4 sm:text-sm">
            Core features
          </span>
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-display-sm md:text-display-md">
            Everything you need to{" "}
            <span className="gradient-text">translate locally</span>
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            A complete desktop experience for video dubbing and audiobook creation — built
            for privacy, speed, and ease of use.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-glow sm:rounded-2xl sm:p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl">
                  <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-1.5 text-lg font-semibold sm:mb-2 sm:text-xl">{feature.title}</h3>
                <p className="text-sm text-muted-foreground sm:text-base">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
