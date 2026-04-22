"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { track } from "@/lib/analytics";
import { useFlus } from "@/lib/store";

const APP_URL = "https://pengebingen.vercel.app";

type Props = {
  onClose: () => void;
  shareText: string;
};

function encodePlanLink(): string {
  const { name, age, goals } = useFlus.getState();
  const daily = goals[0]?.dailyAmount ?? 50;
  const member = {
    name,
    age,
    dailyAmount: daily,
    parentContribution: 0,
  };
  const encoded = btoa(JSON.stringify([member]));
  return `${APP_URL}/familie?plan=${encoded}`;
}

export function ShareSheet({ onClose, shareText }: Props) {
  const [qrSvg, setQrSvg] = useState("");
  const [copied, setCopied] = useState(false);
  const [planCopied, setPlanCopied] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("theme-exclusive") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    QRCode.toString(APP_URL, {
      type: "svg",
      width: 200,
      margin: 1,
      color: { dark: isDark ? "#f0ede6" : "#1a1a1a", light: "#00000000" },
    }).then(setQrSvg);
  }, []);

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: "Pengebingen",
        text: shareText,
        url: APP_URL,
      });
      track("share_completed", { method: "native" });
    } catch {
      // user cancelled
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${APP_URL}`);
      setCopied(true);
      track("share_completed", { method: "copy" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignored
    }
  };

  const sharePlan = async () => {
    const planUrl = encodePlanLink();
    const planText = "Se spareplanen min på Pengebingen! Sjekk hva din sparing kan bli til.";
    if (canNativeShare) {
      try {
        await navigator.share({ title: "Min spareplan", text: planText, url: planUrl });
        track("plan_shared", { method: "native" });
      } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${planText}\n\n${planUrl}`);
        setPlanCopied(true);
        track("plan_shared", { method: "copy" });
        setTimeout(() => setPlanCopied(false), 2000);
      } catch { /* ignored */ }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="w-full max-w-md bg-[var(--background)] rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-5" />

        <div className="text-center">
          <div className="font-display text-xl font-semibold">
            Del med venner
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Vis andre hva sparing kan bli til
          </p>
        </div>

        {/* QR Code */}
        <div className="mt-5 flex justify-center">
          <div
            className="w-[180px] h-[180px] rounded-2xl bg-white p-4 border border-[var(--border)] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </div>

        <p className="mt-3 text-center text-[11px] text-[var(--muted-2)]">
          Skann for å åpne Pengebingen
        </p>

        {/* Share text preview */}
        <div className="mt-4 p-3 rounded-2xl bg-[var(--surface-2)] text-[13px] text-[var(--foreground)] leading-snug whitespace-pre-line">
          {shareText}
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={canNativeShare ? nativeShare : copyLink}
            className="w-full py-3.5 rounded-2xl bg-[var(--primary)] text-white font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Del med venner
          </button>
          <button
            type="button"
            onClick={sharePlan}
            className={`w-full py-3 rounded-2xl text-[13px] font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 ${
              planCopied
                ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
                : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {planCopied ? "Lenke kopiert!" : "Del min spareplan"}
          </button>
          <button
            type="button"
            onClick={copyLink}
            className={`w-full py-3 rounded-2xl text-[13px] font-medium active:scale-[0.98] transition-all ${
              copied
                ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
                : "text-[var(--muted)]"
            }`}
          >
            {copied ? "Kopiert!" : "Eller kopier lenke"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
