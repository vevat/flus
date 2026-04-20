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
    id: "cant-lose",
    emoji: "🎯",
    title: "Du kan ikke unngå å bli rik",
    body: "Følger du planen over tid, er det matematisk umulig å ikke bygge formue. Rentes rente + tid + lave gebyrer = garantert vekst.",
    shouldShow: () => true,
  },
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
    body: "Du bygger ikke bare for deg selv – du bygger en hel familie-formue. Det starter med én beslutning: å begynne.",
    shouldShow: () => true,
  },
  {
    id: "rule-of-7",
    emoji: "✨",
    title: "Rentes rente – verdens 8. underverk",
    body: "\"Rentes rente er det kraftigste i universet\" – Albert Einstein. Pengene dine dobler seg omtrent hvert 9. år. Start nå, og tiden gjør jobben.",
    shouldShow: () => true,
  },
  {
    id: "time-in-market",
    emoji: "⏳",
    title: "Pengene jobber for deg",
    body: "\"Time in the market beats timing the market.\" Over halvparten av formuen din kommer fra avkastning – ikke det du sparer selv. De som selger seg ut og prøver å kjøpe tilbake billig, taper nesten alltid. Ingen slår markedet over tid.",
    shouldShow: () => true,
  },
  {
    id: "sleep-well",
    emoji: "😴",
    title: "Sov godt om natten",
    body: "All Weather-strategien er designet for å tåle alt – krakk, inflasjon, deflasjon. Du trenger ikke stresse når markedet faller.",
    shouldShow: () => true,
  },
  {
    id: "inflation",
    emoji: "📉",
    title: "Inflasjon spiser i det stille",
    body: "Legger du sparepengene i banken, taper du kjøpekraft hvert eneste år. Over tid går du glipp av millioner. Invester – ikke la pengene råtne.",
    shouldShow: () => true,
  },
  {
    id: "forbes-book",
    emoji: "📖",
    title: "Hyllet av Forbes",
    body: "\"Money: Master the Game\" av Tony Robbins er kalt en av de viktigste bøkene om personlig økonomi noensinne. All Weather-strategien er kjernen.",
    shouldShow: () => true,
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
