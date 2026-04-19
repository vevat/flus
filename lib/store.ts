"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AvatarId =
  | "zara"
  | "emma"
  | "sofia"
  | "amara"
  | "nova"
  | "ida"
  | "malik"
  | "oscar"
  | "jonas"
  | "sander"
  | "erik"
  | "theo"
  | "luna";

export type Goal = {
  /** Alder kontribusjonen starter på */
  fromAge: number;
  /** Daglig sparebeløp i dagens kroner */
  dailyAmount: number;
};

type FlusState = {
  hasOnboarded: boolean;
  name: string;
  age: number;
  avatar: AvatarId | null;
  /** Liste over sparemål - første er startbeløpet, ev. flere ved milepæler */
  goals: Goal[];
  /** Hvilke tips brukeren har sett (skal ikke gjenta seg umiddelbart) */
  seenTips: string[];
  /** Sparehacks brukeren har sagt "skal" gjøre (bygger fremtidsverdi i Boost) */
  acceptedHacks: string[];

  setName: (name: string) => void;
  setAge: (age: number) => void;
  setAvatar: (id: AvatarId) => void;
  setInitialDaily: (daily: number) => void;
  addMilestoneGoal: (fromAge: number, daily: number) => void;
  removeGoal: (fromAge: number) => void;
  completeOnboarding: () => void;
  markTipSeen: (id: string) => void;
  toggleHack: (id: string) => void;
  reset: () => void;
};

const DEFAULT_DAILY = 50;

export const useFlus = create<FlusState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      name: "",
      age: 14,
      avatar: null,
      goals: [{ fromAge: 14, dailyAmount: DEFAULT_DAILY }],
      seenTips: [],
      acceptedHacks: [],

      setName: (name) => set({ name }),
      setAge: (age) =>
        set((s) => {
          // Hold første mål synkronisert med valgt alder hvis ikke onboardet enda
          if (!s.hasOnboarded) {
            const goals = [...s.goals];
            if (goals.length > 0) {
              goals[0] = { ...goals[0], fromAge: age };
            }
            return { age, goals };
          }
          return { age };
        }),
      setAvatar: (avatar) => set({ avatar }),
      setInitialDaily: (daily) =>
        set((s) => {
          const goals = [...s.goals];
          if (goals.length > 0) {
            goals[0] = { ...goals[0], dailyAmount: daily };
          } else {
            goals.push({ fromAge: s.age, dailyAmount: daily });
          }
          return { goals };
        }),
      addMilestoneGoal: (fromAge, daily) =>
        set((s) => {
          // Erstatt evt eksisterende mål med samme fromAge
          const filtered = s.goals.filter((g) => g.fromAge !== fromAge);
          const goals = [...filtered, { fromAge, dailyAmount: daily }].sort(
            (a, b) => a.fromAge - b.fromAge,
          );
          return { goals };
        }),
      removeGoal: (fromAge) =>
        set((s) => {
          // Aldri fjern det første målet (startbeløpet)
          if (s.goals.length === 0) return s;
          const first = s.goals[0];
          if (first.fromAge === fromAge) return s;
          return { goals: s.goals.filter((g) => g.fromAge !== fromAge) };
        }),
      completeOnboarding: () => set({ hasOnboarded: true }),
      markTipSeen: (id) =>
        set((s) => ({
          seenTips: s.seenTips.includes(id) ? s.seenTips : [...s.seenTips, id],
        })),
      toggleHack: (id) =>
        set((s) => ({
          acceptedHacks: s.acceptedHacks.includes(id)
            ? s.acceptedHacks.filter((h) => h !== id)
            : [...s.acceptedHacks, id],
        })),
      reset: () =>
        set({
          hasOnboarded: false,
          name: "",
          age: 14,
          avatar: null,
          goals: [{ fromAge: 14, dailyAmount: DEFAULT_DAILY }],
          seenTips: [],
          acceptedHacks: [],
        }),
    }),
    {
      name: "flus-storage",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState, version) => {
        const s = (persistedState ?? {}) as Partial<FlusState>;
        if (version < 2 && !Array.isArray(s.acceptedHacks)) {
          s.acceptedHacks = [];
        }
        return s as FlusState;
      },
    },
  ),
);
