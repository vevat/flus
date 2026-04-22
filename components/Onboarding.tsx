"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { useFlus, type AvatarId } from "@/lib/store";
import { AvatarPicker } from "./Avatar";
import { track } from "@/lib/analytics";
import { useHoldRepeat } from "@/lib/hooks";

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
    <div className="flex-1 flex flex-col px-6 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="font-display text-2xl font-semibold leading-tight text-center">
          Velkommen til{" "}
          <span className="text-[var(--primary)]">Pengebingen</span>
        </div>
        <p className="mt-1 text-[var(--muted)] text-[13px] text-center leading-snug">
          Hemmeligheten til å bli millionær, enkelt og risikofritt.
          <br />
          Bli med i den eksklusive klubben som vet hvordan.
        </p>
      </motion.div>

      <div className="mt-5 space-y-4">
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
            className="mt-1 w-full px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-base focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all"
          />
        </div>

        {/* Alder */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)]">
            Hvor gammel er du?
          </label>
          <AgeStepper value={localAge} onChange={setLocalAge} min={8} max={80} />
        </div>

        {/* Avatar */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)]">
            Velg din figur
          </label>
          <div className="mt-1">
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
        className={`mt-4 w-full py-3.5 rounded-2xl text-base font-semibold transition-colors ${
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

function AgeStepper({ value, onChange, min, max }: {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
}) {
  const dec = useHoldRepeat(
    useCallback(() => onChange((v) => Math.max(min, v - 1)), [onChange, min]),
  );
  const inc = useHoldRepeat(
    useCallback(() => onChange((v) => Math.min(max, v + 1)), [onChange, max]),
  );

  const hint = dec.showHint || inc.showHint;

  return (
    <div className="mt-1 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <button
          type="button"
          {...dec.handlers}
          className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform select-none touch-none"
          aria-label="Minus"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <div className="font-display text-2xl font-semibold tabular-nums leading-none">
            {value}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">år</div>
        </div>
        <button
          type="button"
          {...inc.handlers}
          className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-lg font-semibold active:scale-95 transition-transform select-none touch-none"
          aria-label="Pluss"
        >
          +
        </button>
      </div>
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-[var(--muted-2)] text-center mt-1"
          >
            Hold inne for å gå raskere
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
