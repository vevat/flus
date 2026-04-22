"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function Feedback() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!rating) return;
    track("feedback_submitted", { rating, comment: comment.trim() || undefined });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
        <div className="text-[20px]">&#10003;</div>
        <p className="text-[13px] text-[var(--muted)] mt-1">
          Tusen takk for tilbakemeldingen!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
      <h2 className="font-display text-base font-semibold">Gi oss en tilbakemelding</h2>
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
        className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[12px] text-[var(--foreground)] placeholder:text-[var(--muted-2)] resize-none focus:outline-none focus:border-[var(--primary)]"
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
  );
}
