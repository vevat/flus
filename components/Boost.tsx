"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlus } from "@/lib/store";
import { track } from "@/lib/analytics";
import {
  FREQUENCY_LABELS,
  HACKS,
  type Hack,
  type HackCategory,
  futureValueOfHack,
  monthlyAmount,
} from "@/lib/hacks";
import { formatNok } from "@/lib/finance";

const AGE_OPTIONS = [25, 30, 40, 50, 60, 70];

export function Boost() {
  const name = useFlus((s) => s.name);
  const age = useFlus((s) => s.age);
  const acceptedHacks = useFlus((s) => s.acceptedHacks);
  const toggleHack = useFlus((s) => s.toggleHack);

  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const defaultBoostAge = age >= 60 ? 70 : age >= 40 ? 60 : 50;
  const activeCat = (ui.boostCategory ?? "all") as HackCategory | "all";
  const setActiveCat = (v: HackCategory | "all") => setUi({ boostCategory: v });
  const targetAge = ui.boostTargetAge ?? defaultBoostAge;
  const setTargetAge = (v: number) => setUi({ boostTargetAge: v });

  const accepted = useMemo(
    () => HACKS.filter((h) => acceptedHacks.includes(h.id)),
    [acceptedHacks],
  );

  const totals = useMemo(() => {
    let monthly = 0;
    let future = 0;
    for (const h of accepted) {
      monthly += monthlyAmount(h);
      future += futureValueOfHack({ hack: h, fromAge: age, toAge: targetAge });
    }
    return { monthly, future };
  }, [accepted, age, targetAge]);

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
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
        {empty ? (
          <div className="text-center py-2">
            <div className="text-3xl mb-2">👇</div>
            <div className="font-display text-[15px] font-semibold">
              Trykk på hackene under
            </div>
            <div className="text-[12px] text-[var(--muted)] mt-0.5">
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
              on={acceptedHacks.includes(hack.id)}
              fromAge={age}
              toAge={targetAge}
              onToggle={() => {
                toggleHack(hack.id);
                track("hack_toggled", { hack: hack.id, category: hack.category });
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="text-[11px] text-[var(--muted)] leading-snug px-1 mt-1">
        Regnet med 7 % årlig avkastning og 2,5 % inflasjon.
      </p>
    </div>
  );
}

/* ---------- Hack-rad ---------- */

function HackRow({
  hack,
  on,
  fromAge,
  toAge,
  onToggle,
}: {
  hack: Hack;
  on: boolean;
  fromAge: number;
  toAge: number;
  onToggle: () => void;
}) {
  const future = futureValueOfHack({ hack, fromAge, toAge });

  return (
    <motion.button
      layout
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`text-left rounded-2xl px-3.5 py-3 border transition-colors ${
        on
          ? "bg-[var(--primary-soft)] border-[var(--primary-strong)]/25"
          : "bg-[var(--surface)] border-[var(--border)]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle-indikator */}
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
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px]">{hack.emoji}</span>
              <span className="font-display font-semibold text-[14px] leading-tight">
                {hack.title}
              </span>
            </div>
            <span className="text-[11px] font-bold tabular-nums shrink-0 text-[var(--foreground)]">
              {hack.amount} kr
              <span className="font-medium text-[var(--muted)]">
                {FREQUENCY_LABELS[hack.frequency]}
              </span>
            </span>
          </div>
          <div className="text-[12px] text-[var(--muted)] leading-snug mt-0.5">
            {hack.blurb}
          </div>
          <div className="text-[11px] font-semibold text-[var(--primary-strong)] tabular-nums mt-1.5">
            Verdt {fmtBig(future)} når du er {toAge}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function fmtBig(amount: number): string {
  if (!isFinite(amount) || amount <= 0) return "0 kr";
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    const d = m < 10 ? 1 : 0;
    return `${m.toLocaleString("nb-NO", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    })} mill`;
  }
  if (amount >= 1000) return `${Math.round(amount / 1000)} k`;
  return `${Math.round(amount)} kr`;
}
