import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparehacks – Boost",
  description:
    "Finn enkle måter å spare mer i hverdagen. Kutt kaffen, pant flasker, mealprep — se hva det blir verdt over tid.",
};

export default function BoostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
