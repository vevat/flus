"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (localStorage.getItem("pwa-install-dismissed")) {
      setDismissed(true);
      return;
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone);
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    if (isIOS) {
      setTimeout(() => setShowIOSHint(true), 2000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    dismiss();
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIOSHint(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  }, []);

  const show = !dismissed && (!!deferredPrompt || showIOSHint);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="mx-5 mb-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--foreground)]">
                Legg til på hjemskjermen
              </div>
              {deferredPrompt ? (
                <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-snug">
                  Installer Pengebingen som app for rask tilgang.
                </p>
              ) : (
                <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-snug">
                  Trykk{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline w-3.5 h-3.5 -mt-0.5">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>{" "}
                  og velg &laquo;Legg til på Hjem-skjerm&raquo;.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
              aria-label="Lukk"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {deferredPrompt && (
            <button
              type="button"
              onClick={install}
              className="mt-3 w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-[13px] font-semibold active:scale-[0.98] transition-transform"
            >
              Installer app
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
