import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import TermsModal from './TermsModal';

export default function ProductCard({ item, onDelete, showDelete }) {
  const { wishlist, toggleWishlist, openChat, orders } = useApp();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const wished = wishlist.includes(item.id);
  const isSold = item.isSold || item.status === 'SOLD' || orders?.some((o) => o.productId === item.id);

  return (
    <div className="card overflow-hidden flex flex-col transition transform hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(59,130,246,0.18)] hover:border-brand-200">
      <Link to={`/product/${item.id}`} className="relative block">
        <img src={item.images?.[0] || item.image} alt={item.title} className="h-48 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white text-xs font-medium px-3 py-1 rounded-full bg-brand-600/90">
          {item.stream}
        </div>
        {isSold && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-lg">
            Sold Out
          </div>
        )}
        {showDelete && (
          <button
            type="button"
            aria-label={`Delete ${item.title}`}
            title="Delete product"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (window.confirm(`Delete "${item.title}"?`)) onDelete?.(item.id);
            }}
            className="absolute top-2 right-2 btn-ghost bg-white/80 dark:bg-gray-900/80 rounded-full p-2"
          >
            <FiTrash2 />
          </button>
        )}
      </Link>
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${item.id}`}>
            <h3 className="font-semibold text-lg hover:text-brand-600 transition-colors">{item.title}</h3>
            <p className="subtle">by {item.seller}</p>
          </Link>
          <span className="text-accent-orange font-bold">
            ₹{item.price || item.maxPrice || item.minPrice || 0}
            {item.type === 'rent' && '/day'}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-1.5 pt-3">
          {isSold ? (
            <span className="bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 text-xs px-3 py-2 rounded-xl font-bold border border-red-200 dark:border-red-800">
              Sold Out
            </span>
          ) : (
            <button onClick={() => setShowTermsModal(true)} className="btn-primary text-xs px-3 py-2 font-bold flex items-center gap-1">
              <FiShoppingBag /> {item.type === 'rent' ? 'Rent' : 'Buy'}
            </button>
          )}
          {!isSold && (
            <button onClick={() => openChat(item)} className="btn-ghost px-2.5 py-2 text-xs">
              <FiMessageCircle /> Bargain
            </button>
          )}
          <button onClick={() => toggleWishlist(item.id)} className={`btn px-2.5 py-2 text-xs ${wished ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : 'btn-ghost'}`}>
            <FiHeart className={wished ? 'fill-brand-500 text-brand-500' : ''} /> {wished ? 'Saved' : 'Wishlist'}
          </button>
        </div>
      </div>

      {showTermsModal && (
        <TermsModal product={item} onClose={() => setShowTermsModal(false)} />
      )}
    </div>
  );
}
