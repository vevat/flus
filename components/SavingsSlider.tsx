"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRelatable, formatNok, DEFAULTS } from "@/lib/finance";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Variable-step stops — overrides min/max/step when provided */
  stops?: number[];
  label?: string;
};

export function SavingsSlider({
  value,
  onChange,
  min = 0,
  max = 300,
  step = 5,
  stops,
  label = "Jeg sparer",
}: Props) {
  const monthly = value * DEFAULTS.daysPerMonth;
  const relatable = getRelatable(value);

  const useStops = stops && stops.length > 1;
  const stopIndex = useMemo(
    () => (useStops ? nearestIndex(stops, value) : 0),
    [useStops, stops, value],
  );

  const pct = useStops
    ? (stopIndex / (stops.length - 1)) * 100
    : ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useStops) {
      onChange(stops[Number(e.target.value)]);
    } else {
      onChange(Number(e.target.value));
    }
  };

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-start justify-between">
        <div className="flex items-baseline gap-1.5">
          <motion.span
            key={value}
            initial={{ scale: 0.92, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className="font-display text-3xl font-bold tracking-tight tabular-nums leading-none"
          >
            {value}
          </motion.span>
          <span className="text-base font-semibold text-[var(--muted)]">
            kr/dag
          </span>
        </div>
        <div className="flex flex-col items-end pt-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-medium">
            Månedlig sparing
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)] tabular-nums">
            = {formatNok(monthly)}/mnd
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[var(--primary)]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={useStops ? 0 : min}
          max={useStops ? stops.length - 1 : max}
          step={useStops ? 1 : step}
          value={useStops ? stopIndex : value}
          onChange={handleChange}
          className="relative z-10"
          aria-label="Daglig sparebeløp"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={relatable.label}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5 text-[12px] text-[var(--muted)]"
        >
          <span>{relatable.emoji}</span>
          <span>= {relatable.label}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function nearestIndex(stops: number[], value: number): number {
  let best = 0;
  let bestDist = Math.abs(stops[0] - value);
  for (let i = 1; i < stops.length; i++) {
    const d = Math.abs(stops[i] - value);
    if (d < bestDist) {
      best = i;
      bestDist = d;
    }
  }
  return best;
}
