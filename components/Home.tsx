"use client";

import { useMemo, useState } from "react";
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
import { ShareSheet } from "./ShareSheet";
import { track } from "@/lib/analytics";

const DEFAULT_PROJECTION_END = 80;
const ALL_MILESTONES = [25, 30, 40, 50, 60, 70];

// 40–100 à 10, 125–400 à 25, 500–1000 à 100
const DAILY_STOPS = [
  ...Array.from({ length: 7 }, (_, i) => 40 + i * 10),   // 40..100
  ...Array.from({ length: 12 }, (_, i) => 125 + i * 25),  // 125..400
  ...Array.from({ length: 6 }, (_, i) => 500 + i * 100),  // 500..1000
];

/** Standard alder å vise verdi for. 50 år er en fin balanse mellom
 *  "innen pensjon" og "fortsatt overskuelig tidshorisont". */
function defaultSelectedAge(currentAge: number): number {
  if (currentAge >= 50) return Math.min(80, currentAge + 20);
  return 50;
}

export function Home() {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const avatar = useFlus((s) => s.avatar);
  const goals = useFlus((s) => s.goals);
  const setInitialDaily = useFlus((s) => s.setInitialDaily);
  const addMilestoneGoal = useFlus((s) => s.addMilestoneGoal);
  const reset = useFlus((s) => s.reset);

  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const selectedAge = ui.selectedAge ?? defaultSelectedAge(age);
  const setSelectedAge = (v: number) => setUi({ selectedAge: v });
  const delayYears = ui.delayYears;
  const setDelayYears = (v: number) => setUi({ delayYears: v });

  const [showShare, setShowShare] = useState(false);
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

  // Neste tilgjengelige milepæl - alltid neste over alder OG over siste mål
  const lastGoalAge = goals.length > 0 ? goals[goals.length - 1].fromAge : age;
  const nextMilestone = ALL_MILESTONES.find((m) => m > lastGoalAge && m > age);
  const milestoneOptions = ALL_MILESTONES.filter(
    (m) => m > lastGoalAge && m > age,
  );

  return (
    <div className="flex-1 flex flex-col px-5 pt-4 pb-3">
      {/* Topp - kompakt */}
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-[var(--muted)]">
          Hei <span className="font-semibold text-[var(--foreground)]">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowShare(true);
              track("share_opened");
            }}
            className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
            aria-label="Del"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Er du sikker på at du vil starte på nytt? All data slettes.")) {
                reset();
              }
            }}
            className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-95 transition-transform"
            aria-label="Start på nytt"
            title="Start på nytt"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        </div>
      </div>

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
          value={Math.max(40, initialDaily)}
          onChange={(v) => {
            setInitialDaily(v);
            track("daily_amount_changed", { amount: v });
          }}
          stops={DAILY_STOPS}
        />
      </div>

      {/* Sparemål-liste */}
      {goals.length > 1 && (
        <div className="mt-3">
          <GoalsList goals={goals} currentAge={age} />
        </div>
      )}

      {/* Milepæl-knapp */}
      {nextMilestone !== undefined && (
        <button
          type="button"
          onClick={() => setMilestoneOpen(true)}
          className="mt-2.5 w-full py-2.5 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] text-[13px] text-[var(--muted)] active:scale-[0.99] transition-transform"
        >
          + Sett nytt sparemål når jeg blir eldre
        </button>
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

      {/* Milestone modal */}
      <AnimatePresence>
        {milestoneOpen && milestoneOptions.length > 0 && (
          <MilestoneModal
            onClose={() => setMilestoneOpen(false)}
            onSave={(fromAge, daily) => {
              addMilestoneGoal(fromAge, daily);
              track("milestone_added", { fromAge, daily });
              setMilestoneOpen(false);
            }}
            options={milestoneOptions}
            currentDaily={initialDaily}
            previousDaily={
              goals[goals.length - 1]?.dailyAmount ?? initialDaily
            }
          />
        )}
      </AnimatePresence>

      {/* Share sheet */}
      <AnimatePresence>
        {showShare && (
          <ShareSheet
            onClose={() => setShowShare(false)}
            shareText={`Visste du at ${initialDaily} kr om dagen kan bli til ${formatNok(nominal, { compact: true })} innen du er ${selectedAge}? Sjekk hva din sparing kan bli til!`}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

function MilestoneModal({
  onClose,
  onSave,
  options,
  previousDaily,
}: {
  onClose: () => void;
  onSave: (fromAge: number, daily: number) => void;
  options: number[];
  currentDaily: number;
  previousDaily: number;
}) {
  const [fromAge, setFromAge] = useState(options[0]);
  const [daily, setDaily] = useState(
    Math.max(Math.round(previousDaily * 3), 150),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="w-full max-w-md bg-[var(--background)] rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-5" />
        <div className="font-display text-2xl font-semibold">
          Nytt sparemål
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Når du er i jobb sparer du gjerne mer. Sett et nytt mål og se hvordan
          prognosen endrer seg.
        </p>

        <div className="mt-5">
          <div className="text-sm text-[var(--muted)] mb-2">Fra alder</div>
          <div className="flex gap-2 flex-wrap">
            {options.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFromAge(a)}
                className={`flex-1 min-w-[50px] py-2.5 rounded-xl font-semibold transition-colors ${
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

        <div className="mt-5">
          <SavingsSlider
            value={daily}
            onChange={setDaily}
            min={50}
            max={1000}
            step={10}
            label="Nytt daglig sparebeløp"
          />
        </div>

        <button
          type="button"
          onClick={() => onSave(fromAge, daily)}
          className="mt-6 w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-semibold active:scale-[0.98] transition-transform"
        >
          Lagre
        </button>
      </motion.div>
    </motion.div>
  );
}

