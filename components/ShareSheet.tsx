"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { track } from "@/lib/analytics";

const APP_URL = "https://flus-lake.vercel.app";

type Props = {
  onClose: () => void;
  shareText: string;
};

export function ShareSheet({ onClose, shareText }: Props) {
  const [qrSvg, setQrSvg] = useState("");
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    QRCode.toString(APP_URL, {
      type: "svg",
      width: 200,
      margin: 1,
      color: { dark: "#1a1a1a", light: "#00000000" },
    }).then(setQrSvg);
  }, []);

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: "Flus – Se sparingen din vokse",
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
            className="w-[180px] h-[180px] rounded-2xl bg-white p-3 border border-[var(--border)]"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </div>

        <p className="mt-3 text-center text-[11px] text-[var(--muted-2)]">
          Skann for å åpne Flus
        </p>

        {/* Share text preview */}
        <div className="mt-4 p-3 rounded-2xl bg-[var(--surface-2)] text-[13px] text-[var(--foreground)] leading-snug">
          &ldquo;{shareText}&rdquo;
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2.5">
          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="flex-1 py-3.5 rounded-2xl bg-[var(--primary)] text-white font-semibold active:scale-[0.98] transition-transform"
            >
              Del
            </button>
          )}
          <button
            type="button"
            onClick={copyLink}
            className={`${canNativeShare ? "flex-1" : "w-full"} py-3.5 rounded-2xl font-semibold active:scale-[0.98] transition-all ${
              copied
                ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
                : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
            }`}
          >
            {copied ? "Kopiert!" : "Kopier tekst"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
