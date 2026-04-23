"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";

const AUTO_SHOW_MS = 10 * 60 * 1000;

export function FeedbackForm({ onClose }: { onClose: () => void }) {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const daily = useFlus((s) => s.goals[0]?.dailyAmount);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!rating) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
          name: name || undefined,
          age: age || undefined,
          dailySavings: daily || undefined,
        }),
      });
    } catch { /* ignore */ }
    setSubmitted(true);
    localStorage.setItem("feedback-given", "1");
    setTimeout(onClose, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-sm rounded-3xl bg-[var(--background)] border border-[var(--border)] p-5"
        style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Lukk"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-[24px]">&#10003;</div>
            <p className="text-[13px] text-[var(--muted)] mt-2">
              Tusen takk for tilbakemeldingen!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="font-display text-base font-semibold text-[var(--foreground)]">Gi oss en tilbakemelding</h2>
            <p className="text-[12px] text-[var(--muted)]">
              Hva synes du om Pengebingen?
            </p>

            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="w-10 h-10 rounded-xl border transition-all flex items-center justify-center text-lg"
                  style={{
                    background:
                      rating && star <= rating
                        ? "var(--primary-soft)"
                        : "var(--surface-2)",
                    borderColor:
                      rating && star <= rating
                        ? "var(--primary)"
                        : "var(--border)",
                    color:
                      rating && star <= rating
                        ? "var(--primary-strong)"
                        : "var(--muted-2)",
                  }}
                >
                  &#9733;
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Valgfritt: Skriv en kommentar..."
              rows={2}
              className="w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-2)] resize-none focus:outline-none focus:border-[var(--primary)]"
            />

            <button
              type="button"
              onClick={submit}
              disabled={!rating}
              className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-[13px] font-semibold transition-opacity disabled:opacity-30"
            >
              Send tilbakemelding
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function FeedbackTrigger() {
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasOnboarded) return;
    if (localStorage.getItem("feedback-given")) return;

    const timer = setTimeout(() => setShow(true), AUTO_SHOW_MS);
    return () => clearTimeout(timer);
  }, [hasOnboarded]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="cursor-pointer hover:text-[var(--muted)] transition-colors"
      >
        Tilbakemelding
      </button>
      <AnimatePresence>
        {show && <FeedbackForm onClose={() => setShow(false)} />}
      </AnimatePresence>
    </>
  );
}
