"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFlus } from "@/lib/store";
import { Boost } from "@/components/Boost";

export default function BoostPage() {
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[var(--muted)] text-sm">Laster…</div>
      </div>
    );
  }

  if (!hasOnboarded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-semibold">Boost</h1>
        <p className="text-[var(--muted)] text-sm leading-snug">
          Sett opp profilen din først, så låser vi opp Boost — sparehacks for
          deg som vil bli rik mens du sover.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-[var(--primary)] text-white font-semibold text-sm shadow-md"
        >
          Start her
        </Link>
      </div>
    );
  }

  return <Boost />;
}
