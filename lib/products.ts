/**
 * All Weather / All Seasons - allokering og konkrete produkter
 * tilgjengelig for norske småsparere på Nordnet, DNB og Sparebank 1.
 *
 * Kilde for strategi:
 *  - Ray Dalio (Bridgewater Associates), via Tony Robbins:
 *    "Money: Master the Game" (2014)
 *  - Originale vekter: 30% aksjer, 40% lange statsobligasjoner,
 *    15% mellomlange statsobligasjoner, 7,5% gull, 7,5% råvarer
 *
 * MERK: Produktdetaljer (ISIN, TER) bør verifiseres mot leverandøren før kjøp.
 * Tilgjengelighet og kostnader kan endres.
 */

export type AssetClass = "stocks" | "longBonds" | "midBonds" | "gold" | "commodities";

export type Allocation = {
  id: AssetClass;
  label: string;
  percent: number;
  color: string;
  why: string;
};

export const ALLOCATIONS: Allocation[] = [
  {
    id: "stocks",
    label: "Aksjer (verden)",
    percent: 30,
    color: "#10b981",
    why: "Vekst i gode tider og inflasjonstider med oppgang.",
  },
  {
    id: "longBonds",
    label: "Lange statsobligasjoner",
    percent: 40,
    color: "#6366f1",
    why: "Beskytter mot deflasjon og økonomisk nedgang.",
  },
  {
    id: "midBonds",
    label: "Mellomlange statsobligasjoner",
    percent: 15,
    color: "#a78bfa",
    why: "Stabiliserer porteføljen i normale markeder.",
  },
  {
    id: "gold",
    label: "Gull",
    percent: 7.5,
    color: "#f59e0b",
    why: "Beskytter mot inflasjon og uro.",
  },
  {
    id: "commodities",
    label: "Råvarer",
    percent: 7.5,
    color: "#ef4444",
    why: "Beskytter mot uventet inflasjon.",
  },
];

export type ProviderId = "nordnet" | "dnb" | "sparebank1";

export type Provider = {
  id: ProviderId;
  name: string;
  blurb: string;
  url: string;
  recommended?: boolean;
};

export const PROVIDERS: Provider[] = [
  {
    id: "nordnet",
    name: "Nordnet",
    blurb: "Full tilgang til ETF-er, lave kostnader, eget aksjesparekonto.",
    url: "https://www.nordnet.no",
    recommended: true,
  },
  {
    id: "dnb",
    name: "DNB",
    blurb: "Norges største bank. Enkelt å sette opp månedlig spareavtale.",
    url: "https://www.dnb.no/sparing-og-investering",
  },
  {
    id: "sparebank1",
    name: "Sparebank 1",
    blurb: "God app, KLP-fond med lave kostnader.",
    url: "https://www.sparebank1.no/nb/sparing-og-investering",
  },
];

export type Product = {
  /** Stabil id */
  id: string;
  asset: AssetClass;
  provider: ProviderId;
  name: string;
  /** ISIN-kode (12 tegn) eller børsticker hvis ETF */
  isin?: string;
  ticker?: string;
  /** Total Expense Ratio i prosent per år */
  ter?: number;
  description: string;
  /** Hvis dette er beste tilgjengelige alternativ for asset-klassen hos provider */
  recommended?: boolean;
  /** Hvis produkt ikke finnes hos provider */
  unavailable?: boolean;
  /** Forklaring når unavailable */
  unavailableNote?: string;
};

