import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  title: "Pengebingen",
  description:
    "Gjør dette nå, og du investerer blant topp 0,1% i verden. Enkelt, uten risiko, uten å miste nattesøvnen.",
  applicationName: "Pengebingen",
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
  openGraph: {
    title: "Pengebingen",
    description:
      "Gjør dette nå, og du investerer blant topp 0,1% i verden. Enkelt, uten risiko, uten å miste nattesøvnen.",
    url: "https://pengebingen.vercel.app",
    siteName: "Pengebingen",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pengebingen",
    description:
      "Gjør dette nå, og du investerer blant topp 0,1% i verden. Enkelt, uten risiko, uten å miste nattesøvnen.",
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
        <ThemeProvider />
        <AnalyticsProvider />
        <Analytics />
        <div className="mx-auto w-full max-w-md flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 flex flex-col">{children}</main>
          <TipCarousel />
          <PlassereDisclaimer />
          <footer className="text-center text-[10px] text-[var(--muted-2)] py-3">
            <div>&copy; {new Date().getFullYear()} Pengebingen. All rights reserved.</div>
            <div className="mt-px text-[9px]">Stay curious | Onkel Cato</div>
          </footer>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
