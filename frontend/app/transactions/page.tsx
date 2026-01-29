'use client';

import {useEffect, useMemo, useState} from 'react';
import {API_BASE, apiDelete, apiGet, apiPost} from '../lib/api';

type TxType = 'BUY' | 'SELL' | 'DIVIDEND' | 'FEE';

type Tx = {
  id: number;
  tradeDate: string;
  symbol: string;
  type: TxType;
  quantity: number | null;
  price: number | null;
  amount: number | null;
  note: string | null;
};

function fmt(n: number | null) {
  return new Intl.NumberFormat('fr-MA', {maximumFractionDigits: 2}).format(n || 0);
}

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tradeDate, setTradeDate] = useState('');
  const [symbol, setSymbol] = useState('ATW');
  const [type, setType] = useState<TxType>('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const needsQtyPrice = type === 'BUY' || type === 'SELL';
  const needsAmount = type === 'DIVIDEND' || type === 'FEE';

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Tx[]>('/api/transactions');
      // sort newest first
      data.sort((a, b) => (a.tradeDate < b.tradeDate ? 1 : -1));
      setTxs(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setError(null);
    try {
      await apiPost('/api/transactions', {
        tradeDate,
        symbol,
        type,
        quantity: needsQtyPrice ? Number(quantity || 0) : null,
        price: needsQtyPrice ? Number(price || 0) : null,
        amount: needsAmount ? Number(amount || 0) : null,
        note: note || null
      });
      await load();
    } catch (e: any) {
      setError(e?.message || 'Create failed');
    }
  };

  const del = async (id: number) => {
    if (!confirm('Delete transaction?')) return;
    await apiDelete(`/api/transactions/${id}`);
    await load();
  };

  const apiHint = useMemo(() => API_BASE, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <p className="mt-1 text-sm text-slate-700">API: {apiHint}</p>

        {error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-6">
          <label className="sm:col-span-2">
            <div className="text-xs text-slate-600">Date</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              type="date"
              value={tradeDate}
              onChange={(e) => setTradeDate(e.target.value)}
            />
          </label>

          <label className="sm:col-span-1">
            <div className="text-xs text-slate-600">Symbol</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
          </label>

          <label className="sm:col-span-1">
            <div className="text-xs text-slate-600">Type</div>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as TxType)}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
              <option value="DIVIDEND">DIVIDEND</option>
              <option value="FEE">FEE</option>
            </select>
          </label>

          <label className="sm:col-span-1">
            <div className="text-xs text-slate-600">Quantity</div>
            <input
              disabled={!needsQtyPrice}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={needsQtyPrice ? 'e.g. 10' : ''}
            />
          </label>

          <label className="sm:col-span-1">
            <div className="text-xs text-slate-600">Price / Amount</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={needsAmount ? amount : price}
              onChange={(e) => (needsAmount ? setAmount(e.target.value) : setPrice(e.target.value))}
              placeholder={'MAD'}
            />
          </label>

          <label className="sm:col-span-6">
            <div className="text-xs text-slate-600">Note</div>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <div className="sm:col-span-6">
            <button
              onClick={create}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add transaction
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
        <h2 className="text-lg font-semibold">List</h2>
        {loading ? (
          <div className="mt-3 text-sm text-slate-700">Loading…</div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-600">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Symbol</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Note</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="py-2">{t.tradeDate}</td>
                    <td className="py-2 font-semibold">{t.symbol}</td>
                    <td className="py-2">{t.type}</td>
                    <td className="py-2">{fmt(t.quantity)}</td>
                    <td className="py-2">{fmt(t.price)}</td>
                    <td className="py-2">{fmt(t.amount)}</td>
                    <td className="py-2">{t.note || ''}</td>
                    <td className="py-2">
                      <button
                        className="text-xs font-semibold text-red-700 hover:underline"
                        onClick={() => del(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
