"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getLearnedIdsSync,
  markVocabCompleted,
  onProgressChanged,
  unmarkVocabCompleted,
} from "@/lib/progress/local";

/**
 * React-friendly view over the localStorage progress shim.
 *
 * SSR returns an empty Set so server and first-client renders match; the real
 * data is loaded on mount, after which the component re-renders with the
 * learned IDs filled in.
 */
export function useProgress() {
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const sync = () => setLearnedIds(getLearnedIdsSync());
    sync();
    return onProgressChanged(sync);
  }, []);

  const mark = useCallback(async (id: string) => {
    await markVocabCompleted(id);
  }, []);

  const unmark = useCallback(async (id: string) => {
    await unmarkVocabCompleted(id);
  }, []);

  const toggle = useCallback(
    async (id: string) => {
      const isLearned = learnedIds.has(id);
      if (isLearned) {
        await unmarkVocabCompleted(id);
      } else {
        await markVocabCompleted(id);
      }
    },
    [learnedIds],
  );

  return { learnedIds, mark, unmark, toggle };
}
