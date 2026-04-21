"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ALLOCATIONS,
  PRODUCTS,
  PROVIDERS,
  NORDNET_AFFILIATE_URL,
  type AssetClass,
  type Product,
  type ProviderId,
} from "@/lib/products";
import { DEFAULTS, formatNok, projectWealth, getAtAge } from "@/lib/finance";
import { useFlus } from "@/lib/store";
import { Donut } from "./Donut";
import { track } from "@/lib/analytics";

export function InvestGuide() {
  const goals = useFlus((s) => s.goals);
  const initialDaily = goals[0]?.dailyAmount ?? 50;
  const savedMonthly = Math.round(initialDaily * DEFAULTS.daysPerMonth);

  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const provider = (ui.investProvider ?? "nordnet") as ProviderId;
  const setProvider = (v: ProviderId) => setUi({ investProvider: v });
  const customMonthly = ui.investMonthly;
  const setCustomMonthly = (v: number) => setUi({ investMonthly: v });
  const monthly =
    customMonthly ?? Math.max(200, Math.round(savedMonthly / 100) * 100);
  const [highlight, setHighlight] = useState<AssetClass | null>(null);

  const age = useFlus((s) => s.age);
  const endAge = 67;

  const feeYears = 50;
  const feeCost = useMemo(() => {
    const dailyFromSlider = monthly / DEFAULTS.daysPerMonth;
    const feeEndAge = age + feeYears;
    const withoutFees = getAtAge(
      projectWealth({
        currentAge: age,
        endAge: feeEndAge,
        contributions: [{ fromAge: age, dailyAmount: dailyFromSlider }],
        annualReturn: DEFAULTS.annualReturn,
      }),
      feeEndAge,
    );
    const withFees = getAtAge(
      projectWealth({
        currentAge: age,
        endAge: feeEndAge,
        contributions: [{ fromAge: age, dailyAmount: dailyFromSlider }],
        annualReturn: DEFAULTS.annualReturn - 0.02,
      }),
      feeEndAge,
    );
    if (!withoutFees || !withFees) return null;
    return {
      without: withoutFees.nominal,
      with: withFees.nominal,
      lost: withoutFees.nominal - withFees.nominal,
    };
  }, [age, monthly, feeYears]);

  const productsForProvider = useMemo(
    () => PRODUCTS.filter((p) => p.provider === provider),
    [provider],
  );

  const productByAsset = useMemo(() => {
    const map = new Map<AssetClass, Product>();
    productsForProvider.forEach((p) => {
      if (p.recommended || !map.has(p.asset)) {
        map.set(p.asset, p);
      }
    });
    return map;
  }, [productsForProvider]);

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6 space-y-5">
      {/* Tittel */}
      <div id="strategi" className="scroll-mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
          Plassere
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight mt-0.5">
          All Weather
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-1 leading-snug">
          En portefølje som tåler alt slags vær – oppgang, nedgang, inflasjon
          og deflasjon. Utviklet av Ray Dalio – en legende og en av verdens
          beste kapitalforvaltere. Strategien er hyllet verden over, og følger
          du den er du blant de 1% beste i verden over tid. Det tar tid, men
          følger du planen kan du ikke unngå å bli rik.
        </p>
      </div>

      {/* Barnevennlig forklaring */}
      <div className="rounded-3xl bg-[var(--primary-soft)] p-4">
        <div className="font-display text-base font-semibold text-[var(--primary-strong)] mb-2">
          Forklart enkelt
        </div>
        <div className="space-y-2 text-[13px] text-[var(--foreground)] leading-snug">
          <p>
            <strong>Tenk på pengene som et fotballag.</strong> Du vil ikke ha
            bare angripere — du vil også ha forsvarere og en keeper. Da
            stiller du sterkt enten du møter et offensivt eller defensivt
            motstanderlag.
          </p>
          <p>
            Aksjer er angriperne — de scorer mest når det går bra. Statsobligasjoner
            er forsvaret som holder igjen når det går dårlig. Gull og
            råvarer er keeperen som redder deg når inflasjonen stiger.
          </p>
          <p>
            Resultatet: du tjener litt mindre enn rene aksjer i de aller beste
            årene, men du taper også mye mindre i de verste. Over tid gir det
            <strong> jevn og solid vekst</strong> uten store skrekkfall.
          </p>
        </div>
      </div>

      {/* Donut */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
        <Donut
          size={200}
          highlightId={highlight}
          onSliceClick={(id) =>
            setHighlight((h) => (h === id ? null : (id as AssetClass)))
          }
        />
        <div className="mt-3 space-y-1.5">
          {ALLOCATIONS.map((a) => {
            const active = highlight === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() =>
                  setHighlight((h) => (h === a.id ? null : a.id))
                }
                className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-xl transition-colors text-left ${
                  active ? "bg-[var(--surface-2)]" : ""
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: a.color }}
                />
                <span className="flex-1 text-[13px] font-medium">
                  {a.label}
                </span>
                <span className="text-[13px] font-semibold tabular-nums text-[var(--muted)]">
                  {a.percent}%
                </span>
              </button>
            );
          })}
        </div>
        {highlight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 px-3 py-2 rounded-xl bg-[var(--surface-2)] text-[12px] text-[var(--muted)]"
          >
            {ALLOCATIONS.find((a) => a.id === highlight)?.why}
          </motion.div>
        )}
      </div>

      {/* Beløps-kalkulator */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
            Plasser hver måned
          </div>
          {!customMonthly && (
            <div className="text-[10px] text-[var(--muted-2)]">
              Fra spareplanen din ({formatNok(savedMonthly)}/mnd)
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-3xl font-bold tabular-nums">
            {formatNok(monthly)}
          </span>
        </div>
        <div className="relative">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[var(--primary)]"
            style={{
              width: `${Math.min(100, ((monthly - 200) / (20000 - 200)) * 100)}%`,
            }}
          />
          <input
            type="range"
            min={200}
            max={20000}
            step={100}
            value={monthly}
            onChange={(e) => setCustomMonthly(Number(e.target.value))}
            aria-label="Månedlig plasseringsbeløp"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-[var(--muted-2)]">
          <span>200 kr</span>
          <span>20 000 kr</span>
        </div>
      </div>

      {/* Velg leverandør */}
      <div>
        <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wide px-1 mb-2">
          Velg din leverandør
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PROVIDERS.map((p) => {
            const active = provider === p.id;
            const incomplete = p.id !== "nordnet";
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => {
                  setProvider(p.id);
                  track("provider_selected", { provider: p.id });
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-2 py-2.5 rounded-2xl text-[12px] font-semibold transition-colors relative ${
                  active
                    ? incomplete
                      ? "bg-[var(--surface-2)] border border-[#ef4444]/30 text-[var(--foreground)]"
                      : "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {p.name}
                {p.recommended && (
                  <span className="block text-[10px] font-medium opacity-60">
                    Anbefalt
                  </span>
                )}
                {incomplete && (
                  <span className="block text-[9px] font-medium text-[#ef4444] opacity-80">
                    Mangler produkter
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
        <div className="mt-2 px-1 text-[12px] text-[var(--muted)] leading-snug">
          {PROVIDERS.find((p) => p.id === provider)?.blurb}
        </div>
        {provider !== "nordnet" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/20 p-3"
          >
            <p className="text-[12px] text-[#ef4444] font-medium leading-snug">
              {PROVIDERS.find((p) => p.id === provider)?.name} mangler 3 av 5
              aktivaklasser som trengs til All Weather-strategien. Vi anbefaler
              Nordnet for å få tilgang til alle byggeklossene.
            </p>
            <motion.a
              href={NORDNET_AFFILIATE_URL}
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.97 }}
              onClick={() => track("affiliate_click", { source: "provider_warning" })}
              className="mt-2 inline-block px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-[12px] font-semibold"
            >
              Bytt til Nordnet &rarr;
            </motion.a>
          </motion.div>
        )}
      </div>

      {/* Gebyr-advarsel */}
      {feeCost && (
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
          <div className="font-display text-base font-semibold mb-1.5">
            Hvorfor lave gebyrer er nøkkelen
          </div>
          <p className="text-[13px] text-[var(--muted)] leading-snug">
            Velger du produkter med høye gebyrer – typisk populære fond hos banker
            – spiser det opp formuen din over tid. Mange fond tar 1,5–2% i
            årlig gebyr. Det høres lite ut, men over {feeYears} år
            er forskjellen enorm:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-[var(--primary-soft)] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[var(--primary-strong)] font-semibold">
                Lave gebyrer (0,2%)
              </div>
              <div className="font-display text-xl font-bold text-[var(--primary-strong)] mt-1">
                {formatNok(feeCost.without, { compact: true })}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                Høye gebyrer (2%)
              </div>
              <div className="font-display text-xl font-bold text-[var(--foreground)] mt-1">
                {formatNok(feeCost.with, { compact: true })}
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-[13px] font-semibold text-[#ef4444]">
              Gebyrer koster deg {formatNok(feeCost.lost, { compact: true })}
            </span>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              Samme avkastning, samme sparebeløp – men 2% i gebyrer vs 0,2%.
            </p>
          </div>
        </div>
      )}

      {/* Produkter per asset-klasse */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wide px-1">
          Konkrete produkter
        </div>
        {ALLOCATIONS.map((a) => {
          const product = productByAsset.get(a.id);
          const amount = (monthly * a.percent) / 100;
          return (
            <ProductCard
              key={a.id}
              allocation={a}
              product={product}
              amount={amount}
            />
          );
        })}
      </div>

      {/* Hvordan komme i gang */}
      <div className="rounded-3xl bg-[var(--primary-soft)] p-4">
        <div className="font-display text-base font-semibold text-[var(--primary-strong)] mb-2">
          Hvordan komme i gang
        </div>
        <ol className="space-y-2 text-[13px]">
          <Step n={1}>
            Opprett <strong>gratis konto hos Nordnet</strong> — det tar 2
            minutter. Du får aksjesparekonto (ASK) med skattefordel og tilgang
            til alle produktene du trenger.
          </Step>
          <Step n={2}>
            Sett opp <strong>månedlig spareavtale</strong> for hvert produkt
            etter beløpene over. Nordnet automatiserer dette gratis.
          </Step>
          <Step n={3}>
            <strong>Rebalanser ca 1 gang i året</strong>: justér beholdningene
            tilbake til målfordelingen ved å kjøpe mer av det som har sunket.
          </Step>
        </ol>

        <motion.a
          href={NORDNET_AFFILIATE_URL}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.97 }}
          onClick={() => track("affiliate_click", { source: "cta_button" })}
          className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[var(--primary)] text-white text-[14px] font-bold shadow-lg"
        >
          Opprett konto hos Nordnet
          <span className="text-[18px]">&rarr;</span>
        </motion.a>

        <p className="mt-3 text-[12px] text-[var(--primary-strong)] leading-snug italic">
          Gjør du dette nå, investerer du blant topp 0,1% i verden. Følg planen,
          gi den tid, og du kan ikke unngå å bygge en formue.
        </p>
      </div>

      {/* Disclaimer */}
      <Disclaimer />

      {/* Copyright */}
      <div className="text-center text-[10px] text-[var(--muted-2)] pb-2">
        &copy; {new Date().getFullYear()} Pengebingen. All rights reserved.
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </span>
      <span className="text-[var(--foreground)] leading-snug">{children}</span>
    </li>
  );
}

function ProductCard({
  allocation,
  product,
  amount,
}: {
  allocation: (typeof ALLOCATIONS)[number];
  product?: Product;
  amount: number;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignored
    }
  };

  if (!product || product.unavailable) {
    return (
      <div className="rounded-2xl bg-[var(--surface)] border border-dashed border-[#ef4444]/20 p-3">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full opacity-40"
            style={{ background: allocation.color }}
          />
          <span className="text-[12px] font-semibold flex-1 text-[var(--muted)]">
            {allocation.label}
          </span>
          <span className="text-[11px] font-medium text-[#ef4444]">
            Mangler
          </span>
        </div>
        <div className="text-[11px] text-[var(--muted)] leading-snug">
          {product?.unavailableNote ??
            "Ikke tilgjengelig hos denne leverandøren."}
        </div>
        <a
          href={NORDNET_AFFILIATE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("affiliate_click", { source: "missing_product" })}
          className="mt-1.5 inline-block text-[11px] font-semibold text-[var(--primary)] underline"
        >
          Tilgjengelig på Nordnet &rarr;
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: allocation.color }}
        />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] flex-1">
          {allocation.label}
        </span>
        <span className="text-[11px] tabular-nums text-[var(--muted)]">
          {allocation.percent}%
        </span>
      </div>
      <div className="font-semibold text-[14px] leading-tight">
        {product.name}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--muted)]">
        {product.isin && (
          <button
            type="button"
            onClick={() => copy(product.isin!)}
            className="font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] hover:bg-[var(--primary-soft)] active:scale-95 transition-all"
            title="Kopier ISIN"
          >
            {product.isin}
          </button>
        )}
        {product.ticker && (
          <span className="font-mono">{product.ticker}</span>
        )}
        {product.ter !== undefined && (
          <span>TER {product.ter.toFixed(2).replace(".", ",")}%</span>
        )}
      </div>
      <p className="mt-1.5 text-[12px] text-[var(--muted)] leading-snug">
        {product.description}
      </p>
      <div className="mt-2 flex items-center justify-between pt-2 border-t border-[var(--border)]">
        <span className="text-[11px] text-[var(--muted)]">Plasseres</span>
        <span className="font-display text-base font-bold tabular-nums">
          {formatNok(amount)}/mnd
        </span>
      </div>
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-[11px] text-[var(--primary)] font-medium"
        >
          ISIN kopiert ✓
        </motion.div>
      )}
    </div>
  );
}

function Disclaimer() {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left rounded-2xl bg-[var(--surface-2)] p-3 text-[11px] text-[var(--muted)] leading-snug transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[var(--muted)]">Disclaimer</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 text-[var(--muted-2)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div className="mt-2 space-y-1.5">
          <p>
            Dette er ikke individuell finansiell rådgivning. Historisk avkastning
            er ingen garanti for fremtidig avkastning. Snakk med en uavhengig
            rådgiver eller bruk{" "}
            <a
              href="https://www.finansportalen.no"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--primary)] underline"
              onClick={(e) => e.stopPropagation()}
            >
              Finansportalen.no
            </a>{" "}
            før du tar store investeringsbeslutninger. Sjekk alltid ISIN,
            kostnader og tilgjengelighet hos leverandøren før kjøp.
          </p>
          <p className="text-[10px] opacity-70">
            Lenker til Nordnet er annonselenker — vi kan motta en godtgjørelse
            hvis du oppretter konto. Dette påvirker ikke vår anbefaling, som er
            basert på produkttilgang og kostnader.
          </p>
        </div>
      )}
    </button>
  );
}
