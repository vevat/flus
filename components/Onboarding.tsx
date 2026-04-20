"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useFlus, type AvatarId } from "@/lib/store";
import { AvatarPicker } from "./Avatar";
import { track } from "@/lib/analytics";

export function Onboarding() {
  const setName = useFlus((s) => s.setName);
  const setAge = useFlus((s) => s.setAge);
  const setAvatar = useFlus((s) => s.setAvatar);
  const completeOnboarding = useFlus((s) => s.completeOnboarding);

  const [localName, setLocalName] = useState("");
  const [localAge, setLocalAge] = useState(14);
  const [localAvatar, setLocalAvatar] = useState<AvatarId | null>(null);

  const canSubmit =
    localName.trim().length > 0 && localAge >= 8 && localAvatar !== null;

  const submit = () => {
    if (!canSubmit) return;
    setName(localName.trim());
    setAge(localAge);
    if (localAvatar) setAvatar(localAvatar);
    completeOnboarding();
    track("onboarding_completed", { age: localAge, avatar: localAvatar });
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-10 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="font-display text-3xl font-semibold leading-tight text-center">
          Velkommen til{" "}
          <span className="text-[var(--primary)]">Pengebingen</span>
        </div>
        <p className="mt-1 text-[var(--muted)] text-sm text-center">
          Bygg generational wealth – enkelt, uten risiko,
          <br />
          uten å miste nattesøvnen.
        </p>
      </motion.div>

      <div className="mt-7 space-y-5">
        {/* Navn */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)]">
            Hva heter du?
          </label>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Fornavn"
            autoComplete="given-name"
            className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-base focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all"
          />
        </div>

        {/* Alder */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)]">
            Hvor gammel er du?
          </label>
          <div className="mt-1.5 flex items-center gap-4 px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setLocalAge((a) => Math.max(8, a - 1))}
              className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-xl font-semibold active:scale-95 transition-transform"
              aria-label="Minus"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <div className="font-display text-3xl font-semibold tabular-nums leading-none">
                {localAge}
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">år</div>
            </div>
            <button
              type="button"
              onClick={() => setLocalAge((a) => Math.min(80, a + 1))}
              className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-xl font-semibold active:scale-95 transition-transform"
              aria-label="Pluss"
            >
              +
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)]">
            Velg din figur
          </label>
          <div className="mt-1.5">
            <AvatarPicker selected={localAvatar} onSelect={setLocalAvatar} />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <motion.button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        whileTap={canSubmit ? { scale: 0.97 } : undefined}
        className={`mt-8 w-full py-4 rounded-2xl text-base font-semibold transition-colors ${
          canSubmit
            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary-soft)]"
            : "bg-[var(--surface-2)] text-[var(--muted-2)]"
        }`}
      >
        Kom i gang
      </motion.button>
    </div>
  );
}
