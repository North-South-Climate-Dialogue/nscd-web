"use client";

import { useState } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/auth/browser";
import FormField from "./FormField";
import AuthEnvWarning from "./AuthEnvWarning";

type Phase = "idle" | "submitting" | "sent";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const supabase = getBrowserSupabase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please enter your name (at least 2 characters).";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    if (confirm !== password) e.confirm = "Passwords don't match.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(null);

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    if (!supabase) {
      setServerError(
        "Authentication isn't configured. Please add Supabase credentials to .env.local.",
      );
      return;
    }

    setPhase("submitting");
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim() },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });

    if (error) {
      setPhase("idle");
      setServerError(error.message);
      return;
    }

    setPhase("sent");
  }

  if (phase === "sent") {
    return (
      <div className="border-2 border-ink bg-paper p-7 md:p-10 shadow-thunk-lg">
        <div className="label-mono text-coral mb-3">Check your email</div>
        <h2 className="font-display font-extrabold text-ink text-[28px] md:text-[36px] leading-[1.05] tracking-tight normal-case">
          One last step.
        </h2>
        <p className="mt-5 text-ink/85 text-[16px] leading-[1.65] max-w-[58ch]">
          We sent a confirmation link to{" "}
          <span className="font-mono text-ink">{email}</span>. Click the link
          in that email to activate your account, then come back and log in.
        </p>
        <p className="mt-3 text-ink/65 text-[14px] leading-[1.55]">
          The email might land in spam — if you don&apos;t see it within a
          minute, check there.
        </p>
        <div className="mt-7">
          <Link
            href="/login"
            className="inline-block border-2 border-ink bg-coral px-5 py-3.5 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
          >
            Go to log in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-2 border-ink bg-paper p-7 md:p-10 shadow-thunk-lg space-y-5"
    >
      {!supabase && <AuthEnvWarning />}

      <FormField
        label="Display name"
        name="name"
        value={name}
        required
        autoComplete="name"
        error={errors.name}
        hint="What we'll call you in the app."
        onChange={setName}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={email}
        required
        autoComplete="email"
        error={errors.email}
        onChange={setEmail}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={password}
        required
        autoComplete="new-password"
        error={errors.password}
        hint="At least 8 characters."
        onChange={setPassword}
      />

      <FormField
        label="Confirm password"
        name="confirm"
        type="password"
        value={confirm}
        required
        autoComplete="new-password"
        error={errors.confirm}
        onChange={setConfirm}
      />

      {serverError && (
        <div className="border-2 border-coral bg-paper p-4 label-mono normal-case tracking-normal text-[13px] text-ink">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={phase === "submitting"}
        className="w-full bg-coral border-2 border-ink px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-thunk"
      >
        {phase === "submitting" ? "Creating your account…" : "Create account →"}
      </button>
    </form>
  );
}
