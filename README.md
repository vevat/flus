# Flus

En vakker, superenkel app som gjør sparing forståelig og motiverende for ungdom (14+) og voksne i Norge.

## Hovedidé

Velg avatar, alder og hvor mye du sparer per dag. Se umiddelbart hvor mye pengene dine kan vokse til når du blir 18, 25, 30, 40, 50, 60, 70 eller 80 år. Avataren din samler mynter, sedler, gull og pengesekker etter hvert som formuen vokser.

Innebygde regler:

- Forventet avkastning: 7% i året (realistisk aksjefond)
- Forventet inflasjon: 2,5% i året (Norges Banks mål)
- Sparebeløpet justeres opp med inflasjon hvert år automatisk
- Alle utregninger gjøres med ekte rentes-rente-formler

## Kjøre lokalt

```bash
npm install
npm run dev
```

Åpne http://localhost:3000 i nettleseren.

## Tech

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) – animasjoner
- [Recharts](https://recharts.org/) – verdi-graf
- [Zustand](https://zustand-demo.pmnd.rs/) + localStorage – state
- PWA-konfigurert (kan installeres på iPhone/Android home-screen)

## Filstruktur

```
app/
  layout.tsx       – fonter, viewport, manifest-lenke
  page.tsx         – velger Onboarding eller Home
  globals.css      – fargepalett + slider-styling
components/
  Onboarding.tsx   – navn + alder + avatar på én skjerm
  Home.tsx         – hovedskjerm med slidere, graf, avatar
  Avatar.tsx       – 6 illustrerte SVG-avatarer + rikdoms-elementer
  SavingsSlider.tsx
  AgeTimeline.tsx
  WealthChart.tsx
  TipCard.tsx
lib/
  finance.ts       – rentes-rente + inflasjon-utregninger
  store.ts         – Zustand-store med localStorage
  cn.ts            – klasse-utility
public/
  manifest.json
  icon.svg
```

## Deploy

Anbefalt: [Vercel](https://vercel.com) – gratis og to klikk å sette opp.
