"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock,
  Globe,
  HelpCircle,
  Lightbulb,
  Mail,
  MessageSquare,
  Play,
  Send,
  Shield,
  Bug,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactForm } from "@/lib/contact-api";
import { CONTACT_REASONS, SUPPORT_EMAIL, type ContactReason } from "@/lib/contact-constants";
import { fetchCurrentUser, getStoredUser } from "@/lib/auth-client";
import { cn } from "@/lib/cn";
import ContactSuccessModal from "@/components/contact/ContactSuccessModal";
import LoadingScreen from "@/components/ui/LoadingScreen";

const REASON_ICONS = {
  message: MessageSquare,
  help: HelpCircle,
  bug: Bug,
  lightbulb: Lightbulb,
} as const;

const EMPTY = {
  name: "",
  email: "",
  reason: "general" as ContactReason,
  subject: "",
  message: "",
};

const VALID_REASONS = new Set(CONTACT_REASONS.map((r) => r.value));

function validate(form: typeof EMPTY) {
  const errors: Partial<Record<keyof typeof EMPTY, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email";
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 20) errors.message = "Message must be at least 20 characters";
  else if (form.message.length > 1000) errors.message = "Message must be at most 1000 characters";
  return errors;
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const initialReason = (() => {
    const r = searchParams.get("reason") || "general";
    return VALID_REASONS.has(r as ContactReason) ? (r as ContactReason) : "general";
  })();

  const [form, setForm] = useState({ ...EMPTY, reason: initialReason });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const prefill = async () => {
      const cached = getStoredUser();
      if (cached) {
        setForm((prev) => ({ ...prev, name: cached.name, email: cached.email }));
        setSignedIn(true);
      }
      const user = await fetchCurrentUser();
      if (user) {
        setForm((prev) => ({ ...prev, name: user.name, email: user.email }));
        setSignedIn(true);
      }
    };
    prefill();
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, reason: initialReason }));
  }, [initialReason]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        reason: form.reason,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setForm((prev) => ({
      ...EMPTY,
      reason: initialReason,
      name: signedIn ? prev.name : "",
      email: signedIn ? prev.email : "",
    }));
    setErrors({});
    setSubmitError(null);
  };

  return (
    <>
      {submitting ? <LoadingScreen variant="overlay" message="Sending your message…" /> : null}

      <ContactSuccessModal
        open={submitted}
        onClose={() => setSubmitted(false)}
        onSendAnother={handleSendAnother}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400" role="alert">
          <strong className="block font-semibold">Failed to send message</strong>
          <p className="mt-1">{submitError}</p>
        </div>
      ) : null}

      {signedIn ? (
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm text-primary">
          Submitting as your signed-in account. Name and email are prefilled.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            disabled={submitting || signedIn}
            readOnly={signedIn}
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary",
              errors.name && "border-red-500/50",
              signedIn && "cursor-default opacity-80",
            )}
          />
          {errors.name ? <p className="text-xs text-red-400">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={submitting || signedIn}
            readOnly={signedIn}
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary",
              errors.email && "border-red-500/50",
              signedIn && "cursor-default opacity-80",
            )}
          />
          {errors.email ? <p className="text-xs text-red-400">{errors.email}</p> : null}
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">What&apos;s this about?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONTACT_REASONS.map((reason) => {
            const Icon = REASON_ICONS[reason.icon];
            const active = form.reason === reason.value;
            return (
              <button
                key={reason.value}
                type="button"
                disabled={submitting}
                onClick={() => setForm((prev) => ({ ...prev, reason: reason.value }))}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition sm:text-sm",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {reason.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm font-medium">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Brief description of your inquiry"
          value={form.subject}
          onChange={handleChange}
          disabled={submitting}
          className={cn(
            "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary",
            errors.subject && "border-red-500/50",
          )}
        />
        {errors.subject ? <p className="text-xs text-red-400">{errors.subject}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          maxLength={1000}
          rows={6}
          placeholder="Tell us more about your question or feedback..."
          value={form.message}
          onChange={handleChange}
          disabled={submitting}
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary",
            errors.message && "border-red-500/50",
          )}
        />
        {errors.message ? <p className="text-xs text-red-400">{errors.message}</p> : null}
        <p className="text-right text-xs text-muted-foreground">{form.message.length} / 1000 characters</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary-hover disabled:opacity-60"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting this form, you agree to our privacy policy for support communications.
      </p>
    </form>
    </>
  );
}

export function ContactSidebar() {
  return (
    <aside className="space-y-8">
      <div>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <MessageSquare className="h-3.5 w-3.5" />
          Contact
        </span>
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Get in touch</h1>
        <p className="text-muted-foreground">
          Have a question, feedback, or need help? We&apos;d love to hear from you.
        </p>
      </div>

      <ul className="space-y-5">
        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <strong className="block text-sm">Email</strong>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <strong className="block text-sm">Response time</strong>
            <p className="text-sm text-muted-foreground">We typically respond within 24–48 hours</p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <strong className="block text-sm">Location</strong>
            <p className="text-sm text-muted-foreground">Remote-first company serving users worldwide</p>
          </div>
        </li>
      </ul>

      <div className="rounded-xl border border-border bg-card/30 p-5">
        <h3 className="mb-3 text-sm font-semibold">Quick links</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/#faq" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <HelpCircle className="h-4 w-4" />
              Browse FAQ
            </Link>
          </li>
          <li>
            <Link href="/contact?reason=bug" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Bug className="h-4 w-4" />
              Report a bug
            </Link>
          </li>
          <li>
            <Link href="/contact?reason=feature" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Lightbulb className="h-4 w-4" />
              Request a feature
            </Link>
          </li>
          <li>
            <Link href="/#download" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Shield className="h-4 w-4" />
              Download the app
            </Link>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="mb-3 text-sm font-semibold">Help us respond faster</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Play className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Mention Video Translate or Audio Book
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Include your macOS version
          </li>
          <li className="flex items-start gap-2">
            <Bug className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            List steps to reproduce bugs
          </li>
        </ul>
      </div>
    </aside>
  );
}
