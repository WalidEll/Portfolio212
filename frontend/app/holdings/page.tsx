'use client';

import {useEffect, useMemo, useState} from 'react';
import PieChart from '../components/PieChart';
import {apiGet} from '../lib/api';

type Holding = {
  symbol: string;
  shares: number;
  avgCost: number;
  invested: number;
  lastPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  realizedPnl: number;
  dividends: number;
  fees: number;
};

function fmt(n: number) {
  return new Intl.NumberFormat('fr-MA', {maximumFractionDigits: 2}).format(n || 0);
}

export default function HoldingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Holding[]>('/api/holdings').then(setHoldings).catch((e) => setError(String(e)));
  }, []);

  const totalValue = useMemo(() => holdings.reduce((s, h) => s + (h.marketValue || 0), 0), [holdings]);

  const pieSlices = useMemo(() => {
    return holdings
      .filter((h) => (h.marketValue || 0) > 0)
      .map((h) => ({label: h.symbol, value: h.marketValue || 0}));
  }, [holdings]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
        <h1 className="text-xl font-semibold">Holdings</h1>
        <p className="mt-1 text-sm text-slate-700">Allocation by market value + details table.</p>

        {error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
            <PieChart slices={pieSlices} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold">Allocation</div>
            <div className="mt-2 space-y-2">
              {pieSlices.length === 0 ? (
                <div className="text-sm text-slate-600">No holdings yet.</div>
              ) : (
                pieSlices
                  .slice()
                  .sort((a, b) => b.value - a.value)
                  .map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-3 text-sm">
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-slate-700">
                        {fmt(s.value)} MAD
                        {totalValue > 0 ? (
                          <span className="text-slate-500"> • {fmt((s.value / totalValue) * 100)}%</span>
                        ) : null}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
        <h2 className="text-lg font-semibold">Details</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-600">
              <tr>
                <th className="py-2">Symbol</th>
                <th className="py-2">Shares</th>
                <th className="py-2">Avg cost</th>
                <th className="py-2">Invested</th>
                <th className="py-2">Last</th>
                <th className="py-2">Value</th>
                <th className="py-2">Unrealized</th>
                <th className="py-2">Realized</th>
                <th className="py-2">Dividends</th>
                <th className="py-2">Fees</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol} className="border-t border-slate-100">
                  <td className="py-2 font-semibold">{h.symbol}</td>
                  <td className="py-2">{fmt(h.shares)}</td>
                  <td className="py-2">{fmt(h.avgCost)}</td>
                  <td className="py-2">{fmt(h.invested)}</td>
                  <td className="py-2">{fmt(h.lastPrice)}</td>
                  <td className="py-2">{fmt(h.marketValue)}</td>
                  <td className={`py-2 ${h.unrealizedPnl >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {fmt(h.unrealizedPnl)}
                  </td>
                  <td className={`py-2 ${h.realizedPnl >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {fmt(h.realizedPnl)}
                  </td>
                  <td className="py-2">{fmt(h.dividends)}</td>
                  <td className="py-2">{fmt(h.fees)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
