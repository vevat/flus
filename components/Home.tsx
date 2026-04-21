"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";
import {
  formatNok,
  getAtAge,
  projectWealth,
} from "@/lib/finance";
import { Avatar, wealthLevelFromAmount } from "./Avatar";
import { SavingsSlider } from "./SavingsSlider";
import { AgeTimeline } from "./AgeTimeline";
import { WealthChart } from "./WealthChart";
import { TipCarousel } from "./TipCard";
import { GoalsList } from "./GoalsList";
import { CostOfWaiting } from "./CostOfWaiting";
import { track } from "@/lib/analytics";

const DEFAULT_PROJECTION_END = 80;

// 40–100 à 10, 125–400 à 25, 500–1000 à 100
const DAILY_STOPS = [
  ...Array.from({ length: 4 }, (_, i) => 10 + i * 10),    // 10..40
  ...Array.from({ length: 6 }, (_, i) => 50 + i * 10),    // 50..100
  ...Array.from({ length: 12 }, (_, i) => 125 + i * 25),  // 125..400
  ...Array.from({ length: 6 }, (_, i) => 500 + i * 100),  // 500..1000
];

function defaultSelectedAge(currentAge: number): number {
  if (currentAge >= 50) return 80;
  if (currentAge >= 30) return 70;
  if (currentAge >= 20) return 60;
  return 50;
}

export function Home() {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const avatar = useFlus((s) => s.avatar);
  const goals = useFlus((s) => s.goals);
  const setInitialDaily = useFlus((s) => s.setInitialDaily);
  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const selectedAge = ui.selectedAge ?? defaultSelectedAge(age);
  const setSelectedAge = (v: number) => setUi({ selectedAge: v });
  const delayYears = ui.delayYears;
  const setDelayYears = (v: number) => setUi({ delayYears: v });

  const initialDaily = goals[0]?.dailyAmount ?? 50;

  const projection = useMemo(
    () =>
      projectWealth({
        currentAge: age,
        endAge: DEFAULT_PROJECTION_END,
        contributions: goals,
      }),
    [age, goals],
  );

  const delayedProjection = useMemo(
    () =>
      projectWealth({
        currentAge: age,
        endAge: DEFAULT_PROJECTION_END,
        contributions: goals.map((g) => ({
          ...g,
          fromAge: g.fromAge + delayYears,
        })),
      }),
    [age, goals, delayYears],
  );

  const point = getAtAge(projection, selectedAge);
  const nominal = point?.nominal ?? 0;
  const real = point?.real ?? 0;
  const contributed = point?.contributed ?? 0;

  const wealthLevel = wealthLevelFromAmount(nominal);

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-3">
      {/* Topp - kompakt */}
      {/* Hero: avatar + stort tall + graf */}
      <div className="mt-2 rounded-3xl bg-[var(--surface)] border border-[var(--border)] px-3 pt-3 pb-2">
        <div className="flex items-center gap-3">
          {avatar && (
            <motion.div
              key={`${avatar}-${wealthLevel}`}
              initial={{ scale: 0.92, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="flex-shrink-0"
            >
              <Avatar id={avatar} size={48} level={wealthLevel} />
            </motion.div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Når du er {selectedAge} år har <strong className="font-bold text-[var(--foreground)]">{name ? `${name}'s` : "din"} Holding</strong> vokst til
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={Math.round(nominal / 100)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="font-display text-[34px] font-bold tracking-tight tabular-nums leading-none mt-0.5"
              >
                {formatNok(nominal, { compact: true })}
              </motion.div>
            </AnimatePresence>
            <div className="text-[11px] text-[var(--muted)] mt-1">
              ≈ {formatNok(real, { compact: true })} i dagens kjøpekraft
            </div>
          </div>
        </div>

        <div className="mt-2">
          <WealthChart
            data={projection}
            delayedData={delayedProjection}
            selectedAge={selectedAge}
            delayYears={delayYears}
            height={210}
          />
        </div>

        {delayYears > 0 && (
          <div className="mt-1 flex items-center justify-end gap-1.5 text-[11px]">
            <span
              className="w-3 h-0 border-t-2 border-dashed border-[var(--gold)]"
            />
            <span className="text-[var(--muted)]">
              Hvis du venter {delayYears} år
            </span>
          </div>
        )}
      </div>

      {/* Tidslinje - milepæl-knapper */}
      <div className="mt-2">
        <AgeTimeline
          currentAge={age}
          selectedAge={selectedAge}
          onChange={setSelectedAge}
        />
      </div>

      {/* Sparing-slider (sentral) */}
      <div className="mt-3 p-4 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
        <SavingsSlider
          value={Math.max(10, initialDaily)}
          onChange={(v) => {
            setInitialDaily(v);
            track("daily_amount_changed", { amount: v });
          }}
          stops={DAILY_STOPS}
          hideRelatable={age > 30}
        />
      </div>

      {/* Sparemål-liste */}
      {goals.length > 1 && (
        <div className="mt-3">
          <GoalsList goals={goals} currentAge={age} />
        </div>
      )}

      {/* Kostnaden av å vente */}
      <div className="mt-3">
        <CostOfWaiting
          currentAge={age}
          targetAge={selectedAge}
          goals={goals}
          delayYears={delayYears}
          onDelayChange={setDelayYears}
        />
      </div>

      {/* Tips */}
      <div className="mt-3">
        <TipCarousel
          context={{
            age,
            selectedAge,
            daily: initialDaily,
            nominal,
            contributed,
          }}
        />
      </div>

    </div>
  );
}

