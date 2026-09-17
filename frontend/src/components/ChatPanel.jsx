import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheckCircle, FiShoppingBag, FiLock } from 'react-icons/fi';
import { useApp } from '../state/AppContext';
import TermsModal from './TermsModal';

export default function ChatPanel() {
  const { activeChat, chats, chatProfiles, setTheme, sendMessage, setActiveChat } = useApp();
  const [offerAmount, setOfferAmount] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Store finalized offer state in local storage
  const [finalizedOffers, setFinalizedOffers] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('finalized_offers') || '{}');
      Object.keys(parsed).forEach((k) => {
        if (!parsed[k]?.price || parsed[k]?.price <= 0) {
          delete parsed[k];
        }
      });
      return parsed;
    } catch {
      return {};
    }
  });

  const fallbackPrice = activeChat?.partner?.price || activeChat?.partner?.minPrice || activeChat?.partner?.maxPrice || 850;

  useEffect(() => {
    const p = activeChat?.partner?.price || activeChat?.partner?.minPrice || activeChat?.partner?.maxPrice || 850;
    setOfferAmount(p);
  }, [activeChat]);

  const thread = useMemo(() => (activeChat ? chats[activeChat.id] || [] : []), [activeChat, chats]);
  
  const contacts = useMemo(() => {
    return Object.keys(chats).map((id) => {
      const profile = chatProfiles[id];
      const name = profile?.name || (activeChat?.id === id ? (activeChat.partner?.seller || activeChat.partner?.title) : null) || `Campus Peer (${id.slice(0, 6)})`;
      return { 
        id, 
        name, 
        partner: profile?.partner || (activeChat?.id === id ? activeChat.partner : { seller: name }) 
      };
    });
  }, [chats, chatProfiles, activeChat]);

  if (!activeChat) return null;

  const chatId = activeChat.id;
  const chatDeal = chatId ? finalizedOffers[chatId] : null;
  const isFinalized = Boolean(chatDeal?.finalized && chatDeal?.price > 0);
  const agreedPrice = (chatDeal?.price && chatDeal?.price > 0) ? chatDeal.price : (offerAmount > 0 ? offerAmount : fallbackPrice);

  const handleAcceptOffer = () => {
    if (!chatId) return;
    const priceToAccept = offerAmount > 0 ? offerAmount : fallbackPrice;
    const newFinalized = { ...finalizedOffers, [chatId]: { finalized: true, price: priceToAccept } };
    setFinalizedOffers(newFinalized);
    localStorage.setItem('finalized_offers', JSON.stringify(newFinalized));
    
    sendMessage(
      activeChat.partner?.seller || 'Partner',
      `Deal Finalized at ₹${priceToAccept}! Offer Accepted. 🎉`
    );
    
    setShowTermsModal(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-5xl h-[85vh] max-h-[800px] bg-white dark:bg-gray-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-gray-900/5 dark:ring-white/10 relative">
        
        {/* Beautiful Gradient Line using Logo Colors */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-800 via-[#1FB78A] to-accent-orange"></div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Messages</h2>
              <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} className="btn-ghost text-xs px-3 py-1.5 rounded-lg">
                Theme
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat({ id: c.id, partner: c.partner || { seller: c.name } })}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    activeChat.id === c.id 
                      ? 'bg-brand-50 dark:bg-brand-900/40 border border-brand-100 dark:border-brand-800/50 shadow-sm' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                  }`}
                >
                  <p className={`font-semibold text-sm ${activeChat.id === c.id ? 'text-brand-700 dark:text-brand-300' : 'text-gray-700 dark:text-gray-300'}`}>{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">Tap to view conversation</p>
                </button>
              ))}
            </div>
          </aside>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg shadow-inner">
                  {(activeChat.partner?.seller || activeChat.partner?.title || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{activeChat.partner?.seller || activeChat.partner?.title || 'Seller'}</p>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveChat(null)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#f8fafc] dark:bg-gray-900/20">
              {thread.map((m, idx) => (
                <div key={idx} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                      m.from === 'me' 
                        ? 'bg-brand-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Bottom Action Area */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-10">
              <div className="max-w-2xl mx-auto">
                {isFinalized ? (
                  /* Locked Finalized Deal Layout */
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center space-y-3 shadow-sm animate-fade-in">
                    <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                      <FiCheckCircle className="text-xl" />
                      <span>Deal Finalized at ₹{agreedPrice}! Bargaining Locked.</span>
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <FiLock size={12} /> Agreed
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                    >
                      <FiShoppingBag className="text-xl" /> Proceed to Terms & Payment (₹{agreedPrice})
                    </button>
                  </div>
                ) : (
                  /* Bargain / Counter Offer Layout */
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></span>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Make an Offer</p>
                      <span className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></span>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 shadow-inner border border-gray-200 dark:border-gray-700 transition-all focus-within:ring-2 focus-within:ring-brand-200 focus-within:border-brand-400">
                      <span className="font-bold text-3xl text-gray-400 ml-2">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(Number(e.target.value))}
                        className="flex-1 bg-transparent border-none p-0 text-3xl font-bold text-gray-900 dark:text-white outline-none focus:ring-0"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleAcceptOffer} 
                        className="flex-1 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 flex justify-center items-center gap-2 text-base"
                      >
                        <span className="text-xl">👍</span> Accept Offer & Pay
                      </button>
                      <button 
                        onClick={() => {
                          const text = `I am not okay with that. My offer is ₹${offerAmount} 👎`;
                          sendMessage(activeChat.partner?.seller || 'Partner', text);
                        }} 
                        className="flex-1 py-4 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold rounded-2xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-500/25 flex justify-center items-center gap-2 text-base"
                      >
                        <span className="text-xl">👎</span> Counter Offer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal Overlay */}
      {showTermsModal && activeChat?.partner && (
        <TermsModal
          product={activeChat.partner}
          customPrice={agreedPrice}
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </div>,
    document.body
  );
}
