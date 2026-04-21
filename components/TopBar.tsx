"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";
import { ShareSheet } from "./ShareSheet";
import { track } from "@/lib/analytics";
import { formatNok, getAtAge, projectWealth } from "@/lib/finance";

export function ThemeToggle() {
  const theme = useFlus((s) => s.theme);
  const setTheme = useFlus((s) => s.setTheme);
  const isGold = theme === "exclusive";

  return (
    <button
      type="button"
      onClick={() => setTheme(isGold ? "original" : "exclusive")}
      className="w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition-all border"
      style={{
        background: isGold ? "rgba(201,168,76,0.15)" : "var(--surface)",
        borderColor: isGold ? "rgba(201,168,76,0.3)" : "var(--border)",
        color: isGold ? "#c9a84c" : "var(--muted)",
      }}
      title={isGold ? "Bytt til light mode" : "Bytt til gold mode"}
    >
      {isGold ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

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
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => {
              setShowShare(true);
              track("share_opened");
            }}
            className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
            aria-label="Del"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
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
            className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
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
              className="w-3.5 h-3.5"
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
