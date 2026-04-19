"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useFlus } from "@/lib/store";

export type Tip = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  /** Returnerer true hvis tipset er relevant for nåværende kontekst */
  shouldShow: (ctx: TipContext) => boolean;
};

export type TipContext = {
  age: number;
  selectedAge: number;
  daily: number;
  nominal: number;
  contributed: number;
};

const TIPS: Tip[] = [
  {
    id: "inflation",
    emoji: "📉",
    title: "Inflasjon spiser litt hvert år",
    body: "100 kr i dag er verdt mindre om 10 år. Vi har lagt inn 2,5% inflasjon, og øker sparingen din litt hvert år automatisk.",
    shouldShow: () => true,
  },
  {
    id: "rule-of-7",
    emoji: "✨",
    title: "Rentes-rente er magisk",
    body: "Pengene dine dobler seg omtrent hvert 10. år når du sparer i fond. Med høyere avkastning, enda raskere.",
    shouldShow: ({ selectedAge, age }) => selectedAge - age >= 10,
  },
  {
    id: "half-from-interest",
    emoji: "🪄",
    title: "Halvparten kommer fra renter",
    body: "Når du blir eldre, kommer det meste av pengene dine fra avkastningen - ikke det du har spart selv. Det er derfor det lønner seg å starte tidlig.",
    shouldShow: ({ nominal, contributed }) =>
      nominal > 0 && contributed / nominal < 0.5,
  },
  {
    id: "small-amounts",
    emoji: "🌱",
    title: "Små beløp blir store",
    body: "Selv 30 kr om dagen blir til hundretusener over tid. Det viktigste er å begynne, og holde ut.",
    shouldShow: ({ daily }) => daily > 0 && daily < 50,
  },
];

type Props = {
  context: TipContext;
};

export function TipCarousel({ context }: Props) {
  const seenTips = useFlus((s) => s.seenTips);
  const markTipSeen = useFlus((s) => s.markTipSeen);

  const eligible = useMemo(
    () => TIPS.filter((t) => t.shouldShow(context)),
    [context],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [eligible.length]);

  if (eligible.length === 0) return null;

  const tip = eligible[index % eligible.length];

  const next = () => {
    markTipSeen(tip.id);
    setIndex((i) => (i + 1) % eligible.length);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.button
        key={tip.id}
        type="button"
        onClick={next}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="w-full text-left rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 active:scale-[0.99] transition-transform"
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5" aria-hidden>
            {tip.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[15px] mb-0.5">{tip.title}</div>
            <p className="text-[13px] text-[var(--muted)] leading-snug">
              {tip.body}
            </p>
          </div>
        </div>
        {eligible.length > 1 && (
          <div className="mt-3 flex gap-1 justify-center">
            {eligible.map((t, i) => (
              <span
                key={t.id}
                className={`h-1 rounded-full transition-all ${
                  i === index % eligible.length
                    ? "w-4 bg-[var(--foreground)]"
                    : "w-1.5 bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        )}
      </motion.button>
    </AnimatePresence>
  );
}