export const PRODUCTS: Product[] = [
  // ------- Nordnet (full ETF + fond) -------
  {
    id: "nn-stocks",
    asset: "stocks",
    provider: "nordnet",
    name: "Nordnet Indeksfond Global",
    isin: "SE0019792842",
    ter: 0.0,
    description:
      "Globalt indeksfond med 0% forvaltningskostnad hos Nordnet. Følger MSCI World.",
    recommended: true,
  },
  {
    id: "nn-stocks-iwda",
    asset: "stocks",
    provider: "nordnet",
    name: "iShares Core MSCI World UCITS ETF",
    isin: "IE00B4L5Y983",
    ticker: "IWDA",
    ter: 0.2,
    description:
      "Klassisk verdensindeks-ETF. Akkumulerende (utbytte reinvesteres automatisk).",
  },
  {
    id: "nn-longbonds",
    asset: "longBonds",
    provider: "nordnet",
    name: "iShares USD Treasury Bond 20+yr UCITS ETF",
    isin: "IE00BSKRJZ44",
    ticker: "DTLA",
    ter: 0.07,
    description:
      "Lange amerikanske statsobligasjoner (20+ år). Klassisk All Weather-byggekloss.",
    recommended: true,
  },
  {
    id: "nn-midbonds",
    asset: "midBonds",
    provider: "nordnet",
    name: "iShares USD Treasury Bond 7-10yr UCITS ETF",
    isin: "IE00B1FZS798",
    ticker: "IDTM",
    ter: 0.07,
    description:
      "Mellomlange amerikanske statsobligasjoner. Stabiliserende komponent.",
    recommended: true,
  },
  {
    id: "nn-gold",
    asset: "gold",
    provider: "nordnet",
    name: "iShares Physical Gold ETC",
    isin: "IE00B4ND3602",
    ticker: "SGLN",
    ter: 0.12,
    description:
      "Fysisk gull lagret i sikre hvelv. En av de billigste gull-ETC-ene.",
    recommended: true,
  },
  {
    id: "nn-commod",
    asset: "commodities",
    provider: "nordnet",
    name: "Invesco Bloomberg Commodity UCITS ETF",
    isin: "IE00BD6FTQ80",
    ticker: "CMOD",
    ter: 0.19,
    description:
      "Bredt råvareindeks-ETF: olje, gass, metaller, korn, kjøtt, sukker.",
    recommended: true,
  },

  // ------- DNB (begrenset, fond over ETF) -------
  {
    id: "dnb-stocks",
    asset: "stocks",
    provider: "dnb",
    name: "DNB Global Indeks A",
    isin: "NO0010332247",
    ter: 0.19,
    description:
      "Lavkostnads globalt indeksfond. Følger MSCI World. Tilgjengelig som månedsspare.",
    recommended: true,
  },
  {
    id: "dnb-midbonds",
    asset: "midBonds",
    provider: "dnb",
    name: "DNB Obligasjon 20 (V)",
    isin: "NO0010338517",
    ter: 0.3,
    description:
      "Norske obligasjoner med moderat løpetid. Nærmeste alternativ til mellomlange statsobligasjoner.",
    recommended: true,
  },
  {
    id: "dnb-longbonds",
    asset: "longBonds",
    provider: "dnb",
    name: "Lange statsobligasjoner",
    unavailable: true,
    unavailableNote:
      "DNB har ikke et rent fond for lange (20+ år) statsobligasjoner. For å få denne komponenten må du ha aksjesparekonto/VPS hos Nordnet og kjøpe ETF (DTLA).",
    description: "",
  },
  {
    id: "dnb-gold",
    asset: "gold",
    provider: "dnb",
    name: "Gull",
    unavailable: true,
    unavailableNote:
      "DNB tilbyr ikke gull-ETF/ETC i fondsutvalget. Bruk Nordnet for SGLN eller 4GLD.",
    description: "",
  },
  {
    id: "dnb-commod",
    asset: "commodities",
    provider: "dnb",
    name: "Råvarer",
    unavailable: true,
    unavailableNote:
      "DNB tilbyr ikke bredt råvarefond. Bruk Nordnet for CMOD.",
    description: "",
  },

  // ------- Sparebank 1 (KLP-fond) -------
  {
    id: "sb1-stocks",
    asset: "stocks",
    provider: "sparebank1",
    name: "KLP AksjeGlobal Indeks P",
    isin: "NO0010381103",
    ter: 0.18,
    description:
      "Globalt indeksfond fra KLP. Bredt diversifisert, lav kostnad, månedsspare-vennlig.",
    recommended: true,
  },
  {
    id: "sb1-midbonds",
    asset: "midBonds",
    provider: "sparebank1",
    name: "KLP Obligasjon Global II",
    isin: "NO0010801715",
    ter: 0.27,
    description:
      "Globale investment grade obligasjoner. God diversifisering og stabilitet.",
    recommended: true,
  },
  {
    id: "sb1-longbonds",
    asset: "longBonds",
    provider: "sparebank1",
    name: "Lange statsobligasjoner",
    unavailable: true,
    unavailableNote:
      "Sparebank 1 har ikke rent fond for lange (20+ år) statsobligasjoner. Bruk Nordnet for ETF DTLA.",
    description: "",
  },
  {
    id: "sb1-gold",
    asset: "gold",
    provider: "sparebank1",
    name: "Gull",
    unavailable: true,
    unavailableNote: "Ikke tilgjengelig i fondsutvalget. Bruk Nordnet.",
    description: "",
  },
  {
    id: "sb1-commod",
    asset: "commodities",
    provider: "sparebank1",
    name: "Råvarer",
    unavailable: true,
    unavailableNote: "Ikke tilgjengelig i fondsutvalget. Bruk Nordnet.",
    description: "",
  },
];

export function productsByProvider(provider: ProviderId): Product[] {
  return PRODUCTS.filter((p) => p.provider === provider);
}
