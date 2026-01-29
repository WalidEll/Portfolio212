import Link from 'next/link';
import PortfolioPicker from './PortfolioPicker';

const items = [
  {href: '/', label: 'Dashboard'},
  {href: '/holdings', label: 'Holdings'},
  {href: '/transactions', label: 'Transactions'},
  {href: '/prices', label: 'Prices'}
];

export default function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Portfolio212</div>
        </div>

        <nav className="flex flex-row gap-4 overflow-x-auto text-sm sm:flex-wrap">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="whitespace-nowrap text-slate-700 hover:text-slate-900"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="w-full sm:w-auto">
          <PortfolioPicker />
        </div>
      </div>
    </header>
  );
}
