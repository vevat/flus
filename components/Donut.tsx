"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ALLOCATIONS, type Allocation } from "@/lib/products";

type Props = {
  size?: number;
  highlightId?: string | null;
  onSliceClick?: (id: string) => void;
  useLight?: boolean;
  allocations?: Allocation[];
  centerLabel?: string;
  centerSub?: string;
};

export function Donut({
  size = 180,
  highlightId,
  onSliceClick,
  useLight,
  allocations = ALLOCATIONS,
  centerLabel = "All Weather",
  centerSub,
}: Props) {
  const data = allocations.map((a) => ({
    name: a.label,
    value: a.percent,
    color: useLight ? a.colorLight : a.color,
    id: a.id,
  }));

  const inner = size * 0.32;
  const outer = size * 0.48;

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={2}
            stroke="var(--background)"
            strokeWidth={3}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
            onClick={(d) => {
              const id = (d as unknown as { id?: string }).id;
              if (id) onSliceClick?.(id);
            }}
          >
            {data.map((entry) => {
              const dim =
                highlightId !== null &&
                highlightId !== undefined &&
                highlightId !== entry.id;
              return (
                <Cell
                  key={entry.id}
                  fill={entry.color}
                  opacity={dim ? 0.25 : 1}
                  style={{ cursor: onSliceClick ? "pointer" : "default" }}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
          {centerLabel}
        </div>
        <div className="font-display text-base font-semibold leading-tight">
          {centerSub ?? `${allocations.length} byggeklosser`}
        </div>
      </div>
    </div>
  );
}
