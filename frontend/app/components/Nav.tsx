import Link from 'next/link';

const items = [
  {href: '/', label: 'Dashboard'},
  {href: '/holdings', label: 'Holdings'},
  {href: '/transactions', label: 'Transactions'},
  {href: '/prices', label: 'Prices'}
];

export default function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="font-semibold">Portfolio212</div>
        <nav className="flex gap-3 text-sm">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="text-slate-700 hover:text-slate-900">
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
