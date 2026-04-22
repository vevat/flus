"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useFlus } from "@/lib/store";

export type Tip = {
  id: string;
  icon: ReactNode;
  title: string;
  body: string;
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        {children}
      </svg>
    </div>
  );
}

const TIPS: Tip[] = [
  {
    id: "cant-lose",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </Icon>
    ),
    title: "Du kan ikke unngå å bli rik",
    body: "Følger du planen over tid, er det matematisk umulig å ikke bygge formue. Rentes rente + tid + lave gebyrer = garantert vekst.",
  },
  {
    id: "top-01",
    icon: (
      <Icon>
        <path d="M12 2l2.09 6.26L21 9.27l-5 4.87L17.18 22 12 18.56 6.82 22 8 14.14l-5-4.87 6.91-1.01L12 2z" />
      </Icon>
    ),
    title: "Du er blant topp 0,1%",
    body: "Gjør du dette nå, investerer du smartere enn 99,9% av befolkningen. De fleste starter aldri. Du har allerede begynt.",
  },
  {
    id: "generational-wealth",
    icon: (
      <Icon>
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
      </Icon>
    ),
    title: "Generational wealth",
    body: "Du bygger ikke bare for deg selv – du bygger en hel familie-formue. Det starter med én beslutning: å begynne.",
  },
  {
    id: "rule-of-7",
    icon: (
      <Icon>
        <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71-.71" />
        <circle cx="12" cy="12" r="5" />
      </Icon>
    ),
    title: "Rentes rente – verdens 8. underverk",
    body: "\"Rentes rente er det kraftigste i universet\" – Albert Einstein. Pengene dine dobler seg omtrent hvert 9. år. Start nå, og tiden gjør jobben.",
  },
  {
    id: "time-in-market",
    icon: (
      <Icon>
        <path d="M5 22l4.586-4.586M19 2l-4.586 4.586M12 6v6l4 2" />
        <circle cx="12" cy="12" r="10" />
      </Icon>
    ),
    title: "Pengene jobber for deg",
    body: "\"Time in the market beats timing the market.\" Over halvparten av formuen din kommer fra avkastning – ikke det du sparer selv. De som selger seg ut og prøver å kjøpe tilbake billig, taper nesten alltid. Ingen slår markedet over tid.",
  },
  {
    id: "sleep-well",
    icon: (
      <Icon>
        <path d="M12 3a6 6 0 009 9 9 9 0 11-9-9z" />
      </Icon>
    ),
    title: "Sov godt om natten",
    body: "All Weather-strategien er designet for å tåle alt – krakk, inflasjon, deflasjon. Du trenger ikke stresse når markedet faller.",
  },
  {
    id: "inflation",
    icon: (
      <Icon>
        <path d="M3 3v18h18M7 16l4-4 4 4 5-5" />
      </Icon>
    ),
    title: "Inflasjon spiser i det stille",
    body: "Legger du sparepengene i banken, taper du kjøpekraft hvert eneste år. Over tid går du glipp av millioner. Invester – ikke la pengene råtne.",
  },
  {
    id: "forbes-book",
    icon: (
      <Icon>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 22h16v-5H6.5M4 19.5V4a2 2 0 012-2h14v15" />
      </Icon>
    ),
    title: "Hyllet av Forbes",
    body: "\"Money: Master the Game\" av Tony Robbins er kalt en av de viktigste bøkene om personlig økonomi noensinne. All Weather-strategien er kjernen.",
  },
];

const AUTO_ROTATE_MS = 10_000;

export function TipCarousel() {
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const markTipSeen = useFlus((s) => s.markTipSeen);

  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % TIPS.length);
    }, AUTO_ROTATE_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (!hasOnboarded) return null;

  const tip = TIPS[index % TIPS.length];

  const next = () => {
    markTipSeen(tip.id);
    setIndex((i) => (i + 1) % TIPS.length);
    resetTimer();
  };

  return (
    <div className="px-5 pb-2">
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
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5" aria-hidden>
              {tip.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] mb-0.5">{tip.title}</div>
              <p className="text-[13px] text-[var(--muted)] leading-snug">
                {tip.body}
              </p>
            </div>
          </div>
          {TIPS.length > 1 && (
            <div className="mt-3 flex gap-1 justify-center">
              {TIPS.map((t, i) => (
                <span
                  key={t.id}
                  className={`h-1 rounded-full transition-all ${
                    i === index % TIPS.length
                      ? "w-4 bg-[var(--foreground)]"
                      : "w-1.5 bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
