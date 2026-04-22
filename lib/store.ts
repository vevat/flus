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

export type FamilyMember = {
  id: string;
  name: string;
  age: number;
  dailyAmount: number;
  /** Ekstra kr/mnd foreldrene sparer for dette medlemmet */
  parentContribution: number;
};

export type ThemeId = "original" | "exclusive";

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
  /** Brukerjusterte beløp per hack (overskriver default) */
  hackAmounts: Record<string, number>;
  /** Familiemedlemmer */
  familyMembers: FamilyMember[];
  /** Visuelt tema */
  theme: ThemeId;
  /** Om Millian har sett hilsenen sin */
  greetingSeen: boolean;

  /** UI-preferanser som huskes mellom sidevisninger */
  ui: {
    selectedAge: number | null;
    delayYears: number;
    boostTargetAge: number | null;
    boostCategory: string;
    investProvider: string;
    investMonthly: number | null;
    goalMillions: number;
    goalTargetAge: number | null;
  };

  setName: (name: string) => void;
  setAge: (age: number) => void;
  setAvatar: (id: AvatarId) => void;
  setInitialDaily: (daily: number) => void;
  addMilestoneGoal: (fromAge: number, daily: number) => void;
  removeGoal: (fromAge: number) => void;
  completeOnboarding: () => void;
  markTipSeen: (id: string) => void;
  toggleHack: (id: string) => void;
  setHackAmount: (id: string, amount: number) => void;
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  updateFamilyMember: (id: string, updates: Partial<Omit<FamilyMember, "id">>) => void;
  removeFamilyMember: (id: string) => void;
  setUi: (patch: Partial<FlusState["ui"]>) => void;
  setTheme: (theme: ThemeId) => void;
  setGreetingSeen: (seen: boolean) => void;
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
      hackAmounts: {},
      familyMembers: [],
      theme: "exclusive" as ThemeId,
      greetingSeen: false,
      ui: {
        selectedAge: null,
        delayYears: 10,
        boostTargetAge: null,
        boostCategory: "all",
        investProvider: "nordnet",
        investMonthly: null,
        goalMillions: 10,
        goalTargetAge: null,
      },

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
      setHackAmount: (id, amount) =>
        set((s) => ({
          hackAmounts: { ...s.hackAmounts, [id]: Math.max(0, amount) },
        })),
      addFamilyMember: (member) =>
        set((s) => ({
          familyMembers: [
            ...s.familyMembers,
            { ...member, id: crypto.randomUUID() },
          ],
        })),
      updateFamilyMember: (id, updates) =>
        set((s) => ({
          familyMembers: s.familyMembers.map((m) =>
            m.id === id ? { ...m, ...updates } : m,
          ),
        })),
      removeFamilyMember: (id) =>
        set((s) => ({
          familyMembers: s.familyMembers.filter((m) => m.id !== id),
        })),
      setUi: (patch) =>
        set((s) => ({ ui: { ...s.ui, ...patch } })),
      setTheme: (theme) => set({ theme }),
      setGreetingSeen: (seen) => set({ greetingSeen: seen }),
      reset: () =>
        set({
          hasOnboarded: false,
          name: "",
          age: 14,
          avatar: null,
          goals: [{ fromAge: 14, dailyAmount: DEFAULT_DAILY }],
          seenTips: [],
          acceptedHacks: [],
          hackAmounts: {},
          familyMembers: [],
          theme: "exclusive" as ThemeId,
          greetingSeen: false,
          ui: {
            selectedAge: null,
            delayYears: 10,
            boostTargetAge: null,
            boostCategory: "all",
            investProvider: "nordnet",
            investMonthly: null,
            goalMillions: 10,
            goalTargetAge: null,
          },
        }),
    }),
    {
      name: "flus-storage",
      storage: createJSONStorage(() => localStorage),
      version: 7,
      migrate: (persistedState, version) => {
        const s = (persistedState ?? {}) as Partial<FlusState>;
        if (version < 2 && !Array.isArray(s.acceptedHacks)) {
          s.acceptedHacks = [];
        }
        if (version < 3 && !Array.isArray(s.familyMembers)) {
          s.familyMembers = [];
        }
        if (version < 4 && !s.ui) {
          s.ui = {
            selectedAge: null,
            delayYears: 10,
            boostTargetAge: null,
            boostCategory: "all",
            investProvider: "nordnet",
            investMonthly: null,
            goalMillions: 10,
            goalTargetAge: null,
          };
        }
        if (version < 5 && !s.theme) {
          s.theme = "exclusive";
        }
        if (version < 6 && !s.hackAmounts) {
          s.hackAmounts = {};
        }
        if (version < 7 && s.greetingSeen === undefined) {
          s.greetingSeen = false;
        }
        return s as FlusState;
      },
    },
  ),
);
