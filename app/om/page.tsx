import type { Metadata } from "next";

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
            rentes-rente effekten.
          </p>
          <p>
            Appen gir deg konkrete, velprøvde investeringsstrategier basert på
            Ray Dalios All Weather-portefølje og Warren Buffetts
            indeksfondsanbefaling, med direkte lenker til de eksakte fondene og
            ETF-ene du trenger.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Hvorfor og hvem</h2>
          <p>
            Tanken om Pengebingen som en app startet med at teknologen Cato
            ville gi unik innsikt til sin nevø, i anledning hans
            konfirmasjonsdag. Innsikt han selv skulle ønske at han selv hadde
            tilegnet seg som 14-åring.
          </p>
          <p>
            Å faktisk se og forstå hva små beløp, strukturert investering og
            bevissthet om investeringsprodukter, betydning av gebyrer, og
            rentes-rente effekten faktisk utgjør, er en berikelse. Og jo
            tidligere i livet man forstår dette, jo mer kraftfullt er det.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Eksterne lenker</h2>
          <p>
            Kan inneholde linker til affiliateprogrammer.
            Anbefalingene våre er basert utelukkende på produkttilgang,
            kostnader og diversifisering.
          </p>
        </div>

      </div>
    </div>
  );
}
