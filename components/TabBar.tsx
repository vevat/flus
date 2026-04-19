"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useFlus } from "@/lib/store";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const TABS: Tab[] = [
  {
    href: "/",
    label: "Hjem",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M3 12 12 4l9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/boost",
    label: "Boost",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    href: "/mal",
    label: "Mål",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/plassere",
    label: "Plassere",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();
  const hasOnboarded = useFlus((s) => s.hasOnboarded);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || !hasOnboarded) return null;

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-30 mt-auto"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
      }}
    >
      <div
        className="mx-3 mb-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-stretch overflow-hidden"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
      >
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5"
            >
              {active && (
                <motion.div
                  layoutId="tab-active-bg"
                  className="absolute inset-1 rounded-xl bg-[var(--primary-soft)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  active ? "text-[var(--primary-strong)]" : "text-[var(--muted)]"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`relative z-10 text-[10px] font-semibold ${
                  active ? "text-[var(--primary-strong)]" : "text-[var(--muted)]"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
