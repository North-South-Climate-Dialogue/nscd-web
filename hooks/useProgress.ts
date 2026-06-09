"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getLearnedIds,
  markVocabCompleted,
  unmarkVocabCompleted,
  subscribeProgress,
} from "@/lib/progress";

/**
 * React-friendly view over the progress router.
 *
 * Routes to Supabase for logged-in users and localStorage for everyone else
 * (see lib/progress/index.ts). SSR starts with an empty Set so server and
 * first-client renders match; the real data loads on mount, and the component
 * re-renders once it arrives. Writes dispatch a change event this hook
 * subscribes to, so the learned set stays in sync after every mark/unmark and
 * across login/logout.
 */
export function useProgress() {
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const ids = await getLearnedIds();
      if (alive) setLearnedIds(ids);
    };
    load();
    const off = subscribeProgress(load);
    return () => {
      alive = false;
      off();
    };
  }, []);

  const mark = useCallback(async (id: string) => {
    await markVocabCompleted(id);
  }, []);

  const unmark = useCallback(async (id: string) => {
    await unmarkVocabCompleted(id);
  }, []);

  const toggle = useCallback(
    async (id: string) => {
      if (learnedIds.has(id)) {
        await unmarkVocabCompleted(id);
      } else {
        await markVocabCompleted(id);
      }
    },
    [learnedIds],
  );

  return { learnedIds, mark, unmark, toggle };
}
