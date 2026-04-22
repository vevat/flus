import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personvernerklæring – Pengebingen",
  description:
    "Les om hvordan Pengebingen behandler dine personopplysninger og bruker informasjonskapsler.",
};

export default function PersonvernPage() {
  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Personvernerklæring</h1>
        <p className="text-[13px] text-[var(--muted)] mt-1 leading-snug">
          Sist oppdatert: april 2026
        </p>
      </div>

      <div className="space-y-4 text-[13px] text-[var(--foreground)] leading-relaxed">
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Hvilke data samler vi inn?</h2>
          <p>
            Pengebingen lagrer all brukerdata (navn, alder, sparemål) lokalt i
            nettleseren din via localStorage. Vi sender ingen personopplysninger
            til våre servere.
          </p>
          <p>Vi bruker følgende tredjepartstjenester:</p>
          <ul className="list-disc pl-5 space-y-1 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Vercel Analytics</strong>{" "}
              — anonymisert trafikkanalyse uten informasjonskapsler
            </li>
            <li>
              <strong className="text-[var(--foreground)]">PostHog</strong>{" "}
              — anonymisert produktanalyse for å forbedre brukeropplevelsen
            </li>
          </ul>
          <p>
            Ingen av disse tjenestene samler inn personlig identifiserbar
            informasjon (PII).
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Informasjonskapsler (cookies)</h2>
          <p>
            Pengebingen bruker ingen sporingsinformasjonskapsler. Vi bruker
            localStorage for å huske innstillingene dine mellom besøk. Du kan
            slette disse når som helst via nettleserens innstillinger.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Lenker til tredjeparter</h2>
          <p>
            Pengebingen inneholder lenker til Nordnet og andre finansielle
            tjenester. Vi er ikke ansvarlige for personvernpraksisen til disse
            tjenestene. Vi oppfordrer deg til å lese deres personvernerklæringer.
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3">
          <h2 className="font-display text-base font-semibold">Dine rettigheter</h2>
          <p>
            Siden vi ikke lagrer persondata på våre servere, har du full kontroll
            over dine data via nettleseren. Du kan når som helst slette all
            lagret informasjon ved å bruke «Start på nytt»-knappen i appen eller
            tømme nettleserdata.
          </p>
        </div>
      </div>

      <div className="text-[11px] text-[var(--muted-2)] space-x-3">
        <Link href="/om" className="underline hover:text-[var(--muted)]">
          Om oss
        </Link>
        <Link href="/vilkar" className="underline hover:text-[var(--muted)]">
          Vilkår
        </Link>
      </div>
    </div>
  );
}
