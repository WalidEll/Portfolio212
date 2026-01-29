'use client';

import {useEffect, useMemo, useState} from 'react';
import {apiGet, apiPost} from './lib/api';

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

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Holding[]>('/api/holdings').then(setHoldings).catch((e) => setError(String(e)));
  }, []);

  const totalValue = useMemo(() => holdings.reduce((s, h) => s + (h.marketValue || 0), 0), [holdings]);
  const invested = useMemo(() => holdings.reduce((s, h) => s + (h.invested || 0), 0), [holdings]);
  const unreal = useMemo(() => holdings.reduce((s, h) => s + (h.unrealizedPnl || 0), 0), [holdings]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Totals based on latest stored prices.</p>

        {error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xs text-slate-500">Market value</div>
            <div className="text-lg font-semibold">{fmt(totalValue)} MAD</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xs text-slate-500">Invested</div>
            <div className="text-lg font-semibold">{fmt(invested)} MAD</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="text-xs text-slate-500">Unrealized PnL</div>
            <div className={`text-lg font-semibold ${unreal >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {fmt(unreal)} MAD
            </div>
          </div>
        </div>

        <button
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          onClick={async () => {
            await apiPost<number>('/api/prices/refresh');
            const h = await apiGet<Holding[]>('/api/holdings');
            setHoldings(h);
          }}
        >
          Refresh prices now
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Holdings (preview)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="py-2">Symbol</th>
                <th className="py-2">Shares</th>
                <th className="py-2">Avg cost</th>
                <th className="py-2">Last</th>
                <th className="py-2">Value</th>
                <th className="py-2">Unrealized</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol} className="border-t border-slate-100">
                  <td className="py-2 font-semibold">{h.symbol}</td>
                  <td className="py-2">{fmt(h.shares)}</td>
                  <td className="py-2">{fmt(h.avgCost)}</td>
                  <td className="py-2">{fmt(h.lastPrice)}</td>
                  <td className="py-2">{fmt(h.marketValue)}</td>
                  <td className={`py-2 ${h.unrealizedPnl >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {fmt(h.unrealizedPnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
