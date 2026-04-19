/**
 * Flus – finansutregninger
 *
 * Antagelser (kan justeres senere uten å endre callsites):
 *  - Forventet nominell årlig avkastning: 7% (realistisk for et globalt aksjefond)
 *  - Forventet årlig inflasjon: 2.5% (Norges Banks målsetting)
 *  - Sparebeløpet justeres opp med inflasjon hvert år (slik at kjøpekraft holdes)
 *  - Bidrag skjer månedlig på slutten av hver måned
 */

export const DEFAULTS = {
  annualReturn: 0.07,
  annualInflation: 0.025,
  daysPerMonth: 30.4375,
} as const;

export type ProjectionPoint = {
  /** Brukerens alder ved dette punktet */
  age: number;
  /** Nominell formue i kroner ved slutten av året */
  nominal: number;
  /** Realverdi (justert for inflasjon, dagens kroner) */
  real: number;
  /** Sum innbetalt frem til dette punktet */
  contributed: number;
};

export type Contribution = {
  /** Alder kontribusjonen starter på */
  fromAge: number;
  /** Daglig sparebeløp i dagens kroner (justeres med inflasjon hvert år) */
  dailyAmount: number;
};

type ProjectOpts = {
  currentAge: number;
  endAge: number;
  contributions: Contribution[];
  annualReturn?: number;
  annualInflation?: number;
};

/**
 * Beregner formuen år for år fra currentAge til endAge.
 * Sparebeløpet for hver kontribusjon justeres opp med inflasjon hvert år.
 */
export function projectWealth({
  currentAge,
  endAge,
  contributions,
  annualReturn = DEFAULTS.annualReturn,
  annualInflation = DEFAULTS.annualInflation,
}: ProjectOpts): ProjectionPoint[] {
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const points: ProjectionPoint[] = [];

  let balance = 0;
  let contributed = 0;

  // Startpunkt
  points.push({
    age: currentAge,
    nominal: 0,
    real: 0,
    contributed: 0,
  });

  for (let age = currentAge; age < endAge; age++) {
    const yearsFromStart = age - currentAge;

    // Aktive kontribusjoner dette året
    const activeContribs = contributions.filter((c) => c.fromAge <= age);

    // Månedlig sparebeløp dette året (justert for inflasjon siden start)
    const monthlyContribution = activeContribs.reduce((sum, c) => {
      const yearsIntoThisContrib = age - c.fromAge;
      const inflated =
        c.dailyAmount *
        DEFAULTS.daysPerMonth *
        Math.pow(1 + annualInflation, yearsIntoThisContrib);
      return sum + inflated;
    }, 0);

    // Simuler 12 månedlige bidrag med rente
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributed += monthlyContribution;
    }

    const yearsAhead = yearsFromStart + 1;
    const real = balance / Math.pow(1 + annualInflation, yearsAhead);

    points.push({
      age: age + 1,
      nominal: balance,
      real,
      contributed,
    });
  }

  return points;
}

/** Henter projeksjonen for en spesifikk alder (interpolerer ikke - bruker nærmeste hele år) */
export function getAtAge(
  points: ProjectionPoint[],
  age: number,
): ProjectionPoint | null {
  if (points.length === 0) return null;
  return (
    points.find((p) => p.age === age) ??
    points.reduce((closest, p) =>
      Math.abs(p.age - age) < Math.abs(closest.age - age) ? p : closest,
    )
  );
}

/** Standard alders-milepæler å vise i tidslinjen */
export function getMilestoneAges(currentAge: number): number[] {
  const candidates = [18, 25, 30, 40, 50, 60, 70, 80];
  return candidates.filter((a) => a > currentAge);
}

/**
 * Trappetrinn-profil — hvor mye man "kan" spare per måned i forhold til
 * andre livsfaser. Realistisk progresjon basert på typisk inntektsutvikling
 * i Norge: lite som student/lærling, solid hopp etter 25 i jobb, topp midt
 * i karrieren, litt opp på slutten når lån er nedbetalt og barna ute.
 *
 * Vekt-tallene er RELATIVE, ikke kroner. Den faktiske summen regnes ut fra
 * målet du setter.
 */
