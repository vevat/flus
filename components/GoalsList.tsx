"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFlus, type Goal } from "@/lib/store";
import { DEFAULTS, formatNok } from "@/lib/finance";

type Props = {
  goals: Goal[];
  currentAge: number;
};

export function GoalsList({ goals, currentAge }: Props) {
  const removeGoal = useFlus((s) => s.removeGoal);

  if (goals.length <= 1) return null;

  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wide px-1">
        Dine sparemål
      </div>
      <AnimatePresence initial={false}>
        {goals.map((g, idx) => {
          const isFirst = idx === 0;
          const monthly = g.dailyAmount * DEFAULTS.daysPerMonth;
          const label = isFirst ? `Nå (${currentAge} år)` : `Fra ${g.fromAge} år`;
          return (
            <motion.div
              key={g.fromAge}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GoalRow
                label={label}
                daily={g.dailyAmount}
                monthly={monthly}
                canRemove={!isFirst}
                onRemove={() => removeGoal(g.fromAge)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function GoalRow({
  label,
  daily,
  monthly,
  canRemove,
  onRemove,
}: {
  label: string;
  daily: number;
  monthly: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-[var(--muted)] leading-tight">
          {label}
        </div>
        <div className="text-[13px] font-semibold tabular-nums leading-tight">
          {daily} kr/dag
          <span className="text-[var(--muted-2)] font-normal ml-1">
            ≈ {formatNok(monthly)}/mnd
          </span>
        </div>
      </div>
      {canRemove && (
        <AnimatePresence mode="wait">
          {confirming ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-1"
            >
              <button
                type="button"
                onClick={onRemove}
                className="px-2.5 py-1 rounded-lg bg-[var(--gold)] text-white text-[11px] font-semibold"
              >
                Slett
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--muted)] text-[11px] font-semibold"
              >
                Avbryt
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="more"
              type="button"
              onClick={() => setConfirming(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-7 h-7 rounded-full text-[var(--muted-2)] hover:bg-[var(--surface-2)] active:scale-90 transition-transform flex items-center justify-center"
              aria-label="Slett mål"
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
