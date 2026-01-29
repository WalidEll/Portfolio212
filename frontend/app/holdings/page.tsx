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

export default async function HoldingsPage() {
  const holdings = await apiGet<Holding[]>('/api/holdings');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h1 className="text-xl font-semibold">Holdings</h1>
      <p className="mt-1 text-sm text-slate-600">Average cost, dividends and fees included.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500">
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
  );
}
