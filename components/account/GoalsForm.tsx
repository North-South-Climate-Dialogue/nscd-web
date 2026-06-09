"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/auth/browser";
import AuthEnvWarning from "@/components/auth/AuthEnvWarning";
import {
  learnedThisWeek,
  streakDays,
  type ProgressRow,
} from "@/lib/progress/derived";
import { getProgressRows, subscribeProgress } from "@/lib/progress";

export const WEEKLY_TARGETS = [5, 10, 20, 30] as const;
export type WeeklyTarget = (typeof WEEKLY_TARGETS)[number];

type Phase = "idle" | "submitting" | "saved";

export default function GoalsForm({
  initialTarget,
  totalTerms,
}: {
  initialTarget: WeeklyTarget;
  totalTerms: number;
}) {
  const supabase = getBrowserSupabase();
  const router = useRouter();

  const [target, setTarget] = useState<WeeklyTarget>(initialTarget);
  const [phase, setPhase] = useState<Phase>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  // Live progress stats — Supabase when logged in, localStorage otherwise.
  const [rows, setRows] = useState<ProgressRow[]>([]);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      const r = await getProgressRows();
      if (alive) setRows(r);
    };
    load();
    const off = subscribeProgress(load);
    return () => {
      alive = false;
      off();
    };
  }, []);
  const weekCount = learnedThisWeek(rows);
  const streak = streakDays(rows);
  const totalLearned = rows.length;
  const weekPct = Math.min(100, Math.round((weekCount / target) * 100));

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(null);
    if (!supabase) {
      setServerError(
        "Authentication isn't configured. Add Supabase credentials to .env.local to save your goal.",
      );
      return;
    }
    setPhase("submitting");
    const { error } = await supabase.auth.updateUser({
      data: { weekly_target: target },
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
    <div className="space-y-7 min-w-0">
      {/* Stats */}
      <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0">
        <div className="label-mono text-coral mb-3">This week</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stat label="Words learned" value={`${weekCount}`} accent />
          <Stat label="Target" value={`${target}`} />
          <Stat label="Streak" value={`${streak}d`} mono />
        </div>

        <div className="mt-6">
          <div className="h-2 w-full bg-ink/15 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-coral transition-[width] duration-500"
              style={{ width: `${weekPct}%` }}
              aria-hidden
            />
          </div>
          <div className="mt-2 label-mono text-sage normal-case tracking-normal text-[12px]">
            {weekPct}% of weekly target · {totalLearned} of {totalTerms} total
          </div>
        </div>
      </article>

      {/* Target selector */}
      <form
        onSubmit={handleSubmit}
        className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0"
      >
        {!supabase && (
          <div className="mb-5">
            <AuthEnvWarning />
          </div>
        )}

        <div className="label-mono text-coral mb-3">Set your target</div>
        <h2 className="font-display font-extrabold text-ink text-[24px] md:text-[30px] leading-tight tracking-tight normal-case">
          How many words per week?
        </h2>
        <p className="mt-3 text-ink/75 text-[15px] leading-[1.55] max-w-[58ch]">
          Pick a pace that feels honest. 5 is gentle, 10 is steady, 20 is
          serious, 30 is the whole glossary in seven weeks.
        </p>

        <fieldset className="mt-6">
          <legend className="sr-only">Weekly target</legend>
          <div role="radiogroup" className="grid grid-cols-4 border-2 border-ink">
            {WEEKLY_TARGETS.map((n, i) => {
              const active = target === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTarget(n)}
                  className={`px-3 py-4 font-display font-extrabold text-[24px] md:text-[28px] leading-none transition-colors ${
                    i > 0 ? "border-l-2 border-ink" : ""
                  } ${active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-[#FAF6EC]"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </fieldset>

        {serverError && (
          <div className="mt-5 border-2 border-coral bg-paper p-4 label-mono normal-case tracking-normal text-[13px] text-ink">
            {serverError}
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={phase === "submitting" || target === initialTarget}
            className="bg-coral border-2 border-ink px-6 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-thunk"
          >
            {phase === "submitting" ? "Saving…" : "Save target"}
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
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="label-mono text-sage mb-1.5">{label}</div>
      <div
        className={`${mono ? "font-mono" : "font-display font-extrabold"} ${
          accent ? "text-coral" : "text-ink"
        } text-[36px] md:text-[44px] leading-none`}
      >
        {value}
      </div>
    </div>
  );
}
