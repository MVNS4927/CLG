import { FiClock, FiTrash2, FiMessageSquare, FiShoppingBag, FiHeart, FiUserCheck, FiChevronRight } from 'react-icons/fi';
import { useApp } from '../state/AppContext';

export default function ActivityTimeline({ limit = 8 }) {
  const { activity, deleteActivity, clearActivity, openChat } = useApp();
  const items = activity.slice(0, limit);

  const getActivityIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('message') || t.includes('offer')) return <FiMessageSquare className="text-brand-500" />;
    if (t.includes('purchased') || t.includes('order')) return <FiShoppingBag className="text-emerald-500" />;
    if (t.includes('wishlist')) return <FiHeart className="text-rose-500" />;
    return <FiUserCheck className="text-blue-500" />;
  };

  const handleReviewActivity = (item) => {
    const titleLower = item.title.toLowerCase();
    if (titleLower.includes('message') || titleLower.includes('offer')) {
      // Extract partner name from title e.g. "Message to Rahul Sharma"
      const parts = item.title.split(/to /i);
      const sellerName = parts[1] || item.meta?.split(':')[0] || 'Campus Peer';
      openChat({ seller: sellerName, title: 'Item Conversation' });
    }
  };

  return (
    <div className="card p-6 space-y-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <FiClock size={18} />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Recent Activity & Messages</h3>
            <p className="text-xs text-gray-500">Track and review your interactions, offers & logs</p>
          </div>
        </div>
        {items.length > 0 && (
          <button 
            onClick={clearActivity} 
            className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 dark:hover:border-red-900/40"
          >
            Clear Log
          </button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isMessage = item.title.toLowerCase().includes('message') || item.title.toLowerCase().includes('offer');
          return (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 hover:border-brand-200 dark:hover:border-brand-800 transition-all group"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700 shrink-0 mt-0.5">
                  {getActivityIcon(item.title)}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">
                      {item.ts ? new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium break-words leading-relaxed">
                    {item.meta}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                {isMessage && (
                  <button
                    onClick={() => handleReviewActivity(item)}
                    className="btn-ghost text-xs px-3 py-1.5 text-brand-600 dark:text-brand-400 font-bold bg-brand-50/80 dark:bg-brand-950/60 hover:bg-brand-100 rounded-xl flex items-center gap-1"
                  >
                    <span>Review Chat</span>
                    <FiChevronRight size={14} />
                  </button>
                )}

                <button 
                  onClick={() => deleteActivity(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-all"
                  title="Delete activity record"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {!items.length && (
          <div className="text-center py-8 text-gray-400 text-xs font-medium">
            No activity records yet. Your messages and transactions will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
