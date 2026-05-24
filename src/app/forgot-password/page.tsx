"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import OtpInput from "@/components/auth/OtpInput";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { forgotPasswordReset, forgotPasswordSendOtp } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

function validateEmail(email: string) {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
  return undefined;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await forgotPasswordSendOtp({ email: email.trim() });
      if (!result.codeSent) {
        setErrors({ general: result.message });
        return;
      }
      setInfo(result.message);
      setStep("reset");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to send code" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setErrors({ code: "Enter the 6-digit code" });
      return;
    }
    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await forgotPasswordReset({
        email: email.trim(),
        code,
        newPassword: password,
      });
      router.push("/login?reset=1");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Reset failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen
          variant="overlay"
          message={step === "email" ? "Sending reset code…" : "Updating your password…"}
        />
      ) : null}
      <AuthLayout
      title={step === "email" ? "Reset your password" : "Create a new password"}
      subtitle={
        step === "email"
          ? "We'll send a 6-digit code to your email"
          : `Enter the code sent to ${email}`
      }
    >
      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {errors.general ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errors.general}
            </div>
          ) : null}

          <AuthInput
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            error={errors.email}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending code…
              </>
            ) : (
              <>
                Send reset code
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
          {errors.general ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errors.general}
            </div>
          ) : null}

          {info ? (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
              {info}
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">Verification code</p>
            <OtpInput
              value={code}
              onChange={(v) => {
                setCode(v);
                setErrors((prev) => ({ ...prev, code: undefined, general: undefined }));
              }}
              disabled={loading}
              error={errors.code}
            />
          </div>

          <div className="relative">
            <AuthInput
              label="New password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
              }}
              error={errors.password}
              icon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              disabled={loading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[2.15rem] text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setStep("email");
              setCode("");
              setPassword("");
              setInfo("");
              setErrors({});
            }}
            className={cn(
              "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
              loading && "opacity-60",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Use a different email
          </button>
        </form>
      )}
    </AuthLayout>
    </>
  );
}
