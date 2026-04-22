import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import "./globals.css";
import { TabBar } from "@/components/TabBar";
import { TopBar } from "@/components/TopBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { TipCarousel } from "@/components/TipCard";
import { PlassereDisclaimer } from "@/components/PlassereDisclaimer";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: {
    default: "Pengebingen – Gratis sparekalkulator og investeringsguide",
    template: "%s – Pengebingen",
  },
  description:
    "Se hva små daglige beløp blir til over tid. Gratis spare- og investeringsguide for unge nordmenn med velprøvde strategier fra Ray Dalio og Warren Buffett.",
  applicationName: "Pengebingen",
  keywords: [
    "sparekalkulator",
    "investering",
    "sparing",
    "renters rente",
    "indeksfond",
    "All Weather",
    "Warren Buffett",
    "Nordnet",
    "unge investorer",
    "Norge",
    "personlig økonomi",
  ],
  authors: [{ name: "Pengebingen" }],
  creator: "Pengebingen",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pengebingen",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  metadataBase: new URL("https://pengebingen.vercel.app"),
  openGraph: {
    title: "Pengebingen – Gratis sparekalkulator og investeringsguide",
    description:
      "Se hva små daglige beløp blir til over tid. Gratis spare- og investeringsguide for unge nordmenn med velprøvde strategier fra Ray Dalio og Warren Buffett.",
    url: "https://pengebingen.vercel.app",
    siteName: "Pengebingen",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pengebingen – Gratis sparekalkulator og investeringsguide",
    description:
      "Se hva små daglige beløp blir til over tid. Gratis spare- og investeringsguide for unge nordmenn.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Pengebingen",
              url: "https://pengebingen.vercel.app",
              description:
                "Gratis spare- og investeringsguide for unge nordmenn. Se hva små daglige beløp blir til over tid med velprøvde strategier fra Ray Dalio og Warren Buffett.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "NOK",
              },
              inLanguage: "nb",
              author: {
                "@type": "Person",
                name: "Cato",
              },
            }),
          }}
        />
        <ThemeProvider />
        <AnalyticsProvider />
        <Analytics />
        <div className="mx-auto w-full max-w-md flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex flex-col">
            {children}
            <TipCarousel />
            <PlassereDisclaimer />
            <footer className="text-center text-[10px] text-[var(--muted-2)] py-3 mt-auto">
              <div className="flex items-center justify-center gap-2">
                <Link href="/om" className="hover:text-[var(--muted)] transition-colors">Om</Link>
                <span aria-hidden="true">·</span>
                <Link href="/personvern" className="hover:text-[var(--muted)] transition-colors">Personvern</Link>
                <span aria-hidden="true">·</span>
                <Link href="/vilkar" className="hover:text-[var(--muted)] transition-colors">Vilkår</Link>
              </div>
              <div className="mt-1">&copy; {new Date().getFullYear()} Pengebingen. Alle rettigheter reservert.</div>
              <div className="mt-px text-[9px]">Stay curious</div>
            </footer>
            {/* Spacer so footer clears the fixed TabBar */}
            <div className="h-20 shrink-0" aria-hidden="true" />
          </main>
        </div>
        <TabBar />
      </body>
    </html>
  );
}
