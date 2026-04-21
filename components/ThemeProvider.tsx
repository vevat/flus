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

const LIGHT_VARS: Record<string, string> = {
  "--background": "#faf8f4",
  "--surface": "#ffffff",
  "--surface-2": "#f3f0e8",
  "--foreground": "#1a1714",
  "--muted": "#7a7368",
  "--muted-2": "#9a9488",
  "--border": "#e4ddd0",
  "--primary": "#b8952e",
  "--primary-soft": "rgba(184, 149, 46, 0.1)",
  "--primary-strong": "#9a7a1e",
  "--gold": "#b8952e",
  "--gold-soft": "rgba(184, 149, 46, 0.1)",
  "--accent": "#b8952e",
  "--accent-soft": "rgba(184, 149, 46, 0.06)",
};

function applyTheme(theme: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  const vars = theme === "exclusive" ? GOLD_VARS : LIGHT_VARS;

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
