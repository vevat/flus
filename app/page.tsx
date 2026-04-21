"use client";

import { useEffect, useState } from "react";
import { useFlus } from "@/lib/store";
import { Onboarding } from "@/components/Onboarding";
import { OnboardingExclusive } from "@/components/OnboardingExclusive";
import { Home } from "@/components/Home";
import { ThemeToggle } from "@/components/TopBar";

export default function Page() {
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const theme = useFlus((s) => s.theme);
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

  if (hasOnboarded) return <Home />;

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="absolute top-2 right-2 z-50">
        <ThemeToggle />
      </div>
      {theme === "exclusive" ? <OnboardingExclusive /> : <Onboarding />}
    </div>
  );
}
