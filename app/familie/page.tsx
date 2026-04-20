"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFlus, type FamilyMember } from "@/lib/store";
import { Family } from "@/components/Family";

function decodePlan(encoded: string): FamilyMember[] | null {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return null;
    return data.map((m: Record<string, unknown>, i: number) => ({
      id: `shared-${i}`,
      name: String(m.name ?? ""),
      age: Number(m.age ?? 0),
      dailyAmount: Number(m.dailyAmount ?? 0),
      parentContribution: Number(m.parentContribution ?? 0),
    }));
  } catch {
    return null;
  }
}

function FamilieContent() {
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const [hydrated, setHydrated] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const planParam = searchParams.get("plan");
  const sharedMembers = useMemo(
    () => (planParam ? decodePlan(planParam) : null),
    [planParam],
  );

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="font-display text-3xl font-semibold text-[var(--primary)]">
          Pengebingen
        </div>
      </div>
    );
  }

  if (sharedMembers && sharedMembers.length > 0) {
    return <Family readonly members={sharedMembers} />;
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

  return <Family />;
}

export default function FamiliePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="font-display text-3xl font-semibold text-[var(--primary)]">
            Pengebingen
          </div>
        </div>
      }
    >
      <FamilieContent />
    </Suspense>
  );
}
