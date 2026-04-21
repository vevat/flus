"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";
import { ShareSheet } from "./ShareSheet";
import { track } from "@/lib/analytics";
import { formatNok, getAtAge, projectWealth } from "@/lib/finance";

export function TopBar() {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const goals = useFlus((s) => s.goals);
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const reset = useFlus((s) => s.reset);
  const ui = useFlus((s) => s.ui);

  const [showShare, setShowShare] = useState(false);

  const daily = goals[0]?.dailyAmount ?? 50;
  const selectedAge = ui.selectedAge ?? 50;

  const shareText = useMemo(() => {
    if (!hasOnboarded) return "";
    const contributions = [{ dailyAmount: daily, fromAge: age }];
    const projection = projectWealth({
      currentAge: age,
      endAge: selectedAge,
      contributions,
    });
    const nominal = getAtAge(projection, selectedAge)?.nominal ?? 0;
    return `Visste du at ${daily} kr om dagen kan bli til ${formatNok(nominal, { compact: true })} innen du er ${selectedAge}? Sjekk hva din sparing kan bli til!`;
  }, [hasOnboarded, daily, age, selectedAge]);

  if (!hasOnboarded) return null;

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <div className="text-[13px] text-[var(--muted)]">
          Hei{" "}
          <span className="font-semibold text-[var(--foreground)]">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowShare(true);
              track("share_opened");
            }}
            className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
            aria-label="Del"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Er du sikker på at du vil starte på nytt? All data slettes."
                )
              ) {
                reset();
              }
            }}
            className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
            aria-label="Start på nytt"
            title="Start på nytt"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showShare && (
          <ShareSheet
            onClose={() => setShowShare(false)}
            shareText={shareText}
          />
        )}
      </AnimatePresence>
    </>
  );
}
