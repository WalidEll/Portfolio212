'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import PortfolioPicker from './PortfolioPicker';

const items = [
  {href: '/', label: 'Dashboard'},
  {href: '/holdings', label: 'Holdings'},
  {href: '/transactions', label: 'Transactions'},
  {href: '/prices', label: 'Prices'}
];

function HamburgerIcon({open}: {open: boolean}) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">Portfolio212</div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={`text-slate-700 hover:text-slate-900 ${pathname === i.href ? 'font-semibold' : ''}`}
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:block">
            <PortfolioPicker />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 sm:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <HamburgerIcon open={open} />
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="mt-3 space-y-3 sm:hidden">
            <div className="grid grid-cols-2 gap-2">
              {items.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className={`rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 ${
                    pathname === i.href ? 'bg-slate-100 font-semibold' : 'bg-white'
                  }`}
                >
                  {i.label}
                </Link>
              ))}
            </div>
            <div>
              <PortfolioPicker />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
