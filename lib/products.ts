/**
 * All Weather / All Seasons - allokering og konkrete produkter.
 *
 * Nordnet er eneste leverandør som tilbyr alle nødvendige byggeklosser
 * (ETF-er for obligasjoner, gull og råvarer) til All Weather-strategien.
 * DNB og Sparebank 1 mangler 3 av 5 aktivaklasser.
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

/**
 * Nordnet affiliate-lenke via Adtraction.
 * Bytt ut denne med din faktiske tracking-URL når programmet er godkjent.
 */
export const NORDNET_AFFILIATE_URL =
  "https://www.nordnet.no/kampanjer/pengebingen";

export type AssetClass = "stocks" | "longBonds" | "midBonds" | "shortBonds" | "gold" | "commodities";

export type PortfolioId = "allweather" | "buffett";

export type Allocation = {
  id: AssetClass;
  label: string;
  percent: number;
  color: string;
  colorLight: string;
  why: string;
};

export const ALLOCATIONS: Allocation[] = [
  {
    id: "stocks",
    label: "Aksjer (verden)",
    percent: 30,
    color: "#c4a87a",
    colorLight: "#a08050",
    why: "Vekst i gode tider og inflasjonstider med oppgang.",
  },
  {
    id: "longBonds",
    label: "Lange statsobligasjoner",
    percent: 40,
    color: "#9a9a9a",
    colorLight: "#8a8a8a",
    why: "Beskytter mot deflasjon og økonomisk nedgang.",
  },
  {
    id: "midBonds",
    label: "Mellomlange statsobligasjoner",
    percent: 15,
    color: "#4a4a4a",
    colorLight: "#5a5a5a",
    why: "Stabiliserer porteføljen i normale markeder.",
  },
  {
    id: "gold",
    label: "Gull",
    percent: 7.5,
    color: "#e8c33a",
    colorLight: "#b89a18",
    why: "Beskytter mot inflasjon og uro.",
  },
  {
    id: "commodities",
    label: "Råvarer",
    percent: 7.5,
    color: "#6e4a2a",
    colorLight: "#7a5430",
    why: "Beskytter mot uventet inflasjon.",
  },
];

export const BUFFETT_ALLOCATIONS: Allocation[] = [
  {
    id: "stocks",
    label: "Aksjer (verden)",
    percent: 90,
    color: "#c4a87a",
    colorLight: "#a08050",
    why: "Historisk beste aktivaklassen. Buffett mener aksjer alltid vinner over tid.",
  },
  {
    id: "shortBonds",
    label: "Korte statsobligasjoner",
    percent: 10,
    color: "#9a9a9a",
    colorLight: "#8a8a8a",
    why: "Trygg buffer som demper de verste fallene.",
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
    blurb:
      "Eneste plattform i Norge med alle byggeklossene til All Weather. 0 kr i kurtasje på fond, gratis aksjesparekonto, og automatisk månedssparing.",
    url: NORDNET_AFFILIATE_URL,
    recommended: true,
  },
  {
    id: "dnb",
    name: "DNB",
    blurb:
      "Har aksjer og obligasjoner, men mangler gull, råvarer og lange statsobligasjoner. Du får kun 2 av 5 aktivaklasser — ikke nok til All Weather.",
    url: "https://www.dnb.no/sparing-og-investering",
  },
  {
    id: "sparebank1",
    name: "Sparebank 1",
    blurb:
      "Har aksjer og obligasjoner via KLP, men mangler gull, råvarer og lange statsobligasjoner. Du får kun 2 av 5 aktivaklasser.",
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
  /** Direct link to this product's page on Nordnet */
  nordnetUrl?: string;
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
    nordnetUrl: "https://www.nordnet.no/market/funds/17334521-nordnet-indeksfond-global",
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
    nordnetUrl: "https://www.nordnet.no/market/etfs/16452522-i-shares-treasury-bond",
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
    nordnetUrl: "https://www.nordnet.no/etf/liste/i-shares-0-treasury-bond-iusm-xeta",
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
    nordnetUrl: "https://www.nordnet.no/market/trackers/17545382-i-shares-physical-gold",
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
    nordnetUrl: "https://www.nordnet.no/etf/liste/invesco-bloomberg-commodity-ucits-cmoe-xeta",
  },

  {
    id: "nn-shortbonds",
    asset: "shortBonds",
    provider: "nordnet",
    name: "iShares USD Treasury Bond 1-3yr UCITS ETF",
    isin: "IE00B14X4S71",
    ticker: "IBTS",
    ter: 0.07,
    description:
      "Korte amerikanske statsobligasjoner (1-3 år). Lav risiko, stabil verdi.",
    recommended: true,
    nordnetUrl: "https://www.nordnet.no/etf/liste/i-shares-0-treasury-bond-iusu-xeta",
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
    id: "dnb-shortbonds",
    asset: "shortBonds",
    provider: "dnb",
    name: "DNB Likviditet A",
    isin: "NO0010068694",
    ter: 0.2,
    description:
      "Pengemarkedsfond med lav risiko. Nærmeste DNB-alternativ til korte statsobligasjoner.",
    recommended: true,
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
    id: "sb1-shortbonds",
    asset: "shortBonds",
    provider: "sparebank1",
    name: "KLP Pengemarked",
    isin: "NO0010215644",
    ter: 0.1,
    description:
      "Pengemarkedsfond med lav risiko og stabil avkastning.",
    recommended: true,
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
