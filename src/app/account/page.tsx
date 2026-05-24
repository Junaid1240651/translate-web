"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Copy,
  CreditCard,
  KeyRound,
  LogOut,
  Mail,
  Trash2,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppModal from "@/components/ui/AppModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  clearAuthSession,
  deleteAccount,
  fetchAccountSubscription,
  fetchCurrentUser,
  getStoredUser,
  type AccountPayment,
  type AccountSubscription,
} from "@/lib/auth-client";
import type { AuthUser } from "@/lib/auth/types";
import { formatMoney } from "@/lib/payments/types";
import UserAvatar from "@/components/auth/UserAvatar";
import { cn } from "@/lib/cn";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<AccountSubscription | null>(null);
  const [payments, setPayments] = useState<AccountPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const cached = getStoredUser();
      if (cached) setUser(cached);
      const fresh = await fetchCurrentUser();
      if (!fresh) {
        router.replace("/login");
        return;
      }
      setUser(fresh);
      try {
        const billing = await fetchAccountSubscription();
        setSubscription(billing.subscription);
        setPayments(billing.payments);
      } catch {
        setSubscription(null);
        setPayments([]);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      clearAuthSession();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const copyKey = async () => {
    if (!subscription?.activationKey) return;
    await navigator.clipboard.writeText(subscription.activationKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <LoadingScreen variant="page" message="Loading your profile…" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {deleting ? <LoadingScreen variant="overlay" message="Deleting your account…" /> : null}

      <AppModal
        open={deleteModalOpen}
        onClose={() => {
          if (deleting) return;
          setDeleteModalOpen(false);
          setError(null);
        }}
        closeOnBackdrop={!deleting}
        showClose={!deleting}
        title="Delete account?"
        titleId="delete-account-title"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        icon={<Trash2 className="h-7 w-7" />}
        iconClassName="bg-red-500/15 text-red-400"
        actions={[
          {
            label: "Cancel",
            onClick: () => setDeleteModalOpen(false),
            variant: "secondary",
            disabled: deleting,
          },
          {
            label: deleting ? "Deleting…" : "Delete account",
            onClick: handleDelete,
            variant: "danger",
            disabled: deleting,
          },
        ]}
      />

      <Header />
      <main className="relative flex-1 pt-24 sm:pt-28">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative container mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <div className="glass-card rounded-2xl border border-border/60 p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-4">
              <UserAvatar name={user.name} imageUrl={user.imageUrl} size="lg" />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/30 px-4 py-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Full name</p>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card/30 px-4 py-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <h2 className="mb-4 text-lg font-semibold">Subscription</h2>
              {subscription ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{subscription.planName} plan</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(subscription.amount, subscription.currency)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          subscription.isActive
                            ? "bg-success/15 text-success"
                            : "bg-red-500/15 text-red-400",
                        )}
                      >
                        {subscription.isActive ? "Active" : subscription.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Valid until {formatDate(subscription.expiresAt)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card/30 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <KeyRound className="h-4 w-4 text-primary" />
                        Activation key
                      </p>
                      <button
                        type="button"
                        onClick={copyKey}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <code className="block break-all rounded-lg bg-background/60 px-3 py-2 font-mono text-sm text-foreground">
                      {subscription.activationKey}
                    </code>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Enter this key in the Video Translator Mac app under Activation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card/30 p-4 text-sm text-muted-foreground">
                  <p className="mb-3">No active subscription yet.</p>
                  <Link href="/pricing" className="font-semibold text-primary hover:underline">
                    View pricing plans
                  </Link>
                </div>
              )}
            </div>

            {payments.length > 0 ? (
              <div className="mt-10 border-t border-border pt-6">
                <h2 className="mb-4 text-lg font-semibold">Payment history</h2>
                <ul className="space-y-3">
                  {payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card/30 px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <CreditCard className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium capitalize">{payment.planId} plan</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(payment.paidAt)} · {payment.razorpayPaymentId}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatMoney(payment.amount, payment.currency)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-primary/40"
              >
                Contact support
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-primary/40"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <h2 className="mb-2 text-sm font-semibold text-red-400">Danger zone</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
