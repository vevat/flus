"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFlus } from "@/lib/store";
import { GoalReverse } from "@/components/GoalReverse";

export default function MalPage() {
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="font-display text-3xl font-semibold text-[var(--primary)]">
          Pengebingen
        </div>
      </div>
    );
  }

  if (!hasOnboarded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="font-display text-2xl font-semibold mb-2">
          Først litt om deg
        </div>
        <p className="text-[var(--muted)] text-sm mb-6">
          Vi trenger å vite alderen din for å regne ut spareplanen.
        </p>
        <Link
          href="/"
          className="px-5 py-3 rounded-2xl bg-[var(--primary)] text-white font-semibold"
        >
          Til oppstart
        </Link>
      </div>
    );
  }

  return <GoalReverse />;
}
