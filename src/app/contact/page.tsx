import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm, { ContactSidebar } from "@/components/contact/ContactForm";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata = {
  title: "Contact Us — Video Translator",
  description: "Get in touch with the Video Translator team for support, feedback, or bug reports.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <ContactSidebar />
            <div className="glass-card rounded-2xl border border-border/50 p-6 sm:p-8">
              <Suspense fallback={<LoadingScreen variant="inline" message="Loading form…" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
