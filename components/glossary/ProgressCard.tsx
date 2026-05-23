"use client";

import { useProgress } from "@/hooks/useProgress";

export default function ProgressCard({ total }: { total: number }) {
  const { learnedIds } = useProgress();
  const learned = learnedIds.size;
  const pct = total === 0 ? 0 : Math.round((learned / total) * 100);

  return (
    <aside className="border-2 border-ink bg-paper p-6 shadow-thunk">
      <div className="label-mono text-sage mb-3">Your progress</div>
      <div className="display text-ink text-[64px] md:text-[80px] leading-none">
        <span className="font-mono font-normal normal-case tracking-normal">
          {String(learned).padStart(2, "0")}
        </span>
        <span className="text-sage"> / {total}</span>
      </div>
      <div className="mt-4 h-2 w-full bg-ink/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-coral transition-[width] duration-300"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-3 label-mono text-sage">
        {pct}% complete · Saved on this device
      </div>
    </aside>
  );
}
