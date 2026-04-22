import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om Pengebingen",
  description:
    "Pengebingen er en gratis norsk spare- og investeringskalkulator som hjelper unge nordmenn med å bygge formue over tid.",
};

export default function OmPage() {
  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Om Pengebingen</h1>
        <p className="text-[13px] text-[var(--muted)] mt-1 leading-snug">
          Laget med kjærlighet for neste generasjon sparere.
        </p>
      </div>

      <div className="space-y-4 text-[13px] text-[var(--foreground)] leading-relaxed">
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Hva er Pengebingen?</h2>
          <p>
            Pengebingen er en gratis norsk spare- og investeringsguide laget for
            unge nordmenn. Vi viser deg hvordan små daglige beløp — fra en pose
            nudler til en kopp kaffe — kan vokse til millioner over tid med
            renters rente.
          </p>
          <p>
            Appen gir deg konkrete, velprøvde investeringsstrategier basert på
            Ray Dalios All Weather-portefølje og Warren Buffetts
            indeksfondsanbefaling, med direkte lenker til de eksakte fondene og
            ETF-ene du trenger.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Hvorfor laget vi dette?</h2>
          <p>
            De fleste nordmenn lærer aldri om investering på skolen. Resultatet
            er at pengene blir stående på sparekonto med negativ realavkastning.
            Pengebingen er laget for å gjøre investering tilgjengelig og
            forståelig — spesielt for de som er unge nok til å utnytte tidenes
            beste superkraft: tid.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Hvem står bak?</h2>
          <p>
            Pengebingen er et uavhengig prosjekt drevet av Cato, en norsk
            teknolog og far som ønsker å gi barna sine — og alle andre — et
            forsprang i personlig økonomi.
          </p>
          <p className="text-[var(--muted)]">
            Kontakt:{" "}
            <a
              href="mailto:hei@pengebingen.no"
              className="underline text-[var(--primary)]"
            >
              hei@pengebingen.no
            </a>
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Hvordan tjener vi penger?</h2>
          <p>
            Pengebingen er helt gratis å bruke. Vi kan motta en godtgjørelse fra
            Nordnet dersom du oppretter konto via våre lenker. Dette påvirker
            ikke anbefalingene våre, som er basert utelukkende på produkttilgang,
            kostnader og diversifisering.
          </p>
        </div>
      </div>

      <div className="text-[11px] text-[var(--muted-2)] space-x-3">
        <Link href="/personvern" className="underline hover:text-[var(--muted)]">
          Personvern
        </Link>
        <Link href="/vilkar" className="underline hover:text-[var(--muted)]">
          Vilkår
        </Link>
      </div>
    </div>
  );
}
