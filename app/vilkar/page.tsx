import type { Metadata } from "next";
import Link from "next/link";
import { Feedback } from "@/components/Feedback";

export const metadata: Metadata = {
  title: "Vilkår for bruk – Pengebingen",
  description:
    "Les vilkårene for bruk av Pengebingen, en gratis spare- og investeringsguide for unge nordmenn.",
};

export default function VilkarPage() {
  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Vilkår for bruk</h1>
        <p className="text-[13px] text-[var(--muted)] mt-1 leading-snug">
          Sist oppdatert: april 2026
        </p>
      </div>

      <div className="space-y-4 text-[13px] text-[var(--foreground)] leading-relaxed">
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Om tjenesten</h2>
          <p>
            Pengebingen er en gratis informasjonstjeneste som viser hvordan
            sparing og investering kan fungere over tid. Tjenesten er ment som et
            pedagogisk verktøy og gir ikke individuelle investeringsråd.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Ikke finansiell rådgivning</h2>
          <p>
            Innholdet på Pengebingen er kun ment som generell informasjon og
            utdanning. Det utgjør ikke finansiell rådgivning, investeringsråd
            eller anbefalinger tilpasset din personlige situasjon.
          </p>
          <p>
            Du bør alltid gjøre din egen research og eventuelt rådføre deg med
            en autorisert finansiell rådgiver før du tar investeringsbeslutninger.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Beregninger og estimater</h2>
          <p>
            Alle tall og beregninger i Pengebingen er estimater basert på
            historisk avkastning og forenklede modeller. Faktisk avkastning kan
            avvike vesentlig. Historisk avkastning er ingen garanti for
            fremtidig avkastning.
          </p>
          <p>
            Vi bruker 8 % årlig forventet avkastning og 3 % årlig inflasjon som
            standardverdier. Disse er basert på langsiktige historiske
            gjennomsnitt, men fremtiden kan avvike.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Annonselenker</h2>
          <p>
            Pengebingen inneholder annonselenker til Nordnet via
            affiliateprogrammer. Vi kan motta en godtgjørelse dersom du oppretter
            konto via disse lenkene. Dette påvirker ikke våre anbefalinger.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Ansvarsbegrensning</h2>
          <p>
            Pengebingen fraskriver seg ethvert ansvar for tap eller skade som
            følge av bruk av tjenesten eller informasjonen som presenteres.
            Bruk av tjenesten skjer på eget ansvar.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Endringer</h2>
          <p>
            Vi forbeholder oss retten til å oppdatere disse vilkårene når som
            helst. Vesentlige endringer vil bli kommunisert via tjenesten.
          </p>
        </div>
      </div>

      <Feedback />

      <div className="text-[11px] text-[var(--muted-2)] space-x-3">
        <Link href="/om" className="underline hover:text-[var(--muted)]">
          Om oss
        </Link>
        <Link href="/personvern" className="underline hover:text-[var(--muted)]">
          Personvern
        </Link>
      </div>
    </div>
  );
}
