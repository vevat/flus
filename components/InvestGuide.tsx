"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ALLOCATIONS,
  PRODUCTS,
  PROVIDERS,
  type AssetClass,
  type Product,
  type ProviderId,
} from "@/lib/products";
import { DEFAULTS, formatNok } from "@/lib/finance";
import { useFlus } from "@/lib/store";
import { Donut } from "./Donut";

export function InvestGuide() {
  const goals = useFlus((s) => s.goals);
  const initialDaily = goals[0]?.dailyAmount ?? 50;
  const savedMonthly = Math.round(initialDaily * DEFAULTS.daysPerMonth);

  const [provider, setProvider] = useState<ProviderId>("nordnet");
  const [customMonthly, setCustomMonthly] = useState<number | null>(null);
  const monthly =
    customMonthly ?? Math.max(200, Math.round(savedMonthly / 100) * 100);
  const [highlight, setHighlight] = useState<AssetClass | null>(null);

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
          En portefølje som tåler alt slags vær - oppgang, nedgang, inflasjon
          og deflasjon. Utviklet av Ray Dalio (Bridgewater) og populært på norsk
          gjennom Tony Robbins&apos; bok &quot;Money: Master the Game&quot;.
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
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                whileTap={{ scale: 0.95 }}
                className={`px-2 py-2.5 rounded-2xl text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {p.name}
                {p.recommended && (
                  <span className="block text-[10px] font-medium opacity-60">
                    Anbefalt
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
        <div className="mt-2 px-1 text-[12px] text-[var(--muted)] leading-snug">
          {PROVIDERS.find((p) => p.id === provider)?.blurb}
        </div>
      </div>

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
            Opprett{" "}
            <strong>aksjesparekonto (ASK)</strong> hos{" "}
            {PROVIDERS.find((p) => p.id === provider)?.name}. Det gir
            skattefordel for aksjefond og aksje-ETF.
          </Step>
          <Step n={2}>
            Sett opp <strong>månedlig spareavtale</strong> for hvert produkt
            etter beløpene over. På Nordnet kan du automatisere dette gratis.
          </Step>
          <Step n={3}>
            <strong>Rebalanser ca 1 gang i året</strong>: justér beholdningene
            tilbake til målfordelingen ved å kjøpe mer av det som har sunket.
          </Step>
        </ol>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-[var(--surface-2)] p-3 text-[11px] text-[var(--muted)] leading-snug">
        <div className="font-semibold text-[var(--foreground)] mb-0.5">
          Viktig
        </div>
        Dette er ikke individuell finansiell rådgivning. Historisk avkastning
        er ingen garanti for fremtidig avkastning. Snakk med en uavhengig
        rådgiver eller bruk{" "}
        <a
          href="https://www.finansportalen.no"
          target="_blank"
          rel="noreferrer"
          className="text-[var(--primary)] underline"
        >
          Finansportalen.no
        </a>{" "}
        før du tar store investeringsbeslutninger. Sjekk alltid ISIN, kostnader
        og tilgjengelighet hos leverandøren før kjøp.
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
      <div className="rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] p-3">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: allocation.color }}
          />
          <span className="text-[12px] font-semibold flex-1">
            {allocation.label}
          </span>
          <span className="text-[12px] tabular-nums text-[var(--muted)]">
            {allocation.percent}% · {formatNok(amount)}
          </span>
        </div>
        <div className="text-[11px] text-[var(--muted)] leading-snug">
          {product?.unavailableNote ??
            "Ikke tilgjengelig hos denne leverandøren. Vurder Nordnet for full All Weather-eksponering."}
        </div>
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
