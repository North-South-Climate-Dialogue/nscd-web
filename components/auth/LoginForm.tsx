"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/auth/browser";
import FormField from "./FormField";
import AuthEnvWarning from "./AuthEnvWarning";

interface Errors {
  email?: string;
  password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const supabase = getBrowserSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (password.length === 0) e.password = "Enter your password.";
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

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setSubmitting(false);
      setServerError(error.message);
      return;
    }

    // Refresh so server components re-read the session, then navigate.
    router.refresh();
    router.push(next);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-2 border-ink bg-paper p-7 md:p-10 shadow-thunk-lg space-y-5"
    >
      {!supabase && <AuthEnvWarning />}

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
        autoComplete="current-password"
        error={errors.password}
        onChange={setPassword}
      />

      {serverError && (
        <div className="border-2 border-coral bg-paper p-4 label-mono normal-case tracking-normal text-[13px] text-ink">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-coral border-2 border-ink px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-thunk"
      >
        {submitting ? "Signing in…" : "Log in →"}
      </button>
    </form>
  );
}
