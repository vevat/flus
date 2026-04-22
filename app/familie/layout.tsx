import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Familie – Del spareplanen",
  description:
    "Se familiens samlede spareplan og del din med venner og familie via QR-kode eller lenke.",
};

export default function FamilieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
