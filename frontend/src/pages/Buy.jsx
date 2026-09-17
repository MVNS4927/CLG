import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

export default function Buy() {
  const { filtered, user } = useApp();
  const [stream, setStream] = useState(user?.stream || 'All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');

  const list = useMemo(() => {
    const base = filtered.buy.filter((p) => {
      const matchesStream = stream === 'All' || p.stream === stream;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchesStream && matchesSearch;
    });
    if (sort === 'price-asc') return [...base].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...base].sort((a, b) => b.price - a.price);
    return base;
  }, [filtered.buy, stream, search, sort]);

  return (
    <div className="section py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="subtle">Marketplace</p>
          <h1 className="heading">Buy essentials</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
          >
            {['All', 'Engineering', 'Medical'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
          >
            <option value="latest">Latest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items"
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 min-w-[220px]"
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['calculator', 'arduino', 'kit', 'coat', 'notes'].map((chip) => (
          <button
            key={chip}
            onClick={() => setSearch(chip)}
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs hover:bg-brand-50 hover:text-brand-700"
          >
            #{chip}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="No products" subtitle="Adjust filters or check back soon." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
