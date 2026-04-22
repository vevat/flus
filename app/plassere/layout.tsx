import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investeringsguide – Plassere",
  description:
    "Velg mellom Ray Dalios All Weather-portefølje og Warren Buffetts indeksfondstrategi. Konkrete fond og ETF-er hos Nordnet.",
};

export default function PlassereLayout({ children }: { children: React.ReactNode }) {
  return children;
}
