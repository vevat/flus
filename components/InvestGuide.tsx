"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ALLOCATIONS,
  BUFFETT_ALLOCATIONS,
  PRODUCTS,
  NORDNET_AFFILIATE_URL,
  type Allocation,
  type AssetClass,
  type Product,
  type PortfolioId,
} from "@/lib/products";
import { DEFAULTS, formatNok, projectWealth, getAtAge } from "@/lib/finance";
import { useFlus } from "@/lib/store";
import { Donut } from "./Donut";
import { track } from "@/lib/analytics";

const WARN = "#b05a3a";
const WARN_SOFT = "rgba(176, 90, 58, 0.1)";
const WARN_BORDER = "rgba(176, 90, 58, 0.2)";

export function InvestGuide() {
  const goals = useFlus((s) => s.goals);
  const initialDaily = goals[0]?.dailyAmount ?? 50;
  const savedMonthly = Math.round(initialDaily * DEFAULTS.daysPerMonth);

  const ui = useFlus((s) => s.ui);
  const setUi = useFlus((s) => s.setUi);

  const customMonthly = ui.investMonthly;
  const setCustomMonthly = (v: number) => setUi({ investMonthly: v });
  const monthly =
    customMonthly ?? Math.max(200, Math.round(savedMonthly / 100) * 100);

  const [portfolio, setPortfolio] = useState<PortfolioId>("allweather");
  const [highlight, setHighlight] = useState<AssetClass | null>(null);

  const age = useFlus((s) => s.age);
  const isGold = useFlus((s) => s.theme) === "exclusive";

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

  const activeAllocations = portfolio === "allweather" ? ALLOCATIONS : BUFFETT_ALLOCATIONS;

  const productsForProvider = useMemo(
    () => PRODUCTS.filter((p) => p.provider === "nordnet"),
    [],
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
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6 space-y-4">
      {/* Hero */}
      <div id="strategi" className="scroll-mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
          Plassere
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight mt-0.5">
          Velg din strategi
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-1 leading-snug">
          To velprøvde strategier fra verdens beste investorer.
          <br />
          Velg den som passer best for deg.
        </p>
      </div>

      {/* Portfolio tabs */}
      <div className="grid grid-cols-2 gap-2">
        <PortfolioTab
          active={portfolio === "allweather"}
          onClick={() => { setPortfolio("allweather"); setHighlight(null); }}
          label="Portefølje 1"
          name="All Weather"
          sub="Tryggeste over tid"
        />
        <PortfolioTab
          active={portfolio === "buffett"}
          onClick={() => { setPortfolio("buffett"); setHighlight(null); }}
          label="Portefølje 2"
          name="Buffett"
          sub="Verdiene svinger mer"
        />
      </div>

      {/* Portfolio content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={portfolio}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Portfolio-specific intro */}
          {portfolio === "allweather" ? (
            <Expandable
              title="Forklart enkelt"
              preview="Når aksjer faller, stiger statsobligasjonene."
              variant="highlight"
            >
              <div className="space-y-2 text-[13px] text-[var(--foreground)] leading-snug">
                <p>
                  Ray Dalios All Weather-strategi sprer pengene dine over fem
                  aktivaklasser som reagerer <em>ulikt</em> på hva som skjer i
                  økonomien.
                </p>
                <p>
                  Da aksjemarkedet krasjet i 2008, steg lange statsobligasjoner
                  over 30%. Da inflasjonen skjøt i været i 2022, holdt gull og
                  råvarer verdien. Poenget er at <strong>uansett hva som skjer,
                  har du alltid noe som stiger</strong>.
                </p>
                <p>
                  Strategien har levert positiv avkastning i 85% av alle år
                  siden 1984, med svært lave tap i de verste periodene. Det er
                  den tryggeste måten å spare langsiktig på.
                </p>
              </div>
            </Expandable>
          ) : (
            <Expandable
              title="Buffetts anbefaling"
              preview="90% aksjer, 10% korte obligasjoner."
              variant="highlight"
            >
              <div className="space-y-2 text-[13px] text-[var(--foreground)] leading-snug">
                <p>
                  Warren Buffett — verdens mest suksessfulle investor —
                  anbefaler en enkel strategi: <strong>90% i et billig
                  aksjeindeksfond og 10% i korte statsobligasjoner</strong>.
                </p>
                <p>
                  Han mener aksjer alltid vinner over lang tid, og at de fleste
                  taper penger på å prøve å time markedet eller betale for dyre
                  fond. Hans eneste råd: kjøp bredt, billig, og hold for alltid.
                </p>
                <p className="font-medium" style={{ color: WARN }}>
                  Forventningsavklaring: Med 90% i aksjer vil porteføljen svinge
                  mye mer enn All Weather. I et dårlig år kan verdien falle
                  30-40%. Buffett mener det ikke spiller noen rolle — så lenge
                  du aldri selger i panikk.
                </p>
              </div>
            </Expandable>
          )}

          {/* Donut */}
          <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
              {portfolio === "allweather" ? "5 byggeklosser" : "2 byggeklosser"}
            </div>
            <Donut
              size={200}
              highlightId={highlight}
              onSliceClick={(id) =>
                setHighlight((h) => (h === id ? null : (id as AssetClass)))
              }
              useLight={!isGold}
              allocations={activeAllocations}
              centerLabel={portfolio === "allweather" ? "All Weather" : "Buffett"}
              centerSub={portfolio === "allweather" ? "5 byggeklosser" : "90 / 10"}
            />
            <div className="mt-3 space-y-1.5">
              {activeAllocations.map((a) => {
                const active = highlight === a.id;
                const dotColor = isGold ? a.color : a.colorLight;
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
                      style={{ background: dotColor }}
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
                {activeAllocations.find((a) => a.id === highlight)?.why}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* "Don't sell" — always visible, applies to both */}
      <div
        className="rounded-3xl p-4"
        style={{ background: WARN_SOFT, border: `1px solid ${WARN_BORDER}` }}
      >
        <div className="font-display text-[15px] font-semibold" style={{ color: WARN }}>
          Det viktigste du gjør: aldri selg i panikk
        </div>
        <p className="mt-1.5 text-[13px] text-[var(--foreground)] leading-snug">
          Å selge seg ut på feil tidspunkt er det dyreste du kan gjøre.
          Historisk har markedet <em>alltid</em> kommet tilbake — men bare for
          de som ble sittende.
        </p>
        <p className="mt-1.5 text-[13px] text-[var(--muted)] leading-snug">
          Det viktigste er å spare og investere jevnt og trutt, enten markedet
          faller eller stiger. De som kjøper fast hver måned — uansett hva
          avisene skriver — ender opp rikest.
        </p>
        <p className="mt-1 text-[11px] text-[var(--muted-2)] italic">
          Kilde: Tony Robbins, «Money: Master the Game»
        </p>
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

      {/* Collapsible: Gebyrer */}
      {feeCost && (
        <Expandable
          title="Gebyrer spiser formuen din"
          alwaysShowPreview
          preview={
            <span style={{ color: WARN }}>
              Velger du feil produkter koster det deg {formatNok(feeCost.lost, { compact: true })} over {feeYears} år
            </span>
          }
        >
          <p className="text-[13px] text-[var(--muted)] leading-snug mb-3">
            Mange fond tar 1,5–2% i årlig gebyr. Det høres lite ut, men over
            {" "}{feeYears} år er forskjellen enorm:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
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
          <div className="mt-2.5 text-center">
            <span className="text-[13px] font-semibold" style={{ color: WARN }}>
              Differanse: {formatNok(feeCost.lost, { compact: true })}
            </span>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              Samme avkastning, samme sparebeløp — men 2% i gebyrer vs 0,2%.
            </p>
          </div>
        </Expandable>
      )}

      {/* Leverandør */}
      <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display text-[15px] font-semibold">Nordnet</span>
          <span className="text-[10px] font-medium text-[var(--primary)] bg-[var(--primary-soft)] px-1.5 py-0.5 rounded-full">Anbefalt</span>
        </div>
        <p className="text-[12px] text-[var(--muted)] leading-snug">
          Alle byggeklossene du trenger. 0 kr i kurtasje på fond og automatisk månedssparing.
        </p>
      </div>

      {/* Collapsible: Konkrete produkter */}
      <Expandable
        title="Konkrete produkter"
        preview={`${activeAllocations.length} fond du trenger`}
      >
        <div className="space-y-2.5">
          {activeAllocations.map((a) => {
            const product = productByAsset.get(a.id);
            const amount = (monthly * a.percent) / 100;
            return (
              <ProductCard
                key={a.id}
                allocation={a}
                product={product}
                amount={amount}
                isGold={isGold}
              />
            );
          })}
        </div>
      </Expandable>

      {/* CTA */}
      <div className="rounded-3xl bg-[var(--primary-soft)] p-4">
        <div className="font-display text-base font-semibold text-[var(--primary-strong)] mb-2">
          Kom i gang på 3 steg
        </div>
        <ol className="space-y-2 text-[13px]">
          <Step n={1}>
            Opprett <strong>gratis konto hos Nordnet</strong> — det tar 2 minutter.
          </Step>
          <Step n={2}>
            Sett opp <strong>månedlig spareavtale</strong> for hvert produkt med beløpene over.
          </Step>
          <Step n={3}>
            {portfolio === "allweather" ? (
              <><strong>Rebalanser 1 gang i året</strong> — kjøp mer av det som har sunket.</>
            ) : (
              <><strong>Ikke rør porteføljen</strong> — la den vokse i fred. Kjøp litt mer hver måned.</>
            )}
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
          Gjør du dette nå, investerer du blant topp 0,1% i verden.
        </p>
      </div>
    </div>
  );
}

/* ---- Portfolio tab ---- */
function PortfolioTab({
  active,
  onClick,
  label,
  name,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  name: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-3 py-3 text-left transition-all ${
        active
          ? "bg-[var(--primary-soft)] border-2 border-[var(--primary)]"
          : "bg-[var(--surface)] border border-[var(--border)]"
      }`}
    >
      <div className={`text-[10px] uppercase tracking-wider ${active ? "text-[var(--primary-strong)]" : "text-[var(--muted)] opacity-60"}`}>
        {label}
      </div>
      <div className={`font-display font-semibold leading-tight mt-0.5 ${
        active ? "text-[17px] text-[var(--foreground)]" : "text-[14px] text-[var(--muted)]"
      }`}>
        {name}
      </div>
      <div className={`text-[11px] mt-0.5 ${active ? "text-[var(--primary-strong)]" : "text-[var(--muted)] opacity-50"}`}>
        {sub}
      </div>
    </button>
  );
}

/* ---- Expandable ---- */
function Expandable({
  title,
  preview,
  children,
  variant = "default",
  alwaysShowPreview = false,
}: {
  title: string;
  preview: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "highlight";
  alwaysShowPreview?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const bg =
    variant === "highlight"
      ? "bg-[var(--primary-soft)]"
      : "bg-[var(--surface)] border border-[var(--border)]";
  const titleColor =
    variant === "highlight"
      ? "text-[var(--primary-strong)]"
      : "text-[var(--foreground)]";

  return (
    <div className={`rounded-3xl p-4 ${bg}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className={`font-display text-base font-semibold ${titleColor}`}>
            {title}
          </div>
          {(alwaysShowPreview || !open) && (
            <div className="text-[12px] text-[var(--muted)] mt-0.5 leading-snug">
              {preview}
            </div>
          )}
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 mt-1 flex-shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

/* ---- Step ---- */
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

/* ---- ProductCard ---- */
function ProductCard({
  allocation,
  product,
  amount,
  isGold,
}: {
  allocation: Allocation;
  product?: Product;
  amount: number;
  isGold: boolean;
}) {
  const dotColor = isGold ? allocation.color : allocation.colorLight;
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
      <div className="rounded-2xl bg-[var(--surface)] border border-dashed p-3" style={{ borderColor: WARN_BORDER }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full opacity-40"
            style={{ background: dotColor }}
          />
          <span className="text-[12px] font-semibold flex-1 text-[var(--muted)]">
            {allocation.label}
          </span>
          <span className="text-[11px] font-medium" style={{ color: WARN }}>
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
          style={{ background: dotColor }}
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
      {product.nordnetUrl && (
        <a
          href={product.nordnetUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("nordnet_product_click", { product: product.id })}
          className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--primary)] hover:underline"
        >
          Se på Nordnet
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M6 3h7v7" />
            <path d="M13 3L3 13" />
          </svg>
        </a>
      )}
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

export function Disclaimer() {
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
