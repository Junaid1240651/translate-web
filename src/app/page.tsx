import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import SectionSeparator from "@/components/SectionSeparator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SectionSeparator />
        <FeaturesSection />
        <SectionSeparator />
        <HowItWorksSection />
        <SectionSeparator />
        <TestimonialsSection />
        <SectionSeparator />
        <FAQSection />
        <SectionSeparator />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

