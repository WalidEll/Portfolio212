'use client';

import React from 'react';

type Slice = {
  label: string;
  value: number;
  color?: string;
};

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
  size = 220
}: {
  slices: Slice[];
  size?: number;
}) {
  const total = slices.reduce((s, a) => s + (isFinite(a.value) ? a.value : 0), 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  if (!total || total <= 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-600">
        No data
      </div>
    );
  }

  const palette = [
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

  let angle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Holdings pie chart">
      {slices.map((s, idx) => {
        const val = Math.max(0, s.value || 0);
        const a = (val / total) * 360;
        const start = angle;
        const end = angle + a;
        angle = end;
        const color = s.color || palette[idx % palette.length];

        // Skip tiny slices (still counted in total). They remain in legend.
        if (a < 0.5) return null;

        return <path key={s.label} d={describeArc(cx, cy, r, start, end)} fill={color} />;
      })}
    </svg>
  );
}
