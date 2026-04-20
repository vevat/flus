/**
 * Sparehacks – konkrete, handlbare måter for unge nordmenn å frigjøre
 * eller tjene penger som kan investeres. Hver hack har:
 *  - et beløp + frekvens (dag/uke/mnd/år)
 *  - en kategori (cut/earn/hack)
 *  - et følelsesmessig "gøy"-ladet språk
 *
 * Tallene er forsiktige estimat for norske ungdommer i 2026.
 */

export type HackCategory = "cut" | "earn" | "hack";
export type HackFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type Hack = {
  id: string;
  emoji: string;
  title: string;
  /** Kort, ungdommelig oneliner */
  blurb: string;
  amount: number;
  frequency: HackFrequency;
  category: HackCategory;
  /** Hvor lett er det? 1 = veldig lett, 3 = krever litt jobb */
  effort: 1 | 2 | 3;
};

export const HACKS: Hack[] = [
  // ---- CUT IT (drop unødvendige utgifter) ----
  {
    id: "cut-energidrikk",
    emoji: "⚡",
    title: "Drop energidrikken",
    blurb: "Du sover bedre, og lommeboka jubler.",
    amount: 35,
    frequency: "daily",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-kantine",
    emoji: "🥪",
    title: "Smør lunsj hjemme",
    blurb: "Spar 50 spenn per skoledag vs kantina.",
    amount: 50,
    frequency: "daily",
    category: "cut",
    effort: 2,
  },
  {
    id: "cut-vannflaske",
    emoji: "💧",
    title: "Ta med vannflaske",
    blurb: "Dropp å betale 30 kr for flaskevann og brus i butikken.",
    amount: 30,
    frequency: "daily",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-streaming",
    emoji: "📺",
    title: "Drop én streaming-tjeneste",
    blurb: "Du rakk uansett ikke å se alt.",
    amount: 129,
    frequency: "monthly",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-skin",
    emoji: "🎮",
    title: "Hopp over én gaming-skin",
    blurb: "En CS- eller Fortnite-skin = 200 kr som kan vokse.",
    amount: 200,
    frequency: "monthly",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-lotto",
    emoji: "🎰",
    title: "Drop Lotto / Eurojackpot",
    blurb: "Sjansen er 1 til 31 millioner. Spar pengene i stedet.",
    amount: 50,
    frequency: "weekly",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-snus",
    emoji: "🚭",
    title: "Drop snusen",
    blurb: "Bra for tennene, råbra for fremtidsformuen.",
    amount: 70,
    frequency: "daily",
    category: "cut",
    effort: 3,
  },
  {
    id: "cut-rema",
    emoji: "🛒",
    title: "Bytt til Rema eller Kiwi",
    blurb: "Samme handlevogn, billigere per tur. Husk Trumf og Trippeltrumf!",
    amount: 30,
    frequency: "weekly",
    category: "cut",
    effort: 1,
  },

  // ---- EARN IT (tjene mer på siden) ----
  {
    id: "earn-tise",
    emoji: "👕",
    title: "Selg gamle klær på Tise",
    blurb: "Gjennomsnittlig 200 kr per uke om du legger ut jevnlig.",
    amount: 200,
    frequency: "weekly",
    category: "earn",
    effort: 2,
  },
  {
    id: "earn-babysit",
    emoji: "👶",
    title: "Tilby babysitting",
    blurb: "200 kr/time. Naboene elsker deg etter første kveld.",
    amount: 600,
    frequency: "weekly",
    category: "earn",
    effort: 2,
  },
  {
    id: "earn-dog",
    emoji: "🐕",
    title: "Hundepass etter skolen",
    blurb: "150 kr per tur, 3 dager i uka.",
    amount: 450,
    frequency: "weekly",
    category: "earn",
    effort: 2,
  },
  {
    id: "earn-snow",
    emoji: "❄️",
    title: "Snømåking eller plenklipping",
    blurb: "Bank på naboens dør. 250 kr per jobb, sesongbasert.",
    amount: 1000,
    frequency: "monthly",
    category: "earn",
    effort: 3,
  },
  {
    id: "earn-foodora",
    emoji: "🚲",
    title: "Foodora / Wolt på sykkel",
    blurb: "Trening + 150–200 kr/time fra du fyller 18.",
    amount: 800,
    frequency: "weekly",
    category: "earn",
    effort: 3,
  },

  // ---- HACK IT (smarte triks) ----
  {
    id: "hack-vipps",
    emoji: "💎",
    title: "Auto-spar hver fredag",
    blurb: "Sett opp fast overføring til sparekonto/fond. Glem den.",
    amount: 200,
    frequency: "weekly",
    category: "hack",
    effort: 1,
  },
  {
    id: "hack-bursdag",
    emoji: "🎁",
    title: "Be om penger til bursdag",
    blurb: "I stedet for ting du glemmer i februar.",
    amount: 1500,
    frequency: "yearly",
    category: "hack",
    effort: 1,
  },
  {
    id: "hack-mealprep",
    emoji: "🍱",
    title: "Meal prep på søndag",
    blurb: "5 lunsjer for 200 kr. Sparer ~100 kr per dag.",
    amount: 100,
    frequency: "daily",
    category: "hack",
    effort: 2,
  },
];

const FREQ_TO_YEARLY: Record<HackFrequency, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  yearly: 1,
};

/** Konverterer hack-beløpet til kroner per år. */
export function yearlyAmount(hack: Hack): number {
  return hack.amount * FREQ_TO_YEARLY[hack.frequency];
}

/** Konverterer hack-beløpet til kroner per måned. */
export function monthlyAmount(hack: Hack): number {
  return yearlyAmount(hack) / 12;
}

/**
 * Beregner hva en hacks årlige beløp blir verdt i fremtid hvis det
 * investeres månedlig fra brukerens nåværende alder til en målalder.
 * Bruker enkel forventet rente (7%) og inflasjonsjustert månedlig bidrag (2.5%).
 */
export function futureValueOfHack({
  hack,
  fromAge,
  toAge,
  annualReturn = 0.08,
  annualInflation = 0.025,
}: {
  hack: Hack;
  fromAge: number;
  toAge: number;
  annualReturn?: number;
  annualInflation?: number;
}): number {
  if (toAge <= fromAge) return 0;
  const years = toAge - fromAge;
  const monthly = monthlyAmount(hack);
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;

  let value = 0;
  let currentMonthly = monthly;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      value = value * (1 + monthlyRate) + currentMonthly;
    }
    currentMonthly *= 1 + annualInflation;
  }
  return value;
}

/** Lokaliserte etiketter for kategorier. */
export const CATEGORY_LABELS: Record<
  HackCategory,
  { label: string; emoji: string; color: string }
> = {
  cut: { label: "Kutt", emoji: "✂️", color: "var(--gold)" },
  earn: { label: "Tjen", emoji: "💼", color: "var(--primary)" },
  hack: { label: "Hack", emoji: "🧠", color: "var(--accent)" },
};

export const FREQUENCY_LABELS: Record<HackFrequency, string> = {
  daily: "/dag",
  weekly: "/uke",
  monthly: "/mnd",
  yearly: "/år",
};
