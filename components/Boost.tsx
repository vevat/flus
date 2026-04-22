"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";
import { track } from "@/lib/analytics";
import { useHoldRepeat } from "@/lib/hooks";
import {
  FREQUENCY_LABELS,
  HACKS,
  type Hack,
  type HackCategory,
  type HackFrequency,
  type HackIconId,
  futureValueOfHack,
  monthlyAmount,
  hackStep,
} from "@/lib/hacks";
import { formatNok } from "@/lib/finance";

const AGE_OPTIONS = [25, 30, 40, 50, 60, 70];

export function Boost() {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const acceptedHacks = useFlus((s) => s.acceptedHacks);
  const toggleHack = useFlus((s) => s.toggleHack);
  const hackAmounts = useFlus((s) => s.hackAmounts);
  const setHackAmount = useFlus((s) => s.setHackAmount);
  const isGold = useFlus((s) => s.theme) === "exclusive";

  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const defaultBoostAge = age >= 60 ? 70 : age >= 40 ? 60 : 50;
  const activeCat = (ui.boostCategory ?? "all") as HackCategory | "all";
  const setActiveCat = (v: HackCategory | "all") => setUi({ boostCategory: v });
  const targetAge = ui.boostTargetAge ?? defaultBoostAge;
  const setTargetAge = (v: number) => setUi({ boostTargetAge: v });

  const getAmount = (h: Hack) => hackAmounts[h.id] ?? h.amount;

  const accepted = useMemo(
    () => HACKS.filter((h) => acceptedHacks.includes(h.id)),
    [acceptedHacks],
  );

  const totals = useMemo(() => {
    let monthly = 0;
    let future = 0;
    for (const h of accepted) {
      const amt = hackAmounts[h.id] ?? h.amount;
      monthly += monthlyAmount(h, amt);
      future += futureValueOfHack({ hack: h, fromAge: age, toAge: targetAge, overrideAmount: amt });
    }
    return { monthly, future };
  }, [accepted, age, targetAge, hackAmounts]);

  const visible = useMemo(() => {
    if (activeCat === "all") return HACKS;
    return HACKS.filter((h) => h.category === activeCat);
  }, [activeCat]);

  const empty = accepted.length === 0;

  return (
    <div className="flex-1 flex flex-col px-5 pt-5 pb-3 gap-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-[22px] font-semibold leading-tight">
          Hvor finner du pengene{name ? `, ${name}` : ""}?
        </h1>
        <p className="text-[13px] text-[var(--muted)] leading-snug mt-1">
          Velg det du faktisk kan kutte eller tjene.
          <br />
          Små beløp blir til store med rentes rente.
        </p>
      </div>

      {/* Sammendrag-kort */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-3">
        {empty ? (
          <div className="text-center py-1">
            <div className="font-display text-[14px] font-semibold">
              Trykk på hackene under
            </div>
            <div className="text-[11px] text-[var(--muted)] mt-0.5">
              Så ser du hva de er verdt i fremtiden
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-wide font-medium">
                Dine valg blir verdt
              </div>
              <div className="text-[11px] text-[var(--muted)]">
                {accepted.length} av {HACKS.length} valgt
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={Math.round(totals.future / 10000)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="font-display text-[32px] leading-none font-bold tracking-tight tabular-nums mt-1"
              >
                {fmtBig(totals.future)}
              </motion.div>
            </AnimatePresence>
            <div className="text-[12.5px] text-[var(--muted)] mt-1.5">
              når du er{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {targetAge} år
              </span>{" "}
              · ≈ {formatNok(totals.monthly, { compact: true })}/mnd
            </div>
          </div>
        )}

        {/* Alder-velger */}
        <div className="flex gap-1 mt-3">
          {AGE_OPTIONS.map((a) => (
            <button
              key={a}
              onClick={() => setTargetAge(a)}
              className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-colors ${
                a === targetAge
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              }`}
            >
              {a} år
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {(
          [
            { key: "all" as const, label: "Alle" },
            { key: "cut" as const, label: "Kutt" },
            { key: "earn" as const, label: "Tjen" },
            { key: "hack" as const, label: "Smarte grep" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCat(tab.key)}
            className={`flex-1 text-[12px] font-semibold py-2 rounded-xl transition-colors ${
              activeCat === tab.key
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hack-liste */}
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {visible.map((hack) => (
            <HackRow
              key={hack.id}
              hack={hack}
              amount={getAmount(hack)}
              on={acceptedHacks.includes(hack.id)}
              fromAge={age}
              toAge={targetAge}
              isGold={isGold}
              onToggle={() => {
                toggleHack(hack.id);
                track("hack_toggled", { hack: hack.id, category: hack.category });
              }}
              onAdjust={(amt) => setHackAmount(hack.id, amt)}
            />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ---------- Icon paths ---------- */

const ICON_PATHS: Record<HackIconId, ReactNode> = {
  zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  sandwich: <><path d="M3 11h18M5 11V8a7 7 0 0114 0v3" /><path d="M3 11l1 7a2 2 0 002 2h12a2 2 0 002-2l1-7" /></>,
  droplet: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />,
  tv: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  gamepad: <><path d="M6 12h4M8 10v4" /><circle cx="15" cy="11" r="0.5" fill="currentColor" /><circle cx="17" cy="13" r="0.5" fill="currentColor" /><path d="M2 12a4 4 0 004 4h2l2 3 2-3h2a4 4 0 004-4V9a4 4 0 00-4-4H6a4 4 0 00-4 4z" /></>,
  dice: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="0.5" fill="currentColor" /><circle cx="15.5" cy="8.5" r="0.5" fill="currentColor" /><circle cx="12" cy="12" r="0.5" fill="currentColor" /><circle cx="8.5" cy="15.5" r="0.5" fill="currentColor" /><circle cx="15.5" cy="15.5" r="0.5" fill="currentColor" /></>,
  ban: <><circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" /></>,
  cart: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 01-8 0" /></>,
  shirt: <><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.88v.7c0 .7.46 1.32 1.13 1.52L8 9l-1 11h10L16 9l4.59-1.44a1.6 1.6 0 001.13-1.52v-.7a2 2 0 00-1.34-1.88z" /></>,
  baby: <><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 10-16 0" /></>,
  dog: <><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 0 3 1 3s1.5-1 1.5-1" /><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217 0 3-1 3s-1.5-1-1.5-1" /><path d="M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" /><path d="M4.42 11.247A13.152 13.152 0 004 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 00-.493-3.309" /></>,
  snowflake: <><path d="M12 2v20M17 7l-10 10M2 12h20M7 7l10 10M17 17l-2-5h4M7 7l2 5H5M12 2l3 5h-6M12 22l-3-5h6M2 12l5-3v6M22 12l-5 3v-6" /></>,
  bike: <><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 100-2 1 1 0 000 2zM12 17.5V14l-3-3 4-3 2 3h3" /></>,
  gem: <><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20M12 22L6 9M12 22l6-13M12 2l-4 7M12 2l4 7" /></>,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><rect x="5" y="12" width="14" height="8" rx="1" /><path d="M12 8v12M3 12h18" /><path d="M7.5 8C6.5 6 8 4 9.5 4c1.5 0 2.5 2 2.5 4M16.5 8c1-2-.5-4-2-4s-2.5 2-2.5 4" /></>,
  utensils: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></>,
  recycle: <><path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" /><path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.009-1.78L16.8 9.5" /><path d="M12 5l3.96 6.84M6.04 11.84L12 5" /><path d="M2 15l4 4 4-4M18 15l4 4-4 4M12 2l3 5H9l3-5" /></>,
  noodles: <><path d="M4 12c0 4.42 3.58 8 8 8s8-3.58 8-8" /><path d="M5 4v4c0 2.21 1.79 4 4 4" /><path d="M9 4v8" /><path d="M13 4v8" /><path d="M17 4v4c0 2.21 1.79 4 4 4" /><path d="M12 20v2" /></>,
  coffee: <><path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" /><path d="M6 2v3M10 2v3M14 2v3" /></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3M2 13h20" /></>,
};

function HackIcon({ icon, color }: { icon: HackIconId; color: string }) {
  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: `${color}18` }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5"
      >
        {ICON_PATHS[icon]}
      </svg>
    </div>
  );
}

/* ---------- Hack-rad ---------- */

function HackRow({
  hack,
  amount,
  on,
  fromAge,
  toAge,
  isGold,
  onToggle,
  onAdjust,
}: {
  hack: Hack;
  amount: number;
  on: boolean;
  fromAge: number;
  toAge: number;
  isGold: boolean;
  onToggle: () => void;
  onAdjust: (amount: number) => void;
}) {
  const future = futureValueOfHack({ hack, fromAge, toAge, overrideAmount: amount });
  const step = hackStep(hack);
  const isCustom = amount !== hack.amount;
  const iconColor = isGold ? hack.iconColor : hack.iconColorLight;

  return (
    <motion.div layout className="flex flex-col">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={`text-left rounded-2xl px-3 py-2 border transition-colors ${
          on
            ? "bg-[var(--primary-soft)] border-[var(--primary-strong)]/25"
            : "bg-[var(--surface)] border-[var(--border)]"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              on
                ? "bg-[var(--primary)] border-[var(--primary)]"
                : "bg-transparent border-[var(--muted-2)]"
            }`}
          >
            {on && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <path d="M5 12l5 5L20 7" />
              </motion.svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HackIcon icon={hack.icon} color={iconColor} />
                <span className="font-display font-semibold text-[14px] leading-tight">
                  {hack.title}
                </span>
              </div>
            </div>
            <div className="text-[12px] text-[var(--muted)] leading-snug mt-0.5 ml-9">
              {hack.blurb}
            </div>

            <HackAdjuster
              amount={amount}
              step={step}
              isCustom={isCustom}
              frequency={hack.frequency}
              future={future}
              onAdjust={onAdjust}
            />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

function HackAdjuster({
  amount,
  step,
  isCustom,
  frequency,
  future,
  onAdjust,
}: {
  amount: number;
  step: number;
  isCustom: boolean;
  frequency: HackFrequency;
  future: number;
  onAdjust: (v: number) => void;
}) {
  const dec = useHoldRepeat(
    useCallback(() => onAdjust(amount - step), [onAdjust, amount, step]),
  );
  const inc = useHoldRepeat(
    useCallback(() => onAdjust(amount + step), [onAdjust, amount, step]),
  );
  const hint = dec.showHint || inc.showHint;

  return (
    <div className="mt-1.5 ml-9">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            {...dec.handlers}
            onPointerDown={(e) => { e.stopPropagation(); dec.handlers.onPointerDown(); }}
            className="w-5 h-5 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-90 transition-transform select-none touch-none"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-2.5 h-2.5"><path d="M5 12h14" /></svg>
          </button>
          <span className={`text-[12px] font-bold tabular-nums min-w-[48px] text-center ${isCustom ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
            {amount} kr
            <span className="font-medium text-[var(--muted)] text-[10px]">
              {FREQUENCY_LABELS[frequency]}
            </span>
          </span>
          <button
            type="button"
            {...inc.handlers}
            onPointerDown={(e) => { e.stopPropagation(); inc.handlers.onPointerDown(); }}
            className="w-5 h-5 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] active:scale-90 transition-transform select-none touch-none"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-2.5 h-2.5"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
        <span className="text-[11px] font-semibold text-[var(--primary-strong)] tabular-nums">
          Verdt {fmtBig(future)}
        </span>
      </div>
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-[var(--muted-2)] text-left mt-0.5"
          >
            Hold inne for å gå raskere
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function fmtBig(amount: number): string {
  if (!isFinite(amount) || amount <= 0) return "0 kr";
  const m = amount / 1_000_000;
  if (m >= 0.1) {
    const d = m < 10 ? 1 : 0;
    return `${m.toLocaleString("nb-NO", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    })} mill`;
  }
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)} 000 kr`;
  }
  return `${Math.round(amount)} kr`;
}
