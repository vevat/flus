"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { AvatarId } from "@/lib/store";

export type WealthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function wealthLevelFromAmount(nominal: number): WealthLevel {
  if (nominal < 5_000) return 0;
  if (nominal < 50_000) return 1;
  if (nominal < 250_000) return 2;
  if (nominal < 1_000_000) return 3;
  if (nominal < 5_000_000) return 4;
  return 5;
}

const ALL_AVATARS: AvatarId[] = [
  "zara",
  "emma",
  "sofia",
  "amara",
  "ida",
  "luna",
  "malik",
  "oscar",
  "jonas",
  "sander",
  "erik",
  "theo",
];

export function Avatar({
  id,
  size = 56,
  level,
  className,
}: {
  id: AvatarId;
  size?: number;
  level?: WealthLevel;
  className?: string;
}) {
  const ring =
    level !== undefined && level >= 3
      ? "ring-2 ring-[var(--gold)]"
      : level !== undefined && level >= 1
        ? "ring-2 ring-[var(--primary)]/40"
        : "";

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden ${ring} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/avatars/${id}.png`}
        alt={id}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}

export function AvatarPicker({
  selected,
  onSelect,
}: {
  selected: AvatarId | null;
  onSelect: (id: AvatarId) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {ALL_AVATARS.map((id) => {
        const active = selected === id;
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            whileTap={{ scale: 0.92 }}
            className={`relative rounded-full overflow-hidden aspect-square transition-all ${
              active
                ? "ring-[3px] ring-[var(--primary)] shadow-lg scale-105"
                : "ring-1 ring-[var(--border)] opacity-75 hover:opacity-100"
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
                layoutId="avatar-check"
                className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center shadow"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
