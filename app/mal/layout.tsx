import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparemål",
  description:
    "Sett et mål i millioner og se nøyaktig hva du må spare per måned i hver livsfase for å nå det.",
};

export default function MalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
