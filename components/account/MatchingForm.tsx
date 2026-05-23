"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/auth/browser";
import FormField from "@/components/auth/FormField";
import AuthEnvWarning from "@/components/auth/AuthEnvWarning";
import {
  AVAILABILITY_OPTIONS,
  TOPIC_OPTIONS,
  OPEN_TO_MATCH_OPTIONS,
  OPEN_TO_MATCH_LABELS,
  type Availability,
  type MatchingFields,
  type OpenToMatch,
  type Topic,
} from "@/types/matching";

const ABOUT_MAX = 500;
const NEIGHBORHOOD_MAX = 80;

type Phase = "idle" | "submitting" | "saved";

interface Errors {
  about?: string;
  neighborhood?: string;
}

export default function MatchingForm({
  initial,
}: {
  initial: MatchingFields;
}) {
  const supabase = getBrowserSupabase();
  const router = useRouter();

  const [fields, setFields] = useState<MatchingFields>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  function setField<K extends keyof MatchingFields>(
    key: K,
    value: MatchingFields[K],
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAvailability(v: Availability) {
    setFields((prev) => ({
      ...prev,
      availability: prev.availability.includes(v)
        ? prev.availability.filter((x) => x !== v)
        : [...prev.availability, v],
    }));
  }

  function toggleTopic(v: Topic) {
    setFields((prev) => ({
      ...prev,
      topics: prev.topics.includes(v)
        ? prev.topics.filter((x) => x !== v)
        : [...prev.topics, v],
    }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (fields.about.length > ABOUT_MAX) {
      e.about = `Keep this to ${ABOUT_MAX} characters or fewer.`;
    }
    if (fields.neighborhood.length > NEIGHBORHOOD_MAX) {
      e.neighborhood = `Keep this to ${NEIGHBORHOOD_MAX} characters or fewer.`;
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
        "Authentication isn't configured. Add Supabase credentials to .env.local to save your matching preferences.",
      );
      return;
    }

    const payload: MatchingFields = {
      ...fields,
      neighborhood: fields.neighborhood.trim(),
      about: fields.about.trim(),
    };

    setPhase("submitting");
    const { error } = await supabase.auth.updateUser({
      data: { matching: payload },
    });

    if (error) {
      setPhase("idle");
      setServerError(error.message);
      return;
    }
    setPhase("saved");
    router.refresh();
    window.setTimeout(() => setPhase("idle"), 2200);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 space-y-7 min-w-0"
    >
      {!supabase && <AuthEnvWarning />}

      {/* Disclaimer */}
      <div className="border-2 border-dashed border-ink/40 bg-paper p-4 md:p-5">
        <div className="label-mono text-coral mb-2">How matching works</div>
        <p className="text-ink/80 text-[14px] leading-[1.55]">
          Workshop organizers use this form to pair you with a partner at the
          next in-person session. There&apos;s no automatic algorithm — a real
          human reads it.
        </p>
      </div>

      {/* Open to matching */}
      <fieldset>
        <legend className="label-mono text-sage block mb-2">
          Open to in-person matching?
        </legend>
        <div role="radiogroup" className="grid grid-cols-3 border-2 border-ink">
          {OPEN_TO_MATCH_OPTIONS.map((v, i) => {
            const active = fields.open_to_match === v;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setField("open_to_match", v as OpenToMatch)}
                className={`px-3 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  i > 0 ? "border-l-2 border-ink" : ""
                } ${active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-[#FAF6EC]"}`}
              >
                {OPEN_TO_MATCH_LABELS[v]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Availability */}
      <fieldset>
        <legend className="label-mono text-sage block mb-2">
          Availability — pick all that work
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <CheckboxTile
              key={opt.value}
              active={fields.availability.includes(opt.value)}
              label={opt.label}
              onToggle={() => toggleAvailability(opt.value)}
            />
          ))}
        </div>
      </fieldset>

      <FormField
        label="Neighborhood"
        name="neighborhood"
        value={fields.neighborhood}
        autoComplete="address-level3"
        error={errors.neighborhood}
        hint="Roughly where you're based in (or near) Vancouver."
        onChange={(v) => setField("neighborhood", v)}
      />

      {/* Topics */}
      <fieldset>
        <legend className="label-mono text-sage block mb-2">
          Topics you care about — pick any
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOPIC_OPTIONS.map((opt) => (
            <CheckboxTile
              key={opt.value}
              active={fields.topics.includes(opt.value)}
              label={opt.label}
              onToggle={() => toggleTopic(opt.value)}
            />
          ))}
        </div>
      </fieldset>

      {/* About me */}
      <label className="block">
        <span className="label-mono text-sage block mb-2">A bit about you</span>
        <textarea
          rows={5}
          maxLength={ABOUT_MAX}
          value={fields.about}
          onChange={(e) => setField("about", e.target.value)}
          placeholder="What you're hoping to get out of a pairing, languages you speak, what you'd like to talk about. A few sentences is plenty."
          className={`w-full border-2 bg-paper px-4 py-3.5 text-[16px] text-ink outline-none transition-colors resize-y ${
            errors.about ? "border-coral" : "border-ink focus:border-coral"
          }`}
          style={{ overflowWrap: "anywhere" }}
        />
        <div className="mt-1.5 flex justify-between gap-3 label-mono text-sage normal-case tracking-normal text-[12px]">
          <span>{errors.about ?? "Helps the organizers find the right partner."}</span>
          <span className="font-mono shrink-0">
            {fields.about.length} / {ABOUT_MAX}
          </span>
        </div>
      </label>

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
          {phase === "submitting" ? "Saving…" : "Save preferences"}
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

function CheckboxTile({
  active,
  label,
  onToggle,
}: {
  active: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onToggle}
      className={`flex items-center gap-3 border-2 border-ink px-4 py-3 text-left transition-colors ${
        active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-[#FAF6EC]"
      }`}
    >
      <span
        aria-hidden
        className={`w-4 h-4 border-2 border-ink flex items-center justify-center text-[12px] leading-none shrink-0 ${
          active ? "bg-ink text-paper" : "bg-paper"
        }`}
      >
        {active ? "✓" : ""}
      </span>
      <span className="text-[14px] font-semibold uppercase tracking-[0.04em]">
        {label}
      </span>
    </button>
  );
}
