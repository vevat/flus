"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRelatable, formatNok, DEFAULTS, type RelatableId } from "@/lib/finance";
import { useFlus } from "@/lib/store";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Variable-step stops — overrides min/max/step when provided */
  stops?: number[];
  label?: string;
  hideRelatable?: boolean;
};

const ICON_PATHS: Record<RelatableId, string> = {
  nudler:
    "M4 14c0-3 2-5 8-5s8 2 8 5M3 14h18v1c0 3-4 5-9 5s-9-2-9-5v-1zm5-7c0-1.5 1-3 4-3s4 1.5 4 3",
  brus:
    "M8 2h8l1 4H7L8 2zm-1 4h10v1a1 1 0 01-1 1H8a1 1 0 01-1-1V6zm1 2h8l-1 14H9L8 8z",
  sjokolade:
    "M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm0 6h14M5 14h14M9 4v16M14 4v16",
  baguette:
    "M5 17L17 5c1.5-1.5 4 1 2.5 2.5L7.5 19.5C6 21 3.5 18.5 5 17zm2-2l10-10M8 16l9-9",
  storebeløp:
    "M12 2v2m0 16v2M2 12h2m16 0h2M12 8a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z",
  sky:
    "M12 3l1.5 3.5L18 8l-3.5 1.5L13 14l-1-4.5L7 8l4.5-1.5L12 3zM5 12l1 2 2 .5-2 1L5 18l-1-2.5L2 15l2-.5L5 12z",
  loaded:
    "M5 16l2-6h10l2 6H5zm7-14l-3 5h6l-3-5zm-5.5 6.5L4 14m13.5-5.5L20 14",
};

export function SavingsSlider({
  value,
  onChange,
  min = 0,
  max = 300,
  step = 5,
  stops,
  label = "Jeg sparer",
  hideRelatable = false,
}: Props) {
  const monthly = value * DEFAULTS.daysPerMonth;
  const relatable = getRelatable(value);
  const isGold = useFlus((s) => s.theme) === "exclusive";

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
            {formatNok(monthly)}/mnd
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

      {!hideRelatable && (
        <AnimatePresence mode="wait">
          <motion.div
            key={relatable.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-[12px] text-[var(--muted)]"
          >
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `${isGold ? relatable.color : relatable.colorLight}18` }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isGold ? relatable.color : relatable.colorLight}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={ICON_PATHS[relatable.id]} />
              </svg>
            </div>
            <span>{relatable.label}</span>
          </motion.div>
        </AnimatePresence>
      )}
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
