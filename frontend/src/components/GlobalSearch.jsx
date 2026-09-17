import { useMemo } from 'react';
import { FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';

export default function GlobalSearch() {
  const { globalQuery, setGlobalQuery, filtered } = useApp();
  const q = globalQuery.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!q) return [];
    return [...filtered.buy, ...filtered.rent].filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.stream.toLowerCase().includes(q)
    );
  }, [q, filtered]);

  if (!q) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="font-semibold">Search results for “{globalQuery}”</p>
          <button onClick={() => setGlobalQuery('')} className="btn-ghost text-xl">
            <FiX />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
          {matches.length === 0 && <p className="p-4 subtle">No matches. Try another keyword.</p>}
          {matches.map((m) => (
            <Link
              key={m.id}
              to={m.type === 'rent' ? '/rent' : '/buy'}
              onClick={() => setGlobalQuery('')}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <img src={m.images?.[0] || m.image} alt={m.title} className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{m.title}</p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {m.stream} • ₹{m.price}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">{m.type}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
