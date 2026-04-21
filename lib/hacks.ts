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

export type HackIconId =
  | "zap" | "sandwich" | "droplet" | "tv" | "gamepad" | "dice"
  | "ban" | "cart" | "shirt" | "baby" | "dog" | "snowflake"
  | "bike" | "gem" | "gift" | "utensils" | "recycle" | "noodles"
  | "coffee" | "briefcase";

export type Hack = {
  id: string;
  icon: HackIconId;
  iconColor: string;
  title: string;
  blurb: string;
  amount: number;
  frequency: HackFrequency;
  category: HackCategory;
  effort: 1 | 2 | 3;
};

const _HACKS: Hack[] = [
  // ---- CUT ----
  {
    id: "cut-nudler",
    icon: "noodles",
    iconColor: "#e8a33a",
    title: "Mr. Lee-nudler til lunsj",
    blurb: "En pakke koster 15 kr. Billig, mettende, og millionærvennlig.",
    amount: 15,
    frequency: "daily",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-vannflaske",
    icon: "droplet",
    iconColor: "#5ba8c8",
    title: "Ta med vannflaske",
    blurb: "Dropp å betale 30 kr for flaskevann og brus i butikken.",
    amount: 30,
    frequency: "daily",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-energidrikk",
    icon: "zap",
    iconColor: "#e8c33a",
    title: "Drop energidrikken",
    blurb: "Du sover bedre, og lommeboka jubler.",
    amount: 35,
    frequency: "daily",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-kantine",
    icon: "sandwich",
    iconColor: "#d4a76a",
    title: "Smør lunsj hjemme",
    blurb: "Spar 50 spenn per skoledag vs kantina.",
    amount: 50,
    frequency: "daily",
    category: "cut",
    effort: 2,
  },
  {
    id: "cut-kaffe",
    icon: "coffee",
    iconColor: "#8b6b4a",
    title: "Dropp kaffebaren",
    blurb: "Lag kaffe hjemme. En kopp ute koster fort 55–75 kr.",
    amount: 55,
    frequency: "daily",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-snus",
    icon: "ban",
    iconColor: "#cc8b6b",
    title: "Drop snusen",
    blurb: "Bra for tennene, råbra for fremtidsformuen.",
    amount: 70,
    frequency: "daily",
    category: "cut",
    effort: 3,
  },
  {
    id: "cut-streaming",
    icon: "tv",
    iconColor: "#9b7acc",
    title: "Drop én streaming-tjeneste",
    blurb: "Du rakk uansett ikke å se alt.",
    amount: 129,
    frequency: "monthly",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-rema",
    icon: "cart",
    iconColor: "#7baacc",
    title: "Bytt til Kiwi eller Rema",
    blurb: "Minst 30 kr/uke spart. For en familie kan det bety tusenlapper i mnd.",
    amount: 30,
    frequency: "weekly",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-skin",
    icon: "gamepad",
    iconColor: "#cc6b6b",
    title: "Hopp over én gaming-skin",
    blurb: "En CS- eller Fortnite-skin = 200 kr som kan vokse.",
    amount: 200,
    frequency: "monthly",
    category: "cut",
    effort: 1,
  },
  {
    id: "cut-lotto",
    icon: "dice",
    iconColor: "#6bcc8a",
    title: "Drop Lotto / Eurojackpot",
    blurb: "Sjansen er 1 til 31 millioner. Spar pengene i stedet.",
    amount: 50,
    frequency: "weekly",
    category: "cut",
    effort: 1,
  },

  // ---- EARN ----
  {
    id: "earn-pant",
    icon: "recycle",
    iconColor: "#4db87a",
    title: "Pant 5 flasker om dagen",
    blurb: "~150 flasker i mnd. 300–450 kr avhengig av 2 eller 3 kr pant.",
    amount: 10,
    frequency: "daily",
    category: "earn",
    effort: 1,
  },
  {
    id: "earn-tise",
    icon: "shirt",
    iconColor: "#cc7eb5",
    title: "Selg gamle klær på Tise eller Finn",
    blurb: "Gjennomsnittlig 150 kr per uke om du legger ut jevnlig.",
    amount: 150,
    frequency: "weekly",
    category: "earn",
    effort: 2,
  },
  {
    id: "earn-dog",
    icon: "dog",
    iconColor: "#a8885c",
    title: "Hundepass etter skolen",
    blurb: "100 kr per tur, 3 dager i uka.",
    amount: 300,
    frequency: "weekly",
    category: "earn",
    effort: 2,
  },
  {
    id: "earn-babysit",
    icon: "baby",
    iconColor: "#e89a7a",
    title: "Tilby babysitting",
    blurb: "100 kr/time. Naboene elsker deg etter første kveld.",
    amount: 300,
    frequency: "weekly",
    category: "earn",
    effort: 2,
  },
  {
    id: "earn-snow",
    icon: "snowflake",
    iconColor: "#8ab8d4",
    title: "Snømåking eller plenklipping",
    blurb: "Bank på naboens dør. 200 kr per jobb, sesongbasert.",
    amount: 800,
    frequency: "monthly",
    category: "earn",
    effort: 3,
  },
  {
    id: "earn-foodora",
    icon: "bike",
    iconColor: "#6bcc6b",
    title: "Foodora / Wolt på sykkel",
    blurb: "Trening + 150–200 kr/time fra du fyller 18.",
    amount: 800,
    frequency: "weekly",
    category: "earn",
    effort: 3,
  },
  {
    id: "earn-deltid",
    icon: "briefcase",
    iconColor: "#b8a060",
    title: "Deltidsjobb eller bi-inntekt",
    blurb: "Selv 5 000 kr ekstra i mnd blir til millioner over tid.",
    amount: 5000,
    frequency: "monthly",
    category: "earn",
    effort: 3,
  },

  // ---- HACK ----
  {
    id: "hack-bursdag",
    icon: "gift",
    iconColor: "#cc6b9b",
    title: "Be om penger til bursdag",
    blurb: "I stedet for ting du glemmer i februar.",
    amount: 1500,
    frequency: "yearly",
    category: "hack",
    effort: 1,
  },
  {
    id: "hack-mealprep",
    icon: "utensils",
    iconColor: "#8acc7a",
    title: "Meal prep på søndag",
    blurb: "5 lunsjer for 200 kr. Sparer ~100 kr per dag.",
    amount: 100,
    frequency: "daily",
    category: "hack",
    effort: 2,
  },
  {
    id: "hack-vipps",
    icon: "gem",
    iconColor: "#c9a84c",
    title: "Auto-spar hver fredag",
    blurb: "Sett opp fast overføring til sparekonto/fond. Glem den.",
    amount: 200,
    frequency: "weekly",
    category: "hack",
    effort: 1,
  },
];

const FREQ_TO_YEARLY: Record<HackFrequency, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  yearly: 1,
};

export function yearlyAmount(hack: Hack): number {
  return hack.amount * FREQ_TO_YEARLY[hack.frequency];
}

export function monthlyAmount(hack: Hack): number {
  return yearlyAmount(hack) / 12;
}

export const HACKS: Hack[] = _HACKS.sort(
  (a, b) => monthlyAmount(a) - monthlyAmount(b),
);

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

export const CATEGORY_LABELS: Record<
  HackCategory,
  { label: string; color: string }
> = {
  cut: { label: "Kutt", color: "var(--gold)" },
  earn: { label: "Tjen", color: "var(--primary)" },
  hack: { label: "Hack", color: "var(--accent)" },
};

export const FREQUENCY_LABELS: Record<HackFrequency, string> = {
  daily: "/dag",
  weekly: "/uke",
  monthly: "/mnd",
  yearly: "/år",
};
