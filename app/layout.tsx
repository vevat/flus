import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/TabBar";

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
  title: "Flus – Se sparingen din vokse",
  description:
    "Flus gjør sparing forståelig og gøy. Se hva små beløp blir til over tid med rentes-rente.",
  applicationName: "Flus",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flus",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f5",
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
        <div className="mx-auto w-full max-w-md flex-1 flex flex-col">
          <main className="flex-1 flex flex-col">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
