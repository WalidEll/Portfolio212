'use client';

import {useEffect, useState} from 'react';
import {API_BASE, apiGet, apiPost} from '../lib/api';
import {getPortfolio, setPortfolio} from '../lib/portfolio';

type Portfolio = {slug: string; name: string};

export default function PortfolioPicker() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [slug, setSlug] = useState(getPortfolio());
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');

  const load = async () => {
    const data = await apiGet<Portfolio[]>('/api/portfolios');
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPortfolio(slug);
  }, [slug]);

  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-slate-600">Portfolio</span>
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm"
          value={slug}
          onChange={(e) => {
            const v = e.target.value;
            setSlug(v);
            // force reload so server-rendered pages re-fetch with new slug
            window.location.reload();
          }}
        >
          {items.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} ({p.slug})
            </option>
          ))}
        </select>
      </label>

      <details className="relative">
        <summary className="cursor-pointer text-sm font-semibold text-emerald-700">New</summary>
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow">
          <div className="text-xs text-slate-500">Create new portfolio (SQLite file)</div>
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
            placeholder="slug (e.g. long-term)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
            placeholder="name (optional)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
            onClick={async () => {
              await apiPost('/api/portfolios', {slug: newSlug, name: newName});
              await load();
              setSlug(newSlug);
              window.location.reload();
            }}
          >
            Create
          </button>
          <div className="mt-2 text-xs text-slate-500">API: {API_BASE}</div>
        </div>
      </details>
    </div>
  );
}
