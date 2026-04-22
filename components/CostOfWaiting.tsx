"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { costOfDelaying, formatNok } from "@/lib/finance";
import type { Goal } from "@/lib/store";

const WARN = "#b05a3a";
const WARN_SOFT = "rgba(176, 90, 58, 0.08)";
const WARN_BORDER = "rgba(176, 90, 58, 0.2)";

type Props = {
  currentAge: number;
  targetAge: number;
  goals: Goal[];
  delayYears: number;
  onDelayChange: (years: number) => void;
};

export function CostOfWaiting({
  currentAge,
  targetAge,
  goals,
  delayYears,
  onDelayChange,
}: Props) {
  const maxDelay = Math.max(1, Math.min(20, targetAge - currentAge - 1));
  const safeDelay = Math.min(Math.max(1, delayYears), maxDelay);

  useEffect(() => {
    if (safeDelay !== delayYears) onDelayChange(safeDelay);
  }, [safeDelay, delayYears, onDelayChange]);

  const result = costOfDelaying({
    currentAge,
    targetAge,
    delayYears: safeDelay,
    contributions: goals,
  });

  if (result.difference <= 0 || maxDelay < 1) return null;

  const ratioPct =
    result.nowAmount > 0
      ? Math.max(0, Math.round((result.delayedAmount / result.nowAmount) * 100))
      : 0;

  // Velg en passende, "menneskelig" sammenligningsfrase
  let ratioPhrase: string;
  if (ratioPct <= 35) ratioPhrase = `bare ~${ratioPct} %`;
  else if (ratioPct <= 55) ratioPhrase = "omtrent halvparten";
  else if (ratioPct <= 70) ratioPhrase = `~${ratioPct} %`;
  else ratioPhrase = `~${ratioPct} %`;

  return (
    <div
      className="rounded-3xl p-3.5"
      style={{ background: WARN_SOFT, border: `1px solid ${WARN_BORDER}` }}
    >
      <div className="text-[12.5px] text-[var(--foreground)] leading-snug">
        Visste du at hvis du venter{" "}
        <span className="font-bold" style={{ color: WARN }}>{safeDelay} år</span>{" "}
        med å begynne sparingen, blir du{" "}
        <span className="font-bold" style={{ color: WARN }}>{ratioPhrase}</span>{" "}
        så rik som om du startet i dag?
      </div>

      <div className="flex items-baseline gap-2 mt-2.5">
        <div className="text-[11px] text-[var(--muted)]">
          Du taper
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={Math.round(result.difference / 1000)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="font-display text-[26px] leading-none font-extrabold tracking-tight tabular-nums"
            style={{ color: WARN }}
          >
            {formatNok(result.difference, { compact: true })}
          </motion.span>
        </AnimatePresence>
        <div className="text-[11px] text-[var(--muted-2)]">
          målt ved {targetAge} år
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="text-[11px] text-[var(--muted)]">
            Utsetter sparingen i
          </div>
          <div className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
            {safeDelay} år
          </div>
        </div>
        <input
          type="range"
          className="slider-gold"
          min={1}
          max={maxDelay}
          step={1}
          value={safeDelay}
          onChange={(e) => onDelayChange(Number(e.target.value))}
          aria-label="Antall år du venter med å starte sparingen"
        />
        <div className="mt-1 flex justify-between text-[10px] text-[var(--muted-2)]">
          <span>1 år</span>
          <span>{maxDelay} år</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-[var(--muted)] leading-snug">
        Tiden er den viktigste ingrediensen — det er rentes-rente du går glipp av.
      </div>
    </div>
  );
}
