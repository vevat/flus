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
    id: "top-01",
    emoji: "🏆",
    title: "Du er blant topp 0,1%",
    body: "Gjør du dette nå, investerer du smartere enn 99,9% av befolkningen. De fleste starter aldri. Du har allerede begynt.",
    shouldShow: () => true,
  },
  {
    id: "generational-wealth",
    emoji: "🏛️",
    title: "Generational wealth",
    body: "Du bygger ikke bare for deg selv – du bygger for barna dine, og deres barn. Det starter med én beslutning: å begynne.",
    shouldShow: ({ selectedAge, age }) => selectedAge - age >= 20,
  },
  {
    id: "rule-of-7",
    emoji: "✨",
    title: "Rentes-rente er magisk",
    body: "Pengene dine dobler seg omtrent hvert 9. år. Det betyr at det du sparer nå, er verdt dobbelt før du fyller 25.",
    shouldShow: ({ selectedAge, age }) => selectedAge - age >= 10,
  },
  {
    id: "half-from-interest",
    emoji: "🪄",
    title: "Pengene jobber for deg",
    body: "Over halvparten av formuen din kommer fra avkastning – ikke det du har spart selv. Tid i markedet slår alt.",
    shouldShow: ({ nominal, contributed }) =>
      nominal > 0 && contributed / nominal < 0.5,
  },
  {
    id: "small-amounts",
    emoji: "🌱",
    title: "Små beløp, stor formue",
    body: "Selv 30 kr om dagen blir til hundretusener. Warren Buffett startet med å selge tyggegummi. Det viktigste er å starte.",
    shouldShow: ({ daily }) => daily > 0 && daily < 50,
  },
  {
    id: "sleep-well",
    emoji: "😴",
    title: "Sov godt om natten",
    body: "All Weather-strategien er designet for å tåle alt – krakk, inflasjon, deflasjon. Du trenger ikke stresse når markedet faller.",
    shouldShow: () => true,
  },
  {
    id: "forbes-book",
    emoji: "📖",
    title: "Hyllet av Forbes",
    body: "\"Money: Master the Game\" av Tony Robbins er kalt en av de viktigste bøkene om personlig økonomi. All Weather-strategien er kjernen.",
    shouldShow: () => true,
  },
  {
    id: "inflation",
    emoji: "📉",
    title: "Inflasjon spiser i det stille",
    body: "100 kr i dag er verdt mindre om 10 år. Pengebingen justerer for inflasjon automatisk, slik at du ser den reelle verdien.",
    shouldShow: () => true,
  },
  {
    id: "cant-lose",
    emoji: "🎯",
    title: "Du kan ikke unngå å bli rik",
    body: "Følger du planen over tid, er det matematisk umulig å ikke bygge formue. Rentes rente + tid + lave gebyrer = garantert vekst.",
    shouldShow: ({ selectedAge, age }) => selectedAge - age >= 30,
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
