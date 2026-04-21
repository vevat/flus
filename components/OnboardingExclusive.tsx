"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFlus, type AvatarId } from "@/lib/store";
import { track } from "@/lib/analytics";
import Image from "next/image";

function useHoldRepeat(
  callback: () => void,
  initialDelay = 400,
  repeatDelay = 80
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeater = useRef<ReturnType<typeof setInterval> | null>(null);
  const cb = useRef(callback);
  cb.current = callback;

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (repeater.current) clearInterval(repeater.current);
    timer.current = null;
    repeater.current = null;
  }, []);

  const start = useCallback(() => {
    cb.current();
    timer.current = setTimeout(() => {
      repeater.current = setInterval(() => cb.current(), repeatDelay);
    }, initialDelay);
  }, [initialDelay, repeatDelay]);

  useEffect(() => stop, [stop]);

  return { onPointerDown: start, onPointerUp: stop, onPointerLeave: stop };
}

const ALL_AVATARS: AvatarId[] = [
  "zara", "emma", "sofia", "amara", "ida", "luna",
  "malik", "oscar", "jonas", "sander", "erik", "theo",
];

export function OnboardingExclusive() {
  const setName = useFlus((s) => s.setName);
  const setAge = useFlus((s) => s.setAge);
  const setAvatar = useFlus((s) => s.setAvatar);
  const completeOnboarding = useFlus((s) => s.completeOnboarding);

  const [localName, setLocalName] = useState("");
  const [localAge, setLocalAge] = useState(14);
  const [localAvatar, setLocalAvatar] = useState<AvatarId | null>(null);
  const [step, setStep] = useState(0);

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

  if (step === 0) {
    return (
      <div className="exclusive-bg flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.08] blur-[120px] pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="font-display text-[28px] font-semibold text-white text-center leading-tight tracking-tight">
              Pengebingen
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-medium">
                Eksklusiv tilgang
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 max-w-[280px]"
          >
            <p className="text-[15px] text-[#b5a890] text-center leading-relaxed">
              Hemmeligheten til å bli millionær.
              <br />
              <span className="text-white/90">Enkelt, risikofritt, og bevist.</span>
            </p>
            <p className="mt-4 text-[12px] text-[#908b80] text-center leading-relaxed">
              Strategien hyllet av <span className="text-white/90">Forbes</span> som den viktigste noensinne.
              Brukt av verdens beste investorer.
              <br />
              Nå tilgjengelig for deg.
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setStep(1)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 w-full max-w-[280px] py-4 rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#b8943e] text-[#0d0f14] text-[15px] font-bold tracking-wide shadow-lg shadow-[#c9a84c]/20 transition-all"
          >
            Bli med i klubben
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-4 text-[11px] text-[#5a5040] text-center"
          >
            Allerede brukt av tusenvis av nordmenn
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="exclusive-bg flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-[#c9a84c]/[0.04] blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col px-7 pt-8 pb-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-gradient-to-r from-[#c9a84c]/40 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c]/70 font-medium">
              Din profil
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#c9a84c]/40 to-transparent" />
          </div>
          <h2 className="font-display text-[17px] font-semibold text-white text-center mt-2 leading-snug">
            Hemmeligheten til å bli millionær
            <br />
            enkelt og risikofritt.
            <br />
            <span className="text-[#b5a890] font-normal text-[14px]">
              Bli med i den eksklusive klubben som vet hvordan.
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-6 space-y-4"
        >
          {/* Navn */}
          <div>
            <label className="text-[12px] font-medium text-[#908b80] uppercase tracking-wider">
              Navn
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Fornavn"
              autoComplete="given-name"
              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#0f0f12] border border-[#222226] text-white text-[15px] placeholder-[#44444a] focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
            />
          </div>

          {/* Alder */}
          <div>
            <label className="text-[12px] font-medium text-[#908b80] uppercase tracking-wider">
              Alder
            </label>
            <ExclusiveAgeStepper
              value={localAge}
              onChange={setLocalAge}
              min={8}
              max={80}
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="text-[12px] font-medium text-[#908b80] uppercase tracking-wider">
              Velg din figur
            </label>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {ALL_AVATARS.map((id) => {
                const active = localAvatar === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => setLocalAvatar(id)}
                    whileTap={{ scale: 0.92 }}
                    className={`relative rounded-full overflow-hidden aspect-square transition-all ${
                      active
                        ? "ring-[2px] ring-[#c9a84c] shadow-lg shadow-[#c9a84c]/20 scale-105"
                        : "ring-1 ring-[#222226] opacity-60 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={`/avatars/${id}.png`}
                      alt={id}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {active && (
                      <motion.div
                        layoutId="avatar-check-ex"
                        className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#c9a84c] text-[#0d0f14] text-[10px] font-bold flex items-center justify-center shadow"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="flex-1" />

        <motion.button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          whileTap={canSubmit ? { scale: 0.97 } : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-4 w-full py-3.5 rounded-2xl text-[15px] font-bold tracking-wide transition-all ${
            canSubmit
              ? "bg-gradient-to-r from-[#c9a84c] to-[#b8943e] text-[#0d0f14] shadow-lg shadow-[#c9a84c]/20"
              : "bg-[#0f0f12] text-[#44444a] border border-[#222226]"
          }`}
        >
          Start reisen
        </motion.button>
      </div>
    </div>
  );
}

function ExclusiveAgeStepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
}) {
  const decrement = useHoldRepeat(() =>
    onChange((v) => Math.max(min, v - 1))
  );
  const increment = useHoldRepeat(() =>
    onChange((v) => Math.min(max, v + 1))
  );

  return (
    <div className="mt-1.5 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0f0f12] border border-[#222226]">
      <button
        type="button"
        {...decrement}
        className="w-9 h-9 rounded-full bg-[#1a1a1e] border border-[#222226] flex items-center justify-center text-[#908b80] text-lg font-semibold active:scale-95 active:bg-[#c9a84c]/10 transition-all select-none touch-none"
        aria-label="Minus"
      >
        −
      </button>
      <div className="flex-1 text-center">
        <div className="font-display text-2xl font-semibold text-white tabular-nums leading-none">
          {value}
        </div>
        <div className="text-[10px] text-[#908b80] mt-0.5 uppercase tracking-wider">
          år
        </div>
      </div>
      <button
        type="button"
        {...increment}
        className="w-9 h-9 rounded-full bg-[#1a1a1e] border border-[#222226] flex items-center justify-center text-[#908b80] text-lg font-semibold active:scale-95 active:bg-[#c9a84c]/10 transition-all select-none touch-none"
        aria-label="Pluss"
      >
        +
      </button>
    </div>
  );
}
