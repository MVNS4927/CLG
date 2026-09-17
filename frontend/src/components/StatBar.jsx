import { FiHeart, FiMessageSquare, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { useApp } from '../state/AppContext';

export default function StatBar() {
  const { products, wishlist, chats } = useApp();
  const totalBuy = products.filter((p) => p.type === 'buy').length;
  const totalRent = products.filter((p) => p.type === 'rent').length;
  const totalChats = Object.keys(chats || {}).length;

  const stats = [
    { label: 'Buy listings', value: totalBuy, icon: <FiShoppingBag /> },
    { label: 'Rent listings', value: totalRent, icon: <FiTrendingUp /> },
    { label: 'Wishlist', value: wishlist.length, icon: <FiHeart /> },
    { label: 'Active chats', value: totalChats, icon: <FiMessageSquare /> }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
          <div className="h-10 w-10 grid place-content-center rounded-lg bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 text-xl">
            {s.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
