"use client";

import { usePathname } from "next/navigation";
import { Disclaimer } from "./InvestGuide";

export function PlassereDisclaimer() {
  const pathname = usePathname();
  if (pathname !== "/plassere") return null;
  return (
    <div className="px-5 pb-2">
      <Disclaimer />
    </div>
  );
}
