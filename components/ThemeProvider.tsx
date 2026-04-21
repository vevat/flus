"use client";

import { useEffect } from "react";
import { useFlus } from "@/lib/store";

const GOLD_VARS: Record<string, string> = {
  "--background": "#08080a",
  "--surface": "#0f0f12",
  "--surface-2": "#1a1a1e",
  "--foreground": "#f0ede6",
  "--muted": "#908b80",
  "--muted-2": "#908b80",
  "--border": "#222226",
  "--primary": "#c9a84c",
  "--primary-soft": "rgba(201, 168, 76, 0.12)",
  "--primary-strong": "#dfc06a",
  "--gold": "#c9a84c",
  "--gold-soft": "rgba(201, 168, 76, 0.12)",
  "--accent": "#c9a84c",
  "--accent-soft": "rgba(201, 168, 76, 0.08)",
};

const ORIGINAL_VARS: Record<string, string> = {
  "--background": "#faf9f5",
  "--surface": "#ffffff",
  "--surface-2": "#f4f2ec",
  "--foreground": "#1a1a1a",
  "--muted": "#6b7280",
  "--muted-2": "#9ca3af",
  "--border": "#e8e4d9",
  "--primary": "#059669",
  "--primary-soft": "#d1fae5",
  "--primary-strong": "#047857",
  "--gold": "#f59e0b",
  "--gold-soft": "#fef3c7",
  "--accent": "#6366f1",
  "--accent-soft": "#e0e7ff",
};

function applyTheme(theme: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  const vars = theme === "exclusive" ? GOLD_VARS : ORIGINAL_VARS;

  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val, "important");
  }

  body.style.setProperty("background-color", vars["--background"], "important");
  body.style.setProperty("color", vars["--foreground"], "important");
}

export function ThemeProvider() {
  const theme = useFlus((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyTheme(useFlus.getState().theme);

    const unsub = useFlus.subscribe((state, prev) => {
      if (state.theme !== prev.theme) {
        applyTheme(state.theme);
      }
    });
    return unsub;
  }, []);

  return null;
}