export const STAIR_STAGES: { until: number; weight: number; label: string }[] = [
  { until: 25, weight: 1, label: "før 25" },
  { until: 35, weight: 4, label: "25 – 34" },
  { until: 50, weight: 7, label: "35 – 49" },
  { until: 200, weight: 8, label: "50 +" },
];

function stageWeight(age: number): number {
  for (const stage of STAIR_STAGES) {
    if (age < stage.until) return stage.weight;
  }
  return STAIR_STAGES[STAIR_STAGES.length - 1].weight;
}

export type StairStage = {
  fromAge: number;
  toAge: number;
  monthlyToday: number;
};

/**
 * Projeksjon basert på en stair-stepped spareplan (månedsbeløp i dagens kroner
 * per livsfase). Inflasjon justerer beløpet opp år for år, slik at kjøpekraften
 * holdes konstant i forhold til når brukeren startet.
 */
export function projectStairStepped({
  currentAge,
  targetAge,
  monthlyByAge,
  annualReturn = DEFAULTS.annualReturn,
  annualInflation = DEFAULTS.annualInflation,
}: {
  currentAge: number;
  targetAge: number;
  monthlyByAge: (age: number) => number;
  annualReturn?: number;
  annualInflation?: number;
}): ProjectionPoint[] {
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const points: ProjectionPoint[] = [];
  let balance = 0;
  let contributed = 0;

  points.push({ age: currentAge, nominal: 0, real: 0, contributed: 0 });

  for (let age = currentAge; age < targetAge; age++) {
    const yearsFromStart = age - currentAge;
    const monthlyToday = Math.max(0, monthlyByAge(age));
    const inflated =
      monthlyToday * Math.pow(1 + annualInflation, yearsFromStart);

    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + inflated;
      contributed += inflated;
    }

    const yearsAhead = yearsFromStart + 1;
    const real = balance / Math.pow(1 + annualInflation, yearsAhead);

    points.push({
      age: age + 1,
      nominal: balance,
      real,
      contributed,
    });
  }

  return points;
}

/**
 * Beregner trappetrinn-spareplan for å nå et nominelt målbeløp innen targetAge.
 *
 * Logikk:
 *  - For hver alder fra currentAge til targetAge, finner vi vekten for livsfasen
 *  - Det månedlige bidraget er base × vekt × inflasjonsjustering
 *  - Beløpet vokser med inflasjon år for år (kjøpekraften holdes konstant)
 *  - Vi simulerer med base = 1, finner sluttverdi, og skalerer til target
 *
 * Returnerer base-beløpet og en pen liste over hver livsfase med månedlig
 * sparesum oppgitt i DAGENS kroner (slik at det er forståelig).
 */
export function solveStairSteppedSavings({
  currentAge,
  targetAge,
  targetAmount,
  annualReturn = DEFAULTS.annualReturn,
  annualInflation = DEFAULTS.annualInflation,
}: {
  currentAge: number;
  targetAge: number;
  targetAmount: number;
  annualReturn?: number;
  annualInflation?: number;
}): {
  baseMonthly: number;
  stages: StairStage[];
  totalContributedToday: number;
  feasible: boolean;
} {
  if (targetAge <= currentAge || targetAmount <= 0) {
    return {
      baseMonthly: 0,
      stages: [],
      totalContributedToday: 0,
      feasible: false,
    };
  }

  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;

  let balancePerUnit = 0;
  for (let age = currentAge; age < targetAge; age++) {
    const yearsFromStart = age - currentAge;
    const weight = stageWeight(age);
    const monthlyContrib = weight * Math.pow(1 + annualInflation, yearsFromStart);
    for (let m = 0; m < 12; m++) {
      balancePerUnit = balancePerUnit * (1 + monthlyRate) + monthlyContrib;
    }
  }

  const baseMonthly = balancePerUnit > 0 ? targetAmount / balancePerUnit : 0;

  // Bygg liste over hvilke livsfaser som faktisk gjelder
  const stages: StairStage[] = [];
  let cursor = currentAge;
  for (const stage of STAIR_STAGES) {
    if (cursor >= targetAge) break;
    if (stage.until <= cursor) continue;
    const stageEnd = Math.min(stage.until, targetAge);
    stages.push({
      fromAge: cursor,
      toAge: stageEnd,
      monthlyToday: baseMonthly * stage.weight,
    });
    cursor = stageEnd;
  }

  // Sum totalt innbetalt i dagens kjøpekraft (uten inflasjonsjustering – så
  // brukeren forstår "hvor mye av min lommebok går faktisk ut")
  const totalContributedToday = stages.reduce((sum, s) => {
    const months = (s.toAge - s.fromAge) * 12;
    return sum + months * s.monthlyToday;
  }, 0);

  return {
    baseMonthly,
    stages,
    totalContributedToday,
    feasible: baseMonthly > 0 && isFinite(baseMonthly),
  };
}

