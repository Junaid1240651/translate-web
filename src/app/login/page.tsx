"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthMethodToggle, { type AuthMethod } from "@/components/auth/AuthMethodToggle";
import OtpInput from "@/components/auth/OtpInput";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  loginSendOtp,
  loginVerifyOtp,
  loginWithPassword,
  saveAuthSession,
} from "@/lib/auth-client";
import { cn } from "@/lib/cn";

function validateEmail(email: string) {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
  return undefined;
}

export default function LoginPage() {
  const router = useRouter();
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("reset=1")) {
      setResetSuccess(true);
    }
  }, []);
  const [method, setMethod] = useState<AuthMethod>("password");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    code?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleMethodChange = (next: AuthMethod) => {
    setMethod(next);
    setOtpStep("email");
    setCode("");
    setInfo("");
    setCodeSent(false);
    setErrors({});
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await loginWithPassword({ email: email.trim(), password });
      saveAuthSession(result);
      router.push("/");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Sign in failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    setErrors({});
    setInfo("");
    try {
      const result = await loginSendOtp({ email: email.trim() });
      if (!result.codeSent) {
        setErrors({ general: result.message });
        return;
      }
      setInfo(result.message);
      setCodeSent(true);
      setOtpStep("code");
      setCode("");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to send code" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setErrors({ code: "Enter the 6-digit code" });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await loginVerifyOtp({ email: email.trim(), code });
      saveAuthSession(result);
      router.push("/");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setErrors({});
    try {
      const result = await loginSendOtp({ email: email.trim() });
      if (!result.codeSent) {
        setErrors({ general: result.message });
        setOtpStep("email");
        setCodeSent(false);
        return;
      }
      setInfo(result.message);
      setCode("");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to resend code" });
    } finally {
      setLoading(false);
    }
  };

  const title =
    method === "password"
      ? "Welcome back"
      : otpStep === "email"
        ? "Welcome back"
        : "Check your email";

  const subtitle =
    method === "password"
      ? "Sign in with your email and password"
      : otpStep === "email"
        ? "Sign in with a one-time code sent to your email"
        : codeSent
          ? `We sent a 6-digit code to ${email}`
          : "Enter your verification code";

  return (
    <>
      {loading ? <LoadingScreen variant="overlay" message="Signing you in…" /> : null}
      <AuthLayout title={title} subtitle={subtitle}>
      {resetSuccess ? (
        <div className="mb-5 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
          Password updated. Sign in with your new password.
        </div>
      ) : null}

      {method === "otp" && otpStep === "code" ? null : (
        <div className="mb-6">
          <AuthMethodToggle value={method} onChange={handleMethodChange} disabled={loading} />
        </div>
      )}

      {method === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-5">
          {errors.general ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errors.general}
            </div>
          ) : null}

          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
            }}
            error={errors.email}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            disabled={loading}
          />

          <div className="space-y-2">
            <div className="relative">
              <AuthInput
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                }}
                error={errors.password}
                icon={<Lock className="h-4 w-4" />}
                autoComplete="current-password"
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
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            New to Video Translator?{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
              Create a free account
            </Link>
          </p>
        </form>
      ) : otpStep === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {errors.general ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <p>{errors.general}</p>
              {errors.general.toLowerCase().includes("no account") ? (
                <p className="mt-2">
                  <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
                    Create a free account →
                  </Link>
                </p>
              ) : null}
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
              setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
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
                Continue with email
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            New to Video Translator?{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
              Create a free account
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
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
            <p className="text-center text-sm text-muted-foreground">Enter verification code</p>
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

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="flex flex-col items-center gap-3 text-sm">
            <button
              type="button"
              disabled={loading}
              onClick={handleResend}
              className={cn("font-medium text-primary hover:text-primary/80", loading && "opacity-60")}
            >
              Resend code
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setOtpStep("email");
                setCode("");
                setInfo("");
                setCodeSent(false);
                setErrors({});
              }}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Use a different email
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
    </>
  );
}
