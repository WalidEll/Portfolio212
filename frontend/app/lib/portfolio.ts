'use client';

export const DEFAULT_PORTFOLIO = 'default';

export function getPortfolio(): string {
  if (typeof window === 'undefined') return DEFAULT_PORTFOLIO;
  return localStorage.getItem('portfolioSlug') || DEFAULT_PORTFOLIO;
}

export function setPortfolio(slug: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('portfolioSlug', slug);
}
