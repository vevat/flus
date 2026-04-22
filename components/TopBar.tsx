"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

function Tip({ label, children }: { label: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap rounded-lg bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--foreground)] z-50 pointer-events-none" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          {label}
        </span>
      )}
    </span>
  );
}
import { useFlus } from "@/lib/store";
import { ShareSheet } from "./ShareSheet";
import { MillianGreeting } from "./MillianGreeting";
import { InstallButton } from "./InstallPrompt";
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
      className="h-6 px-2 rounded-full text-[9px] font-semibold tracking-wide transition-all active:scale-95 border"
      style={{
        background: isGold ? "rgba(201,168,76,0.15)" : "var(--surface)",
        borderColor: isGold ? "rgba(201,168,76,0.3)" : "var(--border)",
        color: isGold ? "#c9a84c" : "var(--muted)",
      }}
      title={isGold ? "Bytt til light mode" : "Bytt til gold mode"}
    >
      {isGold ? "GOLD" : "LIGHT"}
    </button>
  );
}

export function TopBar() {
  const router = useRouter();
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const goals = useFlus((s) => s.goals);
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const reset = useFlus((s) => s.reset);
  const ui = useFlus((s) => s.ui);

  const [showShare, setShowShare] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  const isMillian = name.toLowerCase() === "millian";
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
    return `Visste du at jeg kan få ${formatNok(nominal, { compact: true })} i formue med å spare ${daily} kroner om dagen?\nSjekk hvor mye din sparing kan bli til!`;
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
          {isMillian && (
            <button
              type="button"
              onClick={() => setShowGreeting(true)}
              className="h-6 px-2 rounded-full text-[9px] font-semibold tracking-wide transition-all active:scale-95 border"
              style={{
                background: "rgba(201,168,76,0.15)",
                borderColor: "rgba(201,168,76,0.3)",
                color: "#c9a84c",
              }}
            >
              HILSEN
            </button>
          )}
          <ThemeToggle />
          <InstallButton />
          <Tip label="Del">
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
          </Tip>
          <Tip label="Reset">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Er du sikker på at du vil starte på nytt? All data slettes."
                  )
                ) {
                  reset();
                  router.push("/");
                }
              }}
              className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
              aria-label="Reset"
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
          </Tip>
        </div>
      </div>

      <AnimatePresence>
        {showShare && (
          <ShareSheet
            onClose={() => setShowShare(false)}
            shareText={shareText}
          />
        )}
        {showGreeting && (
          <MillianGreeting onClose={() => setShowGreeting(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
