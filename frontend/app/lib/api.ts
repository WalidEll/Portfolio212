import {getPortfolio} from './portfolio';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:8080';

function withPortfolio(path: string) {
  if (path.startsWith('/api/portfolios')) return path; // admin endpoints
  if (path.startsWith('/api/p/')) return path; // already scoped

  const slug = getPortfolio();

  // translate old calls like /api/holdings -> /api/p/{slug}/holdings
  if (path.startsWith('/api/')) {
    return `/api/p/${slug}${path.slice('/api'.length)}`;
  }

  return path;
}

export async function apiGet<T>(path: string): Promise<T> {
  const p = withPortfolio(path);
  const res = await fetch(`${API_BASE}${p}`, {cache: 'no-store'});
  if (!res.ok) throw new Error(`GET ${p} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const p = withPortfolio(path);
  const res = await fetch(`${API_BASE}${p}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`POST ${p} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const p = withPortfolio(path);
  const res = await fetch(`${API_BASE}${p}`, {method: 'DELETE'});
  if (!res.ok) throw new Error(`DELETE ${p} failed: ${res.status}`);
}
