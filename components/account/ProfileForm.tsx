"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/auth/browser";
import FormField from "@/components/auth/FormField";
import AuthEnvWarning from "@/components/auth/AuthEnvWarning";
import {
  NATIVE_LANGUAGES,
  NATIVE_LANGUAGE_LABELS,
  PRACTICING_LANGUAGES,
  PRACTICING_LANGUAGE_LABELS,
  type ProfileFields,
} from "@/types/profile";

const BIO_MAX = 500;
const LOCATION_MAX = 80;

type Phase = "idle" | "submitting" | "saved";

interface Errors {
  display_name?: string;
  bio?: string;
  native_language?: string;
  practicing?: string;
  location?: string;
}

export default function ProfileForm({
  initial,
}: {
  initial: ProfileFields;
}) {
  const supabase = getBrowserSupabase();
  const router = useRouter();

  const [fields, setFields] = useState<ProfileFields>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  function set<K extends keyof ProfileFields>(key: K, value: ProfileFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (fields.display_name.trim().length < 2) {
      e.display_name = "Display name must be at least 2 characters.";
    }
    if (fields.bio.length > BIO_MAX) {
      e.bio = `Bio must be ${BIO_MAX} characters or fewer.`;
    }
    if (fields.location.length > LOCATION_MAX) {
      e.location = `Location must be ${LOCATION_MAX} characters or fewer.`;
    }
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

    // Trim whitespace in stored values so the rest of the app reads clean data.
    const payload: ProfileFields = {
      display_name: fields.display_name.trim(),
      bio: fields.bio.trim(),
      native_language: fields.native_language,
      practicing: fields.practicing,
      location: fields.location.trim(),
    };

    const { error } = await supabase.auth.updateUser({ data: payload });

    if (error) {
      setPhase("idle");
      setServerError(error.message);
      return;
    }

    setPhase("saved");
    // Re-fetch server data so the navbar's "Hi, name" reflects the new value.
    router.refresh();
    window.setTimeout(() => setPhase("idle"), 2200);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 space-y-6 min-w-0"
    >
      {!supabase && <AuthEnvWarning />}

      <FormField
        label="Display name"
        name="display_name"
        value={fields.display_name}
        required
        autoComplete="name"
        error={errors.display_name}
        hint="Shown in the navbar and anywhere else we greet you."
        onChange={(v) => set("display_name", v)}
      />

      {/* Bio — textarea, inline */}
      <label className="block">
        <span className="label-mono text-sage block mb-2">Bio</span>
        <textarea
          rows={4}
          maxLength={BIO_MAX}
          value={fields.bio}
          onChange={(e) => set("bio", e.target.value)}
          className={`w-full border-2 bg-paper px-4 py-3.5 text-[16px] text-ink outline-none transition-colors resize-y ${
            errors.bio ? "border-coral" : "border-ink focus:border-coral"
          }`}
          placeholder="A sentence or two about you — what you're working on, what languages you speak, what climate topics you care about."
          style={{ overflowWrap: "anywhere" }}
        />
        <div className="mt-1.5 flex justify-between gap-3 label-mono text-sage normal-case tracking-normal text-[12px]">
          <span>{errors.bio ?? "Optional. Visible on your future profile page."}</span>
          <span className="font-mono shrink-0">
            {fields.bio.length} / {BIO_MAX}
          </span>
        </div>
      </label>

      {/* Native language */}
      <fieldset>
        <legend className="label-mono text-sage block mb-2">Native language</legend>
        <div role="radiogroup" className="grid grid-cols-3 border-2 border-ink">
          {NATIVE_LANGUAGES.map((value, i) => {
            const active = fields.native_language === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set("native_language", value)}
                className={`px-3 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  i > 0 ? "border-l-2 border-ink" : ""
                } ${active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-[#FAF6EC]"}`}
              >
                {NATIVE_LANGUAGE_LABELS[value]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Practicing */}
      <fieldset>
        <legend className="label-mono text-sage block mb-2">
          What you&apos;re practicing
        </legend>
        <div role="radiogroup" className="grid grid-cols-3 border-2 border-ink">
          {PRACTICING_LANGUAGES.map((value, i) => {
            const active = fields.practicing === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set("practicing", value)}
                className={`px-3 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  i > 0 ? "border-l-2 border-ink" : ""
                } ${active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-[#FAF6EC]"}`}
              >
                {PRACTICING_LANGUAGE_LABELS[value]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <FormField
        label="Location"
        name="location"
        value={fields.location}
        autoComplete="address-level2"
        error={errors.location}
        hint="Optional, free text — e.g. “Vancouver, BC”. Helpful for matching at in-person workshops."
        onChange={(v) => set("location", v)}
      />

      {serverError && (
        <div className="border-2 border-coral bg-paper p-4 label-mono normal-case tracking-normal text-[13px] text-ink">
          {serverError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={phase === "submitting"}
          className="bg-coral border-2 border-ink px-6 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-thunk"
        >
          {phase === "submitting" ? "Saving…" : "Save changes"}
        </button>

        <span
          aria-live="polite"
          className={`label-mono normal-case tracking-normal text-[13px] transition-opacity duration-300 ${
            phase === "saved" ? "text-coral opacity-100" : "opacity-0"
          }`}
        >
          ✓ Saved
        </span>
      </div>
    </form>
  );
}
