import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function RentBrowse() {
  const { filtered, user } = useApp();
  const [stream, setStream] = useState(user?.stream || 'All');
  const [search, setSearch] = useState('');
  const [duration, setDuration] = useState(3);
  const [sort, setSort] = useState('latest');

  const list = useMemo(() => {
    const base = filtered.rent.filter((p) => {
      const matchesStream = stream === 'All' || p.stream === stream;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchesStream && matchesSearch;
    });
    if (sort === 'price-asc') return [...base].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...base].sort((a, b) => b.price - a.price);
    return base;
  }, [filtered.rent, stream, search, sort]);

  return (
    <div className="section py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="subtle">Rentals</p>
          <h1 className="heading">Browse rentals</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="input"
          >
            {['All', 'Engineering', 'Medical'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="input"
          >
            {[1, 3, 7, 14].map((d) => (
              <option key={d} value={d}>
                {d} day{d > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
          >
            <option value="latest">Latest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rentals"
            className="input min-w-[220px]"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['camera', 'coat', 'kit', 'stethoscope', 'tripod'].map((chip) => (
          <button
            key={chip}
            onClick={() => setSearch(chip)}
            className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs hover:bg-brand-50 hover:text-brand-700"
          >
            #{chip}
          </button>
        ))}
        <Link to="/rent/list" className="btn-primary text-sm px-4 py-2 rounded-full">
          List your rental <FiArrowRight />
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No rentals" subtitle="Adjust filters or list your own gear." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => (
            <div key={item.id} className="space-y-2">
              <ProductCard item={item} />
              <p className="text-xs text-gray-500">
                For {duration} day{duration > 1 ? 's' : ''}: <span className="font-semibold text-brand-600">?{item.price * duration}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
