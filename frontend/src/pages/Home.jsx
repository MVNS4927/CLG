import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useApp } from '../state/AppContext';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { useMemo, useState } from 'react';
import StatBar from '../components/StatBar';
import ActivityTimeline from '../components/ActivityTimeline';
import EmptyState from '../components/EmptyState';
import logo from '/logo.png';

export default function Home() {
  const { user, filtered, loading, setLoading, wishlist, products, chats, chatProfiles, setActiveChat } = useApp();
  const [stream, setStream] = useState(user?.stream || 'All');

  const featured = [...filtered.buy, ...filtered.rent].filter((p) => stream === 'All' || p.stream === stream).slice(0, 4);
  const wishlistItems = useMemo(() => products.filter((p) => wishlist.includes(p.id)).slice(0, 3), [products, wishlist]);

  return (
    <div className="section py-10 space-y-10">
      <div className="card overflow-hidden relative">
        <div className="logo-watermark-hero" aria-hidden="true" />
        <div className="grid md:grid-cols-2 gap-6 p-8 relative">
          <div className="space-y-3 relative">
            <img
              src={logo}
              alt="CLG Space logo"
              className="h-16 w-16 object-contain drop-shadow-md transform"
              style={{ transform: 'scale(1.35)', transformOrigin: 'left top' }}
            />
            <p className="text-sm text-brand-600 font-semibold">CLG Space</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              Hey {user?.name || 'Student'}, welcome to the <span className="text-accent-orange"> {user?.stream} hub.</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-300">Buy, sell, rent essentials fast. Verified peers, instant chat.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/buy" className="btn-primary">
                Browse Buy <FiArrowRight />
              </Link>
              <Link to="/sell" className="btn-ghost border border-brand-200 dark:border-gray-700 px-4 py-2 rounded-xl">
                List an item
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1"
              >
                {['All', 'Engineering', 'Medical'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">College: {user?.college}</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-accent-orange/30 via-brand-200/50 to-brand-500/50 blur-3xl" />
            <div className="relative card p-6 h-full overflow-hidden">
              <div className="logo-watermark-corner" aria-hidden="true" />
              <p className="font-semibold mb-3">Featured this week</p>
              <div className="grid grid-cols-1 gap-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
                  : featured.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <img src={p.images?.[0] || p.image} alt={p.title} className="h-14 w-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-semibold">{p.title}</p>
                          <p className="subtle">
                            ₹{p.price} {p.type === 'rent' && '/day'}
                          </p>
                        </div>
                        <Link to={p.type === 'rent' ? '/rent/browse' : '/buy'} className="btn-ghost text-sm">
                          View
                        </Link>
                      </div>
                    ))}
              </div>
              <button onClick={() => setLoading(!loading)} className="btn-ghost mt-4 text-xs text-gray-500">
                {loading ? 'Stop skeleton' : 'Show skeleton'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <StatBar />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4 space-y-3 relative overflow-hidden">
          <div className="logo-watermark-corner" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <h3 className="heading">Chat inbox</h3>
            <span className="tag">Live</span>
          </div>
          {Object.keys(chats || {}).length === 0 ? (
            <EmptyState title="No chats yet" subtitle="Message a seller to start a thread." />
          ) : (
            <div className="space-y-3">
              {Object.entries(chats).map(([id, thread]) => {
                const last = thread[thread.length - 1];
                const preview = last?.text || 'New conversation';
                const profile = chatProfiles?.[id];
                const senderIsMe = last?.from === 'me';
                const partnerName = profile?.name || 'Campus Peer';
                const partnerId = profile?.collegeId || 'Verified';
                return (
                  <div key={id} className="card p-3 flex items-center justify-between hover:border-brand-200">
                    <div>
                      <p className="font-semibold text-brand-800 dark:text-brand-300">
                        {partnerName} <span className="text-xs text-gray-500 font-normal">({partnerId})</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                        {senderIsMe ? <span className="font-bold text-brand-600 dark:text-brand-400">You: </span> : ''}
                        {preview}
                      </p>
                    </div>
                    <button
                      className="btn-primary px-3 py-2"
                      onClick={() => setActiveChat({ id, partner: profile?.partner || { seller: partnerName, collegeId: partnerId } })}
                    >
                      Open
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <ActivityTimeline limit={7} />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="heading">Wishlist spotlight</h3>
          <Link to="/buy" className="btn-ghost text-sm">
            Add more
          </Link>
        </div>
        {wishlistItems.length === 0 ? (
          <p className="subtle">Save items to see them here.</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {wishlistItems.map((p) => (
              <ProductCard key={p.id} item={p} />
            ))}
          </div>
        )}
      </div>

      <div className="pointer-events-none select-none relative" aria-hidden="true">
        <div
          className="absolute inset-x-0 -top-24 h-64 opacity-5 blur-sm"
          style={{ backgroundImage: `url(${logo})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '320px' }}
        />
      </div>
    </div>
  );
}