/**
 * Beregner kostnaden ved å vente med å starte sparing.
 * Returnerer differansen i nominell formue ved targetAge mellom å starte nå
 * vs. å starte om delayYears år.
 */
export function costOfDelaying({
  currentAge,
  targetAge,
  delayYears,
  contributions,
  annualReturn = DEFAULTS.annualReturn,
  annualInflation = DEFAULTS.annualInflation,
}: {
  currentAge: number;
  targetAge: number;
  delayYears: number;
  contributions: Contribution[];
  annualReturn?: number;
  annualInflation?: number;
}): {
  nowAmount: number;
  delayedAmount: number;
  difference: number;
  perMonthLost: number;
} {
  if (targetAge <= currentAge) {
    return { nowAmount: 0, delayedAmount: 0, difference: 0, perMonthLost: 0 };
  }

  const nowProjection = projectWealth({
    currentAge,
    endAge: targetAge,
    contributions,
    annualReturn,
    annualInflation,
  });

  // For "delayed" - skift alle bidrag fram med delayYears
  const delayedContribs = contributions.map((c) => ({
    ...c,
    fromAge: c.fromAge + delayYears,
  }));

  const delayedProjection = projectWealth({
    currentAge,
    endAge: targetAge,
    contributions: delayedContribs,
    annualReturn,
    annualInflation,
  });

  const nowAmount = nowProjection[nowProjection.length - 1]?.nominal ?? 0;
  const delayedAmount =
    delayedProjection[delayedProjection.length - 1]?.nominal ?? 0;
  const difference = Math.max(0, nowAmount - delayedAmount);
  const perMonthLost = delayYears > 0 ? difference / (delayYears * 12) : 0;

  return { nowAmount, delayedAmount, difference, perMonthLost };
}

/** Formaterer kroner kort og pent (123 456 kr / 1,2 mill kr) */
export function formatNok(amount: number, opts?: { compact?: boolean }): string {
  const compact = opts?.compact ?? false;
  if (!isFinite(amount)) return "0 kr";

  if (compact && Math.abs(amount) >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${formatDecimal(millions, millions >= 10 ? 0 : 1)} mill kr`;
  }
  if (compact && Math.abs(amount) >= 10_000) {
    return `${formatNumber(Math.round(amount))} kr`;
  }
  return `${formatNumber(Math.round(amount))} kr`;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("nb-NO").format(n);
}

function formatDecimal(n: number, decimals: number): string {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function getRelatable(daily: number): { emoji: string; label: string } {
  if (daily < 25) return { emoji: "🍜", label: "en pakke Mr. Lee nudler" };
  if (daily < 35) return { emoji: "🥤", label: "en brus" };
  if (daily < 50)
    return { emoji: "⚡", label: "en energidrikk (idiotisk – stay away!)" };
  if (daily < 100) return { emoji: "🥖", label: "en påsmurt baguette til lunsj" };
  return { emoji: "💎", label: "Du er en skikkelig sparemaskin" };
}
