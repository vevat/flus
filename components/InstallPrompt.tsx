"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [hintText, setHintText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as { standalone?: boolean }).standalone);
    setIsStandalone(!!standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = useCallback(async () => {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      return;
    }

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    if (isIOS) {
      setHintText("Trykk del-ikonet ↑ og velg «Legg til på Hjem-skjerm»");
    } else {
      setHintText("Klikk ⋮ i nettleseren → «Installer app» eller «Legg til på startskjermen»");
    }
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
  }, []);

  if (isStandalone) return null;

  return (
    <span
      className="relative"
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {showLabel && !showHint && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap rounded-lg bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--foreground)] z-50 pointer-events-none" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          Last ned app
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
        aria-label="Last ned app"
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
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-3 text-[11px] text-[var(--foreground)] leading-snug z-50"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
            onClick={() => setShowHint(false)}
          >
            {hintText}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
