"use client";

import { useEffect, useState } from "react";
import { useFlus } from "@/lib/store";
import { Onboarding } from "@/components/Onboarding";
import { Home } from "@/components/Home";

export default function Page() {
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

  return hasOnboarded ? <Home /> : <Onboarding />;
}
