"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlus, type FamilyMember } from "@/lib/store";
import {
  DEFAULTS,
  formatNok,
  projectWealth,
  getAtAge,
} from "@/lib/finance";
import { track } from "@/lib/analytics";
import { AddMemberModal } from "./AddMemberModal";
import { FamilyMemberCard } from "./FamilyMemberCard";

const MEMBER_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--gold)",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
];

export function Family({ readonly, members: externalMembers }: {
  readonly?: boolean;
  members?: FamilyMember[];
}) {
  const storeMembers = useFlus((s) => s.familyMembers);
  const removeFamilyMember = useFlus((s) => s.removeFamilyMember);

  const members = externalMembers ?? storeMembers;
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);

  const targetAge = 67;

  const projections = useMemo(() => {
    return members.map((m) => {
      const totalDaily =
        m.dailyAmount + m.parentContribution / DEFAULTS.daysPerMonth;
      const data = projectWealth({
        currentAge: m.age,
        endAge: targetAge,
        contributions: [{ fromAge: m.age, dailyAmount: totalDaily }],
      });
      const point = getAtAge(data, targetAge);
      return {
        member: m,
        nominal: point?.nominal ?? 0,
        contributed: point?.contributed ?? 0,
      };
    });
  }, [members, targetAge]);

  const totalNominal = projections.reduce((s, p) => s + p.nominal, 0);
  const totalMonthly = members.reduce(
    (s, m) =>
      s + m.dailyAmount * DEFAULTS.daysPerMonth + m.parentContribution,
    0,
  );

  return (
    <div className="flex-1 flex flex-col px-5 pt-5 pb-3">
      {/* Header */}
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
          Familie
        </div>
        <h1 className="font-display text-2xl font-semibold leading-tight mt-0.5">
          Familien din
        </h1>
        {members.length > 0 && (
          <p className="text-[13px] text-[var(--muted)] mt-1">
            Sparer totalt {formatNok(Math.round(totalMonthly))}/mnd
          </p>
        )}
      </div>

      {/* Members */}
      {members.length === 0 ? (
        <div className="mt-8 text-center">
          <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
          <p className="text-[var(--muted)] text-sm leading-snug max-w-[260px] mx-auto">
            Legg til familiemedlemmer for å se hva dere kan oppnå sammen.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {projections.map((p, i) => (
            <FamilyMemberCard
              key={p.member.id}
              member={p.member}
              nominal={p.nominal}
              color={MEMBER_COLORS[i % MEMBER_COLORS.length]}
              targetAge={targetAge}
              readonly={readonly}
              onEdit={() => setEditMember(p.member)}
              onRemove={() => {
                removeFamilyMember(p.member.id);
                track("family_member_removed");
              }}
            />
          ))}
        </div>
      )}

      {/* Total */}
      {members.length >= 2 && (
        <div className="mt-3 p-4 rounded-3xl bg-[var(--primary-soft)] border border-[var(--primary-strong)]/15">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[var(--primary-strong)] font-semibold">
              Familiens formue ved {targetAge}
            </span>
          </div>
          <div className="font-display text-3xl font-bold text-[var(--primary-strong)] mt-1">
            {formatNok(totalNominal, { compact: true })}
          </div>
        </div>
      )}

      {/* Add button */}
      {!readonly && (
        <button
          type="button"
          onClick={() => {
            setShowAdd(true);
            track("family_add_opened");
          }}
          className="mt-4 w-full py-3 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] text-[13px] text-[var(--muted)] font-medium active:scale-[0.99] transition-transform"
        >
          + Legg til familiemedlem
        </button>
      )}

      {/* Share family plan */}
      {!readonly && members.length > 0 && (
        <ShareFamilyButton members={members} />
      )}

      {/* Disclaimer */}
      {members.length > 0 && (
        <p className="mt-4 text-[11px] text-[var(--muted-2)] text-center leading-snug">
          Beregnet med 8% årlig avkastning og 2,5% inflasjon.
          <br />
          Historisk avkastning er ingen garanti.
        </p>
      )}

      <div className="flex-1" />

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAdd || editMember) && (
          <AddMemberModal
            existing={editMember}
            onClose={() => {
              setShowAdd(false);
              setEditMember(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const APP_URL = "https://pengebingen.vercel.app";

function encodePlan(members: FamilyMember[]): string {
  const compact = members.map((m) => ({
    name: m.name,
    age: m.age,
    dailyAmount: m.dailyAmount,
    parentContribution: m.parentContribution,
  }));
  return btoa(JSON.stringify(compact));
}

function ShareFamilyButton({ members }: { members: FamilyMember[] }) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const shareUrl = `${APP_URL}/familie?plan=${encodePlan(members)}`;
  const shareText = `Se familieplanen vår på Pengebingen! Vi sparer sammen for fremtiden.`;

  const share = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ title: "Pengebingen familieplan", text: shareText, url: shareUrl });
        track("family_plan_shared", { method: "native", memberCount: members.length });
      } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        track("family_plan_shared", { method: "copy", memberCount: members.length });
        setTimeout(() => setCopied(false), 2000);
      } catch { /* ignored */ }
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={`mt-2.5 w-full py-3 rounded-2xl text-[13px] font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
        copied
          ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
          : "bg-[var(--primary)] text-white"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      {copied ? "Lenke kopiert!" : "Del familieplan"}
    </button>
  );
}
