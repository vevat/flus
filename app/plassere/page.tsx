"use client";

import { useEffect, useState } from "react";
import { useFlus } from "@/lib/store";
import { InvestGuide } from "@/components/InvestGuide";
import Link from "next/link";

export default function PlasserePage() {
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
          Sett opp profilen din først så vi kan vise deg hvor mye du bør plassere
          i hvert produkt.
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

  return <InvestGuide />;
}
