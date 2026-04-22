"use client";

import { useMemo, useState, useCallback } from "react";
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
import { GoalsList } from "./GoalsList";
import { CostOfWaiting } from "./CostOfWaiting";
import { track } from "@/lib/analytics";

const DEFAULT_PROJECTION_END = 80;
const ALL_MILESTONES = [25, 30, 40, 50, 60, 70];

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
  const addMilestoneGoal = useFlus((s) => s.addMilestoneGoal);
  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const selectedAge = ui.selectedAge ?? defaultSelectedAge(age);
  const setSelectedAge = (v: number) => setUi({ selectedAge: v });
  const delayYears = ui.delayYears;
  const setDelayYears = (v: number) => setUi({ delayYears: v });

  const [milestoneOpen, setMilestoneOpen] = useState(false);

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

  const lastGoalAge = goals.length > 0 ? goals[goals.length - 1].fromAge : age;
  const milestoneOptions = ALL_MILESTONES.filter(
    (m) => m > lastGoalAge && m > age,
  );
  const hasMilestones = milestoneOptions.length > 0;

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-3">
      {/* 1 — Slider + milestone flow */}
      <div className="mt-1 p-4 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
          Hvis jeg starter med å spare
        </div>
        <SavingsSlider
          value={Math.max(10, initialDaily)}
          onChange={(v) => {
            setInitialDaily(v);
            track("daily_amount_changed", { amount: v });
          }}
          stops={DAILY_STOPS}
          hideRelatable={age > 30}
        />

        {/* Sparemål-liste */}
        {goals.length > 1 && (
          <div className="mt-3 pt-2.5 border-t border-[var(--border)]">
            <GoalsList goals={goals} currentAge={age} />
          </div>
        )}

      </div>

      {/* Milestone prompt — between slider and result card */}
      {hasMilestones && !milestoneOpen && (
        <button
          type="button"
          onClick={() => setMilestoneOpen(true)}
          className="mt-2 w-full text-left text-[11px] text-[var(--muted)] leading-snug px-1"
        >
          Når du blir eldre sparer du sikkert enda mer.{" "}
          <span className="underline text-[var(--primary)] font-medium">
            + Legg til nytt sparemål
          </span>
        </button>
      )}

      {/* Inline milestone picker */}
      <AnimatePresence>
        {milestoneOpen && hasMilestones && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4"
          >
            <MilestonePicker
              options={milestoneOptions}
              previousDaily={goals[goals.length - 1]?.dailyAmount ?? initialDaily}
              onSave={(fromAge, daily) => {
                addMilestoneGoal(fromAge, daily);
                track("milestone_added", { fromAge, daily });
                setMilestoneOpen(false);
              }}
              onCancel={() => setMilestoneOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2 — Hero result card */}
      <div className="mt-3 rounded-3xl bg-[var(--surface)] border border-[var(--border)] px-3 pt-3 pb-2">
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
              Da har <strong className="font-bold text-[var(--foreground)]">{name ? `${name}'s` : "din"} pengebinge</strong> vokst til
            </div>
            <div className="flex items-start gap-0 mt-0.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={Math.round(nominal / 100)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-display text-[34px] font-bold tracking-tight tabular-nums leading-none"
                >
                  {formatNok(nominal, { compact: true })}
                </motion.div>
              </AnimatePresence>
              <InfoTooltip text={`≈ ${formatNok(real, { compact: true })} i dag`} />
            </div>
          </div>
        </div>

        {/* Age selector inline */}
        <div className="mt-2.5 mb-1">
          <AgeTimeline
            currentAge={age}
            selectedAge={selectedAge}
            onChange={setSelectedAge}
          />
        </div>

        <div className="mt-1">
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
            <span className="w-3 h-0 border-t-2 border-dashed border-[var(--gold)]" />
            <span className="text-[var(--muted)]">
              Hvis du venter {delayYears} år
            </span>
          </div>
        )}
      </div>

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

    </div>
  );
}

function MilestonePicker({
  options,
  previousDaily,
  onSave,
  onCancel,
}: {
  options: number[];
  previousDaily: number;
  onSave: (fromAge: number, daily: number) => void;
  onCancel: () => void;
}) {
  const [fromAge, setFromAge] = useState(options[0]);
  const suggestedDaily = Math.max(Math.round(previousDaily * 3), 150);
  const [daily, setDaily] = useState(suggestedDaily);

  return (
    <div className="mt-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold">Nytt sparemål</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          Avbryt
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] text-[var(--muted)] shrink-0">Fra alder</span>
        <div className="flex gap-1.5 flex-wrap">
          {options.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setFromAge(a)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors ${
                fromAge === a
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <SavingsSlider
        value={daily}
        onChange={setDaily}
        min={50}
        max={1000}
        step={10}
        hideRelatable
      />

      <button
        type="button"
        onClick={() => onSave(fromAge, daily)}
        className="mt-3 w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-[13px] font-semibold active:scale-[0.98] transition-transform"
      >
        Lagre
      </button>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShow((s) => !s);
  }, []);

  return (
    <span className="relative ml-1 top-0.5 flex-shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-label="Vis justert verdi"
        className="w-3.5 h-3.5 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-2 h-2">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.5 3a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM7 6.5h2v5H7v-5Z" />
        </svg>
      </button>
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-1 text-[10px] text-[var(--muted)] whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
