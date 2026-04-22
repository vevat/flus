"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type ProjectionPoint } from "@/lib/finance";

/**
 * Konsistent visning av kroner i grafen — alltid i millioner, uten "kr".
 * 1 desimal under 10 mill, hele tall over.
 *  50 000   → "0,1 mill"
 *  1 300 000 → "1,3 mill"
 *  12 000 000 → "12 mill"
 */
function formatMill(amount: number): string {
  if (!isFinite(amount) || amount < 50_000) return "0";
  const m = amount / 1_000_000;
  const decimals = m < 10 ? 1 : 0;
  const str = m.toLocaleString("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${str} mill`;
}

/**
 * Y-akse-formatering: bare tallet, uten "mill"-suffiks. Hele tall hvis mulig.
 *  3 000 000 → "3"
 *  500 000   → "0,5"
 *  10 000 000 → "10"
 */
function formatYAxis(amount: number): string {
  if (amount === 0) return "";
  const m = amount / 1_000_000;
  // Hvis nær et helt tall, bruk hele tall
  if (Math.abs(m - Math.round(m)) < 0.05) return Math.round(m).toString();
  return m.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

type Props = {
  data: ProjectionPoint[];
  /** Valgfri delayed-projeksjon - rendres som stiplet linje */
  delayedData?: ProjectionPoint[];
  selectedAge: number;
  /** Antall år delayed scenariet er forsinket - 0 = vis ikke */
  delayYears?: number;
  /** Valgfritt målbeløp - vises som horisontal stiplet linje */
  targetValue?: number;
  height?: number;
};

type ChartPoint = {
  age: number;
  nominal: number;
  delayed: number | null;
};

export function WealthChart({
  data,
  delayedData,
  selectedAge,
  delayYears = 0,
  targetValue,
  height = 220,
}: Props) {
  const merged: ChartPoint[] = useMemo(() => {
    const delayedByAge = new Map<number, number>();
    if (delayedData && delayYears > 0) {
      for (const p of delayedData) delayedByAge.set(p.age, p.nominal);
    }
    return data
      .filter((p) => p.age <= selectedAge)
      .map((p) => ({
        age: p.age,
        nominal: p.nominal,
        delayed:
          delayYears > 0
            ? (delayedByAge.get(p.age) ?? null)
            : null,
      }));
  }, [data, delayedData, selectedAge, delayYears]);

  const selectedPoint = merged[merged.length - 1];
  const maxNominal = merged.reduce(
    (m, p) => (p.nominal > m ? p.nominal : m),
    0,
  );

  const { yMax, yTicks } = millionTicks(
    Math.max(maxNominal, targetValue ?? 0),
  );
  // Skjul øverste Y-tall (overflødig, faktisk verdi vises langs kurven) +
  // 0-ticken (tom label gir tom <tspan>).
  const yTicksDisplay = (yTicks.length >= 2 ? yTicks.slice(0, -1) : yTicks).filter(
    (v) => v > 0,
  );

  const ageTicks = useMemo(() => xTicks(merged), [merged]);
  const startAge = merged[0]?.age ?? 0;
  const endAge = merged[merged.length - 1]?.age ?? startAge;

  // Tiår-merker for verdi-labels på selve kurven (20, 30, 40 ...)
  // Hopper over selectedAge for å unngå krasj med highlighted dot
  const decadePoints = useMemo(() => {
    const span = endAge - startAge;
    if (span < 5) return [];
    const points: { age: number; nominal: number }[] = [];
    for (let a = Math.ceil(startAge / 10) * 10; a < endAge; a += 10) {
      if (a === selectedAge) continue;
      const p = merged.find((m) => m.age === a);
      if (p) points.push({ age: p.age, nominal: p.nominal });
    }
    return points;
  }, [merged, startAge, endAge, selectedAge]);

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={1}
          minHeight={1}
        >
          <AreaChart
            data={merged}
            margin={{ top: 24, right: 24, left: 4, bottom: 22 }}
          >
          <defs>
            <linearGradient id="totalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="age"
            type="number"
            domain={[startAge, endAge]}
            axisLine={false}
            tickLine={false}
            ticks={ageTicks}
            interval={0}
            padding={{ left: 10, right: 10 }}
            tickMargin={4}
            height={22}
            tick={(props: object) => <AgeTick {...(props as AgeTickProps)} />}
          />
          <YAxis
            orientation="right"
            axisLine={false}
            tickLine={false}
            width={32}
            tick={{
              fontSize: 11,
              fill: "var(--muted)",
              fontWeight: 700,
            }}
            tickFormatter={(v) => formatYAxis(Number(v))}
            domain={[0, yMax]}
            ticks={yTicksDisplay}
            allowDataOverflow={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--foreground)",
            }}
            cursor={{
              stroke: "var(--muted-2)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            labelFormatter={(age) => `${age} år`}
            itemSorter={(item) => (item.dataKey === "nominal" ? -1 : 1)}
            formatter={(val, name) => {
              const label =
                name === "delayed" ? `Venter ${delayYears} år` : "Formue";
              const num = Number(val);
              if (!isFinite(num) || num === 0)
                return ["—", label] as [string, string];
              return [formatMill(num), label];
            }}
          />
          <Area
            type="monotone"
            dataKey="nominal"
            stroke="var(--primary)"
            strokeWidth={3}
            fill="url(#totalFill)"
            isAnimationActive
            animationDuration={420}
            animationEasing="ease-out"
          />
          {/* Verdi-merker langs kurven for hvert tiår */}
          {decadePoints.map((p) =>
            p.nominal < 50_000 ? null : (
              <ReferenceDot
                key={`decade-${p.age}`}
                x={p.age}
                y={p.nominal}
                r={0}
                fill="transparent"
                stroke="none"
                ifOverflow="extendDomain"
              >
                <Label
                  value={formatMill(p.nominal)}
                  position="top"
                  offset={6}
                  fill="var(--foreground)"
                  fontSize={10}
                  fontWeight={700}
                />
              </ReferenceDot>
            ),
          )}
          {delayYears > 0 && (
            <Line
              type="monotone"
              dataKey="delayed"
              stroke="var(--gold)"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={false}
              activeDot={false}
              isAnimationActive
              animationDuration={420}
              animationEasing="ease-out"
              connectNulls={false}
            />
          )}
          {targetValue !== undefined && targetValue > 0 && (
            <ReferenceLine
              y={targetValue}
              stroke="var(--gold)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
          )}
          {selectedPoint && selectedPoint.age !== startAge && (
            <ReferenceDot
              x={selectedPoint.age}
              y={selectedPoint.nominal}
              r={6}
              fill="var(--primary)"
              stroke="var(--surface)"
              strokeWidth={3}
              ifOverflow="extendDomain"
            >
              {selectedPoint.nominal >= 50_000 && (
                <Label
                  value={formatMill(selectedPoint.nominal)}
                  position="top"
                  offset={10}
                  fill="var(--primary-strong)"
                  fontSize={11}
                  fontWeight={800}
                />
              )}
            </ReferenceDot>
          )}
        </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type AgeTickProps = {
  x?: number;
  y?: number;
  payload?: { value: number };
};

/**
 * Custom X-akse-tick: viser alderen med "år"-suffiks så det er åpenbart
 * at X-aksen er brukerens alder (uten egen aksetittel).
 */
function AgeTick(props: AgeTickProps) {
  const { x = 0, y = 0, payload } = props;
  const value = payload?.value ?? 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="var(--muted)"
      >
        {value} år
      </text>
    </g>
  );
}

function xTicks(data: ChartPoint[]): number[] {
  if (data.length === 0) return [];
  const startAge = data[0].age;
  const endAge = data[data.length - 1].age;
  const span = endAge - startAge;

  let step: number;
  if (span <= 6) step = 1;
  else if (span <= 12) step = 2;
  else if (span <= 25) step = 5;
  else if (span <= 50) step = 10;
  else step = 15;

  // Forhindrer at "X år"-labels overlapper når start/slutt ligger
  // tett på en tiår-tick (f.eks. 14 år vs 20 år ved span=66).
  const minGap = step <= 2 ? step : Math.ceil(step * 0.7);

  const ticks: number[] = [startAge];
  let next = Math.ceil((startAge + 1) / step) * step;
  while (next < endAge) {
    if (next - ticks[ticks.length - 1] >= minGap) ticks.push(next);
    next += step;
  }
  // Sikre at endAge alltid er siste tick — erstatt siste decade hvis den
  // er for tett, ellers legg til.
  const last = ticks[ticks.length - 1];
  if (last !== endAge) {
    if (last !== startAge && endAge - last < minGap) {
      ticks[ticks.length - 1] = endAge;
    } else {
      ticks.push(endAge);
    }
  }
  return ticks;
}

/**
 * Y-akse ticks med jevne, "pene" steg (1, 2, eller 5 × 10^n).
 * Garanterer minst 4 intervaller for konsistent antall synlige ticks.
 */
function millionTicks(value: number): { yMax: number; yTicks: number[] } {
  if (value <= 0) return { yMax: 100_000, yTicks: [0, 50_000, 100_000] };

  const rawStep = value / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;

  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;

  let step = nice * mag;
  let yMax = Math.ceil(value / step) * step;

  if (yMax / step < 4) {
    step = step / 2;
    yMax = Math.ceil(value / step) * step;
  }

  const yTicks: number[] = [];
  for (let v = 0; v <= yMax + step * 0.001; v += step) {
    yTicks.push(Math.round(v));
  }
  return { yMax, yTicks };
}
