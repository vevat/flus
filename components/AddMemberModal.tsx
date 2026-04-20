"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFlus, type FamilyMember } from "@/lib/store";
import { track } from "@/lib/analytics";

type Props = {
  existing?: FamilyMember | null;
  onClose: () => void;
};

export function AddMemberModal({ existing, onClose }: Props) {
  const addFamilyMember = useFlus((s) => s.addFamilyMember);
  const updateFamilyMember = useFlus((s) => s.updateFamilyMember);

  const [name, setName] = useState(existing?.name ?? "");
  const [age, setAge] = useState(existing?.age ?? 14);
  const [daily, setDaily] = useState(existing?.dailyAmount ?? 50);
  const [parentContrib, setParentContrib] = useState(
    existing?.parentContribution ?? 0,
  );

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    if (existing) {
      updateFamilyMember(existing.id, {
        name: name.trim(),
        age,
        dailyAmount: daily,
        parentContribution: parentContrib,
      });
      track("family_member_updated", { age, daily, parentContrib });
    } else {
      addFamilyMember({
        name: name.trim(),
        age,
        dailyAmount: daily,
        parentContribution: parentContrib,
      });
      track("family_member_added", { age, daily, parentContrib });
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="w-full max-w-md bg-[var(--background)] rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-5" />
        <div className="font-display text-xl font-semibold">
          {existing ? "Rediger medlem" : "Legg til medlem"}
        </div>

        <div className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Navn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fornavn"
              className="mt-1 w-full px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-base focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Alder
            </label>
            <div className="mt-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setAge((a) => Math.max(0, a - 1))}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {age}
                </span>
                <span className="text-xs text-[var(--muted)] ml-1">år</span>
              </div>
              <button
                type="button"
                onClick={() => setAge((a) => Math.min(80, a + 1))}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>

          {/* Daily savings */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Egen sparing (kr/dag)
            </label>
            <div className="mt-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setDaily((d) => Math.max(0, d - 10))}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {daily}
                </span>
                <span className="text-xs text-[var(--muted)] ml-1">kr/dag</span>
              </div>
              <button
                type="button"
                onClick={() => setDaily((d) => Math.min(2000, d + 10))}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>

          {/* Parent contribution */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Foreldre sparer i tillegg (kr/mnd)
            </label>
            <div className="mt-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setParentContrib((p) => Math.max(0, p - 100))}
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {parentContrib}
                </span>
                <span className="text-xs text-[var(--muted)] ml-1">kr/mnd</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setParentContrib((p) => Math.min(50000, p + 100))
                }
                className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className={`mt-6 w-full py-4 rounded-2xl font-semibold active:scale-[0.98] transition-all ${
            canSave
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface-2)] text-[var(--muted-2)]"
          }`}
        >
          {existing ? "Lagre" : "Legg til"}
        </button>
      </motion.div>
    </motion.div>
  );
}
