"use client";

import { useState, useCallback } from "react";
import type { FeedbackEntry } from "@/app/api/feedback/route";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/feedback?key=${encodeURIComponent(password)}`);
      if (!res.ok) {
        setError("Feil passord");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setFeedback(data);
      setAuthed(true);
    } catch {
      setError("Noe gikk galt");
    }
    setLoading(false);
  }, [password]);

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : "—";

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    stars: r,
    count: feedback.filter((f) => f.rating === r).length,
  }));

  if (!authed) {
    return (
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="w-full max-w-xs space-y-4">
          <h1 className="font-display text-xl font-bold text-center text-[var(--foreground)]">
            Admin
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Passord"
            className="w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted-2)] focus:outline-none focus:border-[var(--primary)]"
            autoFocus
          />
          {error && (
            <p className="text-[12px] text-red-400 text-center">{error}</p>
          )}
          <button
            type="button"
            onClick={login}
            disabled={loading || !password}
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-white text-[14px] font-semibold transition-opacity disabled:opacity-40"
          >
            {loading ? "Logger inn..." : "Logg inn"}
          </button>
        </div>
      </div>
    );
  }

  const withComments = feedback.filter((f) => f.comment).reverse();

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6 space-y-5">
      <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
        Tilbakemeldinger
      </h1>

      {/* Summary */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-5">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-display text-[40px] font-bold leading-none text-[var(--foreground)]">
              {avgRating}
            </div>
            <div className="text-[11px] text-[var(--muted)] mt-1">
              snitt av {feedback.length}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            {ratingCounts.map(({ stars, count }) => {
              const pct = feedback.length > 0 ? (count / feedback.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--muted)] w-4 text-right">
                    {stars}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--primary-strong)" }}>
                    ★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--muted)] w-5 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comments */}
      {withComments.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[12px] uppercase tracking-wider text-[var(--muted)]">
            Kommentarer
          </h2>
          {withComments.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="text-[13px]"
                      style={{
                        color:
                          s <= f.rating
                            ? "var(--primary-strong)"
                            : "var(--muted-2)",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-[var(--muted-2)]">
                  {new Date(f.timestamp).toLocaleDateString("nb-NO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-2 text-[13px] text-[var(--foreground)] leading-snug">
                {f.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* All entries without comments */}
      {feedback.length > withComments.length && (
        <div className="space-y-2">
          <h2 className="text-[12px] uppercase tracking-wider text-[var(--muted)]">
            Kun stjerner ({feedback.length - withComments.length})
          </h2>
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4">
            <div className="flex flex-wrap gap-2">
              {feedback
                .filter((f) => !f.comment)
                .reverse()
                .map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-2)] px-2 py-1 text-[11px]"
                  >
                    <span style={{ color: "var(--primary-strong)" }}>★</span>
                    <span className="text-[var(--foreground)]">{f.rating}</span>
                    <span className="text-[var(--muted-2)]">
                      {new Date(f.timestamp).toLocaleDateString("nb-NO", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {feedback.length === 0 && (
        <div className="text-center text-[var(--muted)] text-[13px] py-8">
          Ingen tilbakemeldinger ennå.
        </div>
      )}
    </div>
  );
}
