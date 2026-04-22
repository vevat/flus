"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";
import {
  formatNok,
  projectStairStepped,
  solveStairSteppedSavings,
  solveStairSteppedWithOverrides,
} from "@/lib/finance";
import { WealthChart } from "./WealthChart";

const TARGET_AGE_OPTIONS = [25, 30, 40, 50, 60, 70, 80];
const STEP = 500;

export function GoalReverse() {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);

  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const defaultGoalAge = (() => {
    const candidates = TARGET_AGE_OPTIONS.filter((a) => a > age);
    return candidates.find((a) => a >= age + 30) ?? candidates[candidates.length - 1] ?? age + 1;
  })();
  const targetMillions = ui.goalMillions ?? 10;
  const setTargetMillions = (v: number) => setUi({ goalMillions: v });
  const targetAge = ui.goalTargetAge ?? defaultGoalAge;
  const setTargetAge = (v: number) => setUi({ goalTargetAge: v });

  const targetAmount = targetMillions * 1_000_000;

  // Den foreslåtte trappetrinn-planen for målet
  const suggestion = useMemo(
    () =>
      solveStairSteppedSavings({
        currentAge: age,
        targetAge,
        targetAmount,
      }),
    [age, targetAge, targetAmount],
  );

  // Brukerens overstyringer per stage (key = fromAge)
  const [overrides, setOverrides] = useState<Record<number, number>>({});

  // Når målet eller tidshorisonten endres, nullstill overstyringer
  useEffect(() => {
    setOverrides({});
  }, [targetMillions, targetAge, age]);

  const effectiveStages = useMemo(() => {
    const hasOverrides = Object.keys(overrides).length > 0;
    if (!hasOverrides) {
      return suggestion.stages.map((s) => ({
        ...s,
        monthlyToday: roundNice(s.monthlyToday),
      }));
    }
    return solveStairSteppedWithOverrides({
      currentAge: age,
      targetAge,
      targetAmount,
      overrides,
    }).map((s) => ({
      ...s,
      monthlyToday: s.fromAge in overrides
        ? s.monthlyToday
        : roundNice(s.monthlyToday),
    }));
  }, [suggestion.stages, overrides, age, targetAge, targetAmount]);

  const monthlyByAge = useMemo(() => {
    const map = new Map<number, number>();
    effectiveStages.forEach((s) => {
      for (let a = s.fromAge; a < s.toAge; a++) map.set(a, s.monthlyToday);
    });
    return (a: number) => map.get(a) ?? 0;
  }, [effectiveStages]);

  const projection = useMemo(
    () =>
      projectStairStepped({
        currentAge: age,
        targetAge,
        monthlyByAge,
      }),
    [age, targetAge, monthlyByAge],
  );

  const reachedAmount = projection[projection.length - 1]?.nominal ?? 0;
  const reachedPct = targetAmount > 0 ? (reachedAmount / targetAmount) * 100 : 0;
  const totalContributed = effectiveStages.reduce(
    (sum, s) => sum + (s.toAge - s.fromAge) * 12 * s.monthlyToday,
    0,
  );

  const sliderPct = ((targetMillions - 1) / (100 - 1)) * 100;

  const adjustStage = (fromAge: number, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    setOverrides((prev) => ({ ...prev, [fromAge]: next }));
  };

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-3 gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
          Sett et mål
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight">
          Hvor stor formue vil du ha{name ? `, ${name}` : ""}?
        </h1>
      </div>

      {/* Målbeløp */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm text-[var(--muted)] font-medium">
            Målet mitt
          </span>
          <span className="text-[11px] text-[var(--muted-2)]">1 – 100 mill</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={targetMillions}
              initial={{ scale: 0.92, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="font-display text-5xl font-bold tracking-tight tabular-nums text-[var(--primary-strong)]"
            >
              {targetMillions}
            </motion.span>
          </AnimatePresence>
          <span className="text-2xl font-semibold text-[var(--muted)]">
            mill kr
          </span>
        </div>

        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[var(--primary)]"
            style={{ width: `${sliderPct}%` }}
          />
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={targetMillions}
            onChange={(e) => setTargetMillions(Number(e.target.value))}
            aria-label="Målbeløp i millioner"
          />
        </div>

        <div className="mt-1.5 flex justify-between text-[10px] text-[var(--muted-2)]">
          <span>1 mill</span>
          <span>100 mill</span>
        </div>
      </div>

      {/* Innen jeg er X år */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-sm text-[var(--muted)] font-medium">
            Innen jeg er
          </span>
          <span className="text-[11px] text-[var(--muted-2)]">
            Du er {age} år nå
          </span>
        </div>

        <div className="flex justify-between gap-1.5 flex-wrap">
          {TARGET_AGE_OPTIONS.filter((a) => a > age).map((a) => {
            const active = targetAge === a;
            return (
              <motion.button
                key={a}
                type="button"
                onClick={() => setTargetAge(a)}
                whileTap={{ scale: 0.92 }}
                className={`flex-1 min-w-[44px] py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--surface-2)] text-[var(--muted)]"
                }`}
              >
                {a} år
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Resultat: graf + trappetrinn */}
      {suggestion.feasible && effectiveStages.length > 0 && (
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Du oppnår
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={Math.round(reachedAmount / 100_000)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`font-display text-3xl font-bold tracking-tight tabular-nums leading-none mt-0.5 ${
                    reachedPct >= 99 ? "text-[var(--primary-strong)]" : ""
                  }`}
                >
                  {formatNok(reachedAmount, { compact: true })}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Mål
              </div>
              <div className="font-display text-base font-semibold tabular-nums text-[var(--gold)]">
                {formatNok(targetAmount, { compact: true })}
              </div>
            </div>
          </div>

          {/* Grafen */}
          <div className="mt-2">
            <WealthChart
              data={projection}
              selectedAge={targetAge}
              targetValue={targetAmount}
              height={185}
            />
          </div>

          <div className="mt-1 flex items-center justify-end gap-1.5 text-[11px]">
            <span className="w-3 h-0 border-t-2 border-dashed border-[var(--gold)]" />
            <span className="text-[var(--muted)]">Målet ditt</span>
          </div>

          {/* Trappetrinn med +/- knapper */}
          <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2.5">
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Slik kommer du dit
            </div>
            {effectiveStages.map((stage, idx) => {
              const ageRange =
                stage.toAge - stage.fromAge === 1
                  ? `${stage.fromAge} år`
                  : `${stage.fromAge} – ${stage.toAge - 1} år`;
              const years = stage.toAge - stage.fromAge;
              return (
                <motion.div
                  key={`${stage.fromAge}-${stage.toAge}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.22 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--primary-soft)] text-[var(--primary-strong)] text-xs font-bold flex items-center justify-center tabular-nums">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-[var(--foreground)]">
                      Når du er <strong>{ageRange}</strong>
                    </div>
                    <div className="text-[10px] text-[var(--muted-2)]">
                      {years} år · per måned
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        adjustStage(stage.fromAge, stage.monthlyToday, -STEP)
                      }
                      disabled={stage.monthlyToday <= 0}
                      className="w-7 h-7 rounded-lg bg-[var(--surface-2)] text-[var(--muted)] font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30 disabled:active:scale-100"
                      aria-label="Reduser med 500"
                    >
                      −
                    </button>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={Math.round(stage.monthlyToday)}
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.15 }}
                        className="font-display text-sm font-bold tracking-tight tabular-nums text-right min-w-[64px]"
                      >
                        {formatNok(stage.monthlyToday)}
                      </motion.div>
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() =>
                        adjustStage(stage.fromAge, stage.monthlyToday, STEP)
                      }
                      className="w-7 h-7 rounded-lg bg-[var(--surface-2)] text-[var(--muted)] font-bold flex items-center justify-center active:scale-90 transition-transform"
                      aria-label="Øk med 500"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {Object.keys(overrides).length > 0 && (
              <button
                type="button"
                onClick={() => setOverrides({})}
                className="w-full text-center text-[11px] text-[var(--muted)] py-1 active:scale-[0.99] transition-transform"
              >
                ↺ Tilbakestill til foreslått plan
              </button>
            )}
          </div>

          {/* Oppsummering */}
          <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1.5">
            <Row
              label="Du betaler inn totalt"
              value={formatNok(totalContributed, { compact: true })}
            />
            <Row
              label="Rentes-rente jobber for deg"
              value={`+ ${formatNok(Math.max(0, reachedAmount - totalContributed), { compact: true })}`}
              gold
            />
          </div>
        </div>
      )}

      {/* Footer-tekst */}
      <div className="text-[11px] text-[var(--muted)] leading-snug px-1">
        Tallene øker automatisk med inflasjon (~2,5 %/år) slik at kjøpekraften
        holdes. Forventet avkastning 7 %/år bygger på{" "}
        <Link
          href="/plassere#strategi"
          className="text-[var(--primary)] underline font-medium"
        >
          All Weather-strategien
        </Link>{" "}
        — en bredt diversifisert portefølje som tåler både opp- og nedgangstider.
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  gold,
}: {
  label: string;
  value: string;
  gold?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] text-[var(--muted)]">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          gold ? "text-[var(--gold)]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/** Rund av månedsbeløp pent (nærmeste 50/100/500 alt etter størrelse) */
function roundNice(v: number): number {
  if (v < 1000) return Math.round(v / 50) * 50;
  if (v < 10_000) return Math.round(v / 100) * 100;
  if (v < 100_000) return Math.round(v / 500) * 500;
  return Math.round(v / 1000) * 1000;
}
