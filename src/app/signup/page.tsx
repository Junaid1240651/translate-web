"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import OtpInput from "@/components/auth/OtpInput";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  saveAuthSession,
  signupSendOtp,
  signupVerify,
} from "@/lib/auth-client";
import { cn } from "@/lib/cn";

function validateName(name: string) {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return undefined;
}

function validateEmail(email: string) {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
  return undefined;
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const passwordChecks = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(form.password) },
    { label: "Contains uppercase", valid: /[A-Z]/.test(form.password) },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }
    if (!passwordChecks.every((c) => c.valid)) {
      setErrors({ password: "Please meet all password requirements" });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await signupSendOtp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setInfo(result.message);
      setStep("otp");
      setCode("");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to send code" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setErrors({ code: "Enter the 6-digit code" });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await signupVerify({ email: form.email.trim(), code });
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
      const result = await signupSendOtp({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setInfo(result.message);
      setCode("");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Failed to resend code" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen
          variant="overlay"
          message={step === "details" ? "Sending verification code…" : "Creating your account…"}
        />
      ) : null}
      <AuthLayout
      title={step === "details" ? "Create your account" : "Verify your email"}
      subtitle={
        step === "details"
          ? "Get started with Video Translator on your Mac"
          : `Enter the code we sent to ${form.email}`
      }
    >
      {step === "details" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {errors.general ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errors.general}
            </div>
          ) : null}

          <AuthInput
            label="Full name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            icon={<User className="h-4 w-4" />}
            autoComplete="name"
            disabled={loading}
          />

          <AuthInput
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
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
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
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
            <ul className="space-y-1.5 pt-1">
              {passwordChecks.map((check) => (
                <li
                  key={check.label}
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    check.valid ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {check.label}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary text-base font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending code…
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
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

          <OtpInput
            value={code}
            onChange={(v) => {
              setCode(v);
              setErrors((prev) => ({ ...prev, code: undefined, general: undefined }));
            }}
            disabled={loading}
            error={errors.code}
          />

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating account…
              </>
            ) : (
              "Verify & create account"
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
                setStep("details");
                setCode("");
                setInfo("");
                setErrors({});
              }}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to account details
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
    </>
  );
}
