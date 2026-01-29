import {apiGet, apiPost} from '../lib/api';

type Price = {
  symbol: string;
  quoteTime: string;
  last: number;
  open: number | null;
  reference: number | null;
  changePct: number | null;
  qtyTraded: number | null;
  volumeValue: number | null;
  high: number | null;
  low: number | null;
};

function fmt(n: number | null) {
  return new Intl.NumberFormat('fr-MA', {maximumFractionDigits: 2}).format(n || 0);
}

export default async function PricesPage() {
  const latest = await apiGet<Price[]>('/api/prices/latest');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <h1 className="text-xl font-semibold">Prices</h1>
          <p className="mt-1 text-sm text-slate-600">Latest stored snapshots (delayed).</p>
        </div>

        <form
          action={async () => {
            'use server';
            await apiPost<number>('/api/prices/refresh');
          }}
        >
          <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Refresh now
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="py-2">Symbol</th>
                <th className="py-2">Time</th>
                <th className="py-2">Last</th>
                <th className="py-2">Change %</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((p) => (
                <tr key={p.symbol} className="border-t border-slate-100">
                  <td className="py-2 font-semibold">{p.symbol}</td>
                  <td className="py-2">{p.quoteTime}</td>
                  <td className="py-2">{fmt(p.last)}</td>
                  <td className={`py-2 ${(p.changePct || 0) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {fmt(p.changePct)}
                  </td>
                  <td className="py-2">{fmt(p.qtyTraded)}</td>
                  <td className="py-2">{fmt(p.volumeValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
