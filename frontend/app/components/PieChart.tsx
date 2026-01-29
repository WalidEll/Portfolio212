'use client';

import React, {useMemo, useState} from 'react';

type Slice = {
  label: string;
  value: number;
};

export const PIE_PALETTE = [
  '#0ea5e9',
  '#22c55e',
  '#a855f7',
  '#f59e0b',
  '#ef4444',
  '#14b8a6',
  '#6366f1',
  '#84cc16',
  '#f97316',
  '#06b6d4'
];

export function pieColorForIndex(i: number) {
  return PIE_PALETTE[i % PIE_PALETTE.length];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export default function PieChart({
  slices,
  size = 240
}: {
  slices: Slice[];
  size?: number;
}) {
  const [active, setActive] = useState<string | null>(null);

  const cleaned = useMemo(
    () => slices.map((s) => ({label: s.label, value: Math.max(0, Number(s.value) || 0)})),
    [slices]
  );
  const total = cleaned.reduce((sum, s) => sum + s.value, 0);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const activeSlice = cleaned.find((s) => s.label === active) || null;

  if (!total || total <= 0) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-600">
        No data
      </div>
    );
  }

  let angle = 0;

  return (
    <div className="relative" style={{width: size, height: size}}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Holdings allocation pie chart"
      >
        {cleaned.map((s, idx) => {
          const a = (s.value / total) * 360;
          const start = angle;
          const end = angle + a;
          angle = end;

          const color = pieColorForIndex(idx);
          const isActive = active === s.label;

          return (
            <path
              key={s.label}
              d={describeArc(cx, cy, r, start, end)}
              fill={color}
              stroke="#ffffff"
              strokeWidth={2}
              opacity={isActive || active == null ? 1 : 0.35}
              onMouseEnter={() => setActive(s.label)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive((cur) => (cur === s.label ? null : s.label))}
            />
          );
        })}
        {/* Donut hole */}
        <circle cx={cx} cy={cy} r={size * 0.22} fill="#ffffff" />
      </svg>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-xs text-slate-600">{activeSlice ? activeSlice.label : 'Total'}</div>
        <div className="text-sm font-semibold text-slate-900">
          {activeSlice ? `${((activeSlice.value / total) * 100).toFixed(1)}%` : '100%'}
        </div>
      </div>
    </div>
  );
}
