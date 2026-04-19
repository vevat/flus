"use client";

import { motion } from "framer-motion";

type Props = {
  currentAge: number;
  selectedAge: number;
  onChange: (age: number) => void;
  /** Maks alder vises i tidslinjen */
  maxAge?: number;
};

export function AgeTimeline({
  currentAge,
  selectedAge,
  onChange,
  maxAge = 80,
}: Props) {
  const candidates = [25, 30, 40, 50, 60, 70, 80];
  const milestones = candidates.filter(
    (a) => a > currentAge && a <= maxAge,
  );

  return (
    <div className="w-full">
      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5 px-1">
        Vis verdi når jeg er
      </div>
      <div className="flex justify-between gap-1">
        {milestones.map((age) => {
          const active = selectedAge === age;
          return (
            <motion.button
              key={age}
              type="button"
              onClick={() => onChange(age)}
              whileTap={{ scale: 0.92 }}
              className={`flex-1 py-2 rounded-full text-[11px] font-semibold transition-colors ${
                active
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              }`}
            >
              {age} år
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
