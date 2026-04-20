"use client";

import { type FamilyMember } from "@/lib/store";
import { DEFAULTS, formatNok } from "@/lib/finance";

type Props = {
  member: FamilyMember;
  nominal: number;
  color: string;
  targetAge: number;
  readonly?: boolean;
  onEdit: () => void;
  onRemove: () => void;
};

export function FamilyMemberCard({
  member,
  nominal,
  color,
  targetAge,
  readonly,
  onEdit,
  onRemove,
}: Props) {
  const monthly = Math.round(
    member.dailyAmount * DEFAULTS.daysPerMonth + member.parentContribution,
  );

  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3.5">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
          style={{ background: color }}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-[15px] leading-tight truncate">
              {member.name}
            </span>
            <span className="text-[12px] text-[var(--muted)] flex-shrink-0">
              {member.age} år
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-[var(--muted)]">
            {member.dailyAmount > 0 && (
              <span>Sparer {member.dailyAmount} kr/dag</span>
            )}
            {member.parentContribution > 0 && (
              <span>+ {formatNok(member.parentContribution)}/mnd fra foreldre</span>
            )}
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[11px] text-[var(--muted)]">
              {formatNok(monthly)}/mnd totalt
            </span>
            <span className="font-display text-[15px] font-bold tabular-nums">
              {formatNok(nominal, { compact: true })}
              <span className="text-[11px] font-normal text-[var(--muted)] ml-1">
                ved {targetAge}
              </span>
            </span>
          </div>
        </div>
      </div>

      {!readonly && (
        <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-1.5 rounded-xl text-[12px] font-medium text-[var(--muted)] active:scale-[0.98] transition-transform"
          >
            Rediger
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 py-1.5 rounded-xl text-[12px] font-medium text-[var(--muted)] active:scale-[0.98] transition-transform"
          >
            Fjern
          </button>
        </div>
      )}
    </div>
  );
}
