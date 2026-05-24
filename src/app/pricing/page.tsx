import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCards from "@/components/pricing/PricingCards";
import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Pricing — Video Translator",
  description: "Choose a Video Translator plan — monthly, yearly, or custom enterprise pricing.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex-1 pt-24 sm:pt-28">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-1/2 top-0 h-72 w-full max-w-3xl -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative container mx-auto px-4 py-10 sm:py-14">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Simple pricing
            </span>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Plans that scale with{" "}
              <span className="gradient-text">your workflow</span>
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Start with monthly access, save with yearly billing, or talk to us for custom
              enterprise pricing.
            </p>
          </div>

          <PricingCards />

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Secure payments</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Checkout powered by Razorpay with encrypted, PCI-compliant processing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-5">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Cancel anytime</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Need a custom plan? Our team can tailor pricing for teams and enterprises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
